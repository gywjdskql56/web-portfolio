# Core Functions
# from util.qpmsdb import *
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from hmmlearn.hmm import GaussianHMM
from hmmlearn.hmm import GMMHMM
from sklearn.mixture import GaussianMixture

from matplotlib import colors
# Data Reader
import yfinance as yf
import statsmodels.api as sm
from pandas_datareader.data import DataReader
from pandas_datareader.fred import FredReader
from pandas_datareader.famafrench import get_available_datasets


# Ploty Visuallization
import matplotlib
import matplotlib.ticker as mtick
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import plotly.graph_objs as go
import seaborn as sns
import plotly.graph_objects as go
import ipywidgets as widgets
import pickle
# notebook formatting
from IPython.display import clear_output
from IPython.core.display import HTML, display
pd.options.display.float_format = '{:.4f}'.format
pd.options.display.max_rows=None
pd.options.display.max_columns=None
from IPython.core.display import display, HTML
display(HTML("<style>.container { width:95% !important; }</style>")) #화면 옆으로 확대


# etc
import bt
import riskfolio as rp

# 한글설정
from matplotlib import rcParams
rcParams['font.family'] = 'Malgun Gothic'

def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

# Ipywidgets 스크롤 설정
style = """
    <style>
       .jupyter-widgets-output-area .output_scroll {
            height: unset !important;
            border-radius: unset !important;
            -webkit-box-shadow: unset !important;
            box-shadow: unset !important;
        }
        .jupyter-widgets-output-area  {
            height: auto !important;
        }
    </style>
    """
display(widgets.HTML(style))

start_download=0 #0. 기존 pickle data 가져옴, 1, 새로 다운로드
# Global X 및 Income 유니버스 쓸지 결정
gx_universe=1 #0: 사용안함, 1:사용함
income_universe=1 #0: 사용안함, 1:사용함

# Define Tickers
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
end = pd.to_datetime('2023-02-01')
frequency = 'D'

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


def pairwise_corr(df_returns, method='spearman'):
    if method == 'spearman':
        d = df_returns.corr(method='spearman')
    else:
        d = df_returns.corr()

    d = d.where(np.triu(np.ones(d.shape)).astype(np.bool))
    np.fill_diagonal(d.values, np.nan)
    d = d.stack().reset_index()
    corr = d.iloc[:, 2]
    pairwise_corr = corr.mean()
    return pairwise_corr


def returns_to_index(df_returns, base):
    df_index=df_returns.cumsum()/100
    df_index=(df_index+1)*base
    return df_index


def yahoo_download(tickers, start, end, frequency):  # 야후 데이타 다운로드
    data = yf.download(tickers, start=start, end=end)
    data = data['Adj Close']
    print(data.describe())
    # data=data.dropna()

    if frequency == 'M':
        data = data.resample('M').last()  # 일간데이터를 월간데이터로 변환
    elif frequency == 'Q':
        data = data.resample('Q').last()  # 일간데이터를 분기데이터로 변환
    elif frequency == 'W':
        data = data.resample('W').last()  # 일간데이터를 분기데이터로 변환
    else:
        pass

    return data


def famafrench_download(start, end, frequency):  # 야후 데이타 다운로드
    datasets = get_available_datasets()
    # print('No. of datasets:{0}'.format(len(datasets)))
    # datasets # comment out if you want to see all the datasets

    # Fama-French 5 Factor Download
    df_5_factor = [dataset for dataset in datasets if '5' in dataset and 'Factor' in dataset]
    df_factors_return = DataReader(df_5_factor[1], 'famafrench', start=start, end=end)
    df_factors_return = df_factors_return[0]
    display(df_factors_return.tail())

    # Momentum Factor Download
    df_momfactor_return = [dataset for dataset in datasets if 'Momentum' in dataset and 'Factor' in dataset]
    df_momfactor_return = DataReader(df_momfactor_return[1], 'famafrench', start=start, end=end)
    df_momfactor_return = df_momfactor_return[0]

    # Concat 5-Factors and Momentum Factor
    df_factors_return = pd.concat([df_factors_return, df_momfactor_return], axis=1)
    df_factors_return = df_factors_return.drop(['Mkt-RF', 'RF'], axis=1)  # 무위험수익 배제
    df_factors_index = returns_to_index(df_factors_return, 100)

    # display(df_factors_return.tail())
    # display(df_factors_index.tail())

    if frequency == 'M':
        df_factors_index = df_factors_index.resample('M').last()  # 일간데이터를 월간데이터로 변환
    elif frequency == 'Q':
        df_factors_index = df_factors_index.resample('Q').last()  # 일간데이터를 분기데이터로 변환
    elif frequency == 'W':
        df_factors_index = df_factors_index.resample('W').last()  # 일간데이터를 분기데이터로 변환
    else:
        pass

    df_factors_return = df_factors_index.pct_change()
    df_factors_return.columns = ['SMB', 'HML', 'RMW', 'CMA', 'Mom']
    df_factors_index.columns = ['SMB', 'HML', 'RMW', 'CMA', 'Mom']

    return df_factors_index, df_factors_return


# def db_download():  # 동현매니저 작업한 DB데이타 다운로드
#     temp_df = get_data().run("ALL")
#
#     group_df = temp_df.pivot_table(index=['Dates'], columns=['INDEX_ID'])
#     group_df.columns = group_df.columns.droplevel(0)
#     column_names = group_df.columns
#
#     for i in column_names:
#         existing_str = i
#         new_str = existing_str.replace('extended_', '')
#         new_str = new_str.replace('_US_Equity', '')
#
#         group_df.rename(columns={i: new_str}, inplace=True)
#     if frequency == 'M':
#         group_df = group_df.resample('M').last()  # 일간데이터를 월간데이터로 변환
#     elif frequency == 'Q':
#         group_df = group_df.resample('Q').last()  # 일간데이터를 분기데이터로 변환
#     elif frequency == 'W':
#         group_df = group_df.resample('W').last()  # 일간데이터를 분기데이터로 변환
#
#     return group_df


