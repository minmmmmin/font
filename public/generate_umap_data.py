import pandas as pd
import numpy as np
import umap
from sklearn.metrics.pairwise import cosine_similarity

# 類似フォントデータ保存（JSON形式がReact向き）
import json

# ファイル読み込み
vectors = pd.read_csv("public/vectors-200.tsv", sep="\t", header=None)
metadata = pd.read_csv("public/metadata.tsv", sep="\t")

# UMAPで2次元に圧縮
reducer = umap.UMAP(random_state=42)
embedding = reducer.fit_transform(vectors)

# 結合：UMAPの座標とmetadata
result_df = pd.concat([metadata, pd.DataFrame(embedding, columns=["x", "y"])], axis=1)

# 保存（Reactで使いやすいCSV形式）
result_df.to_csv("umap_font_data.csv", index=False)

# 類似度マトリクス（オプション）
similarity_matrix = cosine_similarity(vectors)

# 近傍上位Nを保存（例えば5個）
top_n = 5
similarities = []
for i, row in enumerate(similarity_matrix):
    sim_indices = np.argsort(row)[-top_n - 1 : -1][::-1]  # 自分自身を除いた上位
    sim_scores = row[sim_indices]
    similar_fonts = metadata.loc[sim_indices, "name"].tolist()
    similarities.append(
        {
            "font": metadata.loc[i, "name"],
            "similar_fonts": similar_fonts,
            "scores": sim_scores.tolist(),
        }
    )

with open("similar_fonts.json", "w") as f:
    json.dump(similarities, f, indent=2)
