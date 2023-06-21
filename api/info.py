import pandas as pd
from config import *
from qpmsdb import *
import pickle5 as pickle
def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

company_master = read_pickle('company_master')
def get_perform(ticker_list, st_dt):
    sql = '''
     select B.TD ,B.CODE ,C.CLOSE_AP ,B.YM ,B.GB ,B.SALES ,B.OP ,B.NI
    from 
    ( SELECT FD 
    FROM MARKET..MA  -- 국내달력
    WHERE FD >= CONVERT(varchar(8),dateadd(yy,-1,(SELECT MAX(FD) FROM MARKET..MA WHERE TR = '1')),112)
    AND TR ='1' ) A
    ,IBES..ZKC_Q_IFRS B  -- 국내컨센 Q
    ,MARKET..MB C  -- 국내주가 
    where 1=1
    and A.FD = B.TD
    and A.FD = C.TD
    and B.CODE in ('{}')  --종목코드 선택가능
    and B.CODE = C.CODE
    AND B.EST_GB = 'D' -- 'B:별도 / D:연결'
    and B.TD > '{}'
    '''.format('\',\''.join(ticker_list), st_dt)
    result = get_df(sql)
    return result
perform_df = get_perform(ticker_list=['000140','000145','005930'], st_dt='20220100')
perform_df_p = perform_df.pivot(index=['TD','YM'],columns='GB',values='SALES')
perform_df_p_dr = perform_df_p.reset_index().drop_duplicates(['TD'])
print(1)
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
df = get_company_code()
save_pickle(df, 'company_code')

def get_code_df(id_list):
    sql = '''
     select TICKER, FSYM_ID, ISIN, SEDOL, GICS_INDUSTRYGROUP, COUNTRY_NAME
     from EUMQNTDB..GQPM_MAST3 
	 where TICKER in ('{}')
    '''.format('\',\''.join(list(map(lambda x: x+" KS EQUITY", id_list))))
    result = get_df(sql)
    return result

master_df = get_code_df(df['CODE'].tolist())

port = pd.read_excel('org-data/suggest/미래에셋 추천 포트폴리오.xlsx', sheet_name='적극투자형')
port['코드'] = port['코드'].apply(lambda x: '0'*(6-len(str(x)))+str(x))
port['코드2'] = port['코드'].apply(lambda x: x+"-KS")
pr_df = get_kr_stock_pr(port['코드'].tolist(), td='20221231')
rtn_df = pr_df.pct_change().fillna(0)

rtn_df['total'] = 0
wgt_dict = port[['코드2','비중2']].set_index('코드2')['비중2'].to_dict()
for col in wgt_dict.keys():
    rtn_df['total'] += rtn_df[col] * wgt_dict[col]

graph = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='그래프(영업일)', skiprows=1)
graph = graph.rename(columns={'Unnamed: 0':'Date'}).set_index('Date').drop_duplicates().rename(columns=port2nm)
perform = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='성과(요약)', skiprows=2)
perform = perform.rename(columns={"Unnamed: 1":"PORT"}).dropna(subset=['PORT'])[['PORT','1D','1W','1M','6M','1Y','YTD']]
perform['PORT'] = perform['PORT'].apply(lambda x: port2nm[x])
perform = perform.set_index("PORT")
print(1)