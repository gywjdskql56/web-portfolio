# -*- coding: utf-8 -*-
import pandas as pd
from flask import Flask
from flask_cors import CORS
import warnings
import pickle
import random
import pymssql
from multifactor import *
from qpmsdb import *
from redis_save import *

save_master()

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
    elif port == '멀티에셋 인컴':
        df = read_pickle("멀티에셋 인컴")
    elif port == '초개인화로보':
        df = read_pickle("초개인화로보")
    elif port == '멀티에셋 모멘텀(국내)':
        df = read_pickle("멀티에셋 모멘텀(국내)")
    else:
        df = read_pickle("멀티에셋 모멘텀(해외)")

    master = read_pickle('종목마스터ETF')
    master_rv = read_pickle('종목마스터ETF_rv')
    return {'table': df[type], 'pie':df[type+'_pie'], 'tablepage':len(df[type])}



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

    # price = get_us_stock_pr(df['ticker'].dropna().tolist())
    price = get_all_ticker_pr(df['ticker'].dropna().tolist())
    if price is not None:
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
        return {"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},
            "rtn" : {"data":[{ "name": "포트수익률", "data":list(map(lambda x: str(round((x-1)*100,4))+"%", total_rtn.values.tolist()))}], "xaxis":total_rtn.index.tolist()}}
    else:
        return {"area": {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},
                "rtn": {"data": [{"name": "포트수익률", "data": list(
                    map(lambda x: str(round((x - 1) * 100, 2)) + "%", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]))}],
                        "xaxis": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}

@app.route('/recent_etf', methods=['GET', 'POST'])
def recent_etf():
    etf_table = read_pickle("recent_etf")
    return {"table": etf_table, "tablepage":len(etf_table)}

def df2list(df):
    df = df.fillna(0)
    df_list = []
    for idx in df.index:
        row_dict = dict()
        row_dict['id'] = idx
        for col in df.columns:
            row_dict[col] = round(df.loc[idx, col] * 100, 2)
        df_list.append(row_dict)
    return df_list

def df2list_pie(df):
    df = df[df.weight!=0]
    df_list = []
    color = ["hsl(164, 70%, 50%)", "hsl(206, 70%, 50%)", "hsl(165, 70%, 50%)", "hsl(173, 70%, 50%)", "hsl(17, 70%, 50%)"]
    for count, idx in enumerate(df.index):
        row_dict = dict()
        row_dict['id'] = idx
        row_dict['label'] = idx
        row_dict['color'] = color[count%4]
        row_dict['value'] = round(df.loc[idx].values[0]*100,2)
        df_list.append(row_dict)
    return df_list

@app.route('/alloc-port-set-pre/<portnm>', methods=['GET', 'POST'])
def alloc_port_set_pre(portnm):
    # props = load_data()
    # save_pickle(props, 'props')
    props = read_pickle('props')
    portfolio_weight, portfolio_risk = risk_analysis(props['regression_result'].exposures.drop('const', axis=1),
                                                     # factor exposure (n * f)
                                                     props['df_factor_summary']['Annualized Volatility'],
                                                     # factor volatility (f * 1)
                                                     props['opts'][portnm])
    return {'valuelist':[round((portfolio_risk['exposure'][i]),2) for i in range(len(portfolio_risk['exposure']))]}

@app.route('/alloc-port-set/<portnm>_<te>_<valuelist>', methods=['GET', 'POST'])
def alloc_port_set(portnm, te, valuelist):
    # props = load_data()
    # save_pickle(props, 'props')
    valuelist = list(map(lambda x: float(x), valuelist.split('|')))
    props = read_pickle('props')
    # portfolio_weight, portfolio_risk = risk_analysis(props['regression_result'].exposures.drop('const', axis=1),
    #                                                  # factor exposure (n * f)
    #                                                  props['df_factor_summary']['Annualized Volatility'],
    #                                                  # factor volatility (f * 1)
    #                                                  props['opts'][portnm])
    print('risk_analysis 완료')
    result = run_optimization(prob=props['prob'], factor_return_regime=props['factor_return_regime'], regime_probability=props['regime_probability'],
                     port_selection=portnm, returns=props['returns'], factors=props['factors'], max_active_risk=0.05,
                     US_Equity=valuelist[0], EFA_Equity=valuelist[1],
                     EM_Equity=valuelist[2], Interest_Rates=valuelist[3],
                     Credit=valuelist[4], Commodity=valuelist[5],
                     Inflation=valuelist[6], USD=valuelist[7],
                     SMB=valuelist[8], HML=valuelist[9],
                     RMW=valuelist[10], CMA=valuelist[11],
                     Mom=valuelist[12], regression_result=props['regression_result'],
                     etf_performance=props['etf_performance'], df_yahoo_index=props['df_yahoo_index'],
                     df_factor_summary=props['df_factor_summary'])
    result['backtest_returns'].prices


    return {'expected_return': df2list(result['expected_return']), "risk_return":df2list(result['risk_return']),
            "exposure_comparison":df2list(result['exposure_comparison']), "risk_comparison":df2list(result['risk_comparison']),
            "pie_data_bf":df2list_pie(result['before_weights']),"pie_data_af":df2list_pie(result['after_weights'])}

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    print(1)