import pandas as pd
import pickle
import pymssql
from qpmsdb import *
def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df
bm = pd.read_excel('org-data/DI_theme/BM지수.xlsx', sheet_name='대표지수')
bm_dict = bm.set_index('name')['ticker'].to_dict()
print(1)

# table = get_perform_table()
# con_list = ['comp_S', 'comp_OP', 'comp_NI']
# col_list = ['OPER_PROFIT', 'NET_PROFIT',
#             'qoq_S', 'qoq_OP', 'qoq_NI', 'yoy_S', 'yoy_OP', 'yoy_NI']
# for col in con_list:
#     table[col] = table[col].fillna('-').apply(
#         lambda x: '하회' if x != '-' and x < -5 else '상회' if x != '-' and x > 5 else '보합' if x != '-' else '-')
# for col in col_list:
#     table[col] = table[col].fillna('-').apply(lambda x: str(round(float(x), 1)) + '%' if x != '-' else '-')
# table['qoq_OP'] = table.apply(lambda row: '적지' if float(str(row.loc['OPER_PROFIT']).replace('%',''))*float(str(row.loc['prev_q_OPER_INC']).replace('%',''))>0 else '흑전' if float(str(row.loc['OPER_PROFIT']).replace('%',''))>0 else '적전',axis=1)
# table['TF'] = table.apply(lambda row: float(str(row.loc['OPER_PROFIT']).replace('%',''))*float(str(row.loc['prev_q_OPER_INC']).replace('%',''))>0, axis=1)

def trans_word(row, prev, now):
    if row.loc[prev] == '-' or row.loc[now] == '-':
        return '-'
    if float(str(row.loc[prev]).replace('%',''))*float(str(row.loc[now]).replace('%',''))>0:
        if float(str(row.loc[now]).replace('%','')) > 0:
            return float(str(row.loc[now]).replace('%',''))
        else:
            return '적지'
    else:
        if float(str(row.loc[now]).replace('%','')) > 0:
            return '흑전'
        else:
            return '적전'
# table['qoq_OP'] = table.apply(lambda row: trans_word(row, 'prev_q_OPER_PROFIT', 'OPER_PROFIT'), axis=1 )
# table['qoq_NI'] = table.apply(lambda row: trans_word(row, 'prev_q_NET_PROFIT', 'NET_PROFIT'), axis=1 )
# table['yoy_OP'] = table.apply(lambda row: trans_word(row, 'prev_q_OPER_PROFIT', 'OPER_PROFIT'), axis=1 )
# table['yoy_NI'] = table.apply(lambda row: trans_word(row, 'prev_q_NET_PROFIT', 'NET_PROFIT'), axis=1 )
# table['qoq_S'] = table['qoq_S'].apply(lambda x: float(str(x).replace("%","")) if x!='-' else '-')
# table['yoy_S'] = table['yoy_S'].apply(lambda x: float(str(x).replace("%","")) if x!='-' else '-')
# save_pickle(table,'perform_table')
# print(1)


def get_company_code():
    sql = '''
        select CODE
        from IBES..ZKC_IFRS B
        where TD='20230323'
        and EST_GB = 'D'
        and GB = 'A'
        and FY = '0'

    '''
    result = get_df(sql)
    return result

# df = get_company_code()
# save_pickle(df, 'company_code')

def get_code_df(id_list):
    sql = '''
     select *
     from EUMQNTDB..GQPM_MAST3 
	 where TICKER in ('{}')
    '''.format('\',\''.join(list(map(lambda x: x+" KS EQUITY", id_list))))
    result = get_df(sql)
    return result

# master_df = get_code_df(df['CODE'].tolist())
# master_df = master_df.drop_duplicates(subset=['TICKER'])
# save_pickle(master_df, 'company_master')

###########################
# explain = pd.read_excel('org-data/DI_theme/테마설명_230327.xlsx')
# print(1)
###########################
# bm = pd.read_excel('org-data/DI_theme/BM지수.xlsx', sheet_name='대표지수')
# pr = get_us_stock_pr_by_ticker(bm['ticker'].tolist(), '20230301')
# print(1)
###########################

