import sqlite3

import pymssql
import pandas as pd
# conn = pymssql.connect(host='10.93.20.194', user='quant', password='mirae', database = 'MARKET',charset='utf8') # 운영DB
conn = pymssql.connect(host='10.93.20.65', user='quant', password='mirae', database = 'MARKET',charset='utf8') # 개발DB
sql = '''
select *
from openquery(zedw_ora,'
select FSYM_ID, BASE_DT, P_PRICE
from zedw.fp_basic_price_v2
where fsym_id in  (''RJ0FT9-R'',''M1FW60-R'')
and base_dt > ''20230200''
')
'''
df = pd.read_sql(sql, con= conn)
print(df)