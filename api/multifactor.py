from util.func import *
import math
from matplotlib import colors, cm
from sklearn.cluster import KMeans
from sklearn.preprocessing import RobustScaler

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

# Download Fama-French Factor Data
df_equityfactor_index, df_equityfactor_return = famafrench_download(start, end, frequency=frequency)

# Download Yahoo Data
if start_download==1:
    df_yahoo_index=yahoo_download(tickers, start, end, frequency)
    df_yahoo_index.to_pickle("pkl/df_yahoo_index.pkl")
else:
    df_yahoo_index = pd.read_pickle("pkl/df_yahoo_index.pkl")



# df_db_index=db_download()
# df_db_index=df_db_index[db_tickers]
# df_db_index=df_db_index[df_db_index.index<=end]
# DataFrame by Asset Class
df_equity=df_yahoo_index[tickers_equity].dropna()
df_equity=df_equity.reset_index()
df_bond=df_yahoo_index[tickers_bond].dropna()
df_bond=df_bond.reset_index()

#equity_turbulence=compute_turbulence(df_equity, years=5, frequency='W')
#equity_turbulence=equity_turbulence.set_index('Date')
#display(equity_turbulence)
#bond_turbulence=compute_turbulence(df_bond, years=5, frequency='W')
#bond_turbulence=bond_turbulence.set_index('Date')
#display(df_db_index.tail())

# 자산수익률 데이터프레임
df_asset_index=df_yahoo_index.copy()
df_asset_index_nousdkrw=df_asset_index.drop('KRW=X', axis=1)
#display(df_asset_index_nousdkrw.tail())

df_asset_index=df_asset_index.dropna(subset=df_asset_index_nousdkrw.columns, axis=0, how='all')
#display(df_asset_index[df_asset_index.index>='2022-09-01'])

#df_yahoo_index=df_db_index[db_tickers]
df_asset_ret=df_asset_index.pct_change()
#df_asset_ret=df_asset_ret.reindex(columns=db_tickers)
#display(df_asset_ret.tail())

num_asset=df_asset_ret.count()
asset_to_delete = num_asset[num_asset <= annualization*3] # 3년 이상 시계열 있는 종목만
delete_name = list(asset_to_delete.index)
print('deleted tickers:', delete_name)

df_asset_index=df_asset_index.drop(delete_name, axis=1)
df_asset_ret=df_asset_ret.drop(delete_name, axis=1)

# display(df_asset_ret.tail())

# try:
#     df_factorasset_index=df_db_index.copy()
#     df_factorasset_index=df_factorasset_index[db_tickers]
#     df_factorasset_ret=df_factorasset_index.pct_change()
#     df_factorasset_ret=df_factorasset_ret.reindex(columns=db_tickers)
# except:
df_factorasset_index=df_yahoo_index[yahoo_tickers].copy()
df_factorasset_ret=df_factorasset_index.pct_change()
df_factorasset_ret=df_factorasset_ret.reindex(columns=yahoo_tickers)


df_factor_ret=calculate_factor_ret_db(df_factorasset_ret, df_equityfactor_return, method=factor_method)
df_factor_ret=df_factor_ret[df_factor_ret.index>='1976-09-02']
df_factor_ret=df_factor_ret.dropna(how='all', subset=['SMB', 'HML', 'RMW', 'CMA', 'Mom']) #데이터 합치기 위해 FF 팩터데이터가 존재하지 않는 행 삭제
#display(df_factor_ret)

df_factor_index=1000*(1+df_factor_ret.cumsum())
#df_factor_index.plot()

df_factor_summary=pd.DataFrame([])
df_factor_summary['Annualized Return']=df_factor_ret.mean()*annualization
df_factor_summary['Annualized Volatility']=df_factor_ret.std()*(annualization**0.5)
df_factor_summary['Sharpe(Rf=0%)']=df_factor_summary['Annualized Return'] / df_factor_summary['Annualized Volatility']
# display(df_factor_summary)

# Calculate Factor Exposures

# 3년간의 데이터 추출
data_x = df_factor_ret.dropna()
data_x = data_x[-annualization * 3:]
data_y = df_asset_ret[df_asset_ret.index <= data_x.index[-1]]
data_y = data_y[-annualization * 3:]

if regression_method == 'PCR':
    regression_result = factor_model(data_y, data_x, regression='PCR')