def calculate_factor_ret(df_asset_ret, df_equityfactor_ret, method='specific'):  # 야후데이터 활용해 팩터리턴 계산
    if method == 'specific':
        factor_columns = ['US_Equity', 'EFA_Equity', 'EM_Equity', 'Interest Rates', 'Credit', 'Commodities',
                          'Inflation', 'USD']
        df_factor_ret = pd.DataFrame([], columns=factor_columns, index=df_asset_ret.index)
        df_factor_ret['US_Equity'] = df_asset_ret['SPY'] - df_asset_ret['BIL']
        df_factor_ret['EFA_Equity'] = df_asset_ret['EFA'] - df_asset_ret['BIL']
        df_factor_ret['EM_Equity'] = df_asset_ret['EEM'] - df_asset_ret['BIL']
        df_factor_ret['Interest Rates'] = df_asset_ret['IEF'] - df_asset_ret['BIL']
        df_factor_ret['Credit'] = df_asset_ret['LQD'] - df_asset_ret['IEF']
        df_factor_ret['Commodities'] = df_asset_ret['DBC'] - df_asset_ret['BIL']
        df_factor_ret['Inflation'] = df_asset_ret['TIP'] - df_asset_ret['IEF']
        df_factor_ret['USD'] = df_asset_ret['KRW=X']
        df_factor_ret = pd.concat([df_factor_ret, df_equityfactor_ret], axis=1)



    elif method == 'broad':
        df_factor_ret = pd.DataFrame([], columns=['US_Growth', 'EFA_Growth', 'EM_Growth', 'Real Rates', 'Inflation',
                                                  'Credit', 'USD'], index=df_asset_ret.index)
        df_factor_ret['US_Growth'] = df_asset_ret['SPY'] - df_asset_ret['BIL']
        df_factor_ret['EFA_Growth'] = df_asset_ret['EFA'] - df_asset_ret['BIL']
        df_factor_ret['EM_Growth'] = df_asset_ret['EEM'] - df_asset_ret['BIL']
        df_factor_ret['Real Rates'] = df_asset_ret['TIP']
        df_factor_ret['Inflation'] = df_asset_ret['IEF'] - df_asset_ret['TIP']
        df_factor_ret['Credit'] = df_asset_ret['LQD'] - df_asset_ret['IEF']
        df_factor_ret['USD'] = df_asset_ret['KRW=X']
    else:
        print("Input accurate calculation methodology")
    return df_factor_ret


def calculate_factor_ret_db(df_asset_ret, df_equityfactor_ret, method='broad'):  # 동현M DB데이터 활용해 팩터리턴 계산
    if method == 'broad':
        factor_columns = ['Equity', 'Interest Rates', 'Credit', 'Commodities', 'EM', 'Inflation', 'USD']
        df_factor_ret = pd.DataFrame([], columns=factor_columns, index=df_asset_ret.index)
        df_factor_ret['US_Equity'] = df_asset_ret['VOO'] - df_asset_ret['treasury_bill']
        df_factor_ret['Interest Rates'] = df_asset_ret['VGIT'] - df_asset_ret['treasury_bill']
        df_factor_ret['Credit'] = df_asset_ret['VCLT'] - df_asset_ret['VGLT']
        df_factor_ret['Commodities'] = df_asset_ret['GSG'] - df_asset_ret['treasury_bill']
        df_factor_ret['EM'] = df_asset_ret['VWO'] - df_asset_ret['VOO']
        df_factor_ret['Inflation'] = df_asset_ret['TIPX'] - df_asset_ret['VGIT']
        df_factor_ret['USD'] = df_asset_ret['usdkrw']
        df_factor_ret = pd.concat([df_factor_ret, df_equityfactor_ret], axis=1)



    elif method == 'specific':
        factor_columns = ['US_Equity', 'EFA_Equity', 'EM_Equity', 'Interest Rates', 'Credit', 'Commodities',
                          'Inflation', 'USD']
        df_factor_ret = pd.DataFrame([], columns=factor_columns, index=df_asset_ret.index)
        df_factor_ret['US_Equity'] = df_asset_ret['VOO'] - df_asset_ret['treasury_bill']
        df_factor_ret['EFA_Equity'] = df_asset_ret['VEA'] - df_asset_ret['treasury_bill']
        df_factor_ret['EM_Equity'] = df_asset_ret['VWO'] - df_asset_ret['treasury_bill']
        df_factor_ret['Interest Rates'] = df_asset_ret['VGIT'] - df_asset_ret['treasury_bill']
        df_factor_ret['Credit'] = df_asset_ret['VCLT'] - df_asset_ret['VGLT']
        df_factor_ret['Commodities'] = df_asset_ret['GSG'] - df_asset_ret['treasury_bill']
        df_factor_ret['Inflation'] = df_asset_ret['TIPX'] - df_asset_ret['VGIT']
        df_factor_ret['USD'] = df_asset_ret['usdkrw']
        df_factor_ret = pd.concat([df_factor_ret, df_equityfactor_ret], axis=1)
    else:
        print("Input accurate calculation methodology")
    return df_factor_ret


def risk_analysis(df_exposures, df_factorvol, df_portfolio):
    # n: # of asssets
    # f: # of factors
    # df_exposures ( n * f)
    # df_factorvol (f * 1)
    # df_portfolio (1 * n)

    df_exposures = df_exposures.sort_index()
    df_weight = pd.DataFrame([], index=df_exposures.index, columns=['weight'])
    df_weight['weight'] = 0

    for ticker in df_weight.index:
        try:
            df_weight.loc[ticker, 'weight'] = df_portfolio[ticker].values

        except:
            df_weight.loc[ticker, 'weight'] = 0

    df_weight = df_weight.T

    df_risk = df_weight.dot(df_exposures)
    df_risk.index = ['exposure']
    df_risk = df_risk.T

    # df_risk=df_exposures.copy()
    df_risk['Factor Volatility'] = df_factorvol.copy()
    df_risk['risk contribution'] = abs(df_risk['exposure']) * df_risk['Factor Volatility']
    risk_sum = df_risk['risk contribution'].sum()
    df_risk['risk contribution(%)'] = df_risk['risk contribution'] / risk_sum

    return df_weight, df_risk


