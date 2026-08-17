---
layout: post
title: Graph Partitioning
---

## Graph

A *graph* $G := (V, E)$ can be defined as a tuple of set of vertices, $V$ and a set of edges $E$ which is a two-element
subset of $V$. The elements of $V$ are called *vertices*. An element $e := \\{a,b\\}$ of $E$ is called an *edge* with 
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

You can find graphs almost everywhere like social media networks where people are connected,
road maps where towns are connected, the internet which is a connection of computers, etc.
<style>
  #graph3d {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
</style>
<div id="graph3d"></div>
<script type="importmap">
  {
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/"
    }
  }
</script>
<script type="module">
  import { graph3 } from "/assets/js/func/graph3.js";

  async function loadGraph()
  {
    const response = await fetch(
        "/assets/js/charts/graph_partitioning/soccer.json"
      );
    const data = await response.json();
    graph3(data, document.getElementById("graph3d"), "meshes");
    //graph3(data, document.getElementById("graph3d"), "caption");
  }
  loadGraph();
</script>

<script src="/assets/js/func/graph2.js"></script>
<div id="road-network"></div>
<script>
  function roadNetwork(dataPath, caption) {
    d3.json(dataPath)
      .then(data => {
      const figure = document.createElement("figure");
      let svg = graph2(data, [500, 500]);
      figure.appendChild(svg);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
      document.getElementById("road-network").appendChild(figure);
    });
  }
  roadNetwork( "/assets/js/charts/graph_partitioning/map.json", "Road Network");
</script>

## Graph Partitioning and Graph Clustering

Graph partition (*GP*) refers to partitioning the vertex set $V$ into $k (k > 1)$ sets,
also called as *blocks*, with
the objective of sharing the computational load or the storage memory among $k$ different
processors or servers. The two competing factors in deciding the partition are
equal load distribution and minimizing the communication among the partitioned *blocks*.
You can see many applications of GP like in high performance computing where multiple
threads of computation are distributed among different processors or database distributed
among multiple servers, etc.

Meanwhile graph clustering is the idea of identifying clusters which show similar characteristics
often identified with strong connection within each of the *clusters*.
For example, you can see clusters of students, community of followers of a particular ideology, etc in social media.

<div id="clustering-vs-partitioning" class="chart-row"></div>
<script>
  function addChart(dataPath, caption) {
    d3.json(dataPath)
      .then(data => {
      const figure = document.createElement("figure");
      let svg = weighted_graph(data, [300, 300]);
      figure.appendChild(svg);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
      document.getElementById("clustering-vs-partitioning").appendChild(figure);
    });
  }
  addChart( "/assets/js/charts/graph_partitioning/cluster.json", "graph clustering");
  addChart( "/assets/js/charts/graph_partitioning/amr.json", "partition of graph");
  addChart( "/assets/js/charts/graph_partitioning/weighted.json", "partition of weighted graph");
</script>

Given a graph $G:=(V,E)$, a $k$-way partition is any vertex partition

$$
  \Pi = (V_1, V_2, .. V_k)
$$

such that

$$
  V_i \neq \phi
$$

$$
  V_i \cap_{_{i<j}} V_j = \phi
$$

$$
  V_1 \cup V_2 \cup .. V_k = V
$$

The partition is carried out with an objective to minimize the *edge cut*
subjected to the *balance* constraint

$$ |V_i| \leq (1+\epsilon) |V|/k ~~~\text{with}~~~ \epsilon \in \mathrm {R}_{\geq 0}$$


The edge cut of a partition is the set
of edges whose vertices belong to distinct blocks.

In graph clustering, $k$ cannot be specified, it is rather inherent to the graph.
Additionally *clusters* can have it's own sizes and thus balance criteria doesn't apply.

<!-- In many applications the *weight* per vertex may vary an -->

### Complexity

The graph partition problem (GPP) with optimal (minimum) edge cut size subjected to the balanced
constraint is an NP-hard optimisation problem. In other words, you can neither solve a 
GPP in polynomial time nor verify if a given
partition $\Pi$ has the minimum edge cut cardinality among the set of possible balanced
partitions.

If you have a vertex set $V$ with $|V| = 2n$, the number of ways you can do a perfect bipartition 
($k=2$, $\epsilon = 0$) is $(2n)!/2 (n!)$. That means it is impossible to check for the optimal solution
by traversing through all the partitions if you are given a practically large $n$. And it obviously
gets trickier for $k>2$.

GPP are therefore approached by heuristic methods to find reasonable GP.

