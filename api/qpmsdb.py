import pickle
import pandas as pd
import pymssql

def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

def get_df(sql):
    conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database='MARKET',
                           charset='utf8')  # 개발DB
    result = pd.read_sql(sql, con=conn)
    return result

def get_all_ticker_pr(ticker_list, td, nm_df,is_ticker = True):
    df = nm_df
    if is_ticker:
        kr_ticker = list(set(list(filter(lambda x: x.split('-')[1]=='KS' and x in ticker_list, df['TICKER_rf']))))
        fr_ticker = list(set(list(filter(lambda x: x.split('-')[1]!='KS' and x in ticker_list, df['TICKER_rf']))))
        df['tf'] = df['TICKER_rf'].apply(lambda x: x in fr_ticker)
        fr_id = df[df['tf']==True]['FSYM_ID'].tolist()
    else:
        kr_ticker = []
        fr_id = list(filter(lambda x: x in list(df['FSYM_ID']), ticker_list))

    kr_num = 0
    fr_num = 0
    pr_df=None
    if len(kr_ticker)>0:
        kr_df = get_kr_stock_pr(list(map(lambda x:x.split('-')[0], kr_ticker)), td)
        print("KR ticker pr : {} ---> {}".format(len(kr_ticker), len(kr_df.columns)))
        kr_num = len(kr_df.columns)
    if len(fr_id) > 0:
        fr_df = get_us_stock_pr(fr_id, df[['FSYM_ID','TICKER_rf']].set_index('FSYM_ID')['TICKER_rf'].to_dict(), td)
        print("FR ticker pr : {} ---> {}".format(len(fr_id), len(fr_df.columns)))
        fr_num = len(fr_df.columns)
    if kr_num>0 and fr_num>0:
        pr_df = pd.merge(kr_df.reset_index(), fr_df.reset_index(), left_on='BASE_DT', right_on='BASE_DT', how='outer').bfill().dropna().set_index('BASE_DT')
    elif fr_num>0:
        pr_df = fr_df
    elif kr_num>0:
        pr_df = kr_df
    else:
        None
    return pr_df

