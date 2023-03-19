import requests
import json
import numpy as np
from datetime import datetime, timedelta
import pickle
def save_pickle(df, file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('pkl/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

df = read_pickle('sec_explain')
score = read_pickle('model_score_add')
url = "http://43.200.170.131:5001/di_univ/테마_그린_배터리_제외종목"

response = requests.get(url)

print("response: ", response)
print("response.text: ", response.text)
total_list = list()
result = eval(response.text)
for idx, dat in zip(eval(response.text)['rtn']['xaxis'],result['rtn']['data'][0]['data']):
    total_list.append({"x":idx,"y":float(dat.replace("%",''))})
total_rtn = result['rtn']['data'][0]['data'][-1]
rtn_month = eval(response.text)['rtn']['xaxis'][-1] / eval(response.text)['rtn']['xaxis'][-23] -1
cagr = (float(result['rtn']['data'][0]['data'][-1].replace('%','')))**(1/((len(result['rtn']['data'][0]['data'])/252)))
std = np.std(list(map(lambda x: float(x.replace("%","")),(eval(response.text)['rtn']['data'][0]['data']))))
print(1)