from util.func import *
from config import *

import math
from matplotlib import colors, cm
from sklearn.cluster import KMeans
from sklearn.preprocessing import RobustScaler
from datetime import datetime
from IPython.display import clear_output
from IPython.core.display import HTML, display
pd.options.display.float_format = '{:.4f}'.format
pd.options.display.max_rows=None
pd.options.display.max_columns=None
from IPython.core.display import display, HTML

def load_data():
    print('0: ',datetime.now())
    # Download Fama-French Factor Data
    # todo:
    df_equityfactor_return = read_pickle("df_equityfactor_return")

    print('1: ',datetime.now())
    # Download Yahoo Data
    if start_download==1:
        df_yahoo_index=yahoo_download(tickers, start, end, frequency)
        df_yahoo_index.to_pickle("pkl/df_yahoo_index.pkl")
    else:
        df_yahoo_index = pd.read_pickle("pkl/df_yahoo_index.pkl")


    df_db_index=read_pickle('df_db_index')

    # 자산수익률 데이터프레임
    # df_asset_index=df_yahoo_index.copy()
    # df_asset_index_nousdkrw=df_asset_index.drop('KRW=X', axis=1)
    # df_asset_index=df_asset_index.dropna(subset=df_asset_index_nousdkrw.columns, axis=0, how='all')
    # df_asset_ret=df_asset_index.pct_change()
    print('2: ',datetime.now())

    # num_asset=df_asset_ret.count()
    # asset_to_delete = num_asset[num_asset <= annualization*3] # 3년 이상 시계열 있는 종목만
    # delete_name = list(asset_to_delete.index)
    # print('deleted tickers:', delete_name)
    #
    # df_asset_index=df_asset_index.drop(delete_name, axis=1)
    # df_asset_ret=df_asset_ret.drop(delete_name, axis=1)


    df_factorasset_index=df_db_index.copy()
    df_factorasset_index=df_factorasset_index[db_tickers]
    df_factorasset_ret=df_factorasset_index.pct_change()
    df_factorasset_ret=df_factorasset_ret.reindex(columns=db_tickers)
    print('3: ',datetime.now())

    df_factor_ret=calculate_factor_ret_db(df_factorasset_ret, df_equityfactor_return, method=factor_method)
    df_factor_ret=df_factor_ret[df_factor_ret.index>='1976-09-02']
    df_factor_ret=df_factor_ret.dropna(how='all', subset=['SMB', 'HML', 'RMW', 'CMA', 'Mom']) #데이터 합치기 위해 FF 팩터데이터가 존재하지 않는 행 삭제

    print('4: ',datetime.now())

    df_factor_summary=pd.DataFrame([])
    df_factor_summary['Annualized Return']=df_factor_ret.mean()*annualization
    df_factor_summary['Annualized Volatility']=df_factor_ret.std()*(annualization**0.5)
    df_factor_summary['Sharpe(Rf=0%)']=df_factor_summary['Annualized Return'] / df_factor_summary['Annualized Volatility']

    # todo :
    regression_result = read_pickle('regression_result')

    #even_range = np.max([np.abs(result.exposures.values.min()), np.abs(result.exposures.values.max())])
    even_range=1.5
    cm = sns.diverging_palette(240, 10, as_cmap=True)

    # Ticker 및 ETF Name 매칭

    ETF = pd.read_pickle("pkl/ETF.pkl")

    ETF = ETF.sort_values('Tickers')
    ETF = ETF.reset_index(drop=True)
    display(ETF)
    print('5: ',datetime.now())
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
    print('6: ',datetime.now())


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

    X = df_factor_fwdret[core_factor_columns].dropna()

    # Scaler로 데이터 전처리
    Scaler=RobustScaler()
    Scaler.fit(X)
    X_transformed=Scaler.transform(X)
    X_transformed=pd.DataFrame(X_transformed,index=X.index, columns=X.columns)
    print('7: ',datetime.now())
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
    print('8: ',datetime.now())

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
    print('9: ',datetime.now())
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
    print('10: ',datetime.now())
    # factor_return_regime: Regime별 Factor Performance 요약 데이터프레임

    multi_index=pd.MultiIndex.from_product([[0, 1, 2, 3],['Ann.mean', 'Ann.std', 'sharpe']], names=['Regime', 'Stats'])
    factor_return_regime = pd.DataFrame([],index=multi_index, columns=factor_columns)

    # K-Means Clustering 결과를 출력

    for regime in [0, 1, 2, 3]:
        print(regime)
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
    print('11: ',datetime.now())
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
    print('12: ',datetime.now())

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

    print('13: ',datetime.now())

    ## todo : 최종결과물
    returns = pd.DataFrame(etf_performance['Expected_Return']).T
    factors = pd.DataFrame(regression_result.exposures[factor_columns]).T
    # Portfolio Definition

    port_equity = pd.DataFrame({'ACWI': [0.8], 'IEF' : [0.2]})
    port_8020 = pd.DataFrame({'ACWI': [0.8], 'IEF' : [0.2]})
    port_6040 = pd.DataFrame({'SPY': [0.6], 'TLT' : [0.4]})
    port_4060 = pd.DataFrame({'ACWI': [0.4], 'IEF' : [0.6]})
    port_theme = pd.DataFrame({'IGF': [0.2], 'BUG' : [0.1], 'BOTZ' : [0.1], 'CLOU' : [0.1], 'DIA' : [0.1], 'ICVT' : [0.1], 'LIT' : [0.1], 'QQQ' : [0.1], 'URA' : [0.1]})
    port_income = pd.DataFrame({'SCHD': [0.2], 'PFF' : [0.1], 'ICVT' : [0.1], 'CWB' : [0.1], 'SDY' : [0.5]})
    port_allweather = pd.DataFrame({'ACWI': [0.3], 'TLT': [0.4], 'IEF': [0.15], 'DBC': [0.075], 'GLD': [0.075]})

    opts = {
        '초개인화로보': port_allweather,
        '테마로테이션': port_theme,
        '변동성 알고리즘': port_8020,
        '멀티에셋 인컴': port_income,
        '멀티에셋 모멘텀': port_4060,
        "60:40 포트폴리오": port_6040
        }


    return { "regression_result":regression_result,"df_factor_summary":df_factor_summary,"opts":opts,"prob":prob,
             "factor_return_regime" :factor_return_regime, "regime_probability" : regime_probability,
             "returns" : returns, "factors" : factors, "max_active_risk" : 0.05,
             "etf_performance" : etf_performance, "df_yahoo_index" : df_yahoo_index,}





