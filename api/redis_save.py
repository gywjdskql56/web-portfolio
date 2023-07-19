from qpmsdb import *
import redis
from config import *
r = redis.StrictRedis(host='localhost', port=6379, db=0)

def save_pickle(df, file_nm):
    with open('redis/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('redis/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

def save_master():
    df = get_all_stock_ticker()
    df = df.dropna()
    df['TICKER_rf'] = df['TICKER'].apply(lambda x: x.replace(' EQUITY','').replace(' ','-'))
    save_pickle(df, 'id_master')
    ticker2fs = df.set_index('TICKER_rf')['FSYM_ID'].to_dict()
    fs2ticker = df.set_index('FSYM_ID')['TICKER_rf'].to_dict()
    isin2ticker = df.set_index('ISIN')['TICKER_rf'].to_dict()
    ticker2isin = df.set_index('TICKER_rf')['ISIN'].to_dict()
    save_pickle(ticker2fs, 'ticker2fs')
    save_pickle(fs2ticker, 'fs2ticker')
    save_pickle(isin2ticker, 'isin2ticker')
    save_pickle(ticker2isin, 'ticker2isin')
    for k, v in ticker2fs.items():
        r.set(k, v)
    for k, v in fs2ticker.items():
        r.set(k, v)
    for k, v in isin2ticker.items():
        r.set(k, v)
    for k, v in ticker2isin.items():
        r.set(k, v)
    print("master is uploaded to redis")
    print(1)


if __name__ == "__main__":
    save_master()
    print(1)