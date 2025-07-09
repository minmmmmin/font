import * as d3 from "d3";

const BrowserShareGraph = ({ data }) => {
  if (!data || !data.viewsByBrowser) return null;

  const pieData = Object.entries(data.viewsByBrowser)
    .map(([browser, ratio]) => ({ browser, ratio }))
    .filter((d) => d.ratio > 0.01); // 1%以上のみ表示

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;
  const color = d3
    .scaleOrdinal()
    .domain(pieData.map((d) => d.browser))
    .range(d3.schemeTableau10);

  const pie = d3.pie().value((d) => d.ratio);
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 10);
  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6);

  return (
    <svg width={width} height={height} className="bg-white shadow rounded">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {pie(pieData).map((d, i) => (
          <g key={i}>
            <path d={arc(d)} fill={color(d.data.browser)} />
            <text
              transform={`translate(${labelArc.centroid(d)})`}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="10"
              fill="#000"
            >
              {d.data.browser}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default BrowserShareGraph;
