import pickle5 as pickle
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
                           charset='EUC-KR')  # 개발DB
    result = pd.read_sql(sql, con=conn)
    return result

def get_df_utf(sql):
    conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database='MARKET',
                           charset='UTF8')  # 개발DB
    result = pd.read_sql(sql, con=conn)
    return result

def get_df_cp949(sql):
    conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database='MARKET',
                           charset='CP949')  # 개발DB
    result = pd.read_sql(sql, con=conn)
    return result

def get_all_ticker_pr(ticker_list, td, nm_df, is_ticker = True):
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

def get_us_stock_pr_by_ticker(id_list, td):
    id_ticker = get_global_sector_master()
    id_ticker = id_ticker[['TICKER', 'FSYM_ID']].dropna()
    id_ticker['TICKER'] = id_ticker['TICKER'].apply(lambda x: x.split(' ')[0] + '-' + x.split(' ')[1] if len(x.split(' '))>2 else x  )
    ticker2id = id_ticker.set_index('TICKER')['FSYM_ID'].to_dict()
    id2ticker = id_ticker.set_index('FSYM_ID')['TICKER'].to_dict()
    id_list = list(map(lambda x: ticker2id[x] if x in ticker2id.keys() else x, id_list))
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '{}'
    '''.format('\',\''.join(id_list), td)

    result = get_df(sql)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    result.columns = list(map(lambda x: id2ticker[x] if x in id2ticker.keys() else x, result.columns))
    return result

def get_kr_stock_pr_by_ticker(id_list, td):

    # id_list_new = list(map(lambda x: x.replace("-KS",""), id_list))
    sql = '''
    select *
    from MARKET..MB 
    where CODE in ('{}')
    and TD > '{}'
    '''.format('\',\''.join(id_list), td)
    result = get_df(sql)
    result = result.pivot(index='TD', columns='CODE', values='OPEN_P').bfill().ffill()
    return result

def get_us_stock_pr(id_list, td):
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '{}'
    '''.format('\',\''.join(id_list), td)
    result = get_df(sql)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    # result.columns = list(map(lambda x: id2ticker[x], result.columns))
    return result

def get_gics_master():
    sql = '''
    SELECT *
    FROM AGGR..MSCI_GICS_CODE
    '''
    result = get_df(sql)
    return result

def get_global_sector_master():
    sql = '''
    select *
    from WEBQM..WEB_GQPM_MAST
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result

def get_global_factor_master():
    sql = '''
    select * from WEBQM..WEB_GQPM_ACCT
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result


def get_all_theme_ticker():
    sql = '''
    select *
    from WEBQM..theme_stock_raw
    where 1=1
    '''
    result = get_df(sql)
    result.columns = list(map(lambda x : x.upper(), result.columns))
    return result
def get_kr_sector_master():
    sql = '''
    select *
    from WEBQM..WEB_KR_MAST_SUB 
    '''
    result = get_df(sql)
    return result
def get_ch_sector_master():
    sql = '''
    select *
    from WEBQM..WEB_GQPM_MAST_CHN
    '''
    result = get_df(sql)
    return result

def get_ch_theme_master():
    sql = '''
    select *
    from WEBQM..THEME_MAST_CHN
    '''
    result = get_df(sql)
    return result

# todo :
def get_global_theme_master(): #글로벌 테마
    sql = '''SELECT * FROM WEBQM..THEME_MAST '''
    result = get_df_cp949(sql)
    return result

def get_global_theme_ticker():
    sql = '''SELECT * FROM WEBQM..STOCK_THEME_MAPPING'''
    result = get_df_cp949(sql)
    return result

def get_global_theme_mapping():
    sql = '''
    select top 100 *
    FROM WEBQM..DI_UNIV
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result

def get_kr_theme_univ():
    sql = '''
    select *
    from WEBQM..KR_THEME_MAST
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result

