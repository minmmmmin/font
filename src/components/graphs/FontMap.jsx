import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const FontMap = () => {
  const ref = useRef(null);

  useEffect(() => {
    d3.csv("/umap_font_data.csv").then((data) => {
      data.forEach((d) => {
        d.x = +d.x;
        d.y = +d.y;
      });

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const width = 800;
      const height = 500;
      const margin = 40;

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.x))
        .range([margin, width - margin]);

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.y))
        .range([height - margin, margin]);

      // カテゴリごとの色スケール
      const categoryColor = d3.scaleOrdinal()
        .domain(["sans-serif", "serif", "display"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

      // 円を描画
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 4)
        .attr("fill", (d) => categoryColor(d.category))
        .attr("opacity", 0.7)
        .append("title")
        .text((d) => `${d.name} (${d.variant})`);

      // レジェンド（右上）
      const legendData = categoryColor.domain();
      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - margin - 120}, ${margin})`);

      legendData.forEach((cat, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        g.append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", categoryColor(cat));
        g.append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(cat)
          .style("font-size", "12px");
      });
    });
  }, []);

  return <svg ref={ref} width={800} height={500}></svg>;
};

export default FontMap;