def predict_regime_performance(df_factorexposure, df_factorreturn):
    # performance_by_regime = pd.DataFrame([],index=['Goldilocks', 'Reflation', 'Deflation', 'Stagflation'], columns=df_factorreturn.columns)

    performance_by_regime = df_factorexposure.dot(df_factorreturn)

    return performance_by_regime


def get_best_gmm_model(X, max_states, max_iter=10000):  # Gaussian HMM 모델
    best_score = -(10 ** 10)
    best_state = 0

    for state in range(2, max_states + 1):
        gmm_model = GaussianMixture(n_components=state, covariance_type='diag', random_state=100).fit(X)

        if gmm_model.score(X) > best_score:
            best_score = gmm_model.score(X)
            best_state = state

    best_model = GaussianMixture(n_components=best_state, covariance_type='diag', random_state=100).fit(X)

    # print('Transition Matrix')
    # print(best_model.transmat_)
    return best_model


def get_best_hmm_model(X, max_states, max_iter=10000):  # Gaussian HMM 모델
    best_score = -(10 ** 10)
    best_state = 0

    for state in range(2, max_states + 1):
        #        hmm_model = mix.GaussianMixture(n_components = state, random_state = 100,
        hmm_model = GaussianHMM(n_components=state, random_state=100,
                                covariance_type="diag", n_iter=max_iter).fit(X)
        if hmm_model.score(X) > best_score:
            best_score = hmm_model.score(X)
            best_state = state

    #    best_model = mix.GaussianMixture(n_components = best_state, random_state = 100,
    best_model = GaussianHMM(n_components=best_state, random_state=100,
                             covariance_type="diag", n_iter=max_iter).fit(X)
    # print('Transition Matrix')
    # print(best_model.transmat_)
    return best_model


def get_best_gmmhmm_model(X, max_states, max_iter=10000):  # GMM-HMM모델 (관측치 분포가 Gaussian Mixture)
    best_score = -(10 ** 10)
    best_state = 0

    for state in range(2, max_states + 1):
        #        hmm_model = mix.GaussianMixture(n_components = state, random_state = 100,
        hmm_model = GMMHMM(n_components=state, n_mix=2, random_state=108,
                           covariance_type="diag", n_iter=max_iter).fit(X)
        if hmm_model.score(X) > best_score:
            best_score = hmm_model.score(X)
            best_state = state

    #    best_model = mix.GaussianMixture(n_components = best_state, random_state = 100,
    best_model = GMMHMM(n_components=best_state, n_mix=2, random_state=100, min_covar=0.001, covariance_type="diag",
                        n_iter=max_iter).fit(X)
    # print('Transition Matrix')
    # print(best_model.transmat_)
    # print('Gaussian Model Weights')
    # print(best_model.weights_)

    # prob_next_step = best_model.transmat_[state_sequence[-1], :]
    return best_model


def compute_turbulence(df, years=1, alpha=0.01, frequency='D'):  # Turbulence 지표 계산
    '''
    Compute financial turbulence given time series data
        input:
            df || DataFrame || a Dataframe includes Column "Date"
            years || integer || number of years to compute historical returns
            alpha || float || a punishment coefficient when inverse-coveriance is singular
        output: Turbulence || DataFrame || Column = ["Date", "Turbulence"]
    '''

    # Compute return for this series
    df_return = df.iloc[1:, 1:].values / df.iloc[:-1, 1:].values - 1
    distance = []
    error = []
    if frequency == 'D':
        days_in_year = 252
    elif frequency == 'M':
        days_in_year = 12
    elif frequency == 'W':
        days_in_year = 52
    else:
        pass

    for i in range(years * days_in_year, len(df) - 1):

        df_past_return = df_return[:i + 1, :]
        # Compute historical mean return
        mu = np.mean(df_past_return, axis=0)

        try:
            # Compute inverse covariance matrix
            inv_sig = np.linalg.inv(np.cov(df_past_return.T))
        except:
            # Find days when covariance matrices are not invertible
            # and add small numbers to the diagonal
            sigma = np.cov(df_past_return.T)
            x = np.ones(sigma.shape[0])
            inv_sig = np.linalg.inv(sigma + np.diag(x) * alpha)
            error.append(i)

        y = np.array(df_return[i, :])
        d = np.dot(np.dot(y - mu, inv_sig), (y - mu).T)
        distance.append(d)

    Turbulence = pd.DataFrame({'Dates': df['Dates'][-len(distance):], 'Turbulence': distance})

    if error != []:
        print('Rows that produce singular covariance matrix')
        print(np.array(error) + 2)

    return Turbulence


