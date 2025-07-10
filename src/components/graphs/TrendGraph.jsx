import * as d3 from "d3";

const TrendGraph = ({ data }) => {
  if (!data || !data.viewsByDateRange) return null;

  const rangeData = data.viewsByDateRange;

  const year = rangeData["year"]?.views || 0;
  const last90 = rangeData["90day"]?.views || 0;
  const last30 = rangeData["30day"]?.views || 0;
  const last7 = rangeData["7day"]?.views || 0;

  const seg1 = year - last90;
  const seg2 = last90 - last30;
  const seg3 = last30 - last7;
  const seg4 = last7;

  const viewEntries = [
    { label: "1年以前", views: seg1 },
    { label: "90日〜30日前", views: seg1 + seg2 },
    { label: "30日〜7日前", views: seg1 + seg2 + seg3 },
    { label: "直近7日", views: seg1 + seg2 + seg3 + seg4 },
  ];

  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 40, bottom: 40, left: 40 };

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
      <path
        d={line(viewEntries)}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        className="transition-all duration-700"
      />

      {viewEntries.map((d, i) => (
        <g key={i}>
          <circle
            cx={xScale(d.label)}
            cy={yScale(d.views)}
            r={4}
            className="fill-blue-500 transition-transform duration-500"
            style={{
              transitionDelay: `${i * 150}ms`,
              transformOrigin: "center",
            }}
          />
          <text
            x={xScale(d.label)}
            y={yScale(d.views) - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#333"
            style={{
              transitionDelay: `${i * 150 + 100}ms`,
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            {(d.views / 1_000_000).toFixed(1)}M
          </text>
        </g>
      ))}

      {/* 横軸ラベル */}
      {viewEntries.map((d, i) => (
        <text
          key={i}
          x={xScale(d.label)}
          y={height - margin.bottom + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
          style={{
            transitionDelay: `${i * 150 + 100}ms`,
            opacity: 1,
            transform: "translateY(0)",
          }}
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
};

export default TrendGraph;
