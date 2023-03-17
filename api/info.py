import pandas as pd
from config import *


graph = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='그래프(영업일)', skiprows=1)
graph = graph.rename(columns={'Unnamed: 0':'Date'}).set_index('Date').drop_duplicates().rename(columns=port2nm)
perform = pd.read_excel('org-data/suggest/RATB_성과표_18차추가.xlsx', sheet_name='성과(요약)', skiprows=2)
perform = perform.rename(columns={"Unnamed: 1":"PORT"}).dropna(subset=['PORT'])[['PORT','1D','1W','1M','6M','1Y','YTD']]
perform['PORT'] = perform['PORT'].apply(lambda x: port2nm[x])
perform = perform.set_index("PORT")
print(1)