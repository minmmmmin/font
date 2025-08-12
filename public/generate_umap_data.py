import pandas as pd
import numpy as np
import umap
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import json
import random

# データ読み込み
vectors = pd.read_csv("public/vectors-200.tsv", sep="\t", header=None)
metadata = pd.read_csv("public/metadata.tsv", sep="\t")

# ===== ランダムに1カテゴリ選択 =====
categories = metadata["category"].unique()
selected_cat = random.choice(categories)
print(f"選択されたカテゴリ: {selected_cat}")

# そのカテゴリだけ抽出
meta_cat = metadata[metadata["category"] == selected_cat].reset_index(drop=True)
vectors_cat = vectors.loc[meta_cat.index].reset_index(drop=True)

# ===== UMAP（カテゴリ内だけ） =====
reducer = umap.UMAP(random_state=42)
embedding_cat = reducer.fit_transform(vectors_cat)

# DataFrameにUMAP座標追加
df_cat = meta_cat.copy()
df_cat["x"] = embedding_cat[:, 0]
df_cat["y"] = embedding_cat[:, 1]

# ===== クラスタリング（UMAP後の座標で） =====
kmeans = KMeans(n_clusters=3, random_state=42, n_init="auto")
df_cat["cluster"] = kmeans.fit_predict(df_cat[["x", "y"]])

# ===== 散布図表示 =====
plt.figure(figsize=(8, 8))
for c in np.unique(df_cat["cluster"]):
    mask = df_cat["cluster"] == c
    plt.scatter(
        df_cat.loc[mask, "x"],
        df_cat.loc[mask, "y"],
        s=30,
        label=f"cluster {c}",
        alpha=0.9
    )

plt.title(f"UMAP of '{selected_cat}' Fonts (Clustering on UMAP space)")
plt.xlabel("UMAP-1")
plt.ylabel("UMAP-2")
plt.legend(loc="best", fontsize=8, frameon=True, markerscale=1.5)
plt.tight_layout()
plt.savefig(f"umap_kmeans_on_umapspace_{selected_cat}.png", dpi=180, bbox_inches="tight")
plt.show()

# ===== JSON保存（任意） =====
df_cat.to_json(f"umap_kmeans_on_umapspace_{selected_cat}.json", orient="records", force_ascii=False, indent=2)
