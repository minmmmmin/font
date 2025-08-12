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

  

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${
    bounds.maxY - bounds.minY
  }`;

  const color = (c) => ["#1f77b4", "#ff7f0e", "#2ca02c"][c % 3];

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
              fill={color(d.cluster)}
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