if __name__ =='__main__':
    props = load_data()
    # props = read_pickle('props')
    # port_selection=widgets.RadioButtons(
    #     options=props.opts.keys(),
    #     description='포트폴리오: ',
    #     value='멀티에셋 모멘텀',
    #     disabled=False)
    # portfolio_weight, portfolio_risk = risk_analysis(props['regression_result'].exposures.drop('const', axis=1),
    #                                                  # factor exposure (n * f)
    #                                                  props['df_factor_summary']['Annualized Volatility'],
    #                                                  # factor volatility (f * 1)
    #                                                  props['opts'][port_selection.value])
    # result = run_optimization(prob=props['prob'], factor_return_regime=props['factor_return_regime'], regime_probability=props['regime_probability'],
    #                  port_selection=port_selection, returns=props['returns'], factors=props['factors'], max_active_risk=0.05,
    #                  US_Equity=portfolio_risk['exposure'][0], EFA_Equity=portfolio_risk['exposure'][1],
    #                  EM_Equity=portfolio_risk['exposure'][2], Interest_Rates=portfolio_risk['exposure'][3],
    #                  Credit=portfolio_risk['exposure'][4], Commodity=portfolio_risk['exposure'][5],
    #                  Inflation=portfolio_risk['exposure'][6], USD=portfolio_risk['exposure'][7],
    #                  SMB=portfolio_risk['exposure'][8], HML=portfolio_risk['exposure'][9],
    #                  RMW=portfolio_risk['exposure'][10], CMA=portfolio_risk['exposure'][11],
    #                  Mom=portfolio_risk['exposure'][12], regression_result=props['regression_result'],
    #                  etf_performance=props['etf_performance'], df_yahoo_index=props['df_yahoo_index'],
    #                  df_factor_summary=props['df_factor_summary'])

    print(1)