def Markov_Regression(df_factor_ret, df_asset_ret, min_timeseries=252,
                      factors=['Equity', 'Interest Rates', 'Credit', 'Commodities', 'EM', 'Inflation', 'USD', 'SMB',
                               'HML', 'RMW', 'CMA', 'Mom'], lagging=0):
    np.random.seed(42)
    df = pd.concat([df_factor_ret, df_asset_ret], axis=1)
    df = df.dropna()
    df_result = df.copy()
    num_rows = len(df.index)  # Factor Return Time-Sereies 개수 확인

    for i in df_factor_ret.index[min_timeseries:]:
        print(i)
        X_train = df[df.index <= i][factors]

        inflation_target = X_train['Interest Rates'].dropna()
        growth_target = X_train['Equity'].dropna()
        exog_inflation = X_train[factors].dropna()
        exog_growth = X_train[factors].dropna()

        mod_inflation = sm.tsa.MarkovRegression(inflation_target.iloc[1:, ], k_regimes=2, exog=exog_inflation.iloc[:-1],
                                                trend='c', switching_variance=True)
        # mod_inflation = sm.tsa.MarkovRegression(inflation_target, k_regimes=2, exog=exog_inflation, switching_variance=True)
        res_inflation = mod_inflation.fit()

        mod_growth = sm.tsa.MarkovRegression(growth_target.iloc[1:, ], k_regimes=2, exog=exog_growth.iloc[:-1],
                                             trend='c', switching_variance=True)
        # mod_growth = sm.tsa.MarkovRegression(growth_target, k_regimes=2, exog=exog_growth, switching_variance=True)
        res_growth = mod_growth.fit()

        df_result.loc[i, 'inflation_0'] = res_inflation.smoothed_marginal_probabilities[0][-1]
        df_result.loc[i, 'inflation_1'] = res_inflation.smoothed_marginal_probabilities[1][-1]
        if df_result.loc[i, 'inflation_0'] > df_result.loc[i, 'inflation_1']:
            df_result.loc[i, 'inflation'] = 0
        else:
            df_result.loc[i, 'inflation'] = 1
        df_result.loc[i, 'growth_0'] = res_growth.smoothed_marginal_probabilities[0][-1]
        df_result.loc[i, 'growth_1'] = res_growth.smoothed_marginal_probabilities[1][-1]
        if df_result.loc[i, 'growth_0'] > df_result.loc[i, 'growth_1']:
            df_result.loc[i, 'growth'] = 0
        else:
            df_result.loc[i, 'growth'] = 1

        # display(df_result)

    df_result['Goldilocks'] = df_result['inflation_1'].rolling(window=1).mean() * df_result['growth_0'].rolling(
        window=1).mean()
    df_result['Reflation'] = df_result['inflation_0'].rolling(window=1).mean() * df_result['growth_0'].rolling(
        window=1).mean()
    df_result['Deflation'] = df_result['inflation_1'].rolling(window=1).mean() * df_result['growth_1'].rolling(
        window=1).mean()
    df_result['Stagflation'] = df_result['inflation_0'].rolling(window=1).mean() * df_result['growth_1'].rolling(
        window=1).mean()
    df_result['Regime'] = df_result[['Goldilocks', 'Reflation', 'Deflation', 'Stagflation']].idxmax(axis=1)

    return df_result


def Markov_Regression_4regime(df_factor_ret, df_asset_ret, min_timeseries=252,
                              factors=['Equity', 'Interest Rates', 'Credit', 'Commodities', 'EM', 'Inflation', 'USD',
                                       'SMB', 'HML', 'RMW', 'CMA', 'Mom'], lagging=0):
    np.random.seed(42)
    df = pd.concat([df_factor_ret, df_asset_ret], axis=1)
    df = df.dropna()
    df_result = df.copy()
    num_rows = len(df.index)  # Factor Return Time-Sereies 개수 확인

    for i in df_factor_ret.index[min_timeseries:]:
        print(i)
        X_train = df[df.index <= i][factors]

        growth_target = X_train['Equity'].dropna()
        exog_growth = X_train[factors].dropna()

        mod_growth = sm.tsa.MarkovRegression(growth_target.iloc[1:, ], k_regimes=4, exog_tvtp=exog_growth.iloc[:-1])
        res_growth = mod_growth.fit()

        df_result.loc[i, 'regime_0'] = res_growth.smoothed_marginal_probabilities[0][-1]
        df_result.loc[i, 'regime_1'] = res_growth.smoothed_marginal_probabilities[1][-1]
        df_result.loc[i, 'regime_2'] = res_growth.smoothed_marginal_probabilities[2][-1]
        df_result.loc[i, 'regime_3'] = res_growth.smoothed_marginal_probabilities[3][-1]

        if i == df_factor_ret.index[-1]:
            df_result.loc[:, 'recent_regime_0'] = res_growth.smoothed_marginal_probabilities[0]
            df_result.loc[:, 'recent_regime_1'] = res_growth.smoothed_marginal_probabilities[1]
            df_result.loc[:, 'recent_regime_2'] = res_growth.smoothed_marginal_probabilities[2]
            df_result.loc[:, 'recent_regime_3'] = res_growth.smoothed_marginal_probabilities[3]
        else:
            pass

        # display(df_result)

    df_result['Regime'] = df_result[['regime_0', 'regime_1', 'regime_2', 'regime_3']].idxmax(axis=1)
    df_result['recent_Regime'] = df_result[
        ['recent_regime_0', 'recent_regime_1', 'recent_regime_2', 'recent_regime_3']].idxmax(axis=1)

    return df_result


