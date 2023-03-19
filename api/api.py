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
# from redis_save import *
from datetime import datetime
# save_master()
import random
import requests

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

def portnm2num(port):
    if port == '미래에셋 추천 포트폴리오':
        return 0
    elif port == '테마로테이션':
        return 3
    elif port == '변동성 알고리즘':
        return 1
    elif port == '멀티에셋 인컴':
        return 4
    elif port == '초개인화로보':
        return 2
    elif port == '멀티에셋 모멘텀(국내)':
        return 6
    else:
        return 7


@app.route('/suggest_port/<port>_<type>', methods=['GET', 'POST'])
def suggest_port(port, type):
    if port !="미래에셋 추천 포트폴리오":
        graph = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='그래프(영업일)', skiprows=1)
        graph = graph.rename(columns={'Unnamed: 0': 'Date'}).set_index('Date').drop_duplicates().rename(columns=port2nm)
        returns = graph[['_'.join([port,type])]].dropna()
        rows = list()
        count = 0
        for idx, val in zip(returns.index, returns.values.flatten()):
            if count%10 == 0:
                row = {"x": idx.strftime('%y/%m/%d'), "y":val}
                rows.append(row)
            count+=1
        perform = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='성과(요약)', skiprows=2)
        perform = perform.rename(columns={"Unnamed: 1": "PORT"}).dropna(subset=['PORT'])[
            ['PORT', '1D', '1W', '1M', '6M', '1Y', 'YTD']]
        perform['PORT'] = perform['PORT'].apply(lambda x: port2nm[x])
        perform = perform.set_index("PORT")
        performs = perform.loc['_'.join([port,type])].to_dict()
        rows_perform = [ {
            'address': str(round(performs['1D']*100,2))+"%",
            'firstName': str(round(performs['1W']*100,2))+"%",
            'lastName': str(round(performs['1M']*100,2))+"%",
            'city': str(round(performs['6M']*100,2))+"%",
            'state': str(round(performs['1Y']*100,2))+"%",
            'state1': str(round(performs['YTD']*100,2))+"%",
            } ]
        print(1)
    else:
        rows_perform = ""
        rows = ""

    linedata = [
        {
            "id": "수익률",
            "color": "hsl(236, 70%, 50%)",
            "data":rows
        }]

    num = portnm2num(port)
    df = read_pickle(port)
    risk = 1
    if type == "공격투자형":
        risk = 1
    elif type == "위험중립형":
        risk = 2
    elif type == "안정추구형":
        risk = 3

    return {'tableN': df[type+'_table'], 'table': df[type], 'pie':df[type+'_pie'], 'tablepage':len(df[type]), 'imagenum':num, 'risknum':risk
            , 'line':linedata, 'tableP':rows_perform }



