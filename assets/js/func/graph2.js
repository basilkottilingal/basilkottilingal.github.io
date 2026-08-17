/*
.. NOTE : Assumes d3 is loaded (or downloaded from CDN) and "d3" is available in 
.. the global scope
*/

function graph2(data, dimensions)
{
  /* Dimensions of the chart. */
  const width  = dimensions[0];
  const height = dimensions[1];

  /* Make copies so the original data are untouched. */
  const nodes = data.nodes.map(d => ({...d}));
  const links = data.links.map(d => ({...d}));

  /* Compute bounding box. */
  const xmin = d3.min(nodes, d => d.x);
  const xmax = d3.max(nodes, d => d.x);

  const ymin = d3.min(nodes, d => d.y);
  const ymax = d3.max(nodes, d => d.y);

  /* Small border around the drawing. */
  const margin = 10;

  /* Specify the color scale. */
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Preserve aspect ratio. */
  const sx = (width  - 2 * margin) / Math.max(xmax - xmin, 1e-9);
  const sy = (height - 2 * margin) / Math.max(ymax - ymin, 1e-9);

  const scale = Math.min(sx, sy);

  /* Transform coordinates into SVG coordinates. */
  nodes.forEach(d => {
    d._x = margin + (d.x - xmin) * scale;
    /* Flip Y so positive Y is upwards. */
    d._y = height - margin - (d.y - ymin) * scale;
  });

  /* Fast lookup table. */
  const nodeMap = new Map();

  nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  /* Create SVG. */
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width:100%; height:auto;");

  const g = svg.append("g");

  /* Draw edges. */
  const edgeStrokeWidth = 2;
  const edge = g.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", edgeStrokeWidth)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("x1", d => nodeMap.get(d.source)._x)
    .attr("y1", d => nodeMap.get(d.source)._y)
    .attr("x2", d => nodeMap.get(d.target)._x)
    .attr("y2", d => nodeMap.get(d.target)._y);

  /* Draw nodes. */
  const nodeRadius = 5;
  const nodeStrokeWidth = 1.;
  const node = g.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("cx", d => d._x)
    .attr("cy", d => d._y)
    .attr("r", nodeRadius)
    .attr("fill", d => color(d.group));

  node.append("title")
    .text(d => d.id);

  /*zoom*/
  const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .on("zoom", event => {
        g.attr("transform", event.transform);
        node.attr("r", nodeRadius / Math.sqrt(event.transform.k));
        node.attr("stroke-width", nodeStrokeWidth / Math.sqrt(event.transform.k));
        edge.attr("stroke-width", edgeStrokeWidth / Math.sqrt(event.transform.k));
    });
  svg.call(zoom);

  return svg.node();
}
