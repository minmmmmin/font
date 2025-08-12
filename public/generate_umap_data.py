import pandas as pd
import umap
import matplotlib.pyplot as plt

# ===== データ読み込み =====
vectors = pd.read_csv("public/vectors-200.tsv", sep="\t", header=None)
metadata = pd.read_csv("public/metadata.tsv", sep="\t")

# ===== UMAP変換 =====
reducer = umap.UMAP(n_neighbors=150, min_dist=0.99, random_state=42)
embedding = reducer.fit_transform(vectors)

# ===== DataFrameに統合 =====
result_df = pd.concat([metadata, pd.DataFrame(embedding, columns=["x", "y"])], axis=1)
result_df.to_csv("n150min0..csv", index=False)

# ===== カテゴリごとに色分け散布図 =====
plt.figure(figsize=(8, 6))
categories = result_df["category"].unique()
colors = plt.cm.get_cmap("tab10", len(categories))

for idx, cat in enumerate(categories):
    subset = result_df[result_df["category"] == cat]
    plt.scatter(subset["x"], subset["y"], label=cat, s=20, alpha=0.5, color=colors(idx))

plt.title("UMAP Projection of Fonts by Category (n150min0.99.)")
plt.xlabel("UMAP-1")
plt.ylabel("UMAP-2")
plt.legend(title="Category", fontsize=8, frameon=True, markerscale=1.5)
plt.tight_layout()
plt.savefig("n150min0.99.png", dpi=180)