elif regression_method == 'stepwise':
    regression_result = factor_model(data_y, data_x, regression='stepwise')
else:
    print('Input Regression Method!')

try:
    gx_ret = df_asset_ret[tickers_gx]
    gx_ret = gx_ret.dropna()
    stepwise_gx_result = factor_model(gx_ret, df_factor_ret.dropna(), regression='stepwise')
    stepwise_income_result = factor_model(df_asset_ret[tickers_income].dropna(), df_factor_ret.dropna(),
                                          regression='stepwise')

except:
    pass
regression_result.corr.style.format("{:.4f}").background_gradient(cmap='YlGn') # Display factor correlations (stepwise)

def background_gradient(s, m, M, cmap='Pubu', low=0, high=0): # Factor Exposure 보여줄 색깔 정의
    rng = M - m
    norm = colors.Normalize(m - (rng * low),
                            M + (rng * high))
    normed = norm(s.values)
    c = [colors.rgb2hex(x) for x in plt.cm.get_cmap(cmap)(normed)]
    return ['background-color: %s' % color for color in c]

#even_range = np.max([np.abs(result.exposures.values.min()), np.abs(result.exposures.values.max())])
even_range=1.5
cm = sns.diverging_palette(240, 10, as_cmap=True)

# Ticker 및 ETF Name 매칭
tickers = df_asset_ret.columns

if start_download == 1:
    ETF = pd.DataFrame([], columns=['Tickers', 'Name'])
    for i in range(len(tickers)):
        names = yf.Ticker(tickers[i])
        print(names)
        try:
            company_names = names.info['longName']
        except:
            try:
                company_names = names.info['shortName']
            except:
                company_names = tickers[i]
        ETF.loc[i, 'Tickers'] = tickers[i]
        ETF.loc[i, 'Name'] = company_names
    ETF.to_pickle("pkl/ETF.pkl")
else:
    ETF = pd.read_pickle("pkl/ETF.pkl")

ETF = ETF.sort_values('Tickers')
ETF = ETF.reset_index(drop=True)
# display(ETF)

# Display Factor Exposures (PCR)
factor_exposures=regression_result.exposures.copy()
factor_exposures=factor_exposures.reset_index()
factor_exposures=factor_exposures.sort_values('index')
factor_exposures['ETF']=ETF['Name'].values
factor_exposures.set_index(['index', 'ETF'], inplace=True)

factor_exposures.style.apply(background_gradient,
                             cmap=cm,
                             m=-even_range,
                             M=even_range).set_precision(4)
#result.exposures.style.format("{:.4f}").background_gradient(cmap='RdYlGn', axis=1)



### Step1. Data 준비

# Forward 1 Month Factor Return
if factor_method=='broad':
    core_factor_columns=['Equity', 'Interest Rates', 'Credit', 'Commodities', 'Inflation', 'USD']
    factor_columns=['Equity', 'Interest Rates', 'Credit', 'Commodities', 'EM','Inflation', 'USD', 'SMB', 'HML', 'RMW', 'CMA', 'Mom']
elif factor_method=='specific':
    core_factor_columns=['Equity', 'Interest Rates', 'Commodities', 'Inflation']
    factor_columns=['US_Equity', 'EFA_Equity', 'EM_Equity', 'Interest Rates', 'Credit', 'Commodities', 'Inflation', 'USD', 'SMB', 'HML', 'RMW', 'CMA', 'Mom']

df_factor_fwdret=df_factor_ret.copy()
df_factor_fwdret['Equity']=0.55*df_factor_fwdret['US_Equity']+0.35*df_factor_fwdret['EFA_Equity']+0.10*df_factor_fwdret['EM_Equity'] #Broad Equity Factor Return을 US, EFA, EM 가중평균하여 정의

