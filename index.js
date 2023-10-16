const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const dataset = data;
    console.log(dataset);

    
    const width = 900;
    const height = 600;
    const padding = 60;

    const svg = d3
      .select("body")
      .append("svg")
      .attr("height", height)
      .attr("width", width);


    const xScale = d3
      .scaleLinear()
      .domain([d3.min(dataset, (d) => d.Year) -1, d3.max(dataset, (d) => d.Year) + 1])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`);

    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
        d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
      ])
      .range([padding, height - padding]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`);

    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
      .attr("r", "6")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
      .attr("fill", (d) => d.Doping == "" ? "orange" : "lightseagreen")
      .style("cursor", "pointer")

      .on("mousemove", function(e, d) {
        const tooltip = d3.select("#tooltip");

        tooltip
            .style("opacity", 0.9)
            .style("left", e.pageX + 10 + "px")
            .style("top", e.pageY + 10 + "px")
            .style("font-size", "14px")

        tooltip
            .attr("data-year", d.Year)
            .html(`${d.Name}: ${d.Nationality} <br/>
            Year: ${d.Year}, Time: ${d.Time} <br/>
            ${d.Doping}
            `)

        
      })

      .on("mouseout", function(e) {
        d3.select("#tooltip").style("opacity", 0)
      })

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", "0")
        .style("position", "absolute")
        .style("background-color", "lightcyan")
        .style("color", "#000")
        .style("padding", "10px")
        .style("border-radius", "5px")


      const legendContainer = svg.append("g").attr("id", "legend")

      const legend = legendContainer
      .selectAll("#legend")
        .data([
          {
            "title": "No doping alligations",
            "color": "lightseagreen"
          },
          {
            "title": "Riders with doping alligations",
            "color": "orange"
          }
        ])
        .enter()
        .append("g")
        .attr("class", "legend-label")
        .attr("transform", (d, i) => `translate(0 ${height / 2 + i * 20})`)

        legend
          .append("rect")
          .attr("x", width - padding)
          .attr("width", 17)
          .attr("height", 17)
          .style("fill", (d) => d.color)

        legend
          .append("text")
          .attr("x", width - padding - 8)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text((d) => d.title)
          .style("fill", "#fff")
          .style("font-size", "13px")


  });
