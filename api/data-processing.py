import pandas as pd
import pickle
import pymssql
def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df
file_list = ['미래에셋 추천 포트폴리오','변동성 알고리즘','테마로테이션','멀티에셋 인컴','초개인화로보','멀티에셋 모멘텀(해외)','멀티에셋 모멘텀(국내)']
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
        df = df[['구분','비중1']].drop_duplicates()
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