file_list = ['미래에셋 추천 포트폴리오(국내)','미래에셋 추천 포트폴리오(해외)','미래에셋 추천 포트폴리오(연금)','변동성 알고리즘','테마로테이션','멀티에셋 인컴','초개인화로보','멀티에셋 모멘텀(해외)','멀티에셋 모멘텀(국내)']
## 추천포트폴리오 엑셀 변환
for file_nm in file_list:
    port1 = pd.read_excel('org-data/suggest/{}.xlsx'.format(file_nm), sheet_name='적극투자형')
    port2 = pd.read_excel('org-data/suggest/{}.xlsx'.format(file_nm), sheet_name='위험중립형')
    port3 = pd.read_excel('org-data/suggest/{}.xlsx'.format(file_nm), sheet_name='안정추구형')

    def df2list_table(df):
        total_list = list()
        for idx, row in df.iterrows():
            print(idx)
            print(row)
            part_dict = {
                'id': idx,
                'type': row.loc['구분'],
                'wgt1': str(round(row.loc['비중1'] * 100, 1)) + "%",
                'ticker': row.loc['종목명'],
                'wgt2': str(round(row.loc['비중2'] * 100, 1)) + "%",
            }
            total_list.append(part_dict)
        return total_list

    def df2list_tableN(df):
        total_list = list()
        for idx, row in df.iterrows():
            print(idx)
            print(row)
            part_dict = {
                'state': row.loc['구분'],
                'firstName': str(round(row.loc['비중1'] * 100, 1)) + "%",
                'lastName': row.loc['종목명'],
                'Name': round(row.loc['비중2'] * 100, 1),
            }
            total_list.append(part_dict)
        return total_list


    # row_dict = {
    #     "state": row.loc['그룹'],
    #     "firstName": row.loc['티커'],
    #     "lastName": row.loc['운용사'],
    #     "Name": row.loc['ETF 명'],
    #     "age": row.loc['시가총액'],
    #     "gender": row.loc['1주 수익률'],
    #     "salary": row.loc['1달 수익률'],
    #     "date": row.loc['최초상장일'],
    # }

    def df2list_pie(df):
        total_list = list()
        df = df[['구분','비중1']].drop_duplicates(subset=['구분'])
        color = ["hsl(164, 70%, 50%)", "hsl(206, 70%, 50%)", "hsl(165, 70%, 50%)", "hsl(173, 70%, 50%)", "hsl(17, 70%, 50%)"]
        for idx, row in df.iterrows():
            print(idx)
            print(row)
            part_dict = {
                'id': row.loc['구분'],
                'value': round(row.loc['비중1'] * 100, 1),
                'label': row.loc['구분'].split(" ")[-1],
                'color': color[idx%len(color)],
            }
            total_list.append(part_dict)
        return total_list

    total_dict = dict()
    total_dict['적극투자형'] = df2list_table(port1)
    total_dict['위험중립형'] = df2list_table(port2)
    total_dict['안정추구형'] = df2list_table(port3)

    total_dict['적극투자형_table'] = df2list_tableN(port1)
    total_dict['위험중립형_table'] = df2list_tableN(port2)
    total_dict['안정추구형_table'] = df2list_tableN(port3)

    total_dict['적극투자형_pie'] = df2list_pie(port1)
    total_dict['위험중립형_pie'] = df2list_pie(port2)
    total_dict['안정추구형_pie'] = df2list_pie(port3)

    save_pickle(total_dict, file_nm)
print(1)

## DI
# score = read_pickle('테마DI스코어')
# di = pd.read_excel("org-data/DI_theme/테마분류_221012.xlsx", sheet_name='theme')
# di_ticker = pd.read_excel("org-data/DI_theme/테마분류_221012.xlsx", sheet_name='ticker')
#
# total_dict = dict()
# for s in list(set(di_ticker.sector)):
#     themes = list(set(di_ticker[di_ticker['sector']==s]['theme'].tolist()))
#     sub_dict = dict()
#     for t in themes:
#         industries = list(set(di_ticker[di_ticker['theme']==t]['industry']))
#         sub_sub_dict = dict()
#         for i in industries:
#             ticker = list(set(di_ticker[di_ticker['industry'] == i]['ticker']))
#             sub_sub_dict[i] = ticker
#         sub_dict[t] = sub_sub_dict
#     total_dict[s] = sub_dict
# save_pickle(total_dict, "테마DI유니버스")

# sp = pd.read_excel('org-data/DI_theme/종목마스터SP500.xlsx')
# russel = pd.read_excel('org-data/DI_theme/종목마스터RUSSELL1000.xlsx')
#
# master_sp = sp[['FSYM_REGIONAL','LOCAL_CD']].set_index('LOCAL_CD')['FSYM_REGIONAL'].to_dict()
# master_sp_rv = sp[['FSYM_REGIONAL','LOCAL_CD']].set_index('FSYM_REGIONAL')['LOCAL_CD'].to_dict()
# save_pickle(master_sp, "종목마스터SP500")
#
# master_russel = russel[['FSYM_ID','LOCAL_CD']].set_index('LOCAL_CD')['FSYM_ID'].to_dict()
# master_russel_rv = russel[['FSYM_ID','LOCAL_CD']].set_index('FSYM_ID')['LOCAL_CD'].to_dict()
# save_pickle(master_russel, "종목마스터RUSSELL1000")
#
# master_sp.update(master_russel)
# master_sp_rv.update(master_russel_rv)
# save_pickle(master_sp, "종목마스터")
# save_pickle(master_sp_rv, "종목마스터_rv")

# def get_master():
#
#     conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database='MARKET',                    charset='utf8')  # 개발DB
#     sql = '''
#     select *
#     from WEBQM..FR_ETF_MAST
#     '''
#     result = pd.read_sql(sql, con=conn)
#     return result
#
# master_org = get_master()
#
# master = master_org[['FSYM_ID','TICKER']].set_index('TICKER')['FSYM_ID'].to_dict()
# master_rv = master_org[['FSYM_ID','TICKER']].set_index('FSYM_ID')['TICKER'].to_dict()
# save_pickle(master, "종목마스터ETF")
# save_pickle(master_rv, "종목마스터ETF_rv")
etf = pd.read_excel('org-data/info/ETF_0210.xlsx').fillna('-')
etf_list = list()
etf['시가총액'] = etf['시가총액'].apply(lambda x: str(round(x/10000,0))+"만" if type(x)!= str else x)
etf['1주 수익률'] = etf['1주 수익률'].apply(lambda x: str(round(x*100,1))+"%" if type(x)!= str else x)
etf['1달 수익률'] = etf['1달 수익률'].apply(lambda x: str(round(x*100,1))+"%" if type(x)!= str else x)

for idx, row in etf.iterrows():
    etf_list.append({"id":idx,"group":row['그룹'],"ticker":row['티커'], "ma":row['운용사'],"name":row['ETF 명'],"mcap":row['시가총액'],"week":row['1주 수익률'],"month":row['1달 수익률'],"initdate":row['최초상장일'],})
save_pickle(etf_list, "recent_etf")
print(1)