def get_us_stock_pr(id_list, id2ticker, td):
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '{}'
    '''.format('\',\''.join(id_list), td)
    result = get_df(sql)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    result.columns = list(map(lambda x: id2ticker[x], result.columns))
    return result



def get_all_stock_ticker():
    sql = '''
    select TICKER, FSYM_ID, ISIN, SEDOL, GICS_INDUSTRYGROUP, COUNTRY_NAME
    from EUMQNTDB..GQPM_MAST3
    '''
    result = get_df(sql)
    return result

def get_kr_stock_ticker():
    sql = '''
    SELECT *
    FROM MARKET..CA
    '''
    result = get_df(sql)
    return result

def get_kr_stock_pr(id_list, td):
    sql = '''
    SELECT CODE, TD, CLOSE_P
    FROM MARKET..MB
    WHERE TD > '{}'
    AND CODE in ('{}')
    '''.format(td, '\',\''.join(id_list))
    result = get_df(sql)
    result = result.rename(columns={"CODE":"FSYM_ID", "TD":"BASE_DT", "CLOSE_P":"P_PRICE"})
    result["FSYM_ID"] = result["FSYM_ID"].apply(lambda x: x+'-KS')
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    return result

def get_factor(factor, td):
    sql = """ select TD, FSYM_ID, GICS_INDUSTRYGROUP, COUNTRY_NAME, VAL
    from WEBQM..WEB_GQPM_DATA
     where ac_code = '{}'
     and td > '{}' """.format(factor, td)
    df = get_df(sql).dropna(subset=['VAL'])
    return df



def get_capex_by_ticker(ticker):
    sql = """DECLARE @zedwqry VARCHAR(4000)
    DECLARE @openqry VARCHAR(5000)
    DECLARE @td VARCHAR(8), @in_fsym_id VARCHAR(16), @in_code VARCHAR(20)

    SET @td = '20220101'
    set @in_fsym_id = '{}'

    SET @zedwqry = 'select
    fsym_id, base_dt, FF_CAPEX
    from zedw.FF_BASIC_DER_LTM_V3
    where 1 = 1
    and fsym_id = '''''+@in_fsym_id+'''''
    and base_dt>'''''+@td+'''''
    order by base_dt desc'
    SET @openqry = 'SELECT * FROM OPENQUERY(ZEDW_ORA, ''' + @zedwqry + ''')'
    EXEC(@openqry)""".format(ticker)
    df = get_df(sql)
    return df

def get_capex():
    sql = """DECLARE @zedwqry VARCHAR(4000)
    DECLARE @openqry VARCHAR(5000)
    DECLARE @td VARCHAR(8), @in_fsym_id VARCHAR(16), @in_code VARCHAR(20)

    SET @td = '20220101'

    SET @zedwqry = 'select
    fsym_id, base_dt, FF_CAPEX
    from zedw.FF_BASIC_DER_LTM_V3
    where 1 = 1
    and base_dt>'''''+@td+'''''
    order by base_dt desc'
    SET @openqry = 'SELECT * FROM OPENQUERY(ZEDW_ORA, ''' + @zedwqry + ''')'
    EXEC(@openqry)"""
    df = get_df(sql).dropna()
    df['score'] = df['FF_CAPEX'].apply(lambda x: float(x))
    return df.sort_values(by=['score'], ascending=False).iloc[:50]

def get_altman():
    sql = """DECLARE @zedwqry VARCHAR(4000)
    DECLARE @openqry VARCHAR(5000)
    DECLARE @td VARCHAR(8), @in_fsym_id VARCHAR(16), @in_code VARCHAR(20)

    SET @td = '20230101'

    SET @zedwqry = 'select
    fsym_id, base_dt, FF_ZSCORE
    from zedw.FF_ADVANCED_DER_QF_V3 
    where 1 = 1
    and base_dt>'''''+@td+'''''
    order by base_dt desc'
    SET @openqry = 'SELECT * FROM OPENQUERY(ZEDW_ORA, ''' + @zedwqry + ''')'
    EXEC(@openqry)"""
    df = get_df(sql).dropna()
    df['score'] = df['FF_ZSCORE'].apply(lambda x: float(x))
    return df.sort_values(by=['score'], ascending=False).iloc[:50]

def get_sh():
    sql = """DECLARE @zedwqry VARCHAR(4000)
    DECLARE @openqry VARCHAR(5000)
    DECLARE @td VARCHAR(8), @in_fsym_id VARCHAR(16), @in_code VARCHAR(20)

    SET @td = '20230101'

    SET @zedwqry = 'select
    fsym_id, base_dt, FF_COM_SHS_OUT*1000 as FF_COM_SHS_OUT
    from zedw.FF_BASIC_QF_V3 
    where 1 = 1
    and base_dt>'''''+@td+'''''
    order by base_dt desc'
    SET @openqry = 'SELECT * FROM OPENQUERY(ZEDW_ORA, ''' + @zedwqry + ''')'
    EXEC(@openqry)"""
    df = get_df(sql).dropna()
    df['score'] = df['FF_COM_SHS_OUT'].apply(lambda x: float(x))
    return df.sort_values(by=['score'], ascending=False).iloc[:50]

def get_dps():
    sql = """DECLARE @zedwqry VARCHAR(4000)
    DECLARE @openqry VARCHAR(5000)
    DECLARE @td VARCHAR(8), @in_fsym_id VARCHAR(16), @in_code VARCHAR(20)

    SET @td = '20230101'

    SET @zedwqry = 'select
    fsym_id, base_dt, FF_DPS_SECS
    from zedw.FF_ADVANCED_LTM_V3 
    where 1 = 1
    and base_dt>'''''+@td+'''''
    order by base_dt desc'
    SET @openqry = 'SELECT * FROM OPENQUERY(ZEDW_ORA, ''' + @zedwqry + ''')'
    EXEC(@openqry)"""
    df = get_df(sql).dropna()
    df['score'] = df['FF_DPS_SECS'].apply(lambda x: float(x))
    return df.sort_values(by=['score'], ascending=False).iloc[:50]


if __name__ == "__main__":
    df = get_factor(factor='400130', td='20220101')
    df = get_dps()
    df = get_sh()
    df = get_altman()
    df = get_capex()
    # pr_df = get_all_ticker_pr(df['FSYM_ID'].tolist(), td='20210101', is_ticker=False)
    df = get_altman()
    df = get_capex()
    # get_all_ticker_pr(['000020-KS','000040-KS','000001 CH','OMCL-US','UNH-US','A-US','241-HK'], td='20210101')
    df = get_kr_stock_pr(['000020','000040'], td='20210101')
    print(1)
