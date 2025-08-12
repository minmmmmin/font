# ライブラリ設定
import csv
import json
 
# CSVファイルの読み込み
with open('public/n150min0.99.csv', 'r') as f:
    d_reader = csv.DictReader(f)
    d_list = [row for row in d_reader]
 
# JSONファイルへの書き込み
with open('output.json', 'w', ensure_ascii=False) as f:
    json.dump(d_list, f)