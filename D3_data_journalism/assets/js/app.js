// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 550;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 40,
  bottom: 80,
  left:100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  d3.csv("assets/data/data.csv").then(function(stateData) {

    console.log(stateData);
    
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare =+data.healthcare;
    // console.log("poverty:", data.poverty);
    // console.log("healthcare:", data.healthcare);
  });
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(stateData, d => d.poverty)-1, d3.max(stateData, d => d.poverty)+1])
  .range([0,chartWidth]);

  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(stateData, d => d.healthcare)-2, d3.max(stateData, d => d.healthcare)+2])
  .range([chartHeight,0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  var circlesGroup= chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r","10")
  .attr("fill","#a0f1f6")
  .attr("opacity",".75")
  .attr("stroke","black");

  chartGroup.append("text")

        .style("text-anchor", "middle")

        .style("font-family", "sans-serif")

        .style("font-size", "9px")
      
        .selectAll("tspan")

        .data(stateData)

        .enter()

        .append("tspan")

        .attr("x", function(data) {

            return xLinearScale(data.poverty);

        })

        .attr("y", function(data) {

            return yLinearScale(data.healthcare -.02);

        })

        .text(function(data) {

            return data.abbr

        });

  var toolTip = d3.tip()
  .attr("class","d3-tip")
  .offset([0,0])
  .html(function(d){
    return(`${d.state}<br>poverty(%):${d.poverty}<br>Lacks healthcare(%):${d.healthcare}`);
  });
  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

   chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks healthcare (%)");

   chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
    .attr("class", "aText")
    .text("In poverty(%)");
    }).catch(function(error) {
      console.log(error);
});

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