if frequency=='D':
    df_factor_fwdret=((1+df_factor_fwdret.shift(-1))*
                      (1+df_factor_fwdret.shift(-2))*
                      (1+df_factor_fwdret.shift(-3))*
                      (1+df_factor_fwdret.shift(-4))*
                      (1+df_factor_fwdret.shift(-5))*
                      (1+df_factor_fwdret.shift(-6))*
                      (1+df_factor_fwdret.shift(-7))*
                      (1+df_factor_fwdret.shift(-8))*
                      (1+df_factor_fwdret.shift(-9))*
                      (1+df_factor_fwdret.shift(-10))*
                      (1+df_factor_fwdret.shift(-11))*
                      (1+df_factor_fwdret.shift(-12))*
                      (1+df_factor_fwdret.shift(-13))*
                      (1+df_factor_fwdret.shift(-14))*
                      (1+df_factor_fwdret.shift(-15))*
                      (1+df_factor_fwdret.shift(-16))*
                      (1+df_factor_fwdret.shift(-17))*
                      (1+df_factor_fwdret.shift(-18))*
                      (1+df_factor_fwdret.shift(-19))*
                      (1+df_factor_fwdret.shift(-20))*
                      (1+df_factor_fwdret.shift(-21)))-1
elif frequency=='W':
    df_factor_fwdret=((1+df_factor_fwdret.shift(-1))*
                      (1+df_factor_fwdret.shift(-2))*
                      (1+df_factor_fwdret.shift(-3))*
                      (1+df_factor_fwdret.shift(-4)))-1
elif frequency=='M':
    df_factor_fwdret=df_factor_fwdret.shift(-1)

# Turbulence
#data_turbulence=df_factor_index[core_factor_columns].reset_index()
#data_turbulence.rename(columns={'index':'Dates'}, inplace=True)
#display(data_turbulence)
#turbulence = compute_turbulence(data_turbulence.dropna(), years=5, alpha=0.01, frequency=frequency)
#turbulence = turbulence.set_index('Dates')
#turbulence['Turbulence_MA(4)'] = ( turbulence['Turbulence'].shift(-1)+
#                                    turbulence['Turbulence'].shift(-2)+
#                                    turbulence['Turbulence'].shift(-3)+
#                                    turbulence['Turbulence'].shift(-4)) / 4
#turbulence.plot()
#display(turbulence)
#df_factor_fwdret=pd.concat([df_factor_fwdret,turbulence['Turbulence_MA(4)']], axis=1)

X = df_factor_fwdret[core_factor_columns].dropna()

# Scaler로 데이터 전처리
Scaler=RobustScaler()
Scaler.fit(X)
X_transformed=Scaler.transform(X)
X_transformed=pd.DataFrame(X_transformed,index=X.index, columns=X.columns)

######################## 전처리 안하고 싶을떄 활성화
#X_transformed=X.copy()

# factor fwd ret 시계열 조정
df_factor_fwdret=df_factor_fwdret[df_factor_fwdret.index>=X.index[0]]
df_factor_fwdret=df_factor_fwdret[df_factor_fwdret.index<=X.index[-1]]

### Step2. Regime 개수 설정을 위한 BIC/AIC 분석

n_components = np.arange(1, 10)
models = [GaussianMixture(n, covariance_type='full', init_params='kmeans',max_iter=1000, tol=1e-6, random_state=100).fit(X_transformed[core_factor_columns])
          for n in n_components]

plt.plot(n_components, [m.bic(X_transformed[core_factor_columns]) for m in models], label='BIC')
plt.plot(n_components, [m.aic(X_transformed[core_factor_columns]) for m in models], label='AIC')
plt.legend(loc='best')
plt.xlabel('n_components');


### Step2. GMM 및 KMeans로 Clustering

gm = GaussianMixture(n_components=4,
                     max_iter=1000,
                     tol=1e-6,
                     init_params='kmeans',
                     covariance_type='full',
                     random_state = 100)

kmeans = KMeans(n_clusters=4)

y_gm = gm.fit_predict(X_transformed[core_factor_columns])
y_gm_proba = gm.predict_proba(X_transformed[core_factor_columns])
y_gm_proba = pd.DataFrame(y_gm_proba, columns=[0,1,2,3], index=df_factor_fwdret.index)


y_kmeans = kmeans.fit_predict(X_transformed[core_factor_columns])
centers=kmeans.cluster_centers_

#display(y_gm_proba.mean())
#display(y_gm_proba_kmeans)

# factor_fwd_ret 데이터프레임에 GMM/K-Means 클러스터링 결과 추가
df_factor_fwdret['Cluster_GMM'] =y_gm
df_factor_fwdret['Cluster_KMeans']=y_kmeans
# display(df_factor_fwdret.tail())

print("Iteration", gm.n_iter_)
print("Means:\n", gm.means_
     ,"\n\nCovarance:\n", gm.covariances_
     ,"\n\nWeights:\n", gm.weights_
     ,"\n\nLog Likelihood: \n", gm.lower_bound_)

