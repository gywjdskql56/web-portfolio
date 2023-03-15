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

def get_all_ticker_pr(ticker_list):
    df = get_all_stock_ticker()
    df = df.dropna()
    df['TICKER_rf'] = df['TICKER'].apply(lambda x: x.replace(' EQUITY','').replace(' ','-'))
    kr_ticker = list(set(list(filter(lambda x: x.split('-')[1]=='KS' and x in ticker_list, df['TICKER_rf']))))
    fr_ticker = list(set(list(filter(lambda x: x.split('-')[1]!='KS' and x in ticker_list, df['TICKER_rf']))))
    df['tf'] = df['TICKER_rf'].apply(lambda x: x in fr_ticker)
    fr_id = df[df['tf']==True]['FSYM_ID'].tolist()

    kr_num = 0
    fr_num = 0
    if len(kr_ticker)>0:
        kr_df = get_kr_stock_pr(list(map(lambda x:x.split('-')[0], kr_ticker)))
        print("KR ticker pr : {} ---> {}".format(len(kr_ticker), len(kr_df.columns)))
        kr_num = len(kr_df.columns)
    if len(fr_id) > 0:
        fr_df = get_us_stock_pr_v2(fr_id, df[['FSYM_ID','TICKER_rf']].set_index('FSYM_ID')['TICKER_rf'].to_dict())
        print("FR ticker pr : {} ---> {}".format(len(fr_id), len(fr_df.columns)))
        fr_num = len(fr_df.columns)
    if kr_num>0 and fr_num>0:
        pr_df = pd.merge(kr_df.reset_index(), fr_df.reset_index(), left_on='BASE_DT', right_on='BASE_DT', how='outer').ffill().bfill()
    elif fr_num>0:
        pr_df = fr_df
    elif kr_num>0:
        pr_df = kr_df
    else:
        None
    return pr_df

def get_us_stock_pr_v2(id_list, id2ticker):
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '20220000'
    '''.format('\',\''.join(id_list))
    result = get_df(sql)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    result.columns = list(map(lambda x: id2ticker[x], result.columns))
    return result

def get_us_stock_pr(ticker_list):
    ticker2id = read_pickle('종목마스터')
    id2ticker = read_pickle('종목마스터_rv')
    ticker_list_filter = list(filter(lambda x: x in ticker2id.keys() and type(x)==str, ticker_list))
    id_list = list(filter(lambda x: type(x)==str,list(map(lambda x: ticker2id[x], ticker_list_filter))))
    sql = '''
    select FSYM_ID, BASE_DT, P_PRICE
    from EUMQNTDB..FP_PRICE_ADJ 
    where FSYM_ID in ('{}')
    and base_dt > '20220000'
    '''.format('\',\''.join(id_list))
    result = get_df(sql)
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    result.columns = list(map(lambda x: id2ticker[x], result.columns))
    return result


def get_all_stock_ticker():
    sql = '''
    select TICKER, FSYM_ID, ISIN, SEDOL
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

def get_kr_stock_pr(id_list):
    sql = '''
    SELECT CODE, TD, CLOSE_P
    FROM MARKET..MB
    WHERE TD > '20210000'
    AND CODE in ('{}')
    '''.format('\',\''.join(id_list))
    result = get_df(sql)
    result = result.rename(columns={"CODE":"FSYM_ID", "TD":"BASE_DT", "CLOSE_P":"P_PRICE"})
    result["FSYM_ID"] = result["FSYM_ID"].apply(lambda x: x+'-KS')
    result = result.pivot(index='BASE_DT', columns='FSYM_ID', values='P_PRICE').bfill().ffill()
    return result



if __name__ == "__main__":
    get_all_ticker_pr(['000020-KS','000040-KS','000001 CH','OMCL-US','UNH-US','A-US','241-HK'])
    df = get_kr_stock_pr(['000020','000040'])
    print(1)
