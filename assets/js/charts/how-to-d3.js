const data =
[
  {x: 10, y: 30, radius: 5, name:"A"},
  {x: 20, y: 45, radius: 12, name:"B"},
  {x: 35, y: 20, radius: 8, name:"C"},
  {x: 50, y: 70, radius: 18, name:"D"},
  {x: 65, y: 55, radius: 10, name:"E"},
  {x: 80, y: 90, radius: 15, name:"F"}
];

const width = 800;
const height = 500;

const margin =
{
  top: 40,
  right: 40,
  bottom: 70,
  left: 80
};

/* Create SVG */
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

/* Scales */
const x = d3.scaleLinear()
  .domain([0,100])
  .range([ margin.left, width-margin.right ]);
const y = d3.scaleLinear()
  .domain([0,100])
  .range([height-margin.bottom, margin.top ]);

/* x-axis */
svg.append("g")
  .attr(
    "transform",
    `translate(0,${height-margin.bottom})`
  )
  .call(d3.axisBottom(x));

/* y-axis */
svg.append("g")
  .attr(
    "transform",
    `translate(${margin.left},0)`
  )
  .call(d3.axisLeft(y));

/* axis labels */
svg.append("text")
  .attr("x",width/2)
  .attr("y",height-20)
  .attr("text-anchor","middle")
  .text("X coordinate");
svg.append("text")
  .attr("transform","rotate(-90)")
  .attr("x",-height/2)
  .attr("y",20)
  .attr("text-anchor","middle")
  .text("Y coordinate");

/* tooltip */
const tooltip = d3.select("body")
  .append("div")
  .attr("class","d3-tooltip");

/* scatter circles */
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  /* circle params from data */
  .attr("cx",d=>x(d.x))
  .attr("cy",d=>y(d.y))
  .attr("r",d=>d.radius)
  .attr("fill","steelblue")
  /* mouse drag events */
  .on("mouseover",function(event,d){
    tooltip
    .html( `${d.name} ( x=${d.x}, y=${d.y}, r=${d.radius} )`)
    .style("opacity",0.5)
    .style("left",(event.pageX+20)+"px")
    .style("top",(event.pageY-20)+"px");
  })
  .on("mouseout", function() {
    tooltip.style("opacity", 0);
  });
