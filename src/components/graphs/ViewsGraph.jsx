import * as d3 from "d3";

const ViewsGraph = ({ data }) => {
  if (!data || !data.viewsByDateRange) return null;

  const viewData = [
    { label: "7日", views: data.viewsByDateRange["7day"].views },
    { label: "30日", views: data.viewsByDateRange["30day"].views },
    { label: "90日", views: data.viewsByDateRange["90day"].views },
    { label: "1年", views: data.viewsByDateRange["year"].views },
  ];

  const width = 400;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  const xScale = d3
    .scaleBand()
    .domain(viewData.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yMax = d3.max(viewData, (d) => d.views);
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  return (
    <svg width={width} height={height} className="bg-white shadow rounded">
      {/* 軸ラベル */}
      {viewData.map((d, i) => (
        <text
          key={d.label}
          x={xScale(d.label) + xScale.bandwidth() / 2}
          y={height - margin.bottom + 15}
          textAnchor="middle"
          fontSize="12"
          fill="#333"
        >
          {d.label}
        </text>
      ))}

      {/* y軸の補助線 */}
      {yScale.ticks(5).map((tick) => (
        <g key={tick}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="#eee"
          />
          <text
            x={margin.left - 8}
            y={yScale(tick)}
            fontSize="12"
            fill="#666"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {d3.format(".2s")(tick)}
          </text>
        </g>
      ))}

      {/* 棒グラフ */}
      {viewData.map((d) => (
        <rect
          key={d.label}
          x={xScale(d.label)}
          y={yScale(d.views)}
          width={xScale.bandwidth()}
          height={height - margin.bottom - yScale(d.views)}
          fill="#3B82F6" // 青
        />
      ))}
    </svg>
  );
};

export default ViewsGraph;
