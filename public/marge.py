import json
import csv
import re

# JSONファイルへの書き込み
with open("./public/Analytics.json", "r", encoding="utf-8") as f:
    analytics = json.load(f)

# CSVファイルの読み込み
with open("./public/n150min099.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    newDatas = []

    for i in reader:
        clean_name = re.sub(
            r"\s(regular|italic|\d{3}italic?|\d{3})$",
            "",
            i["name"],
            flags=re.IGNORECASE,
        )
        newData = {}

        for j in analytics:
            if j["family"] == clean_name:
                newData["family"] = i["name"]
                newData["variant"] = i["variant"]
                newData["category"] = i["category"]
                newData["x"] = i["x"]
                newData["y"] = i["y"]
                newData["designers"] = j["designers"]
                newData["totalViews"] = j["totalViews"]
                newData["rate"] = j["rate"]
                newData["viewsByDateRange"] = j["viewsByDateRange"]
                newData["viewsByBrowser"] = j["viewsByBrowser"]
                newData["viewsByOS"] = j["viewsByOS"]

        if newData:
            newDatas.append(newData)

            print(newData)

newDatas.sort(key=lambda a: a.get("totalviews", 0), reverse=True)

with open("./public/output.json", "w", encoding="utf-8") as f:
    json.dump(newDatas, f, ensure_ascii=False, indent=2)
