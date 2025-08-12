import React, { useMemo, useState } from "react";
import data from "../../output2.json";

const Dashboard = () => {
  const [glyph, setGlyph] = useState("A");

  // family抽出
  const extractFamily = (family) =>
    family.replace(/\s(regular|italic|\d{3}italic?|\d{3})$/i, "");

  // variantをCSSに
  const parseVariant = (variant) => {
    if (variant.toLowerCase() === "regular")
      return { fontWeight: 400, fontStyle: "normal" };
    const m = variant.match(/^(\d{3})(italic)?$/i);
    if (m)
      return {
        fontWeight: parseInt(m[1], 10),
        fontStyle: m[2] ? "italic" : "normal",
      };
    return { fontWeight: 400, fontStyle: "normal" };
  };

  // Google Fontsリンク作成
  const fontLinks = useMemo(() => {
    const fams = [...new Set(data.map((d) => extractFamily(d.family)))];
    return fams.map((fam) => {
      return (
        <link
          key={fam}
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            fam
          )}&display=swap`}
        />
      );
    });
  }, []);

  // 座標範囲
  const bounds = useMemo(() => {
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    const pad = 0.5;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad,
    };
  }, []);

  const CATEGORY_COLORS = {
    serif: "#1f77b4",
    "sans-serif": "#ff7f0e",
    display: "#2ca02c",
    handwriting: "#d62728",
    monospace: "#9467bd",
  };

  const categoryColor = (cat, idx = 0) => {
    if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
    const fallback = ["#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    return fallback[idx % fallback.length];
  };

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${
    bounds.maxY - bounds.minY
  }`;

  const categories = useMemo(() => {
    return [...new Set(data.map((d) => d.category))];
  }, []);

  let array = [];

  const fontSize = 0.2;
  return (
    <div>
      {fontLinks}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          表示文字：
          <input
            value={glyph}
            onChange={(e) => setGlyph(e.target.value || "")}
            maxLength={3}
            style={{
              border: "1px solid #ccc",
              marginLeft: "0.5rem",
              padding: "0.25rem",
            }}
          />
        </label>
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "0.5rem",
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: categoryColor(cat, i),
                borderRadius: 2,
                border: "1px solid #ccc",
              }}
            />
            <span style={{ fontSize: 12 }}>{cat}</span>
          </div>
        ))}
      </div>
      <svg
        viewBox={viewBox}
        style={{ background: "#fff", border: "1px solid #ccc" }}
      >
        {data.map((d, i) => {
          // 文字列から数値へ変換
          const dx = parseFloat(d.x);
          const dy = parseFloat(d.y);

          const conti = array.map((a) => {
            const overlap = !(
              (
                dx + fontSize < a.x1 || // 完全に左
                dx > a.x2 || // 完全に右
                dy + fontSize < a.y1 || // 完全に上
                dy > a.y2
              ) // 完全に下
            );
            return overlap;
          });

          const hasTrue = conti.some((value) => value == true);
          if (!hasTrue) {
            array.push({
              x1: dx,
              x2: dx + fontSize,
              y1: dy,
              y2: dy + fontSize,
            });
          }
          const fam = extractFamily(d.family);
          const { fontWeight, fontStyle } = parseVariant(d.variant);
          if (i < 1000 && !hasTrue) {
            return (
              <text
                key={i}
                x={dx}
                y={dy}
                fontSize={fontSize}
                textAnchor="start" // 左基準
                dominantBaseline="text-before-edge" // 上基準
                fill={categoryColor(d.category, i)}
                style={{
                  fontFamily: `${fam}, cursive`,
                  fontWeight,
                  fontStyle,
                }}
              >
                {glyph}
              </text>
            );
          }
          array.push({
            x1: dx,
            y1: dy,
            x2: dx + fontSize,
            y2: dy + fontSize,
          });
        })}
      </svg>
    </div>
  );
};

export default Dashboard;
