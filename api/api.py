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
import re

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
    if port == '미래에셋 추천 포트폴리오(국내)':
        return '00'
    elif port == '미래에셋 추천 포트폴리오(해외)':
        return '01'
    elif port == '미래에셋 추천 포트폴리오(연금)':
        return '02'
    elif port == '테마로테이션':
        return '3'
    elif port == '변동성 알고리즘':
        return '1'
    elif port == '멀티에셋 인컴':
        return '4'
    elif port == '초개인화로보':
        return '2'
    elif port == '멀티에셋 모멘텀(국내)':
        return '6'
    else:
        return '7'


@app.route('/suggest_port/<port>_<type>', methods=['GET', 'POST'])
def suggest_port(port, type):
    if "미래에셋 추천 포트폴리오" not in port:
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
        magi_port_pre = pd.read_excel('org-data/suggest/{}_22.xlsx'.format(port), sheet_name=type)
        magi_port_pre['코드'] = magi_port_pre['코드'].apply(lambda x: '0' * (6 - len(str(x))) + str(x) if len(str(re.sub('[0-9]','',str(x))))==0 else str(x))
        magi_port_pre['코드2'] = magi_port_pre['코드'].apply(lambda x: x + "-KS" if len(str(re.sub('[0-9]','',str(x))))==0 else x+'-US' )
        pr_df_pre = get_us_stock_pr_by_ticker(magi_port_pre['코드2'].tolist(), td='20221231')
        returns_pre = pr_df_pre.pct_change().fillna(0)

        magi_port = pd.read_excel('org-data/suggest/{}.xlsx'.format(port), sheet_name=type)
        magi_port['코드'] = magi_port['코드'].apply(lambda x: '0' * (6 - len(str(x))) + str(x) if len(str(re.sub('[0-9]','',str(x))))==0 else str(x))
        magi_port['코드2'] = magi_port['코드'].apply(lambda x: x + "-KS" if len(str(re.sub('[0-9]','',str(x))))==0 else x+'-US' )
        pr_df = get_us_stock_pr_by_ticker(magi_port['코드2'].tolist(), td='20221231')
        returns = pr_df.pct_change().fillna(0)

        # returns_pre = (returns_pre+1).cumprod()
        returns_pre['total'] = 0
        wgt_dict = magi_port_pre[['코드2', '비중2']].set_index('코드2')['비중2'].to_dict()
        for col in list(set(wgt_dict.keys()) & set(returns_pre.columns)):
            returns_pre['total'] += returns_pre[col] * wgt_dict[col]

        # returns = (returns+1).cumprod()
        returns['total'] = 0
        wgt_dict = magi_port[['코드2', '비중2']].set_index('코드2')['비중2'].to_dict()
        for col in list(set(wgt_dict.keys()) & set(returns.columns)):
            returns['total'] += returns[col] * wgt_dict[col]
        total_returns = (returns_pre.loc[:'20230401'][['total']]).append(returns.loc['20230401':][['total']])
        total_returns = (total_returns + 1).cumprod()
        rows = list()
        count = 0
        for idx, val in zip(total_returns.index, total_returns['total'].values.flatten()):
            if count%10 == 0:
                row = {"x": datetime.strptime(idx,'%Y%m%d').strftime('%y/%m/%d'), "y":val}
                rows.append(row)
            count+=1
        rows_perform = [{
            'address': str(round((total_returns['total'][-1]/total_returns['total'][-2]-1)*100,2))+"%",
            'firstName': str(round((total_returns['total'][-1]/total_returns['total'][-5]-1)*100,2))+"%",
            'lastName': str(round((total_returns['total'][-1]/total_returns['total'][-22]-1)*100,2))+"%",
            'city': "-%",
            'state': "-%",
            'state1': "-%",
            }]

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
            , 'line': linedata, 'tableP': rows_perform }