class factor_model:

    def __init__(self, df_asset_ret, df_factor_ret, regression='PCR'):
        self.df_asset_ret = df_asset_ret
        self.df_factor_ret = df_factor_ret
        self.regression = regression
        self.check_timeseries(self.df_asset_ret, self.df_factor_ret)
        self.factorstats = self.calculate_stats(self.df_factor_ret)
        self.corr = self.calculate_factorcorr(self.df_factor_ret)
        self.exposures = self.calculate_factorexposures(self.df_asset_ret, self.df_factor_ret)
        self.mu, self.cov = self.estimate_parameters_stepwise(self.df_asset_ret, self.df_factor_ret)

    def check_timeseries(self, df_asset_ret, df_factor_ret):
        if len(df_asset_ret.index) == len(df_factor_ret.index):
            pass
        else:
            print('The timeseries lengths of assets and factors are not matching!')

        return

    def calculate_stats(self, df_factor_ret):
        df_factor_index = bt.ffn.core.to_price_index(df_factor_ret, start=1000)

        df_factorstats = pd.DataFrame.from_dict({k: v.stats for k, v in bt.ffn.calc_stats(df_factor_index).items()})

        return df_factorstats

    def calculate_factorcorr(self, df_factor_ret):
        corr = df_factor_ret.corr()
        return corr

    def calculate_factorexposures(self, df_asset_ret, df_factor_ret):
        # display(df_asset_ret.tail())
        # display(df_factor_ret.tail())

        if self.regression == 'stepwise':
            step = 'Forward'
            exposures = rp.ParamsEstimation.loadings_matrix(X=df_factor_ret, Y=df_asset_ret, stepwise=step,
                                                            threshold=0.05)
        else:
            feature_selection = 'PCR'
            n_components = 0.95
            exposures = rp.ParamsEstimation.loadings_matrix(X=df_factor_ret, Y=df_asset_ret,
                                                            feature_selection=feature_selection,
                                                            n_components=n_components)

        exposures.style.format("{:.4f}").background_gradient(cmap='RdYlGn')
        return exposures

    def estimate_parameters(self, df_asset_ret, df_factor_ret):
        # Building the portfolio object
        port = rp.Portfolio(returns=df_asset_ret)

        # Select method and estimate input parameters:
        method_mu = 'hist'  # Method to estimate expected returns based on historical data.
        method_cov = 'hist'  # Method to estimate covariance matrix based on historical data.
        port.factors = df_factor_ret.copy()

        if self.regression == 'stepwise':
            port.factors_stats(method_mu=method_mu, method_cov=method_cov, d=0.94)
        else:
            feature_selection = 'PCR'
            n_components = 0.95
            port.factors_stats(method_mu=method_mu,
                               method_cov=method_cov,
                               dict_risk=dict(feature_selection=feature_selection,
                                              n_components=n_components)
                               )

        port.mu_fm = port.mu_fm
        port.cov_fm = port.cov_fm
        expected_return = port.mu_fm
        risk_model = port.cov_fm

        return expected_return, risk_model

    def estimate_parameters_stepwise(self, df_asset_ret, df_factor_ret):
        # Building the portfolio object
        port = rp.Portfolio(returns=df_asset_ret)

        # Select method and estimate input parameters:
        method_mu = 'hist'  # Method to estimate expected returns based on historical data.
        method_cov = 'hist'  # Method to estimate covariance matrix based on historical data.
        port.factors = df_factor_ret.copy()

        # step_regression=rp.ParamsEstimation.forward_regression(X=df_factor_ret.dropna(), y=df_asset_ret.dropna()['VOO'], criterion='pvalue', threshold=0.05, verbose=False)
        # print('step_regression', step_regression)

        risk_factors = rp.ParamsEstimation.risk_factors(X=df_factor_ret.dropna(), Y=df_asset_ret.dropna(),
                                                        stepwise='Forward', threshold=0.1)
        # display(risk_factors[0]*12) #연율화 기대수익 출력
        # display((risk_factors[1]*12)**(0.5)) #연율화 COV Matrix출력
        # display(risk_factors[2])

        port.factors_stats(method_mu=method_mu, method_cov=method_cov, d=0.94)
        port.mu_fm = port.mu_fm
        port.cov_fm = port.cov_fm
        expected_return = port.mu_fm
        risk_model = port.cov_fm
        return expected_return, risk_model


def optimize_portfolio(returns, factors, target_exposure, initial_portfolio, cov, max_active_risk, max_assets):
    """
    Optimizes a portfolio to target specific factor exposures.

    Parameters:
        returns (pd.DataFrame): returns for each asset in the portfolio
        factors (pd.DataFrame): factor exposures for each asset
        target_exposure (pd.Series): target factor exposure for the portfolio

    Returns:
        weights (np.array): optimized weights for each asset in the portfolio
    """

    n_assets = returns.shape[1]
    # initial_weights = np.ones(n_assets) / n_assets
    initial_weights = initial_portfolio.copy()

    def portfolio_risk(weights, returns, factors, target_exposure):
        """
        Calculates the portfolio risk as the sum of squared deviations
        from the target factor exposures.
        """
        portfolio_exposure = (factors @ weights.T)

        deviation = portfolio_exposure - target_exposure

        risk = np.sum(deviation ** 2)

        return risk

    def exante_TE(weights, bm_weights, cov):
        active_weights = weights - bm_weights
        TE = (active_weights @ cov) @ active_weights.T
        TE = TE ** 0.5
        TE = TE.iloc[0, 0]

        return TE

    def clean_weight(weight, cutoff=0.01):
        clean_weight = weight.copy()
        clean_weight[np.abs(clean_weight) < cutoff] = 0
        sum = clean_weight.sum()
        celan_weight = clean_weight / sum
        return clean_weight

    # TE= exante_TE(weights=weights, bm_weights=initial_portfolio, cov=cov)
    # print('TE', TE)

    constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1},
                   {'type': 'ineq', 'fun': lambda x: max_active_risk - exante_TE(x, initial_portfolio, cov)},
                   {'type': 'ineq', 'fun': lambda x: max_assets - len(x[x >= 0.0001])},
                   {'type': 'ineq', 'fun': lambda x: np.sum(x[x >= 0.0001]) - 0.999},
                   ]
    bounds = [(0, 1) for i in range(n_assets)]

    result = minimize(
        fun=portfolio_risk,
        x0=initial_weights,
        args=(returns, factors, target_exposure),
        method='SLSQP',
        constraints=constraints,
        bounds=bounds
    )

    result = clean_weight(result.x, cutoff=0.01)

    return result


def display_regime(prob, factor_return_regime, regime_probability, regime_list):
    print('\033[1m' + '1. 시장국면' + '\033[0m')  # Bold
    regime_probability.columns = regime_list
    regime_probability.loc['현재 추정확률'] = prob.iloc[-1, :].values

    prob.columns = regime_list

    factor_return_regime.index.set_levels(regime_list, level=0, inplace=True)
    factor_return_regime.columns = ['주식_미국', '주식_EFA', '주식_EM', '금리', '크레딧', '원자재', '인플레이션', '원달러', '중소형', '가치/성장',
                                    '수익성', '회계퀄리티', '모멘텀']
    return regime_probability, factor_return_regime


def display_weights(before_weights, after_weights):

    print('\033[1m'  + '2. 투자비중' + '\033[0m') #Bold

    fig, ax = plt.subplots(1, 2, figsize=(14,6))
    ax=np.ravel(ax)
    # Plotting the composition of the portfolio
    rp.plot_pie(w=before_weights, title='Initial', others=0.01, nrow=25, cmap = "tab20",
                     height=6, width=10, ax=ax[0])
    rp.plot_pie(w=after_weights, title='Optimized', others=0.01, nrow=25, cmap = "tab20",
                     height=6, width=10, ax=ax[1])
    fig.tight_layout()
    plt.show()


