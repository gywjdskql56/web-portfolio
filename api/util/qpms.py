import pymssql
import pandas as pd
import numpy as np
from datetime import timedelta

import os
import sys
import warnings

warnings.filterwarnings('ignore')


class get_data:
    def __init__(self):
        self.server = '10.93.20.65'
        self.username = 'roboadv'
        self.pw = 'roboadv123!'
        self.db_name = 'ROBO'
        self.table_name = 'EXTENDED_DATA'
        # self.target_data_name = target_data_name

        self.p_list = []
        self.cur_dir, self.list_file_n = os.getcwd(), 'util/p_data_list.txt'
        self.list_file = os.path.join(self.cur_dir, self.list_file_n)

        assert os.path.isfile(self.list_file), sys.exit(
            f"There is no list_file    '{self.list_file_n}'    at   '{self.cur_dir}''")

        self.p_list = []
        with open(os.path.join(self.list_file), "r") as self.file:
            while True:
                self.line = self.file.readline()
                if not self.line:
                    break
                self.p_list.append(self.line.strip())

        # self.categories = {'extended_VTI_US_Equity': 'US Stock Market',
        #          'extended_VOO_US_Equity': 'US Large Cap',
        #          'extended_VTV_US_Equity': 'US Large Cap Value',
        #          'extended_VUG_US_Equity': 'US Large Cap Growth',
        #          'extended_VO_US_Equity': 'US Mid Cap',
        #          'extended_VOE_US_Equity': 'US Mid Cap Value',
        #          'extended_VOT_US_Equity': 'US Mid Cap Growth',
        #          'extended_VB_US_Equity': 'US Small Cap',
        #          'extended_VBR_US_Equity': 'US Small Cap Value',
        #          'extended_VBK_US_Equity': 'US Small Cap Growth',
        #          'extended_IWC_US_Equity': 'US Micro Cap',
        #          'extended_VXUS_US_Equity': 'Global ex-US Stock Market',
        #          'extended_VEA_US_Equity': 'International ex-US Developed Markets(EAFE)',
        #          'extended_VSS_US_Equity': 'International ex-US Small Cap',
        #          'extended_EFV_US_Equity': 'International ex-US Value',
        #          'extended_VGK_US_Equity': 'European Stocks',
        #          'extended_VPL_US_Equity': 'Pacific Region Stocks',
        #          'extended_VWO_US_Equity': 'Emerging Markets',
        #          'extended_BND_US_Equity': 'Total Bond Market',
        #          'extended_VGSH_US_Equity': 'Short Term Treasuries',
        #          'extended_VGIT_US_Equity': 'Intermediate Term Treasuries',
        #          'extended_VGLT_US_Equity': 'Long Term Government Bonds',
        #          'extended_TIPX_US_Equity': 'TIPS',
        #          'extended_SHM_US_Equity': 'Short Term Tax Exempt',
        #          'extended_MMIT_US_Equity': 'Intermediate Term Tax Exempt',
        #          'extended_TFI_US_Equity': 'Long Term Tax Exempt',
        #          'extended_VCSH_US_Equity': 'Short Term Investment Grade',
        #          'extended_LQD_US_Equity': 'Corporate Bonds',
        #          'extended_VCLT_US_Equity': 'Long Term Corporate Bonds',
        #          'extended_HYG_US_Equity': 'High Yield Corporate Bonds',
        #          'extended_SYBZ_GY_Equity': 'Global Bonds (Unhedged)',
        #          'extended_SPFV_GY_Equity': 'Global Bonds (USD Hedged)',
        #          'extended_VNQ_US_Equity': 'Real Estate (REIT)',
        #          'extended_GLD_US_Equity': 'Gold',
        #          'extended_GDX_US_Equity': 'Precious Metals',
        #          'extended_GSG_US_Equity': 'Commodities',
        #          'extended_CPI': 'Inflation (CPI-U)',
        #          'extended_10y_treasury': '10-year Treasury',
        #          'extended_treasury_bill': 'Treasury Bills / Cash - Risk Free Return Benchmark'}
        #
        #          ------ This Part will not be updated after 2022.08.30 ------
        #

    def run(self, target_data_name, prefix=False, suffix=True):
        self.target_data_name = target_data_name

        conn = pymssql.connect(host=self.server, user=self.username, password=self.pw, database=self.db_name)
        if self.target_data_name == 'All':
            e_query = "SELECT * FROM " + self.table_name
        else:
            e_query = "SELECT * FROM " + self.table_name + " WHERE INDEX_ID = '" + self.target_data_name + "'"

        extracted_data = pd.read_sql(e_query, con=conn)
        print(f' executed query: {e_query}')

        extracted_data['TD'] = pd.to_datetime(extracted_data['TD'])
        extracted_data = extracted_data.rename(columns={'TD': 'Dates', 'VALUE': 'TOT_RETURN_INDEX_NET_DVDS'})

        if self.target_data_name == 'All':
            print('Whole Data Successfully Extracted')
            pass
        else:
            ### Check ERRORS:
            extracted_INDEX_ID = extracted_data['INDEX_ID'].unique()[0]
            print(f" '{extracted_INDEX_ID}' Data Succesfully extracted")
            # INDEX ID ERROR
            if extracted_INDEX_ID != self.target_data_name:
                print(f'input INDEX_ID : {self.target_data_name} ; extracted_INDEX_ID : {extracted_INDEX_ID}')
                sys.exit('INDEX ID ERROR: Check DB table infos')
            else:
                pass
            # UNRELATED DATA ERROR
            if len(extracted_data['INDEX_ID'].unique()) != 1:
                sys.exit('UNRELATED DATA ERROR: unrelated INDEX_ID is included in extracted data')
            else:
                pass

        # Data renaming
        self.prefix, self.suffix = prefix, suffix

        a = 0 if self.prefix else 1
        if 'Equity' in self.target_data_name:
            b = None if self.suffix else -2
        else:
            b = None

        extracted_data['INDEX_ID'] = extracted_data['INDEX_ID'].apply(lambda x: '_'.join(x.split('_')[a:b]))

        return extracted_data

    def apply_usdkrw(self, etf_ticker, usdkrwinfo=False):
        to_be_converted = self.run(f'extended_{etf_ticker}_US_Equity')

        usdkrw_ticker = 'USDKRW_KRWB_Curncy'
        # match_usdkrw = self.run('extended_USDKRW_REGN_Curncy')
        match_usdkrw = self.run(f'extended_{usdkrw_ticker}')
        if usdkrwinfo:
            print(
                f"\n!!!!!!!! T+1 date '{usdkrw_ticker} data' is matched with T date '{etf_ticker}' ETF data   !!!!!!!")
            print(f"    => Caution!: Fist date of USDKRW data : {match_usdkrw.Dates[0].strftime('%Y-%m-%d')}")

            print('설명:\n미국장 ETF  T일 종가는 한국시간 T+1일 새벽 5시 => 펀드회계상 T+1일자 기준가에 반영')
            print('펀드회계상 T+1일자 기준가에 반영될시 T+1일자 원달러 환율로 반영\n')
            print(match_usdkrw.info())

        applied_pr = []  # ETF 날짜 기준 반복문돌려서 ETF 날짜 기준으로 생성됨 => 다 만들고 나서 shift(1)필요
        for i, d in enumerate(to_be_converted.Dates):
            '''
            ETF => T
            USDKRW => T+1

             ==>>>>>>>>>>>>> 환산 값 날짜 : T+1, 펀드 회계상 한국 날짜 T+1로 들어감

            '''
            matched_day = d + timedelta(days=1)
            get_num = (match_usdkrw.Dates == matched_day).sum()  # 필요한 날의 환율 데이터가 있는지 확인
            if get_num != 0:
                if (match_usdkrw.Dates == matched_day).sum() > 1:
                    print((match_usdkrw.Dates == matched_day).sum())
                    sys.exit('stop')
                now_pr = to_be_converted[to_be_converted.Dates == d].values[0][-1]
                match_ex = match_usdkrw[match_usdkrw.Dates == matched_day].values[0][-1]
                applied_pr.append(now_pr * match_ex)
            else:  # 필요 날짜 환율 데이터 없을경우 nan
                applied_pr.append(np.nan)

        to_be_converted['exchange_pr'] = applied_pr
        to_be_converted['exchange_pr'] = to_be_converted['exchange_pr'].shift(1)  # ETF 날짜 기준으로 돈 반복문에서 펀드 회계 날짜로 맞추기 위해
        return to_be_converted

    # def univ_dicts(self):
    #     return self.categories
    # ------ This Part will not be updated after 2022.08.30 ----

    def univ_list(self):
        return self.p_list

    def server_infos(self):
        print(f"Server Name: {self.server} // User Name: {self.username}")
        print(f"DB_name: {self.db_name} // table_name: {self.table_name}")
