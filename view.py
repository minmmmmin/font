import pandas as pd
import matplotlib.pyplot as plt

# CSV 読み込み（区切りがタブの場合は sep="\t"）
umap_result = pd.read_csv("public/umap_font_data.csv", sep="\t")

# 散布図描画
plt.figure(figsize=(10, 8))
plt.scatter(
    umap_result["x"],
    umap_result["y"],
    c=umap_result["category"].astype('category').cat.codes,  # categoryで色分け
    cmap="tab10",
    alpha=0.7
)
plt.xlabel("UMAP 1")
plt.ylabel("UMAP 2")
plt.title("UMAP Projection (Regular Variants)")
plt.colorbar(label="Category")
plt.show()