@app.route('/di_univ/<strategy>_<sector>_<theme>_<rmticker>', methods=['GET', 'POST'])
def DI_theme_port(strategy, sector , theme, rmticker):
    if rmticker=='':
        rm_ticker = []
    else:
        rm_ticker = rmticker.split('|')

    nm_df = get_all_stock_ticker().dropna()
    nm_df['TICKER_rf'] = nm_df['TICKER'].apply(lambda x: x.replace(' EQUITY', '').replace(' ', '-'))
    if strategy=="테마":
        df = read_pickle('테마DI스코어')

        df = df[df['theme']==theme]
        total_sum = float(df['mcap'].sum())
        df['wgt'] = df['mcap'].apply(lambda x : float(x)/total_sum*100)
        df['TF'] = df.apply(lambda row: row.loc['industry'] not in rmticker and row.loc['ticker'] not in rmticker,axis=1)
        df = df[df['TF']==True]
        df = df.dropna(subset=['ticker'])
        nm_dict = nm_df[['COUNTRY_NAME','TICKER_rf']].set_index('TICKER_rf')['COUNTRY_NAME'].to_dict()
        df['country'] = df['ticker'].apply(lambda x:nm_dict[x] if x in nm_dict.keys() else 'etc')
    else:
        if theme=="건전한 재무재표 전략지수":
            factor = '400130' # WEBQM..WEB_GQPM_ACCT
        elif theme=="주주환원지수":
            factor = '600100'
        elif theme=="Capex와 R&D 지수":
            factor = '400100'
        elif theme == "배당성장주":
            factor = '400120'
        df = get_factor(factor, td='20230201')
        wgt_df = get_factor('600100', td='20230201')
        df = pd.merge(df, wgt_df[['FSYM_ID', 'VAL']].dropna().drop_duplicates('FSYM_ID').rename(
            columns={'VAL': 'WGT'}), left_on=['FSYM_ID'], right_on=['FSYM_ID'], how='left').sort_values(by=['VAL'],ascending=False).dropna().iloc[:50]

        nm_dict = nm_df[['FSYM_ID', 'TICKER_rf']].set_index('FSYM_ID')['TICKER_rf'].to_dict()
        df['ticker'] = df['FSYM_ID'].apply(lambda x: nm_dict[x] if x in nm_dict.keys() else x)
        df['industry'] = df['GICS_INDUSTRYGROUP']
        total_sum = df['WGT'].sum()
        df['wgt'] = df['WGT'].apply(lambda x : x/total_sum*100)
        df['country'] = df['COUNTRY_NAME']


    area_data = list()
    for sec in list(set(df['industry'])):
        area_data_ch = list()
        sub_df = df[df['industry']==sec].fillna(0)
        for t, w in zip(sub_df['ticker'], sub_df['wgt']):
            child_ch = {"name": t,"color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": round(w,2)}
            area_data_ch.append(child_ch)
        child = {"name": sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    print({"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}})

    price = get_all_ticker_pr(df['ticker'].dropna().tolist(), td='20220101', nm_df=nm_df)
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

        pie = list()
        pie_data = df.groupby('industry')['wgt'].sum().to_dict()
        for key in pie_data.keys():
            pie.append({
                "id": key,
                "label": key,
                "value": round(pie_data[key],2),
                "color": "hsl({}, 70%, 50%)".format(random.randint(2, 300))
            })
        pie_ctr = list()
        pie_ctr_data = df.groupby('country')['wgt'].sum().to_dict()
        for key in pie_ctr_data.keys():
            pie_ctr.append({
                "id": key,
                "label": key,
                "value": round(pie_ctr_data[key],2),
                "color": "hsl({}, 70%, 50%)".format(random.randint(2, 300))
            })
        return {"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},
            "rtn" : {"data":[{ "name": "포트수익률", "data":list(map(lambda x: str(round((x-1)*100,4))+"%", total_rtn.values.tolist()))}], "xaxis":list(map(lambda x: datetime.strptime(x,"%Y%m%d").strftime("%Y-%m-%d"),total_rtn.index.tolist()))},
                "pie":pie, 'pie_ctr':pie_ctr}
    else:
        return {"area": {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},
                "rtn": {"data": [{"name": "포트수익률", "data": list(
                    map(lambda x: str(round((x - 1) * 100, 2)) + "%", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]))}],
                        "xaxis": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"pie":""}

# @app.route('/recent_etf', methods=['GET', 'POST'])
# def recent_etf():
#     etf_table = read_pickle("recent_etf")
#     return {"table": etf_table, "tablepage":len(etf_table)}

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
                     df_factor_summary=props['df_factor_summary'],)


    returns = (result["backtest_returns"].dropna().sort_index().pct_change().fillna(0) + 1).cumprod()
    rows = dict()
    for col in ['After','Before']:
        row_list = list()
        count=0
        for idx, val in zip(returns[col].index, returns[col].values):
            if count%25==0:
                idx = idx.strftime('%y/%m/%d')
                row_list.append({"x": idx, "y": round(float(val),2)})
            count += 1
        rows[col] = row_list

    prices = [
        {
            "id": "After",
            "color": "hsl(236, 70%, 50%)",
            "data":rows["After"]
        },
        {
            "id": "Before",
            "color": "hsl(236, 70%, 50%)",
            "data": rows["Before"]
        }
    ]
    num = portnm2num(portnm)

    return {'expected_return': df2list(result['expected_return']), "risk_return":df2list(result['risk_return']),
            "exposure_comparison":df2list(result['exposure_comparison']), "risk_comparison":df2list(result['risk_comparison']),
            "pie_data_bf":df2list_pie(result['before_weights']),"pie_data_af":df2list_pie(result['after_weights']), "backtest_returns": prices, "portnum":num}

@app.route('/recent_etf', methods=['GET', 'POST'])
def recent_etf():
    etf = pd.read_excel('org-data/info/ETF_0210.xlsx')
    total_rows = list()
    etf['시가총액'] = etf['시가총액'].apply(lambda x:  round(x,2))
    etf['1주 수익률'] = etf['1주 수익률'].apply(lambda x:  round(x*100,2))
    etf['1달 수익률'] = etf['1달 수익률'].apply(lambda x:  round(x*100,2))
    for i in range(len(etf)):
        row = etf.iloc[i].fillna('-')
        row_dict = {
            "state": row.loc['그룹'],
            "firstName": row.loc['티커'],
            "lastName": row.loc['운용사'],
            "Name": row.loc['ETF 명'],
            "age": row.loc['시가총액'],
            "gender": row.loc['1주 수익률'],
            "salary": row.loc['1달 수익률'],
            "date": row.loc['최초상장일'],
        }
        total_rows.append(row_dict)
    return {"table": total_rows}

@app.route('/di_univ2/<strategy>_<sector>_<theme>_<rmticker>', methods=['GET', 'POST'])
def temp(strategy,sector,theme,rmticker):
    url = "http://43.200.170.131:5001/di_univ/{}_{}_{}_{}".format(strategy,sector,theme,rmticker)
    response = requests.get(url)
    result = eval(response.text)
    total_list = list()
    count=0
    for idx, dat in zip(result['rtn']['xaxis'], result['rtn']['data'][0]['data']):
        if count % 3==0:
            total_list.append({"x": datetime.strptime(idx,"%Y-%m-%d").strftime('%y-%m-%d'), "y": float(dat.replace("%",''))})
        count+=1
    result['rtn_new'] = [{"data": total_list, "color": "hsl(236, 70%, 50%)", "id": "수익률",}]
    result['explain'] = read_pickle('sec_explain')[theme]
    return result


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
    print(1)