@app.route('/di_univ/<strategy>_<sector>_<theme>_<rmticker>_<num>_<factor>', methods=['GET', 'POST'])
def DI_theme_port(strategy, sector , theme, rmticker, num, factor):
    rmticker = list(map(lambda x: x.split(' (')[0], rmticker.split('|')))
    print(rmticker)
    factor = factor.split('|')


    nm_df = get_all_theme_ticker().dropna()
    nm_df['TICKER_rf'] = nm_df['TICKER'].apply(lambda x: x.replace(' EQUITY', '').replace(' ', '-'))
    bm = ''
    if strategy=="테마":
        # df = read_pickle('테마DI스코어')
        df = read_pickle('model_score_add2')
        df = df[df['theme']==theme]

        df['TF'] = df.apply(lambda row: row.loc['industry'] not in rmticker and row.loc['ticker'] not in rmticker,axis=1)
        df = df[df['TF']==True]
        df = df.dropna(subset=['ticker'])
        nm_df['COUNTRY_NAME'] = nm_df['TICKER_rf'].apply(lambda x: x.split('-')[1])
        nm_dict = nm_df[['COUNTRY_NAME','TICKER_rf']].set_index('TICKER_rf')['COUNTRY_NAME'].to_dict()
        name_dict = nm_df[['NAME','TICKER_rf']].set_index('TICKER_rf')['NAME'].to_dict()
        df['country'] = df['ticker'].apply(lambda x: nm_dict[x] if x in nm_dict.keys() else 'etc')
        for idx, fac in enumerate(factor):
            df['mcap'] += df[df.columns[idx+7]]*float(fac)*0.01
        df = df.sort_values(by='mcap',ascending=False).iloc[:min(int(num),len(df))]
        total_sum = float(df['mcap'].sum())
        df['wgt'] = df['mcap'].apply(lambda x : float(x)/total_sum*100)
        sec_explain_2 = read_pickle('sec_explain_2')
        if theme in sec_explain_2.keys():
            explain = read_pickle('sec_explain_2')[theme]
        else:
            explain = ""
        df['FSYM_ID'] = df['ticker']
        df['name'] = df['FSYM_ID'].apply(lambda x: name_dict[x] if x in name_dict.keys() else x)
        if theme in read_pickle('테마BM').keys():
            bm = read_pickle('테마BM')[theme]
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
            columns={'VAL': 'WGT'}), left_on=['FSYM_ID'], right_on=['FSYM_ID'], how='left').sort_values(by=['VAL'],ascending=False).dropna().iloc[:min(int(num),len(df))]
        df = pd.merge(nm_df, df, left_on='FSYM_ID', right_on='FSYM_ID', how='right')

        # nm_dict = nm_df[['FSYM_ID', 'TICKER_rf']].set_index('FSYM_ID')['TICKER_rf'].to_dict()
        # df['ticker'] = df['FSYM_ID'].apply(lambda x: nm_dict[x] if x in nm_dict.keys() else x)
        df['industry'] = df['GICS_INDUSTRYGROUP']
        gics = get_gics()
        gics_dict = gics.set_index('INDUSTRY_GROUP')['INDUSTRY_GROUP_NAME'].to_dict()
        df['industry'] = df['industry'].apply(lambda x: gics_dict[x] if x in gics_dict.keys() else '기타')
        df['TF'] = df.apply(lambda row: row.loc['industry'] not in rmticker and row.loc['TICKER'] not in rmticker,
                            axis=1)
        df = df[df['TF'] == True]
        total_sum = df['WGT'].sum()
        df['wgt'] = df['WGT'].apply(lambda x : x/total_sum*100)
        df['country'] = df['COUNTRY_NAME']
        df = df.rename(columns={'NAME':'name', 'TICKER':"ticker"})
        explain = ""

    table_list = list()
    for idx, row in df.iterrows():
        part_dict = {
            'state': row.loc['industry'],
            'lastName': row.loc['ticker'],
            'lastName2': row.loc['name'],
            'Name': round(row.loc['wgt'],2),
        }
        table_list.append(part_dict)
    area_data = list()
    for sec in list(set(df['industry'])):
        area_data_ch = list()
        sub_df = df[df['industry']==sec].fillna(0)
        for t, w, n in zip(sub_df['ticker'], sub_df['wgt'], sub_df['name']):
            child_ch = {"name": t+" ({})".format(n), "color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": round(w,2)}
            area_data_ch.append(child_ch)
        child = {"name": sec,'id':sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    print({"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}})

    price = get_us_stock_pr_by_ticker(df['ticker'].dropna().tolist()+[bm], td='20220101')
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
                    total_rtn = rtn[ticker] * wgt*0.01
                else:
                    total_rtn += rtn[ticker] * wgt*0.01
                in_db.append(ticker)
                idx += 1
            else:
                no_db.append(ticker)

        print("in_db : {} || no_db : {}".format(len(in_db), len(no_db)))
        print("in_db : {} || no_db : {}".format((in_db), (no_db)))
        print(total_wgt)
        total_rtn = total_rtn / total_wgt
        total_rtn = (1+total_rtn).cumprod()

        total_list = list()
        count = 0
        for idx, dat in zip(total_rtn.index.tolist(), total_rtn.values.tolist()):
            if count % 3 == 0:
                total_list.append(
                    {"x": datetime.strptime(idx,"%Y%m%d").strftime("%y-%m-%d"), "y": round((dat-1)*100,2)})
            count += 1
        if bm != '' and bm in price.columns:
            bm_rtn = (price[bm].pct_change(1).fillna(0)+1).cumprod()
            total_bm_list = list()
            count = 0
            for idx, dat in zip(bm_rtn.index.tolist(), bm_rtn.values.tolist()):
                if count % 3 == 0:
                    total_bm_list.append(
                        {"x": datetime.strptime(idx,"%Y%m%d").strftime("%y-%m-%d"), "y": round((dat-1)*100,2)})
                count += 1
            linedata = [{"data": total_list, "color": "hsl(236, 70%, 50%)", "id": "포트수익률", },{"data": total_bm_list, "color": "hsl(236, 70%, 50%)", "id": "BM수익률", }]
        else:
            linedata = [{"data": total_list, "color": "hsl(236, 70%, 50%)", "id": "수익률", }]

        rtn_val_list = total_rtn.values.tolist()
        if bm!='' and bm in price.columns:
            bm_val_list = bm_rtn.values.tolist()
            rtn_period = [{"address" : str(round((rtn_val_list[-1] / rtn_val_list[-2] - 1) * 100, 2)) + "% ({}%)".format(str(round((bm_val_list[-1] / bm_val_list[-2] - 1) * 100, 2))),
            "firstName" : str(round((rtn_val_list[-5] / rtn_val_list[-2] - 1) * 100, 2)) + "% ({}%)".format(str(round((bm_val_list[-5] / bm_val_list[-2] - 1) * 100, 2))),
            "lastName" : str(round((rtn_val_list[-22] / rtn_val_list[-2] - 1) * 100, 2)) + "% ({}%)".format(str(round((bm_val_list[-22] / bm_val_list[-2] - 1) * 100, 2))),
            "city": str(round((rtn_val_list[-22*6]/rtn_val_list[-2]-1) * 100, 2))+"% ({}%)".format(str(round((bm_val_list[-22*6] / bm_val_list[-2] - 1) * 100, 2))),
            "state" :str(round((rtn_val_list[-22 * 12] / rtn_val_list[-2] - 1) * 100, 2)) + "% ({}%)".format(str(round((bm_val_list[-22*12] / bm_val_list[-2] - 1) * 100, 2))),
            "state1" : str(round((rtn_val_list[-22*2+15]/rtn_val_list[-2]-1)*100, 2))+"% ({}%)".format(str(round((bm_val_list[-22*2+15] / bm_val_list[-2] - 1) * 100, 2)))}]
        else:
            rtn_period = [{"address": str(round((rtn_val_list[-1] / rtn_val_list[-2] - 1) * 100, 2)) + "%",
                           "firstName": str(
                               round((rtn_val_list[-5] / rtn_val_list[-2] - 1) * 100, 2)) + "%" ,
                           "lastName": str(
                               round((rtn_val_list[-22] / rtn_val_list[-2] - 1) * 100, 2)) + "%",
                           "city": str(
                               round((rtn_val_list[-22 * 6] / rtn_val_list[-2] - 1) * 100, 2)) + "%",
                           "state": str(
                               round((rtn_val_list[-22 * 12] / rtn_val_list[-2] - 1) * 100, 2)) + "%",
                           "state1": str(
                               round((rtn_val_list[-22 * 2 + 15] / rtn_val_list[-2] - 1) * 100, 2)) + "%"}]

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
                "pie":pie, 'pie_ctr':pie_ctr,
                'rtn_new': linedata,
                'explain': explain, 'table': table_list, "rtn_period" : rtn_period}
    else:
        return {"area": {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data},"pie":"",'rtn_new':"",'explain':"" }

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
            row_dict[col] = round(float(str(df.loc[idx, col]).replace("%",'')) * 100, 2)
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


@app.route('/alloc-port-set-regime/', methods=['GET', 'POST'])
def alloc_port_set_regime():
    regime_probs = read_pickle('regime_probs')
    probs = read_pickle('probs')
    return {'regime_probs': regime_probs, 'probs': probs}

@app.route('/alloc-port-set-pre/<portnm>', methods=['GET', 'POST'])
def alloc_port_set_pre(portnm):
    # props = load_data()
    # save_pickle(props, 'props')
    props = read_pickle('props')
    regime_probs = read_pickle('regime_probs')
    probs = read_pickle('probs')
    portfolio_weight, portfolio_risk = risk_analysis(props['regression_result'].exposures.drop('const', axis=1),
                                                     # factor exposure (n * f)
                                                     props['df_factor_summary']['Annualized Volatility'],
                                                     # factor volatility (f * 1)
                                                     props['opts'][portnm])

    return {'valuelist':[round((portfolio_risk['exposure'][i]),2) for i in range(len(portfolio_risk['exposure']))],
            'regime_probs':regime_probs, 'probs':probs}

@app.route('/alloc-port-set/<portnm>_<te>_<valuelist>', methods=['GET', 'POST'])
def alloc_port_set(portnm, te, valuelist):
    # props = load_data()
    # save_pickle(props, 'props')
    # valuelist = list(map(lambda x: float(x), valuelist.split('|')))
    # props = read_pickle('props')
    # portfolio_weight, portfolio_risk = risk_analysis(props['regression_result'].exposures.drop('const', axis=1),
    #                                                  # factor exposure (n * f)
    #                                                  props['df_factor_summary']['Annualized Volatility'],
    #                                                  # factor volatility (f * 1)
    #                                                  props['opts'][portnm])
    print('risk_analysis 완료')
    # result = run_optimization(prob=props['prob'], factor_return_regime=props['factor_return_regime'], regime_probability=props['regime_probability'],
    #                  port_selection=portnm, returns=props['returns'], factors=props['factors'], max_active_risk=0.05,
    #                  US_Equity=valuelist[0], EFA_Equity=valuelist[1],
    #                  EM_Equity=valuelist[2], Interest_Rates=valuelist[3],
    #                  Credit=valuelist[4], Commodity=valuelist[5],
    #                  Inflation=valuelist[6], USD=valuelist[7],
    #                  SMB=valuelist[8], HML=valuelist[9],
    #                  RMW=valuelist[10], CMA=valuelist[11],
    #                  Mom=valuelist[12], regression_result=props['regression_result'],
    #                  etf_performance=props['etf_performance'], df_yahoo_index=props['df_yahoo_index'],
    #                  df_factor_summary=props['df_factor_summary'],opts=props['opts'])
    #
    #
    # returns = (result["backtest_returns"].dropna().sort_index().pct_change().fillna(0) + 1).cumprod()
    # rows = dict()
    # for col in ['After','Before']:
    #     row_list = list()
    #     count=0
    #     for idx, val in zip(returns[col].index, returns[col].values):
    #         if count%25==0:
    #             idx = idx.strftime('%y/%m/%d')
    #             row_list.append({"x": idx, "y": round(float(val),2)})
    #         count += 1
    #     rows[col] = row_list
    #
    # prices = [
    #     {
    #         "id": "After",
    #         "color": "hsl(236, 70%, 50%)",
    #         "data":rows["After"]
    #     },
    #     {
    #         "id": "Before",
    #         "color": "hsl(236, 70%, 50%)",
    #         "data": rows["Before"]
    #     }
    # ]
    # p_rows = dict()
    # for col in ['상승국면','인플레이션 국면','하락국면','급락국면']:
    #     row_list = list()
    #     count=0
    #     for idx, val in zip(props['prob'][col].index, props['prob'][col].values):
    #         if count%25==0:
    #             idx = idx.strftime('%y/%m/%d')
    #             row_list.append({"x": idx, "y": round(float(val),2)})
    #         count += 1
    #     p_rows[col] = row_list
    #
    # probs = [
    #     {
    #         "id": "상승국면",
    #         "color": "hsl(10, 70%, 50%)",
    #         "data":p_rows["상승국면"]
    #     },
    #     {
    #         "id": "인플레이션 국면",
    #         "color": "hsl(60, 70%, 50%)",
    #         "data": p_rows["인플레이션 국면"]
    #     },
    #     {
    #         "id": "하락국면",
    #         "color": "hsl(110, 70%, 50%)",
    #         "data": p_rows["하락국면"]
    #     },
    #     {
    #         "id": "급락국면",
    #         "color": "hsl(160, 70%, 50%)",
    #         "data": p_rows["급락국면"]
    #     }
    # ]
    # num = portnm2num(portnm)
    # props['regime_probability'] = props['regime_probability'].transpose().fillna(0)
    # final = {'expected_return': df2list(result['expected_return']), "risk_return":df2list(result['risk_return']),
    #         "exposure_comparison":df2list(result['exposure_comparison']), "risk_comparison":df2list(result['risk_comparison']),
    #         "pie_data_bf":df2list_pie(result['before_weights']),"pie_data_af":df2list_pie(result['after_weights']),
    #         "backtest_returns": prices, "portnum":num, "probs":probs, "regime_probs":df2list(props['regime_probability'])}
    # save_pickle(final, 'final_{}'.format(portnm.replace(':','')))
    final = read_pickle('final_{}'.format(portnm.replace(':','')))
    return final
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

@app.route('/company', methods=['GET', 'POST'])
def company():
    company_master = read_pickle('company_master')
    company_list = list()
    for code, name in zip(company_master.CODE.tolist(), company_master.JM_NM.tolist()):
        company_list.append({"label":name, "value":code})
    return {"list": company_list}

@app.route('/company-perform-table', methods=['GET', 'POST'])
def company_perform_table():
    # table = get_perform_table()
    # con_list = [ 'comp_S', 'comp_OP', 'comp_NI']
    # col_list = ['OPER_PROFIT', 'NET_PROFIT',
    #             'qoq_S', 'qoq_OP', 'qoq_NI', 'yoy_S', 'yoy_OP', 'yoy_NI']
    # for col in con_list:
    #     table[col] = table[col].fillna('-').apply(lambda x:'하회' if x != '-' and x<-5 else '상회' if x != '-' and x>5 else '보합' if x != '-' else '-')
    # for col in col_list:
    #     table[col] = table[col].fillna('-').apply(lambda x: str(round(float(x),1))+'%' if x!='-' else '-')
    table = read_pickle('perform_table')
    total_rows = list()
    table['REPORT_GB'] = table['REPORT_GB'].apply(lambda x:'별도' if x=='º°μμ' else '연결' )
    table['ANNOUN_DT'] = table['ANNOUN_DT'].apply(lambda x: datetime.strptime(x,'%Y%m%d').strftime('%Y-%m-%d'))
    table['INDEXskeh _WEIGHT'] = table['INDEX_WEIGHT'].apply(lambda x: round(x, 2))
    table['SALES'] = table['SALES'].apply(lambda x: round(x, 2))
    for i in range(len(table)):
        row = table.iloc[i].fillna('-')
        row_dict = {
            "state": row.loc['ANNOUN_DT'],
            "state1": row.loc['JM_NAME'],
            "state2": row.loc['GICODE'],
            "state3": row.loc['REPORT_GB'],
            "firstName": row.loc['INDEX_NAME_KR'].replace('지수',''),
            "lastName": row.loc['INDEX_WEIGHT'],
            "Name": row.loc['SEC_NM'],
            "age": row.loc['IND_NM'],
            "gender": row.loc['SALES'],
            "salary": row.loc['OPER_PROFIT'],
            "date": row.loc['NET_PROFIT'],
            "cons1": row.loc['comp_S'],
            "cons2": row.loc['comp_OP'],
            "cons3": row.loc['comp_NI'],
            "data1": row.loc['qoq_S'],
            "data2": row.loc['qoq_OP'],
            "data3": row.loc['qoq_NI'],
            "data4": row.loc['yoy_S'],
            "data5": row.loc['yoy_OP'],
            "data6": row.loc['yoy_NI'],
        }
        total_rows.append(row_dict)
    return {"table": total_rows}


def df2list_line(perform_df_p_dr):
    perform_df_p_dr = perform_df_p_dr.bfill().ffill().dropna()
    total_list = list()
    color = 10
    for col in perform_df_p_dr.columns:
        dat_list = list()
        count=0
        for idx, dat in zip(perform_df_p_dr.index, perform_df_p_dr[col]):
            if count % 3 ==0:
                dat_list.append({'x': datetime.strptime(idx, '%Y%m%d').strftime('%y-%m-%d'), 'y': dat})

            count += 1
        total_list.append({'id': col, 'color': 'hsl({}, 70%, 50%)'.format(color), 'data': dat_list})
        color += 50
    return total_list

@app.route('/company-perform/<company_nm>', methods=['GET', 'POST'])
def company_perform(company_nm):
    company_nm_list = company_nm.split('|')
    # company_master = read_pickle('company_master')
    # company_master_dict = company_master[['JM_NM','CODE']].set_index('JM_NM')['CODE'].to_dict()
    # company_nm_list = list(map(lambda x: company_master_dict[x],company_nm_list))
    perform_df = get_perform(ticker_list=company_nm_list, st_dt='20220100')
    perform_df_sale = perform_df.drop_duplicates(['TD', 'YM','GB']).pivot(index=['TD', 'YM'], columns='GB', values='SALES')
    perform_df_sale = perform_df_sale.reset_index().drop_duplicates(['TD']).set_index('TD')
    del perform_df_sale['YM']

    perform_df_op = perform_df.drop_duplicates(['TD', 'YM','GB']).pivot(index=['TD', 'YM'], columns='GB', values='OP')
    perform_df_op = perform_df_op.reset_index().drop_duplicates(['TD']).set_index('TD')
    del perform_df_op['YM']

    perform_df_ni = perform_df.drop_duplicates(['TD', 'YM','GB']).pivot(index=['TD', 'YM'], columns='GB', values='NI')
    perform_df_ni = perform_df_ni.reset_index().drop_duplicates(['TD']).set_index('TD')
    del perform_df_ni['YM']

    total_list_close = df2list_line(perform_df[['TD','CLOSE_AP']].drop_duplicates(subset=['TD']).set_index('TD'))
    total_list_sale = df2list_line(perform_df_sale)
    total_list_op = df2list_line(perform_df_op)
    total_list_ni = df2list_line(perform_df_ni)


    return { "line_close":total_list_close, "line_sale": total_list_sale,"line_op": total_list_op,"line_ni": total_list_ni }


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
    print(1)