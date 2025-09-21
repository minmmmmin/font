import React, { useMemo, useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "../../output.json";

const Dashboard = () => {
  const [glyph, setGlyph] = useState("A");
  const [showTop, setShowTop] = useState(500);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const [fontSizeMap, setFontSizeMap] = useState(new Map()); 
  // key: index, value: "small" or "normal"

  const svgRef = useRef(null);
  const contentRef = useRef(null);
  const zoomRef = useRef(null);

  const TOTAL = data.length;

  const extractFamily = (family) =>
    family.replace(/\s(regular|italic|\d{3}italic?|\d{3})$/i, "");

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

  // Google Fonts 読み込みリンク
  const fontLinks = useMemo(() => {
    const fams = [...new Set(data.map((d) => extractFamily(d.family)))];
    return fams.map((fam) => (
      <link
        key={fam}
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          fam
        )}&display=swap`}
      />
    ));
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

  const categories = useMemo(
    () => [...new Set(data.map((d) => d.category))],
    []
  );

  // ズーム初期化
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
        setTransform(event.transform);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
    zoomRef.current = zoom;

    return () => {
      svg.on(".zoom", null);
    };
  }, [bounds]);

  // フォントサイズ
  const baseFontSize = 0.15;      // 通常サイズ
  const overlapFontSize = 0.1;   // 重なったときのサイズ

  return (
    <>
      {fontLinks}

      {/* 背景のSVG */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#fff",
          zIndex: 0,
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <g ref={contentRef}>
          {(() => {
            const occupied = [];
            const items = [];

            for (let i = 0; i < data.length; i++) {
              if (i >= showTop) break;

              const d = data[i];
              const dx = parseFloat(d.x);
              const dy = parseFloat(d.y);

              // スクリーン座標に変換
              const sx = dx * transform.k + transform.x;
              const sy = dy * transform.k + transform.y;
              const size = baseFontSize / transform.k;

              // 重なりチェック
              const hasOverlap = occupied.some((a) => {
                return !(
                  sx + size < a.x1 ||
                  sx > a.x2 ||
                  sy + size < a.y1 ||
                  sy > a.y2
                );
              });

              const fam = extractFamily(d.family);
              const { fontWeight, fontStyle } = parseVariant(d.variant);

              let fontSizeType = fontSizeMap.get(i);

              if (!fontSizeType) {
                // 初回のみ決定 → 以後は固定
                fontSizeType = hasOverlap ? "small" : "normal";
                setFontSizeMap((prev) => {
                  const next = new Map(prev);
                  next.set(i, fontSizeType);
                  return next;
                });
              }

              const effectiveSize =
                fontSizeType === "small" ? overlapFontSize : baseFontSize;

              if (fontSizeType === "normal") {
                occupied.push({
                  x1: sx,
                  y1: sy,
                  x2: sx + size,
                  y2: sy + size,
                });
              }

              const label = `フォント名：${fam} ${d.variant}\nカテゴリ：${
                d.category
              }\n利用数ランキング ${i + 1} / ${TOTAL}`;

              items.push(
                <text
                  key={i}
                  x={dx}
                  y={dy}
                  fontSize={effectiveSize}
                  textAnchor="start"
                  dominantBaseline="text-before-edge"
                  fill={categoryColor(d.category, i)}
                  style={{
                    fontFamily: `${fam}, cursive`,
                    fontWeight,
                    fontStyle,
                    cursor: "pointer",
                    opacity: fontSizeType === "small" ? 0.6 : 1,
                  }}
                >
                  <title>{label}</title>
                  {glyph}
                </text>
              );
            }

            return items;
          })()}
        </g>
      </svg>

      {/* オーバーレイUI */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1,
          background: "rgba(255,255,255,0.85)",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
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
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          ※日本語対応のフォントが少ないためアルファベットで試すことをおすすめします。
        </div>

        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
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
          画面をリセット
        </button>
      </div>
    </>
  );
};

export default Dashboard;