def get_kr_theme_ticker():
    sql = '''
    select *
    from WEBQM..KR_STOCK_THEME_MAPPING
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result

def get_kr_theme_mapping():
    sql = '''
    select top 100 *
    FROM WEBQM..DI_UNIV
    where 1=1
    and ticker like '%-KR'
    '''
    # EUMQNTDB..WEB_GQPM_MAST
    result = get_df(sql)
    return result



def get_gics():
    sql = '''
    SELECT DISTINCT INDUSTRY_GROUP, INDUSTRY_GROUP_NAME 
    FROM AGGR..MSCI_GICS_CODE 
    '''
    result = get_df(sql)
    return result

def get_kr_stock_pr(id_list, td):
    sql = '''
    SELECT CODE, TD, CLOSE_AP
    FROM MARKET..MB
    WHERE TD > '{}'
    AND CODE in ('{}')
    '''.format(td, '\',\''.join(id_list))
    result = get_df(sql)
    result = result.rename(columns={"CODE":"FSYM_ID", "TD":"BASE_DT", "CLOSE_AP":"P_PRICE"})
    # result["FSYM_ID"] = result["FSYM_ID"].apply(lambda x: x+'-KS')
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    return result

def get_factor(factor, td):
    sql = """ select TD, FSYM_ID, GICS_INDUSTRYGROUP, COUNTRY_NAME, VAL
    from WEBQM..WEB_GQPM_DATA
     where ac_code = '{}'
     and td > '{}' """.format(factor, td)
    df = get_df(sql).dropna(subset=['VAL'])
    return df

def get_global_factor_data(code_list):
    sql = """ select * 
    from WEBQM..WEB_GQPM_DATA
    where TD = (select max(TD)
    from WEBQM..WEB_GQPM_DATA)
    and AC_CODE in ('{}')
 """.format('\',\''.join(code_list))
    df = get_df(sql).dropna(subset=['VAL'])
    return df

def get_kr_factor_data(code_list):
    sql = """ select * 
    from WEBQM..WEB_KR_QPM_DATA
    where TD = (select max(TD)
    from WEBQM..WEB_KR_QPM_DATA)
    and AC_CODE in ('{}')
 """.format('\',\''.join(code_list))
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

def get_perform_table():
    sql = '''
    -- DROP TABLE #REPORT1
    
    
    declare @std_date VARCHAR(8)
    set @std_date = '20230101'
    print(@std_date)
    
    
    CREATE TABLE #REPORT1 
            ( ANNOUN_DT VARCHAR(8)
            , REPORT_GB VARCHAR(8)
             , GICODE VARCHAR(20)
             , GS_YM VARCHAR(8)
             , GS_GB VARCHAR(8)
             , JM_NAME VARCHAR(50)
             , INDEX_NAME_KR VARCHAR(20)
             , INDEX_WEIGHT FLOAT
             , SEC_NM VARCHAR(50)
             , IND_NM VARCHAR(50)
             , SALES FLOAT
             , OPER_PROFIT FLOAT
             , BF_TAX_PROFIT FLOAT
             , NET_PROFIT FLOAT
             , SIZE VARCHAR(20)
             , PREV_Q_GS_YM VARCHAR(8)
             , PREV_Y_GS_YM VARCHAR(8)
             )
    INSERT INTO #REPORT1 (
    ANNOUN_DT
    ,REPORT_GB
    ,GICODE
    ,GS_YM
    ,GS_GB
    ,JM_NAME
    ,INDEX_NAME_KR
    ,INDEX_WEIGHT 
    ,SEC_NM
    ,IND_NM
    ,SALES
    ,OPER_PROFIT
    ,BF_TAX_PROFIT
    ,NET_PROFIT
    ,SIZE
    ,PREV_Q_GS_YM
    ,PREV_Y_GS_YM
    )
    SELECT 
     A.ANNOUN_DT	
    ,A.REPORT_GB	
    ,A.GICODE	
    ,A.GS_YM	
    ,A.GS_GB	
    , A_INFO.itemabbrnm as JM_NAME
    , REPLACE(IDX.INDEX_NAME_KR,'지수','') AS INDEX_NAME_KR
    , IDX.INDEX_WEIGHT
    , SECTOR.K1 AS SEC_NM
    , SECTOR.K2 AS IND_NM
    ,A.SALES	
    ,A.OPER_PROFIT	
    ,A.BF_TAX_PROFIT	
    ,A.NET_PROFIT
    ,A_INFO.SIZE
    ,A.PREV_Q_GS_YM	
    ,A.PREV_Y_GS_YM	
    from (
            
            select A.*
                 --, LEFT(B.gs_pyear,6) AS PREV_Y_GS_YM
                 , left(convert(char(10), dateadd(year, -1, CONVERT(datetime,A.gs_ym+'01') ) , 112),6) AS PREV_Y_GS_YM
                 , LEFT(B.gs_pquarter,6) AS PREV_Q_GS_YM
                 , count(A.ANNOUN_DT) over() cnt 
            from FNFDB..FNF_REAL_FS_N A  -- 잠정실적
            left outer join fnsdb..fns_stocks_d B  -- 결산년월
            on (A.GICODE = B.gicode and A.ANNOUN_DT = B.trd_dt)
            where 1=1
            and A.ANNOUN_DT > @std_date
            and A.gs_gb in ('1','2','3','4')
        )A left outer join AGGR..KRX_PKG_CONST IDX
        on (A.ANNOUN_DT = IDX.FILE_DATE and A.GICODE = IDX.CONSTITUENT_CODE)
        , ( select A.SCODE, A.CODE, B.K1, B.K2
              from SECTOR..SAC A
                 , SECTOR..SA B
             where 1=1
               and A.scode like 'B%'
               and A.scode  = B.scode 
               and len(A.scode) > 4
         ) SECTOR
    , (select gicode, itemcd, mkt_gb, itemabbrnm, kospi200_use_gb, 
                       case when mkt_cap_size = '02' then '코스피대'
                            when mkt_cap_size = '03' then '코스피중'
                            when mkt_cap_size = '04' then '코스피소'
                            when mkt_cap_size = '1' then '코스닥대'
                            when mkt_cap_size = '2' then '코스닥중'
                            when mkt_cap_size = '3' then '코스닥소'
                            when mkt_cap_size = '0' then '제외'
                            else '기타'
                            end as SIZE
                from FNSDB..FNS_J_MAST   -- 종목 마스터
                where 1=1
                and use_yn = 'Y'       -- 상폐아닌 종목만
                and (reits_gb = '0' or reits_gb is null)  -- 리츠 제외
                --and etf_gb = '00'  -- etf 제외
                and mkt_gb in ('1','2')
        ) A_INFO
    where 1=1
    and IDX.INDEX_ISIN in ( 'KRD020020008', 'KRD020040006')
    and REPLACE(A.GICODE,'A','') = SECTOR.CODE
    and A.GICODE = A_INFO.gicode
    
    ---- 현황판
    
    SELECT 
     RESULT.ANNOUN_DT
     ,(CASE WHEN RESULT.REPORT_GB = 'D' then '연결'
           WHEN RESULT.REPORT_GB = 'B' then '별도'
           ELSE ' ' END) AS REPORT_GB	
    ,RESULT.GICODE	
    ,RESULT.JM_NAME	
    ,RESULT.INDEX_NAME_KR	
    ,RESULT.INDEX_WEIGHT	
    ,RESULT.SEC_NM	
    ,RESULT.IND_NM	
    ,RESULT.GS_YM	
    ,RESULT.GS_GB	
    ,RESULT.SALES	
    ,RESULT.OPER_PROFIT	
    ,RESULT.NET_PROFIT	
    ,NULLIF(RESULT.prev_q_SALES / 100000,0) -1 as prev_q_SALES
    ,NULLIF(RESULT.prev_q_OPER_INC / 100000,0) -1 as prev_q_OPER_PROFIT
    ,NULLIF(RESULT.prev_q_NET_INC / 100000,0) -1 as prev_q_NET_PROFIT
    ,NULLIF(RESULT.prev_y_SALES / 100000,0) -1 as prev_y_SALES
    ,NULLIF(RESULT.prev_y_OPER_INC / 100000,0) -1 as prev_y_OPER_PROFIT
    ,NULLIF(RESULT.prev_y_NET_INC / 100000,0) -1 as prev_y_NET_PROFIT
    ,NULLIF(RESULT.SALES	 /  RESULT.con_cur_SALES -1,'')  * 100 AS comp_S
    ,NULLIF(RESULT.OPER_PROFIT	 /  RESULT.con_cur_OP -1,'') * 100 AS comp_OP
    ,NULLIF(RESULT.NET_PROFIT	 /  RESULT.con_cur_NI -1,'') * 100 AS comp_NI
    ,NULLIF(RESULT.SALES	 /  NULLIF(RESULT.prev_q_SALES / 100000 ,0) -1,'') * 100 AS qoq_S
    ,NULLIF(RESULT.OPER_PROFIT	 /  NULLIF(RESULT.prev_q_OPER_INC / 100000,0) -1,'') * 100 AS qoq_OP
    ,NULLIF(RESULT.NET_PROFIT	 /  NULLIF(RESULT.prev_q_NET_INC / 100000,0) -1,'') * 100 AS qoq_NI
    ,NULLIF(RESULT.SALES	 /  NULLIF(RESULT.prev_y_SALES / 100000,0) -1,'') * 100 AS yoy_S
    ,NULLIF(RESULT.OPER_PROFIT	 /  NULLIF(RESULT.prev_y_OPER_INC / 100000,0) -1,'') * 100 AS yoy_OP
    ,NULLIF(RESULT.NET_PROFIT	 /  NULLIF(RESULT.prev_y_NET_INC / 100000,0) -1,'') * 100 AS yoy_NI
    ,RESULT.SIZE
    FROM (
    
    select A.ANNOUN_DT	
            ,A.REPORT_GB	
            ,A.GICODE	
            ,A.GS_YM	
            ,A.GS_GB	
            ,A.JM_NAME	
            ,A.INDEX_NAME_KR	
            ,A.INDEX_WEIGHT	
            ,A.SEC_NM	
            ,A.IND_NM	
            ,A.SALES	
            ,A.OPER_PROFIT	
            ,A.NET_PROFIT	
            ,A.SIZE	
            ,A.PREV_Q_GS_YM	
            ,A.PREV_Y_GS_YM	
            ,A.GB	
            ,A.con_cur_SALES	
            ,A.con_cur_OP	
            ,A.con_cur_NI		
         , sum( case when RIGHT(A.ACCOUNT,6) = '904001' then A.AMOUNT else 0 end ) as prev_q_SALES
         , sum( case when RIGHT(A.ACCOUNT,6) = '906001' then A.AMOUNT else 0 end ) as prev_q_OPER_INC
         , sum( case when RIGHT(A.ACCOUNT,6) = '908004' then A.AMOUNT else 0 end ) as prev_q_NET_INC
         , sum( case when RIGHT(y1.ACCOUNT,6) = '904001' then y1.AMOUNT else 0 end ) as prev_y_SALES
         , sum( case when RIGHT(y1.ACCOUNT,6) = '906001' then y1.AMOUNT else 0 end ) as prev_y_OPER_INC
         , sum( case when RIGHT(y1.ACCOUNT,6) = '908004' then y1.AMOUNT else 0 end ) as prev_y_NET_INC
    from (
            select A.ANNOUN_DT
                 , A.REPORT_GB
                 , A.GICODE
                 , A.GS_YM
                 , A.GS_GB
                 , A.JM_NAME
                 , A.INDEX_NAME_KR
                 , A.INDEX_WEIGHT 
                 , A.SEC_NM
                 , A.IND_NM
                 , A.SALES
                 , A.OPER_PROFIT
                 , A.NET_PROFIT
                 , A.SIZE
                 , A.PREV_Q_GS_YM
                 , A.PREV_Y_GS_YM
                 , CON.GB
                 , CON.SALES as con_cur_SALES
                 , CON.OP as con_cur_OP
                 , CON.NI as con_cur_NI
                 , q1.AMOUNT
                 , f2.ACCOUNT 
            from #REPORT1 A
            left outer join IBES..ZKC_Q_IFRS CON -- 컨센  -- 이게 오래걸리네.
            on (REPLACE(A.GICODE,'A','') = CON.CODE
                            AND A.ANNOUN_DT = CON.TD
                            and A.GS_YM = CON.YM 
                            and A.REPORT_GB  =CON.EST_GB)
            , fnjdb..fnj_aa f1
            , fnjdb..fnj_ga_ifrs_n f2  -- 코드 
            left outer join fnjdb..fnj_za_ifrs_n q1 -- Q_연결
            on ( f2.ACCOUNT = q1.ACCOUNT )
            where 1=1
            --and A.ANNOUN_DT > '20230301'
            and A.REPORT_GB = 'D' -- 연결
            and (CON.GB  = 'A' or CON.GB IS NULL)  -- 컨센 평균
            and A.GICODE = f1.gicode
            and f1.u_gb = f2.U_GB 
            and f2.REPORT_GB = '60'   -- 연결 리포트
            and f2.ACCOUNT_MAIN in ('904001' , '906001' , '908001' , '908004')
            --qoq
            and A.GICODE = q1.gicode
            and A.PREV_Q_GS_YM = q1.GS_YM
            and q1.GS_GB in ('1','2','3','4')
            ) A
    left outer join fnjdb..fnj_za_ifrs_n y1 -- Y_연결 --yoy
    on ( A.GICODE = y1.GICODE AND A.PREV_Y_GS_YM = y1.GS_YM AND A.ACCOUNT = y1.ACCOUNT )
    where 1=1
    and y1.GS_GB in ('1','2','3','4')
    group by A.ANNOUN_DT ,A.REPORT_GB	
            ,A.GICODE	
            ,A.GS_YM	
            ,A.GS_GB	
            ,A.JM_NAME	
            ,A.INDEX_NAME_KR	
            ,A.INDEX_WEIGHT	
            ,A.SEC_NM	
            ,A.IND_NM	
            ,A.SALES	
            ,A.OPER_PROFIT	
            ,A.NET_PROFIT	
            ,A.SIZE	
            ,A.PREV_Q_GS_YM	
            ,A.PREV_Y_GS_YM	
            ,A.GB	
            ,A.con_cur_SALES	
            ,A.con_cur_OP	
            ,A.con_cur_NI
    union all
    select A.ANNOUN_DT	
            ,A.REPORT_GB	
            ,A.GICODE	
            ,A.GS_YM	
            ,A.GS_GB	
            ,A.JM_NAME	
            ,A.INDEX_NAME_KR	
            ,A.INDEX_WEIGHT	
            ,A.SEC_NM	
            ,A.IND_NM	
            ,A.SALES	
            ,A.OPER_PROFIT	
            ,A.NET_PROFIT	
            ,A.SIZE	
            ,A.PREV_Q_GS_YM	
            ,A.PREV_Y_GS_YM	
            ,A.GB	
            ,A.con_cur_SALES	
            ,A.con_cur_OP	
            ,A.con_cur_NI		
         , sum( case when RIGHT(A.ACCOUNT,6) = '904001' then A.AMOUNT else 0 end ) as prev_q_SALES
         , sum( case when RIGHT(A.ACCOUNT,6) = '906001' then A.AMOUNT else 0 end ) as prev_q_OPER_INC
         , sum( case when RIGHT(A.ACCOUNT,6) = '908004' then A.AMOUNT else 0 end ) as prev_q_NET_INC
         , sum( case when RIGHT(y1.ACCOUNT,6) = '904001' then y1.AMOUNT else 0 end ) as prev_y_SALES
         , sum( case when RIGHT(y1.ACCOUNT,6) = '906001' then y1.AMOUNT else 0 end ) as prev_y_OPER_INC
         , sum( case when RIGHT(y1.ACCOUNT,6) = '908004' then y1.AMOUNT else 0 end ) as prev_y_NET_INC
    from (
            select A.ANNOUN_DT
                 , A.REPORT_GB
                 , A.GICODE
                 , A.GS_YM
                 , A.GS_GB
                 , A.JM_NAME
                 , A.INDEX_NAME_KR
                 , A.INDEX_WEIGHT 
                 , A.SEC_NM
                 , A.IND_NM
                 , A.SALES
                 , A.OPER_PROFIT
                 , A.NET_PROFIT
                 , A.SIZE
                 , A.PREV_Q_GS_YM
                 , A.PREV_Y_GS_YM
                 , CON.GB
                 , CON.SALES as con_cur_SALES
                 , CON.OP as con_cur_OP
                 , CON.NI as con_cur_NI
                 , q1.AMOUNT
                 , f2.ACCOUNT 
            from #REPORT1 A
            left outer join IBES..ZKC_Q_IFRS CON -- 컨센  -- 이게 오래걸리네.
            on (REPLACE(A.GICODE,'A','') = CON.CODE
                            AND A.ANNOUN_DT = CON.TD
                            and A.GS_YM = CON.YM 
                            and A.REPORT_GB  =CON.EST_GB)
            , fnjdb..fnj_aa f1
            , fnjdb..fnj_ga_ifrs_n f2  -- 코드 
            left outer join fnjdb..fnj_la_ifrs_n q1 -- Q_연결
            on ( f2.ACCOUNT = q1.ACCOUNT )
            where 1=1
            --and A.ANNOUN_DT > '20230301'
            and A.REPORT_GB = 'B' -- 별도
            and (CON.GB  = 'A' or CON.GB IS NULL)  -- 컨센 평균
            and A.GICODE = f1.gicode
            and f1.u_gb = f2.U_GB 
            and f2.REPORT_GB = '30'   -- 연결 리포트
            and f2.ACCOUNT_MAIN in ('904001' , '906001' , '908001' , '908004')
            --qoq
            and A.GICODE = q1.gicode
            and A.PREV_Q_GS_YM = q1.GS_YM
            and q1.GS_GB in ('1','2','3','4')
            ) A
    left outer join fnjdb..fnj_la_ifrs_n y1 -- Y_별도 --yoy
    on ( A.GICODE = y1.GICODE AND A.PREV_Y_GS_YM = y1.GS_YM AND A.ACCOUNT = y1.ACCOUNT )
    where 1=1
    and y1.GS_GB in ('1','2','3','4')
    group by A.ANNOUN_DT	
            ,A.REPORT_GB	
            ,A.GICODE	
            ,A.GS_YM	
            ,A.GS_GB	
            ,A.JM_NAME	
            ,A.INDEX_NAME_KR	
            ,A.INDEX_WEIGHT	
            ,A.SEC_NM	
            ,A.IND_NM	
            ,A.SALES	
            ,A.OPER_PROFIT	
            ,A.NET_PROFIT	
            ,A.SIZE	
            ,A.PREV_Q_GS_YM	
            ,A.PREV_Y_GS_YM	
            ,A.GB	
            ,A.con_cur_SALES	
            ,A.con_cur_OP	
            ,A.con_cur_NI
    )RESULT
    order by RESULT.ANNOUN_DT desc
    ;
    '''
    result = get_df(sql)
    return result

if __name__ == "__main__":
    # china = get_all_theme_ch()
    kr_ticker = get_kr_theme_ticker()
    kr = get_kr_theme_univ()
    kr_univ = pd.merge(kr, kr_ticker, left_on='LV3', right_on='THEME_CODE', how='right')
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
