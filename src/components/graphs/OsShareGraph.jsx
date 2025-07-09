import * as d3 from "d3";
import { useEffect, useState } from "react";

const OSShareGraph = ({ data }) => {
  if (!data || !data.viewsByOS) return null;

  const osData = Object.entries(data.viewsByOS)
    .map(([name, ratio]) => ({ name, ratio }))
    .sort((a, b) => b.ratio - a.ratio);

  const width = 400;
  const height = 30 * osData.length + 40;
  const margin = { top: 20, right: 100, bottom: 20, left: 100 };

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(osData, (d) => d.ratio)])
    .range([0, width - margin.left - margin.right]);

  // keyによってコンポーネントが作り直されるので、初期値は常に0になる
  const [animatedRatios, setAnimatedRatios] = useState(osData.map(() => 0));

  useEffect(() => {
    // マウント後に一度だけアニメーションを実行するシンプルな作りに戻す
    const timeout = setTimeout(() => {
      setAnimatedRatios(osData.map((d) => d.ratio));
    }, 100); // 描画直後にアニメーションを開始

    return () => clearTimeout(timeout);
  }, []); // 依存配列は空でOK

  return (
    <svg width={width} height={height} className="bg-white shadow rounded">
      {osData.map((d, i) => {
        const barHeight = 20;
        const y = margin.top + i * 30;
        const animatedWidth = xScale(animatedRatios[i]);

        return (
          <g key={d.name}>
            {/* OS名ラベル */}
            <text
              x={margin.left - 10}
              y={y + barHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="12"
              fill="#333"
            >
              {d.name}
            </text>

            {/* バー */}
            <rect
              x={margin.left}
              y={y}
              width={animatedWidth}
              height={barHeight}
              fill="#10B981"
              style={{
                transition: "width 0.8s ease-out",
              }}
            />

            {/* パーセンテージ表示 */}
            <text
              x={margin.left + animatedWidth + 5}
              y={y + barHeight / 2}
              alignmentBaseline="middle"
              fontSize="12"
              fill="#555"
              style={{
                transition: "x 0.8s ease-out",
              }}
            >
              {(d.ratio * 100).toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default OSShareGraph;
