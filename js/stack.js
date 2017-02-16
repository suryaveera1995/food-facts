(function(){
  d3.json("../output/stack.json", function(error, data){
   
    let boxBoundWidth = 900;
    let boxBoundHeight = 600;
    let margin = {top: 20, right: 160, bottom: 35, left: 30};
    data = data['data'];

    let width = boxBoundWidth - margin.left - margin.right,
    height = boxBoundHeight - margin.top - margin.bottom;

    let svg = d3.select("#svg-container")
    .append("div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let dataset = d3.layout.stack()(["salt", "sugar"].map(function(values) {
      return data.map(function(d) {
        return {x: d.country, y: +d[values]};
      });
    }));

    let x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

    let y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

    let colors = ["b33040", "#d25c4d"];

    // Define and draw axes
    let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

    let xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    // Create groups for each series, rects for each segment
    let groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

    let rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      let xPosition = d3.mouse(this)[0] - 15;
      let yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });


    let legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice().reverse()[i];});

    legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) {
      switch (i) {
        case 0: return "Salt";
        case 1: return "Sugar";
      }
    });

  })
})();
