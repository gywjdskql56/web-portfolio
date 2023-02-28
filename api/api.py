# -*- coding: utf-8 -*-
import pandas as pd
from flask import Flask
from flask_cors import CORS
import warnings
import pickle
import random
import pymssql

warnings.filterwarnings("ignore")
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df



@app.route('/suggest_port/<port>_<type>', methods=['GET', 'POST'])
def suggest_port(port, type):
    if port == '미래에셋 추천 포트폴리오':
        df = read_pickle(port)
    elif port == '테마로테이션':
        df = read_pickle("테마로테이션")
    elif port == '변동성 알고리즘':
        df = read_pickle("변동성 알고리즘")
    else:
        df = read_pickle("멀티에셋 인컴")

    master = read_pickle('종목마스터ETF')
    master_rv = read_pickle('종목마스터ETF_rv')
    return {'table': df[type], 'pie':df[type+'_pie'], 'tablepage':len(df[type])}

def get_us_stock_pr(ticker_list):
    ticker2id = read_pickle('종목마스터')
    id2ticker = read_pickle('종목마스터_rv')
    ticker_list_filter = list(filter(lambda x: x in ticker2id.keys() and type(x)==str, ticker_list))
    id_list = list(filter(lambda x: type(x)==str,list(map(lambda x: ticker2id[x], ticker_list_filter))))
    conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database='MARKET',
                           charset='utf8')  # 개발DB
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '20210000'
    '''.format('\',\''.join(id_list))
    result = pd.read_sql(sql, con=conn)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    result.columns = list(map(lambda x: id2ticker[x], result.columns))
    return result

@app.route('/di_theme_univ/<sector>_<theme>_<rmticker>', methods=['GET', 'POST'])
def DI_theme_port(sector , theme, rmticker):
    if rmticker=='':
        rm_ticker = []
    else:
        rm_ticker = rmticker.split('|')
    df = read_pickle('테마DI스코어')

    df = df[df['theme']==theme]
    total_sum = df['mcap'].sum()
    df['wgt'] = df['mcap'].apply(lambda x : x/total_sum*100)
    df['TF'] = df.apply(lambda row: row.loc['industry'] not in rmticker and row.loc['ticker'] not in rmticker,axis=1)
    df = df[df['TF']==True]
    df = df.dropna(subset=['ticker'])

    area_data = list()
    for sec in list(set(df['industry'])):
        area_data_ch = list()
        sub_df = df[df['industry']==sec].fillna(0)
        for t, w in zip(sub_df['ticker'], sub_df['wgt']):
            child_ch = {"name": t,"color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": round(w,0)}
            area_data_ch.append(child_ch)
        child = {"name": sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    print({"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}})

    price = get_us_stock_pr(df['ticker'].dropna().tolist())
    rtn = price.pct_change().fillna(0)
    total_rtn = None
    idx = 0
    total_wgt = 0
    no_db = list()
    in_db = list()
    for ticker, wgt in zip(df['ticker'].tolist(), df['wgt'].tolist()):
        if ticker in rtn.columns:
            total_wgt += wgt*0.01
            if idx==0:
                total_rtn = rtn[ticker] * wgt * 0.01
            else:
                total_rtn += rtn[ticker] * wgt * 0.01
            in_db.append(ticker)
        else:
            no_db.append(ticker)
    print("in_db : {} || no_db : {}".format(len(in_db), len(no_db)))
    print("in_db : {} || no_db : {}".format((in_db), (no_db)))
    total_rtn = (1+total_rtn).cumprod()
    # line_data = list()
    # for idx,val in zip(total_rtn.index, total_rtn.values):
    #     line_data.append({"x":idx, "y":round(val,2)})

    return {"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},
            "rtn" : {"data":[{ "name": "포트수익률", "data":list(map(lambda x: str(round((x-1)*100,2))+"%", total_rtn.values.tolist()))}], "xaxis":total_rtn.index.tolist()}}



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    print(1)