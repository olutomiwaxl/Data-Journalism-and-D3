
function makeResponsive() {

    // Set up chart
    var svgWidth = 960;
    var svgHeight = 500;
    var margin = {top: 20, right: 40, bottom: 60, left: 100};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
   // append svg and chart group
   var svg = d3.select("#scatter")
   .append("svg")
   .attr("height", svgHeight)
   .attr("width", svgWidth);
   
   var chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`); 

   //import  data
    d3.csv("data.csv", function(error, censusData) {
        if (error) throw error;
    //      console.log(censusData)
    censusData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare= +data.healthcare;
          });
 
    // create scales
    var xScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty)*0.9, d3.max(censusData, d => d.poverty)*1.1])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)*0.9, d3.max(censusData, d => d.healthcare)*1.1])
    .range([height, 0]);
  
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);


    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "pink")
    .attr("opacity", ".5")
  
    var circlesLabel = chartGroup.selectAll("state")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.poverty)-15/2)
    .attr("y", d => yScale(d.healthcare)+15/2)
    .attr("fill", "black")
    .text(d => d.abbr);
  
    

   //Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty Level: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

   //Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Level (%)");
  });
  
  }

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, responsify() is called.
  d3.select(window).on("resize", makeResponsive);