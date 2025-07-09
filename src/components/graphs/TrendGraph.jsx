import * as d3 from "d3";

const TrendGraph = ({ data }) => {
  if (!data || !data.viewsByDateRange) return null;

  const rangeData = data.viewsByDateRange;
  const viewEntries = [
    { label: "7day", ...rangeData["7day"] },
    { label: "30day", ...rangeData["30day"] },
    { label: "90day", ...rangeData["90day"] },
    { label: "year", ...rangeData["year"] },
  ];

  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 40, bottom: 40, left: 40 }; // bottomを広げた

  const xScale = d3
    .scalePoint()
    .domain(viewEntries.map((d) => d.label))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(viewEntries, (d) => d.views)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d) => xScale(d.label))
    .y((d) => yScale(d.views));

  return (
    <svg width={width} height={height} className="bg-white shadow rounded">
      {/* データ点と数値ラベル */}
      {viewEntries.map((d, i) => (
        <g key={i}>
          <circle
            cx={xScale(d.label)}
            cy={yScale(d.views)}
            r={4}
            fill="#3B82F6"
          />
          <text
            x={xScale(d.label)}
            y={yScale(d.views) - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#333"
          >
            {(d.views / 1_000_000).toFixed(1)}M
          </text>
        </g>
      ))}

      {/* 折れ線 */}
      <path
        d={line(viewEntries)}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
      />

      {/* 横軸ラベル */}
      {viewEntries.map((d, i) => (
        <text
          key={i}
          x={xScale(d.label)}
          y={height - margin.bottom + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          {d.label}
        </text>
      ))}


    </svg>
  );
};

export default TrendGraph;