# regime_probability: 각각의 Regime의 역사적 분포
regime_probability=pd.DataFrame([],columns=[0,1,2,3])
print(len(df_factor_fwdret.loc[df_factor_fwdret['Cluster_GMM']==0]))
regime_probability.loc[0,0]=len(df_factor_fwdret.loc[df_factor_fwdret['Cluster_GMM']==0])
regime_probability.loc[0,1]=len(df_factor_fwdret.loc[df_factor_fwdret['Cluster_GMM']==1])
regime_probability.loc[0,2]=len(df_factor_fwdret.loc[df_factor_fwdret['Cluster_GMM']==2])
regime_probability.loc[0,3]=len(df_factor_fwdret.loc[df_factor_fwdret['Cluster_GMM']==3])
total_case=regime_probability.loc[0,0]+regime_probability.loc[0,1]+regime_probability.loc[0,2]+regime_probability.loc[0,3]
regime_probability=regime_probability / total_case
regime_probability.index=['역사적 확률']

# factor_return_regime: Regime별 Factor Performance 요약 데이터프레임

multi_index=pd.MultiIndex.from_product([[0, 1, 2, 3],['Ann.mean', 'Ann.std', 'sharpe']], names=['Regime', 'Stats'])
factor_return_regime = pd.DataFrame([],index=multi_index, columns=factor_columns)

# K-Means Clustering 결과를 출력

for regime in [0, 1, 2, 3]:
    print(regime)
    temp = pd.DataFrame([])
    temp = df_factor_fwdret[df_factor_fwdret['Cluster_KMeans'] == regime].describe()
    if frequency == 'W':
        temp.loc['Ann.mean'] = temp.loc['mean'] * 12
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(12)
    elif frequency == 'D':
        temp.loc['Ann.mean'] = temp.loc['mean'] * 12
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(12)
    elif frequency == 'M':
        temp.loc['Ann.mean'] = temp.loc['mean'] * annualization
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(annualization)
    temp.loc['sharpe'] = temp.loc['Ann.mean'] / temp.loc['Ann.std']
    # display(temp)

    # display(df_factor_fwdret[df_factor_fwdret['Cluster_GMM'] == regime][factor_columns].corr().style.format(
    #     "{:.4f}").background_gradient(cmap='YlGn'))
    print('Pairwise Corr_Core = ',
          pairwise_corr(df_factor_fwdret[df_factor_fwdret['Cluster_GMM'] == regime][core_factor_columns],
                        method='pearson'))
    print('Pairwise Corr_Whole = ',
          pairwise_corr(df_factor_fwdret[df_factor_fwdret['Cluster_GMM'] == regime][factor_columns], method='pearson'))

    factor_return_regime.loc[(regime, 'Ann.mean'), factor_columns] = temp.loc['Ann.mean', factor_columns].copy()
    factor_return_regime.loc[(regime, 'Ann.std'), factor_columns] = temp.loc['Ann.std', factor_columns].copy()
    factor_return_regime.loc[(regime, 'sharpe'), factor_columns] = temp.loc['sharpe', factor_columns].copy()

# display(factor_return_regime)
# display(factor_return_regime.loc[(0, 'Ann.mean'), :])

# GMM Clustering 결과를 출력

for regime in [0, 1, 2, 3]:
    print(regime)
    temp = pd.DataFrame([])
    temp = df_factor_fwdret[df_factor_fwdret['Cluster_GMM'] == regime].describe()
    if frequency == 'W':
        temp.loc['Ann.mean'] = temp.loc['mean'] * 12
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(12)
    elif frequency == 'D':
        temp.loc['Ann.mean'] = temp.loc['mean'] * 12
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(12)
    elif frequency == 'M':
        temp.loc['Ann.mean'] = temp.loc['mean'] * annualization
        temp.loc['Ann.std'] = temp.loc['std'] * math.sqrt(annualization)
    temp.loc['sharpe'] = temp.loc['Ann.mean'] / temp.loc['Ann.std']
    # display(temp)

    # display(df_factor_fwdret[df_factor_fwdret['Cluster_KMeans'] == regime][factor_columns].corr().style.format(
    #     "{:.4f}").background_gradient(cmap='YlGn'))
    print('Pairwise Corr_Core = ',
          pairwise_corr(df_factor_fwdret[df_factor_fwdret['Cluster_KMeans'] == regime][core_factor_columns],
                        method='pearson'))
    print('Pairwise Corr_Whole = ',
          pairwise_corr(df_factor_fwdret[df_factor_fwdret['Cluster_KMeans'] == regime][factor_columns],
                        method='pearson'))

    factor_return_regime.loc[(regime, 'Ann.mean'), factor_columns] = temp.loc['Ann.mean', factor_columns].copy()
    factor_return_regime.loc[(regime, 'Ann.std'), factor_columns] = temp.loc['Ann.std', factor_columns].copy()
    factor_return_regime.loc[(regime, 'sharpe'), factor_columns] = temp.loc['sharpe', factor_columns].copy()

