import * as d3 from "d3";

const BrowserShareGraph = ({ data }) => {
  if (!data || !data.viewsByBrowser) return null;

  const pieData = Object.entries(data.viewsByBrowser)
    .map(([browser, ratio]) => ({ browser, ratio }))
    .filter((d) => d.ratio > 0.01); // 1%以上を抽出（任意）

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

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* 円グラフ */}
      <svg width={width} height={height} className="bg-white shadow rounded">
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pie(pieData).map((d, i) => (
            <g key={i}>
              {/* 扇形 */}
              <path d={arc(d)} fill={color(d.data.browser)} />
              {/* 円グラフ中央ラベル */}
              <text
                transform={`translate(${arc.centroid(d)})`}
                textAnchor="middle"
                fontSize="10"
                fill="#000"
              >
                {(d.data.ratio * 100).toFixed(1)}%
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* レジェンド */}
      <div className="flex flex-col justify-center">
        {pieData.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm mb-1">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: color(d.browser) }}
            ></span>
            <span className="text-gray-800">{d.browser}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserShareGraph;