## Graph Partitioning Algorithms

### Spectral methods

Spectral GP [3][4], was originally employed to find reasonable bi-partition for a *connected* graph.
It uses eigen vector corresponding to the second smallest eigen value of the graph *Laplacian*.
The Laplacian of a graph, $L(G) := D-A$ is a positive semi-definite matrix whose eigen values are
guaranteed to be
  $$
    0 = \lambda_1 \leq \lambda_2 .. \leq {\lambda}_{|V|}
  $$. The matrix $D$ is the diagonal matrix whose diagonal entries $d_{ii}$ are the valency or degree of each vertex $i$ and
the matrix $A$ is the adjacency matrix whose entries $a_{ij}$ are either 1 or 0 depending if the two nodes $i$ and $j$ are connected or not.

For a bi-partition $\Pi = \\{S, V\setminus S \\}$, you can take $\pm 1$ for each vertex, depending on whether the vertex belongs to $S$ or not.
The set of all possible *partition vectors* can thus be represented as ${\\{\pm 1\\}}^{|V|}$ which is a subspace of the vector space ${\mathbb {R}}^{|V|}$.
The edge cut of the above partition is defined as

$$
  \omega (S, V\setminus S) = \{ \{i,j\} | i \in S, j \in V\setminus S \}
$$

which is also equal to 

$$
  \omega (S, V \setminus S) = \frac{1}{4} {\mathbf {x}}^T L \mathbf {x}
$$

So edge cut minimization looks for minimization of ${\mathbf {x}}^T L \mathbf {x}$ with
some normalization condition like $\mathbf{x}^T \mathbf {x} = 1$. You can also take
the edge weighted normalization $\mathbf{x}^T D \mathbf {x} = 1$, which is more suitable for irregular graphs.
After applying Lagrange multiplier and differentiating by $\mathbf{x}$ you can deduce the above problem into

$$
  L\mathbf{x} = \lambda D \mathbf {x}
$$

which is the classical eigen value problem.

The trivial solution for the above, the eigen vector corresponding to $\lambda_1 = 0$, is the *ones vector* $\mathbf{1}$.
As you can see $\mathbf{1}$ also happens to be a partition vector. However this corresponds to either $S = V$ or $S = \phi$,
which doesn't satsify the balance condition, $\mathbf{x}^T \mathbf{1} \approx 0$.
So we can reconstitute the solution as

$$
    \mathbf {x}_p = \underset { \mathbf {x} : \mathbf{x}^T \mathbf{1} \approx 0} {\operatorname {argmin}}
       \frac { {\mathbf {x}}^T L \mathbf {x} } { {\mathbf {x}}^T D \mathbf {x}}
$$

You can solve this by finding the *fiedler vector*, the eigen vector corresponding to the second smallest eigen value
$\lambda_2$, and rounding off it's component to $-1$ or $+1$ using the median of the fiedler vector as the threshold.
You have to remember that, the multiplicity of the eigen value $0$ is equal to the number of
disconnected components in the graph.

## GP using local refinement 


## Few graph analysis tools

1. [Python Networkx library](https://networkx.org/)
2. [Nvidia CUDA-X (formerly RAPIDS) cuGRAPH](https://developer.nvidia.com/topics/ai/data-science/cuda-x-for-data-science)
3. [Python igraph library for clustering of large networks](https://python.igraph.org/en/stable/)
4. [Python DGL library for graph deep learning](https://www.dgl.ai/)
5. [Neo4j graph database management and graph intelligence (freemium business model)](https://neo4j.com/)

## Graph datasets free to download
1. [Dimacs 11 datasets [2]](https://networkrepository.com/dimacs.php)
2. [Open Graph Bench Mark https://ogb.stanford.edu/](https://ogb.stanford.edu/)
3. [Stanford Large Network Data Collection](https://snap.stanford.edu/data/)

## Reference

[1] Jungnickel, Dieter. *Graphs, networks and algorithms.* 
Berlin, Heidelberg: Springer Berlin Heidelberg, 2008.

[2] Sanders, Peter, Christian Schulz, and Dorothea Wagner.
"Benchmarking for graph clustering and partitioning." *Encyclopedia of social network analysis and mining Springer* (2014).

[3] Donath, William E., and Alan J. Hoffman. "Lower bounds for the partitioning of graphs."
*IBM Journal of Research and Development* 17.5 (1973): 420-425.

[4] Fiedler, Miroslav. "Algebraic connectivity of graphs." *Czechoslovak mathematical journal* 23.2 (1973): 298-305.
