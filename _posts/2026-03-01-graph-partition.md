---
layout: post
title: Graph Partitioning
---

## Graph

A *graph* $G := (V, E)$ can be defined as a tuple of set of vertices, $V$ and a set of edges $E$ which is a two-element
subset of $V$. The elements of $V$ are called *vertices*. An element $e := \{a,b\}$ of $E$ is called an *edge* with 
*end vertices* $a$ and $b$.

<style>
  .chart-row {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: flex-start;
  }
  .chart-row figure {
    margin: 0;
    text-align: center;
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="/assets/js/func/graph.js"></script>

<div id="graphs-classification" class="chart-row"></div>
<script>
  function addChart(dataPath, caption) {
    d3.json(dataPath)
      .then(data => {
      const figure = document.createElement("figure");
      let svg = force_directed(data, [200, 200]);
      figure.appendChild(svg);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
      document.getElementById("graphs-classification").appendChild(figure);
    });
  }
  addChart( "/assets/js/charts/graph_partitioning/cyclic.json", "cyclic graph");
  addChart( "/assets/js/charts/graph_partitioning/bipartite.json", "bipartite graph");
  addChart( "/assets/js/charts/graph_partitioning/tree.json", "tree");
</script>


### Where do you find graphs ?

You can find graphs almost everywhere like social media networks where people are connected, road maps where towns are connected, the internet which is a connection of computers, etc. 
<!--div id="graphs-ex" class="chart-row"></div>
<script>
  function addChart(dataPath, caption) {
    d3.json(dataPath)
      .then(data => {
      const figure = document.createElement("figure");
      let svg = force_directed(data, [1000, 800]);
      figure.appendChild(svg);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
      document.getElementById("graphs-ex").appendChild(figure);
    });
  }
  addChart( "/assets/js/charts/graph_partitioning/map.heavy.json", "cyclic graph");
</script-->

## Graph Partitioning and Graph Clustering

## Few graph analysis tools

1. [Python Networkx library](https://networkx.org/)
2. [Nvidia CUDA-X (formerly RAPIDS) cuGRAPH](https://developer.nvidia.com/topics/ai/data-science/cuda-x-for-data-science)
3. [Python igraph library for clustering of large networks](https://python.igraph.org/en/stable/)
4. [Python DGL library for graph deep learning](https://www.dgl.ai/)
5. [Neo4j graph database management and graph intelligence (freemium business model)](https://neo4j.com/)

## Reference

1. Jungnickel, Dieter. *Graphs, networks and algorithms.* Berlin, Heidelberg: Springer Berlin Heidelberg, 2008.
2. Sanders, Peter, Christian Schulz, and Dorothea Wagner. "Benchmarking for graph clustering and partitioning." *Encyclopedia of social network analysis and mining Springer* (2014).
