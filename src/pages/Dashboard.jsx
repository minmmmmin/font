import React, { useMemo, useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "../../output2.json";

const Dashboard = () => {
  const [glyph, setGlyph] = useState("A");
  const [showTop, setShowTop] = useState(500);

  // ===== d3用の参照 =====
  const svgRef = useRef(null);
  const contentRef = useRef(null);
  const zoomRef = useRef(null);

  // 全体件数
  const TOTAL = data.length; // 1881 固定にするなら const TOTAL = 1881;

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
    const xs = data.map((d) => +d.x);
    const ys = data.map((d) => +d.y);
    const pad = 0.5;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad,
      width: Math.max(...xs) - Math.min(...xs) + pad * 2,
      height: Math.max(...ys) - Math.min(...ys) + pad * 2,
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

  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`;

  const categories = useMemo(() => {
    return [...new Set(data.map((d) => d.category))];
  }, []);

  // ===== d3-zoom 初期化 =====
  useEffect(() => {
    if (!svgRef.current || !contentRef.current) return;

    const svg = d3.select(svgRef.current);
    const content = d3.select(contentRef.current);

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20])
      .translateExtent([
        [bounds.minX, bounds.minY],
        [bounds.maxX, bounds.maxY],
      ])
      .on("zoom", (event) => {
        content.attr("transform", event.transform);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
    zoomRef.current = zoom;

    return () => {
      svg.on(".zoom", null);
    };
  }, [bounds.minX, bounds.maxX, bounds.minY, bounds.maxY]);

  const fontSize = 0.2;

  return (
    <div style={{ paddingInline: 16 }}>
      {fontLinks}

      <div
        style={{
          marginTop: "1rem",
          marginBottom: "0.5rem",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
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

        {/* すぐに全体表示へ戻る */}
        <button
          onClick={() => {
            if (!svgRef.current || !zoomRef.current) return;
            const svg = d3.select(svgRef.current);
            svg
              .transition()
              .duration(250)
              .call(zoomRef.current.transform, d3.zoomIdentity);
          }}
          style={{
            padding: "0.25rem 0.5rem",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          リセット
        </button>
      </div>

      {/* 上位件数セレクト */}
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        上位件数：
        <select
          value={showTop}
          onChange={(e) => setShowTop(Number(e.target.value))}
          style={{ border: "1px solid #ccc", padding: "0.25rem" }}
        >
          {[100, 500, 1000, TOTAL].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}>
        ※日本語対応のフォントが少ないためアルファベットで試すことをおすすめします。
      </div>

      {/* 凡例 */}
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

      {/* SVG全体にzoomをかけるのでrefを付与 */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          width: "100%",
          height: "70vh",
          display: "flex",
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 変換を当てたい要素群をgにまとめてref */}
        <g ref={contentRef}>
          {(() => {
            // シンプルな当たり判定（重なり抑制）
            const occupied = [];
            const items = [];

            for (let i = 0; i < data.length; i++) {
              const d = data[i];
              const dx = parseFloat(d.x);
              const dy = parseFloat(d.y);

              // 既存テキストと重なっていたらスキップ
              const hasOverlap = occupied.some((a) => {
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

              const fam = extractFamily(d.family);
              const { fontWeight, fontStyle } = parseVariant(d.variant);

              // ホバー表示内容：フォント名・バリアント・カテゴリ・インデックス（左詰め＆改行）
              const label = `${fam} ${d.variant} — ${d.category}
${i + 1} / ${TOTAL}`;

              if (i < showTop && !hasOverlap) {
                occupied.push({
                  x1: dx,
                  y1: dy,
                  x2: dx + fontSize,
                  y2: dy + fontSize,
                });

                items.push(
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
                      cursor: "pointer",
                    }}
                    data-index={i + 1}
                  >
                    <title>{label}</title>
                    {glyph}
                  </text>
                );
              }
            }

            return items;
          })()}
        </g>
      </svg>
    </div>
  );
};

export default Dashboard;