def bulletgraph(data=None, limits=None, labels=None, axis_label=None, title=None,
                size=(5, 3), palette=None, formatter=None, target_color="gray",
                bar_color="black", label_color="gray"):
    """ Build out a bullet graph image
        Args:
            data = List of labels, measures and targets
            limits = list of range valules
            labels = list of descriptions of the limit ranges
            axis_label = string describing x axis
            title = string title of plot
            size = tuple for plot size
            palette = a seaborn palette
            formatter = matplotlib formatter object for x axis
            target_color = color string for the target line
            bar_color = color string for the small bar
            label_color = color string for the limit label text
        Returns:
            a matplotlib figure
    """
    # Determine the max value for adjusting the bar height
    # Dividing by 10 seems to work pretty well
    h = limits[-1] / 10

    # Use the green palette as a sensible default
    if palette is None:
        palette = sns.light_palette("red", len(limits), reverse=False)

    # Must be able to handle one or many data sets via multiple subplots

    if len(data) == 1:
        fig, ax = plt.subplots(len(data), len(data), figsize=size, sharex=True)
    else:
        fig, axarr = plt.subplots(len(data), figsize=size, sharex=True)

    # Add each bullet graph bar to a subplot
    for idx, item in enumerate(data):

        # Get the axis from the array of axes returned when the plot is created
        if len(data) > 1:
            ax = axarr[idx]

        # Formatting to get rid of extra marking clutter
        ax.set_aspect('equal')
        ax.set_yticklabels([item[0]])
        ax.set_yticks([1])
        ax.spines['bottom'].set_visible(False)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_visible(False)

        prev_limit = 0
        for idx2, lim in enumerate(limits):
            # Draw the bar
            ax.barh([1], lim - prev_limit, left=prev_limit, height=h,
                    color=palette[idx2])
            prev_limit = lim
        rects = ax.patches
        # The last item in the list is the value we're measuring
        # Draw the value we're measuring
        ax.barh([1], item[1], height=(h / 3), color=bar_color)

        # Need the ymin and max in order to make sure the target marker
        # fits
        ymin, ymax = ax.get_ylim()
        ax.vlines(
            item[2], ymin * .9, ymax * .9, linewidth=1.5, color=target_color)

    # Now make some labels
    if labels is not None:
        for rect, label in zip(rects, labels):
            height = rect.get_height()
            ax.text(
                rect.get_x() + rect.get_width() / 2,
                -height * 0.4,
                label,
                ha='center',
                # va='bottom',
                color=label_color)
    if formatter:
        ax.xaxis.set_major_formatter(formatter)
    if axis_label:
        ax.set_xlabel(axis_label)
    if title:
        fig.suptitle(title, fontsize=14)
    fig.subplots_adjust(hspace=0)


def display_summary(after_weights, before_weights, cov, expected_return):
    print('\033[1m' + '3. 분석정보' + '\033[0m')  # Bold

    pd.options.display.float_format = '{:.2%}'.format

    # Calcuate Expected Return
    ER_Before = pd.DataFrame(before_weights @ expected_return)
    ER_After = pd.DataFrame(after_weights @ expected_return)

    # Calculate Volatility
    VOL_Before = ((before_weights @ cov) @ before_weights.T) ** 0.5
    VOL_After = ((after_weights @ cov) @ after_weights.T) ** 0.5

    # Calculate Active Risk [After]
    active_weights = after_weights - before_weights
    # TE = (active_weights @ cov) @ active_weights.T
    TE = active_weights.dot(cov)
    TE = TE.dot(active_weights.T)
    TE = TE ** 0.5

    # Sumaary 데이터프레임 생성
    summary = pd.DataFrame([],
                           index=['상승국면', '인플레이션국면', '하락국면', '급락국면', '기대수익(연간)', '변동성(연간)', '예상 추적오차'],
                           columns=['Before', 'After'])
    summary.iloc[0:4, 0] = ER_Before.iloc[0, 0:4].values
    summary.iloc[0:4, 1] = ER_After.iloc[0, 0:4].values
    summary.iloc[4, 0] = ER_Before.iloc[0, 4]
    summary.iloc[4, 1] = ER_After.iloc[0, 4]
    summary.iloc[5, 0] = VOL_Before.values[0][0]
    summary.iloc[5, 1] = VOL_After.values[0][0]
    summary.iloc[6, 1] = TE.iloc[0, 0]

    expected_return = summary.iloc[0:4, :]
    risk_return = summary.iloc[4:, :]
    return expected_return, risk_return
    # display(summary.T)
    #
    # # Active Risk 그래프 생성
    #
    # fig = go.Figure(go.Indicator(
    #     mode="number+gauge",
    #     gauge={'shape': "bullet",
    #            'axis': {'tickformat': ',.0%', 'range': [None, 0.15]},
    #            'steps': [{'range': [0.05, 0.10], 'color': "lightgray"}, {'range': [0.10, 0.15], 'color': "gray"}],
    #            'bar': {'color': "red"}},
    #     value=TE.iloc[0, 0],
    #     number={'valueformat': ',.0%'},
    #     domain={'x': [0, 1], 'y': [0, 1]},
    #     title={'text': "예상추적오차", 'font': {"size": 12}}))
    #
    # fig.update_layout(autosize=False, width=1400, height=200)
    #
    # fig.show()
    #
    # # 국면별 기대수익 및 리스크-리턴 프로파일 그래프 생성
    #
    # fig, ax = plt.subplots(1, 2, figsize=(14, 6))
    # ax = np.ravel(ax)
    #
    # expected_return.plot.bar(title='국면별 예상 기대수익률', ax=ax[0])
    # ax[0].yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1, decimals=None, symbol='%', is_latex=False))
    #
    # # risk_return.plot.bar(title='리스크-리턴 추정치)', ax=ax[1])
    # plt.plot(risk_return.T['변동성(연간)'][0], risk_return.T['기대수익(연간)'][0], 'bo', label='Before')
    # plt.plot(risk_return.T['변동성(연간)'][1], risk_return.T['기대수익(연간)'][1], 'ro', label='After')
    # plt.title('리스크-리턴 프로파일')
    # plt.axis([0, 0.2, -0.2, 0.2])
    # plt.xlabel('변동성(연간)')
    # plt.ylabel('기대수익(연간)')
    # plt.legend()
    #
    # ax[1].yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1, decimals=None, symbol='%', is_latex=False))
    # ax[1].xaxis.set_major_formatter(mtick.PercentFormatter(xmax=1, decimals=None, symbol='%', is_latex=False))
    #
    # plt.show()

