import pandas as pd
# import pickle
import pickle5 as pickle
port2nm = {
    '변동성공격2':'변동성 알고리즘_적극투자형',
    '변동성위험중립2':'변동성 알고리즘_위험중립형',
    '변동성안정2':'변동성 알고리즘_안정추구형',
    '초개인로보적극2': '초개인화로보_적극투자형',
    '초개인로보성장2': '초개인화로보_위험중립형',
    '초개인로보안정2': '초개인화로보_안정추구형',
    '테마로테션공격2': '테마로테이션_적극투자형',
    '테마로테션적극2': '테마로테이션_위험중립형',
    '테마로테션중립2': '테마로테이션_안정추구형',
    '멀티에셋인컴공2': '멀티에셋 인컴_적극투자형',
    '멀티에셋인컴적2': '멀티에셋 인컴_위험중립형',
    '멀티에셋인컴중2': '멀티에셋 인컴_안정추구형',
    '멀티에셋_국_적2': '멀티에셋 모멘텀(국내)_적극투자형',
    '멀티에셋_국_중2': '멀티에셋 모멘텀(국내)_위험중립형',
    '멀티에셋_국_안2': '멀티에셋 모멘텀(국내)_안정추구형',
    '멀티에셋_해_적2': '멀티에셋 모멘텀(해외)_적극투자형',
    '멀티에셋_해_중2': '멀티에셋 모멘텀(해외)_위험중립형',
    '멀티에셋_해_안2': '멀티에셋 모멘텀(해외)_안정추구형',
 }


start_download=0
gx_universe=1 #0: 사용안함, 1:사용함
income_universe=1 #0: 사용안함, 1:사용함

tickers_equity=['ACWI','SPY', 'QQQ','EFA','EEM']
tickers_equity_region=['ACWI', 'VT', 'VTI', 'IXUS', 'SPY','IVV','VOO','QQQ','EFA','VEA', 'IEFA', 'SCHF','EEM','IEMG', 'VWO', 'VXUS', 'VEU']
tickers_equity_factor=['VLUE','IVW', 'MTUM', 'QUAL', 'USMV', 'IWM']
tickers_equity_sector=['XLB','XLY','XLP','XLE','XLF','XLV','XLI', 'IYR','VNQ','XLK','IYZ','XLU', 'VGT']
tickers_equity_style=['VTV','VUG','VV','VO','VOE','VOT','VB','VBK','VBR','IJR', 'IJH','IWF', 'IWD','VYM', 'SCHD', 'RSP', 'IWB', 'DIA', 'IWR', 'IVE','DGRO', 'VBR', 'SDY', 'ESGU','DVY', 'MDY']
tickers_equity_country=['VOO','ITOT','EWC','EWW','EPU','EWZ','ARGT','EWU','EWP','EWG','EWI', 'EGPT','INDA', 'AFK', 'EZA', 'EWY', 'EWJ', 'MCHI', 'EWS', 'EWA']
tickers_equity=tickers_equity + tickers_equity_region + tickers_equity_factor + tickers_equity_sector + tickers_equity_style + tickers_equity_country

if gx_universe==1:
    #tickers_gx=['QYLD', 'LIT', 'PAVE', 'PFFD','XYLD', 'URA', 'MLPA', 'COPX', 'RYLD', 'BOTZ', 'BUG', 'MLPX', 'SIL', 'DRIV', 'KRMA', 'CLOU', 'CATH', 'FINX', 'SRET', 'SNSR', 'PFFV', 'CHIQ', 'GNOM', 'SPFF', 'AUSF', 'HERO', 'EDOC', 'AIQ', 'SOCL', 'GREK', 'CTEC', 'MILN']
    tickers_gx=['QYLD', 'LIT', 'PAVE', 'PFFD', 'XYLD', 'COPX', 'URA', 'RYLD', 'BOTZ',
               'MLPA', 'MLPX', 'SIL', 'BUG', 'DRIV', 'SDIV', 'DIV', 'KRMA', 'CATH', 'CLOU',
               'FINX', 'SNSR', 'SRET', 'CHIQ', 'PFFV', 'GNOM', 'SPFF', 'HERO', 'AUSF', 'EDOC',
               'CTEC', 'AIQ', 'SOCL', 'GREK', 'NORW', 'MILN', 'EMBD', 'RNRG', 'QYLG', 'ONOF',
               'VPN', 'QDIV', 'DJIA', 'POTX', 'GURU', 'GXTG', 'EBIZ', 'DAX', 'ASEA',
               'SDEM', 'BKCH', 'XYLG', 'NGE', 'HYDR', 'ALTY', 'GOEX', 'CHIX', 'ARGT', 'XRMI',
               'BFIT', 'CHIS', 'EMFM', 'GXG', 'CHIK', 'PGAL', 'QRMI', 'CHIH', 'EFAS', 'CHIE',
               'AQWA', 'BOSS', 'BITS', 'CHIC', 'CHIR', 'KROP', 'CEFA', 'CHII', 'DMAT', 'RAYS',
               'VNAM', 'XCLR', 'RATE', 'CHIM', 'WNDY', 'EDUT', 'QCLR', 'XTR', 'IRVH', 'RYLG',
               'CHB', 'EWEB', 'CHIU',  'KEJI', 'GRNR', 'QTR', 'DIVD',
               ]
else:
    tickers_gx=[]

if income_universe==1:
    tickers_income=['VYM', 'QYLD','IGF', 'NFRA', 'TOLZ', 'ICLN', 'EMLP', 'ANGL', 'SHYG', 'HYZD', 'CWB', 'ICVT', 'FPE', 'PFXF','PFFD', 'EPRF', 'SPFF', 'PFF', 'PSP', 'KKR', 'HTGC', 'MFIC']
    #tickers_income=['CWB', 'FPE', 'JNK', 'ICVT', 'SRLN', 'BKLN', 'SCHD', 'VIG', 'VCSH', 'VCIT']
else:
    tickers_income=[]

tickers_bond=['TLT','IEF','SHY','TIP','STIP', 'LTPZ', 'LQD','HYG','EMB', 'BIL']
tickers_etc=['GLD','IAU', 'DBC','KRW=X']
tickers=tickers_equity + tickers_bond+tickers_etc+tickers_gx+tickers_income

tickers= list(set(tickers))

db_tickers=['ACWI','VOO','VEA','VWO','VGIT','VNQ','HYG','VCLT', 'VGLT','GLD','GSG','LQD','TIPX','treasury_bill', 'usdkrw']
yahoo_tickers=['SPY', 'EFA', 'EEM' ,'IEF', 'LQD', 'TIP', 'BIL', 'DBC', 'KRW=X']

# 팩터 정의
factor_columns=['US_Growth','EFA_Growth','EM_Growth','Real Rates', 'Inflation', 'Credit', 'Commodity','USD', 'Value', 'Momentum', 'Quality', 'LowVol', 'SmallSize']

# 데이터 기간 및 주기 등 정의

start = pd.to_datetime('1970-12-31')
end = pd.to_datetime('2023-01-15')
frequency = 'D'

annualization = None

if frequency == 'M':
    annualization = 12
elif frequency == 'D':
    annualization = 252
elif frequency == 'W':
    annualization = 52
elif frequency == 'Q':
    annualization = 4
else:
    print('input rebalancing frequency!')

# 기타
factor_method = 'specific'
regression_method = 'stepwise'  # stepwise / PCA
