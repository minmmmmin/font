import React, { useMemo, useState } from "react";
import data from "/public/output.json";

const Dashboard = () => {
  const [glyph, setGlyph] = useState("A");

  // family抽出
  const extractFamily = (name) =>
    name.replace(/\s(regular|italic|\d{3}italic?|\d{3})$/i, "");

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
    const fams = [...new Set(data.map((d) => extractFamily(d.name)))];
    return fams.map((fam) => (
      <link
        key={fam}
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          fam.replace(/\s+/g, "+")
        )}&display=swap`}
      />
    ));
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
        width={1000}
        height={750}
        viewBox={viewBox}
        style={{ background: "#fff", border: "1px solid #ccc" }}
      >
        {data.map((d, i) => {
          const fam = extractFamily(d.name);
          const { fontWeight, fontStyle } = parseVariant(d.variant);
          return (
            <text
              key={i}
              x={d.x}
              y={d.y}
              fontSize={0.2}
              textAnchor="middle"
              dominantBaseline="central"
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
        })}
      </svg>
    </div>
  );
};

export default Dashboard;
