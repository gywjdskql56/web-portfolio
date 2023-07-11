import pandas as pd
# import pickle
import pickle
import pymssql
from qpmsdb import *
def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df
def get_factor_formula():
    factor_map = pd.read_excel('../api/org-data/DI_theme/factor_map.xlsx')
    return factor_map

def get_theme_univ(univ_country):
    if univ_country == "국내 유니버스":
        glob = get_kr_theme_univ().rename(columns={'LV1_NM':'SECTOR_NM', 'LV2_NM':'THEME_NM'})
    elif univ_country == "글로벌 유니버스":
        glob = get_global_theme_master()
    elif univ_country == "중국 유니버스":
        glob = get_ch_theme_master().rename(columns={'sector':'SECTOR_NM', 'theme':'THEME_NM'})
    return glob

def get_sector_univ(univ_country):
    if univ_country == "국내 유니버스":
        glob = get_kr_sector_master()#.rename(columns={'LV1_NM':'SECTOR_NM', 'LV2_NM':'THEME_NM'})
        glob['FSYM_ID'] = glob['CODE']
        glob['TICKER'] = glob['CODE']
        glob['NAME'] = glob['BBG_TICKER']
    elif univ_country == "글로벌 유니버스":
        glob = get_global_sector_master().rename(columns={"JM_NM":"NAME","GICS_SECTOR":"GICS_LV1","GICS_INDUSTRYGROUP":"GICS_LV2","GICS_INDUSTRY":"GICS_LV3",})
        glob = glob[glob['GICS_LV1']!='']
    elif univ_country == "중국 유니버스":
        glob = get_ch_sector_master().rename(columns={'name_en':'NAME'})
        glob['TICKER'] = glob['FSYM_ID']
    gics_master = get_gics_master()
    sector_dict = gics_master[['SECTOR', 'SECTOR_NAME']].drop_duplicates(['SECTOR']).set_index('SECTOR')['SECTOR_NAME'].to_dict()
    industry_dict = gics_master[['INDUSTRY_GROUP', 'INDUSTRY_GROUP_NAME']].drop_duplicates(['INDUSTRY_GROUP']).set_index('INDUSTRY_GROUP')['INDUSTRY_GROUP_NAME'].to_dict()
    indust_dict = gics_master[['INDUSTRY', 'INDUSTRY_NAME']].drop_duplicates(['INDUSTRY']).set_index('INDUSTRY')['INDUSTRY_NAME'].to_dict()
    glob['GICS_LV1_NAME'] = glob['GICS_LV1'].apply(lambda x: sector_dict[x] if x in sector_dict.keys() else '')
    glob['GICS_LV2_NAME'] = glob['GICS_LV2'].apply(lambda x: industry_dict[x]  if x in industry_dict.keys() else '')
    glob['GICS_LV3_NAME'] = glob['GICS_LV3'].apply(lambda x: indust_dict[x] if x in indust_dict.keys() else '')
    glob = glob[glob['GICS_LV1_NAME']!='']
    glob = glob[glob['GICS_LV2_NAME']!='']
    glob = glob[glob['GICS_LV3_NAME']!='']
    return glob

def get_factor_data(country, factor_formula, factor_formula_dict):
    if country == "국내 유니버스":
        factor_data = get_kr_factor_data(factor_formula.descriptor.sum())
        factor_data['FSYM_ID'] = factor_data['CODE']
        factor_data = factor_data.drop_duplicates(subset=["FSYM_ID", "AC_CODE"]).pivot(index="FSYM_ID",
                                                                                       columns="AC_CODE", values="VAL")
        factor_data = factor_data.apply(lambda col: (col - min(col)) / (max(col) - min(col)), axis=0)

        for key in factor_formula_dict:
            factor_data[key] = (factor_data[
                list(set(factor_formula_dict[key]).intersection(set(factor_data.columns)))].sum(axis=1))/len(factor_formula_dict[key])
        factor_data = factor_data[factor_formula_dict.keys()]
        return factor_data
    else:
        factor_data = get_global_factor_data(factor_formula.descriptor.sum())
        factor_data = factor_data.drop_duplicates(subset=["FSYM_ID", "AC_CODE"]).pivot(index="FSYM_ID",
                                                                                       columns="AC_CODE", values="VAL")
        factor_data = factor_data.apply(lambda col: (col - min(col)) / (max(col) - min(col)), axis=0)

        for key in factor_formula_dict:
            factor_data[key] = (factor_data[
                list(set(factor_formula_dict[key]).intersection(set(factor_data.columns)))].sum(axis=1))/len(factor_formula_dict[key])
        factor_data = factor_data[factor_formula_dict.keys()]
        return factor_data



if __name__=="__main__":
    get_sector_univ(univ_country="국내 유니버스")
    factor_formula = get_factor_formula()
    factor_formula = factor_formula[['factor', 'descriptor']].groupby(by=['factor']).agg(
        lambda x: '||'.join(x)).reset_index()
    factor_formula['descriptor'] = factor_formula['descriptor'].apply(lambda x: x.split('||'))
    factor_formula = factor_formula[factor_formula['factor'] != 'liquidity']
    factor_formula = factor_formula[factor_formula['factor'] != 'volatility']



    factor_master = get_global_factor_master()
    factor_master['AC_NM'] = factor_master['AC_NM'].apply(lambda x: x.replace(",",""))

    factor_master_dict = factor_master[['AC_CODE', 'AC_NM']].set_index('AC_NM').to_dict()['AC_CODE']
    diff = set(factor_formula['descriptor'].sum()) - set(list(factor_master_dict.keys()))
    factor_formula['descriptor'] = factor_formula['descriptor'].apply(lambda x: [factor_master_dict[xx] for xx in x])
    factor_formula_dict = factor_formula.set_index('factor').to_dict()['descriptor']

    factor_data = get_global_factor_data(factor_formula.descriptor.sum())
    factor_data = factor_data.drop_duplicates(subset=["FSYM_ID", "AC_CODE"]).pivot(index="FSYM_ID", columns="AC_CODE", values="VAL")
    factor_data = factor_data.apply(lambda col: (col - min(col)) / (max(col) - min(col)), axis=0)

    for key in factor_formula_dict:
        factor_data[key] = factor_data[list(set(factor_formula_dict[key]).intersection(set(factor_data.columns)))].sum(axis=1)
    factor_data = factor_data[factor_formula_dict.keys()]
    print(1)
