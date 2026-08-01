
const width = 800;
const height = 450;

const margin = {
  top:40,
  right:30,
  bottom:60,
  left:60
};


const svg = d3.select("#chart")
.append("svg")
.attr("width",width)
.attr("height",height);


d3.json("/assets/js/charts/ai-electricity/model_electricity.json").then(data=>{


  // Flatten energy values
  const values=[];

  data.forEach(d=>{
    values.push(d.short);
    values.push(d.medium);
    values.push(d.long);
  });


  const x = d3.scaleLinear()
    .domain([0,d3.max(values)])
    .range([
      margin.left,
      width-margin.right
    ]);


  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(20)
    (values);



  const y = d3.scaleLinear()
    .domain([
      0,
      d3.max(bins,d=>d.length)
    ])
    .range([
      height-margin.bottom,
      margin.top
    ]);



  svg.selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
  .attr("x",d=>x(d.x0)+1)
  .attr("y",d=>y(d.length))
  .attr("width",
    d=>Math.max(0,x(d.x1)-x(d.x0)-1)
  )
  .attr("height",
    d=>height-margin.bottom-y(d.length)
  );



  // x axis
  svg.append("g")
  .attr(
    "transform",
    `translate(0,${height-margin.bottom})`
  )
  .call(d3.axisBottom(x))
  .append("text")
  .attr("x",width/2)
  .attr("y",45)
  .text("Energy per query (Wh)");



  // y axis

  svg.append("g")
  .attr(
    "transform",
    `translate(${margin.left},0)`
  )
  .call(d3.axisLeft(y))
  .append("text")
  .attr("x",-40)
  .attr("y",20)
  .text("Count");


});