# ## todo
def display_risk(before_weights, after_weights, regression_result, df_factor_summary):
    initial_weight, initial_risk = risk_analysis(regression_result.exposures.drop('const', axis=1),
                                                 # factor exposure (n * f)
                                                 df_factor_summary['Annualized Volatility'],
                                                 # factor volatility (f * 1)
                                                 before_weights)  # portfolio weight (n *1)

    new_weight, new_risk = risk_analysis(regression_result.exposures.drop('const', axis=1),  # factor exposure (n * f)
                                         df_factor_summary['Annualized Volatility'],  # factor volatility (f * 1)
                                         after_weights)  # portfolio weight (n *1)

    exposure_comparison = pd.DataFrame([], index=initial_risk.index, columns=['Before', 'After'])
    exposure_comparison['Before'] = initial_risk['exposure']
    exposure_comparison['After'] = new_risk['exposure']
    exposure_comparison.index = ['주식_미국', '주식_EFA', '주식_EM', '금리', '크레딧', '원자재', '인플레이션', '원달러', '중소형', '가치/성장', '수익성',
                                 '회계퀄리티', '모멘텀']

    risk_comparison = pd.DataFrame([], index=initial_risk.index, columns=['Before', 'After'])
    risk_comparison['Before'] = initial_risk['risk contribution(%)']
    risk_comparison['After'] = new_risk['risk contribution(%)']
    risk_comparison.index = ['주식_미국', '주식_EFA', '주식_EM', '금리', '크레딧', '원자재', '인플레이션', '원달러', '중소형', '가치/성장', '수익성',
                             '회계퀄리티', '모멘텀']
    return exposure_comparison, risk_comparison

    # fig, ax = plt.subplots(1, 2, figsize=(14, 6))
    # ax = np.ravel(ax)
    #
    # exposure_comparison.plot.bar(title='팩터 노출도', ax=ax[0])
    # risk_comparison.plot.bar(title='위험 기여도(%)', ax=ax[1])
    #
    # plt.gca().yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1.0))
    # plt.show()


def display_performance(before_weights, after_weights, data):
    print('\033[1m' + '4. 백테스팅 결과' + '\033[0m')  # Bold
    before_names = before_weights[before_weights > 0.0001].dropna(axis=1).columns
    after_names = after_weights[after_weights > 0].dropna(axis=1).columns

    Before = bt.Strategy('Before', [bt.algos.RunQuarterly(),
                                    bt.algos.SelectAll(),
                                    bt.algos.WeighSpecified(**before_weights.to_dict(orient='records')[0]),
                                    bt.algos.Rebalance()])

    After = bt.Strategy('After', [bt.algos.RunQuarterly(),
                                  bt.algos.SelectAll(),
                                  bt.algos.WeighSpecified(**after_weights.to_dict(orient='records')[0]),
                                  bt.algos.Rebalance()])

    def my_comm(q, p):
        return abs(q) * p * 0.00

    # create a backtest and run it
    backtest_Before = bt.Backtest(Before, data[before_names].dropna(), commissions=my_comm)
    backtest_After = bt.Backtest(After, data[after_names].dropna(), commissions=my_comm)
    report = bt.run(backtest_Before, backtest_After)

    return report.prices

    # report = bt.run(backtest_Before, backtest_After)
    # report.plot()
    #
    # plt.show()

def make_weight_dataframe(df_exposures, df_portfolio):
    df_exposures=df_exposures.sort_index()
    df_weight=pd.DataFrame([],index=df_exposures.columns, columns=['weight'])
    df_weight['weight']=0

    for ticker in df_weight.index:
        try:
            df_weight.loc[ticker, 'weight'] = df_portfolio[ticker].values

        except:
            df_weight.loc[ticker, 'weight'] = 0

    df_weight=df_weight.T
    return df_weight


def match_port_weight(initial_port):
    port_equity = pd.DataFrame({'ACWI': [0.8], 'IEF': [0.2]})
    port_8020 = pd.DataFrame({'ACWI': [0.8], 'IEF': [0.2]})
    port_6040 = pd.DataFrame({'ACWI': [0.6], 'IEF': [0.4]})
    port_4060 = pd.DataFrame({'ACWI': [0.4], 'IEF': [0.6]})
    port_allweather = pd.DataFrame({'ACWI': [0.3],
                                    'TLT': [0.4],
                                    'IEF': [0.15],
                                    'DBC': [0.075],
                                    'GLD': [0.075]})
    if initial_port == '테마로테이션' or initial_port == '변동성 알고리즘':
        weight = port_equity
    elif initial_port == '멀티에셋 모멘텀':
        weight = port_8020
    elif initial_port == '초개인화로보':
        weight = port_6040
    elif initial_port == '멀티에셋 인컴':
        weight = port_4060
    else:
        weight = port_allweather

    return weight

