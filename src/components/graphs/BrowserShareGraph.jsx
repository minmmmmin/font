import { useState } from "react";
import * as d3 from "d3";

const BrowserShareGraph = ({ data }) => {
  if (!data || !data.viewsByBrowser) return null;

  const pieData = Object.entries(data.viewsByBrowser)
    .map(([browser, ratio]) => ({ browser, ratio }))
    .filter((d) => d.ratio > 0.01)
    .sort((a, b) => b.ratio - a.ratio);

  const [hovered, setHovered] = useState(null);

  const width = 320;
  const height = 320;
  const radius = Math.min(width, height) / 2;

  const pastelColors = d3.schemePastel1;
  const color = d3
    .scaleOrdinal()
    .domain(pieData.map((d) => d.browser))
    .range(pastelColors);

  const pie = d3.pie().value((d) => d.ratio);
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 10);
  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <svg width={width} height={height} className="bg-white shadow rounded">
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pie(pieData).map((d, i) => {
            const [labelX, labelY] = outerArc.centroid(d);
            const isHovered = hovered?.data?.browser === d.data.browser;

            return (
              <g key={i}>
                <path
                  d={arc(d)}
                  fill={color(d.data.browser)}
                  onMouseEnter={() => setHovered(d)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                />
                {isHovered && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#333"
                    className="pointer-events-none"
                  >
                    {(d.data.ratio * 100).toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="flex flex-col justify-center">
        {pieData.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm mb-1">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: color(d.browser) }}
            ></span>
            <span className="text-gray-800 font-medium">{d.browser}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserShareGraph;