# display(factor_return_regime)
# display(factor_return_regime.loc[(0, 'Ann.mean'), :])


# Regime 추이를 출력

df_factor_ret[df_factor_ret.index>='2019-12-31'].US_Equity.cumsum().plot()
df_factor_fwdret[df_factor_fwdret.index>='2019-12-31']['Cluster_GMM'].plot()

prob=y_gm_proba[[0,1,2,3]].dropna()
prob=prob[prob.index>='2019-12-31']

ax=prob.plot.area(stacked=True, color=['steelblue', 'yellow', 'red', 'green'])
plt.show()

df_factorreturn=factor_return_regime.copy()
df_factorreturn=df_factorreturn.T

etf_performance = predict_regime_performance(regression_result.exposures[factor_columns], df_factorreturn)
etf_performance = etf_performance.xs('Ann.mean', level='Stats', axis=1)
etf_performance['Expected_Return']=regime_probability.loc['역사적 확률',0]*etf_performance[0]+regime_probability.loc['역사적 확률',1]*etf_performance[1]+regime_probability.loc['역사적 확률',2]*etf_performance[2]+regime_probability.loc['역사적 확률',3]*etf_performance[3]
# display(etf_performance)


## todo : 최종결과물
returns = pd.DataFrame(etf_performance['Expected_Return']).T
factors = pd.DataFrame(regression_result.exposures[factor_columns]).T
# Portfolio Definition

port_equity = pd.DataFrame({'ACWI': [0.8], 'IEF' : [0.2]})
port_8020 = pd.DataFrame({'ACWI': [0.8], 'IEF' : [0.2]})
port_6040 = pd.DataFrame({'ACWI': [0.6], 'IEF' : [0.4]})
port_4060 = pd.DataFrame({'ACWI': [0.4], 'IEF' : [0.6]})
port_allweather = pd.DataFrame({'ACWI': [0.3],
                                'TLT': [0.4],
                                'IEF': [0.15],
                                'DBC': [0.075],
                                'GLD': [0.075]})

opts = {
    '초개인화 자산관리': port_allweather,
    '테마로테이션': port_allweather,
    '변동성 매매': port_allweather,
    '멀티에셋 인컴': port_allweather,
    '멀티에셋 모멘텀': port_allweather
    }

port_selection=widgets.RadioButtons(
    options=opts.keys(),
    description='포트폴리오: ',
    value='멀티에셋 모멘텀',
    disabled=False)



button = widgets.Button(description="NEXT")
output = widgets.Output(layour={'border': '1px solid black'})

def on_button_clicked(b):
    with output:
        clear_output(wait=True)
        portfolio_weight, portfolio_risk = risk_analysis(regression_result.exposures.drop('const', axis=1), # factor exposure (n * f)
                                                     df_factor_summary['Annualized Volatility'],      # factor volatility (f * 1)
                                                     opts[port_selection.value])       # portfolio weight (n *1)
        run_interactive_widgets(port_selection=port_selection.value, portfolio_risk=portfolio_risk, returns=returns, factors=factors, prob=prob, factor_return_regime=factor_return_regime, regime_probability=regime_probability)
        #run_optimization(port_selection.value, returns, factors, max_active_risk.value, US_Equity.value,  EFA_Equity.value, EM_Equity.value, Interest_Rates.value, Credit.value, Commodity.value, Inflation.value, USD.value, SMB.value, HML.value, RMW.value, CMA.value, Mom.value)

button.on_click(on_button_clicked)



# display(port_selection, button)
print(1)

















print(1)