def run_optimization(prob, factor_return_regime, regime_probability, port_selection, returns, factors, max_active_risk, US_Equity,  EFA_Equity, EM_Equity, Interest_Rates, Credit, Commodity, Inflation, USD, SMB, HML, RMW, CMA, Mom, regression_result, etf_performance, df_yahoo_index, df_factor_summary):
    clear_output(wait=True)
    initial_weight = match_port_weight(port_selection)
    initial_weight = make_weight_dataframe(factors, initial_weight)
    target_exposure=pd.Series([US_Equity,EFA_Equity, EM_Equity,Interest_Rates, Credit, Commodity, Inflation, USD, SMB, HML, RMW, CMA, Mom], index=factors.index)

    weights = optimize_portfolio(returns, factors, target_exposure, initial_portfolio=initial_weight, cov=regression_result.cov*annualization, max_active_risk=max_active_risk, max_assets=15)
    weights = pd.DataFrame(weights, index=factors.columns, columns=['weight'])
    regime_probability, factor_return_regime = display_regime(prob, factor_return_regime, regime_probability, regime_list=['상승국면', '인플레이션 국면', '하락국면', '급락국면'])
    before_weights = initial_weight.T
    after_weights = weights
    expected_return, risk_return = display_summary(after_weights=weights.T, before_weights=initial_weight, cov=regression_result.cov*annualization, expected_return=etf_performance)
    exposure_comparison, risk_comparison = display_risk(before_weights=initial_weight, after_weights=weights.T, regression_result=regression_result, df_factor_summary=df_factor_summary)
    backtest_returns = display_performance(before_weights=initial_weight, after_weights=weights.T, data=df_yahoo_index)
    return {
        "regime_probability": regime_probability,
        "factor_return_regime": factor_return_regime,
        "before_weights": before_weights,
        "after_weights": after_weights,
        "expected_return": expected_return, # 국면별 기대수익
        "risk_return": risk_return, # 리스크-리턴
        "exposure_comparison": exposure_comparison,
        "risk_comparison": risk_comparison,
        "backtest_returns": backtest_returns,
    }

def background_gradient(s, m, M, cmap='Pubu', low=0, high=0): # Factor Exposure 보여줄 색깔 정의
    rng = M - m
    norm = colors.Normalize(m - (rng * low),
                            M + (rng * high))
    normed = norm(s.values)
    c = [colors.rgb2hex(x) for x in plt.cm.get_cmap(cmap)(normed)]
    return ['background-color: %s' % color for color in c]


def run_interactive_widgets(port_selection, portfolio_risk, returns, factors, prob, factor_return_regime,
                            regime_probability, regression_result, etf_performance, df_yahoo_index,df_factor_summary):
    clear_output(wait=True)

    max_active_risk = widgets.FloatSlider(
        value=0.05,
        min=0,
        max=0.2,
        step=0.01,
        description='최대추적오차',
        continuous_update=False,
        readout_format='.1%')
    US_Equity = widgets.FloatSlider(
        value=portfolio_risk['exposure'][0],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='주식_미국',
        continuous_update=False)
    EFA_Equity = widgets.FloatSlider(
        value=portfolio_risk['exposure'][1],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='주식_EFA',
        continuous_update=False)
    EM_Equity = widgets.FloatSlider(
        value=portfolio_risk['exposure'][2],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='주식_EM',
        continuous_update=False)
    Interest_Rates = widgets.FloatSlider(
        value=portfolio_risk['exposure'][3],
        min=-2.0,
        max=2.0,
        step=0.1,
        orientation='vertical',
        description='금리',
        continuous_update=False)
    Credit = widgets.FloatSlider(
        value=portfolio_risk['exposure'][4],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='크레딧',
        continuous_update=False)
    Commodity = widgets.FloatSlider(
        value=portfolio_risk['exposure'][5],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='원자재',
        continuous_update=False)
    Inflation = widgets.FloatSlider(
        value=portfolio_risk['exposure'][6],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='인플레이션',
        continuous_update=False)
    USD = widgets.FloatSlider(
        value=portfolio_risk['exposure'][7],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='원달러',
        continuous_update=False)
    SMB = widgets.FloatSlider(
        value=portfolio_risk['exposure'][8],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='중소형',
        continuous_update=False)
    HML = widgets.FloatSlider(
        value=portfolio_risk['exposure'][9],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='가치/성장:',
        continuous_update=False)
    RMW = widgets.FloatSlider(
        value=portfolio_risk['exposure'][10],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='수익성',
        continuous_update=False)
    CMA = widgets.FloatSlider(
        value=portfolio_risk['exposure'][11],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='회계퀄리티',
        continuous_update=False)
    Mom = widgets.FloatSlider(
        value=portfolio_risk['exposure'][12],
        min=-1.2,
        max=1.2,
        step=0.1,
        orientation='vertical',
        description='모멘텀',
        continuous_update=False)

    returns = widgets.fixed(returns)
    factors = widgets.fixed(factors)
    port_selection = widgets.fixed(port_selection)
    prob = widgets.fixed(prob)
    factor_return_regime = widgets.fixed(factor_return_regime)
    regime_probability = widgets.fixed(regime_probability)

    factor_widgets = widgets.Box(
        [US_Equity, EFA_Equity, EM_Equity, Interest_Rates, Credit, Commodity, Inflation, USD, SMB, HML, RMW, CMA, Mom])
    ui = widgets.VBox([max_active_risk, factor_widgets])

    out = widgets.interactive_output(run_optimization, {'max_active_risk': max_active_risk,
                                                        'US_Equity': US_Equity,
                                                        'EFA_Equity': EFA_Equity,
                                                        'EM_Equity': EM_Equity,
                                                        'Interest_Rates': Interest_Rates,
                                                        'Credit': Credit,
                                                        'Commodity': Commodity,
                                                        'Inflation': Inflation,
                                                        'USD': USD,
                                                        'SMB': SMB,
                                                        'HML': HML,
                                                        'RMW': RMW,
                                                        'CMA': CMA,
                                                        'Mom': Mom,
                                                        'port_selection': port_selection,
                                                        'returns': returns,
                                                        'factors': factors,
                                                        'prob': prob,
                                                        'factor_return_regime': factor_return_regime,
                                                        'regime_probability': regime_probability,
                                                        'regression_result': regression_result,
                                                        'etf_performance': etf_performance,
                                                        'df_yahoo_index' : df_yahoo_index,
                                                        'df_factor_summary':df_factor_summary
                                                        })

    display(ui, out)