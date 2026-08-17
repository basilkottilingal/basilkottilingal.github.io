/*
.. NOTE : Assumes d3 is loaded (or downloaded from CDN) and "d3" is available in 
.. the global scope
*/

function force_directed(data, dimensions)
{
  /*
  Author :  https://observablehq.com/@d3/force-directed-graph/2
  */

  /* dimensions of the chart. (specified by the user) */
  const width = dimensions[0];
  const height = dimensions[1];

  /* Specify the color scale. */
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  /* The force simulation mutates links and nodes, so create a copy
  .. so that re-evaluating this cell produces the same result. */
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  /* Create a simulation with several forces. */
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  /* Create the SVG container. */
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  /* Add a line for each link, and a circle for each node. */
  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d => color(d.group));

  node.append("title")
    .text(d => d.id);

  /* Add a drag behavior. */
  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  /* Set the position attributes of links and nodes each time the simulation ticks. */
  function ticked()
  {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  /* Reheat the simulation when drag starts, and fix the subject position. */
  function dragstarted(event)
  {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  /* Update the subject (dragged node) position during drag. */
  function dragged(event)
  {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  /* Restore the target alpha so the simulation cools after dragging ends.
  .. Unfix the subject position now that it’s no longer being dragged. */
  function dragended(event)
  {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  /* When this cell is re-run, stop the previous simulation. (This doesn’t
  .. really matter since the target alpha is zero and the simulation will
  .. stop naturally, but it’s a good practice.) 
  invalidation.then(() => simulation.stop());
  */

  return svg.node();
}

/*
.. NOTE : Assumes d3 is loaded (or downloaded from CDN) and "d3" is available in 
.. the global scope
*/

function weighted_graph (data, dimensions)
{
  /*
  Author :  https://observablehq.com/@d3/force-directed-graph/2
  */

  /* dimensions of the chart. (specified by the user) */
  const width = dimensions[0];
  const height = dimensions[1];

  /* Specify the color scale. */
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  /* The force simulation mutates links and nodes, so create a copy
  .. so that re-evaluating this cell produces the same result. */
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  /* spring force of a link is different for an internal edge and a cut edge */
  function linkStrength(d) {
    if (d.source.group === d.target.group) {
      return 1.0;
    } else {
      return 0.1;
    }
  }

  /* Create a simulation with several forces. */
  const simulation = d3.forceSimulation(nodes)
    .force("link", 
      d3.forceLink(links)
        .id(d => d.id)
        .strength(linkStrength)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  /* Create the SVG container. */
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  /* Add a line for each link, and a circle for each node. */
  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  /* linear scale for the weight of the node */
  const radiusScale = d3.scaleLinear()
    .domain(d3.extent(nodes, d => d.weight))
    .range([5, 15]);
  
  function radius(weight) {
    if (weight === undefined || weight === null)
      return 5;
    return radiusScale(weight);
  }

  /* add circles for each node */
  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
    .attr("r", d => radius (d.weight))
    .attr("fill", d => color(d.group));

  node.append("title")
    .text(d => d.id);

  /* Add a drag behavior. */
  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  /* Set the position attributes of links and nodes each time the simulation ticks. */
  function ticked()
  {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  /* Reheat the simulation when drag starts, and fix the subject position. */
  function dragstarted(event)
  {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  /* Update the subject (dragged node) position during drag. */
  function dragged(event)
  {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  /* Restore the target alpha so the simulation cools after dragging ends.
  .. Unfix the subject position now that it’s no longer being dragged. */
  function dragended(event)
  {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  /* When this cell is re-run, stop the previous simulation. (This doesn’t
  .. really matter since the target alpha is zero and the simulation will
  .. stop naturally, but it’s a good practice.) 
  invalidation.then(() => simulation.stop());
  */

  return svg.node();
}
