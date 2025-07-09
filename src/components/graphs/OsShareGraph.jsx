import * as d3 from 'd3';

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
    .domain([0, d3.max(osData, d => d.ratio)])
    .range([0, width - margin.left - margin.right]);

  return (
    <svg width={width} height={height} className="bg-white shadow rounded">
      {osData.map((d, i) => {
        const barHeight = 20;
        const y = margin.top + i * 30;
        return (
          <g key={d.name}>
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
            <rect
              x={margin.left}
              y={y}
              width={xScale(d.ratio)}
              height={barHeight}
              fill="#10B981"
            />
            <text
              x={margin.left + xScale(d.ratio) + 5}
              y={y + barHeight / 2}
              alignmentBaseline="middle"
              fontSize="12"
              fill="#555"
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
