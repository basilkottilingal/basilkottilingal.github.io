---
layout: post
title: Half Edge Mesh
---

### Eulerian Mesh. AMR Grid.

*Quadtrees* in 2D and *octrees* in  3D are a 
hierarchical graph used to discretize computational domains 
as in Fig:2(a)(b) 
which will be mentioned as *tree* in general. The *nodes* of the graph 
are called *cells*. Every internal node has $2^{D}$ 
children nodes called as *children*. So
every internal node is the (only) *parent* to it's $2^{D}$
children. 

{:refdef: style="display:flex; flex-direction:column; align-items:center; text-align:center;"}
<figure style="text-align:center;">
  <div style="display:flex; justify-content:center; gap:20px; width:100%;">
  <img src="{{ site.baseurl }}/assets/jpg/quadtree.internal.jpg" style="width:30%; object-fit:cover;">
  <img src="{{ site.baseurl }}/assets/jpg/quadtree.extended.jpg" style="width:30%; object-fit:cover;">
  </div>
  <figcaption>
  <em> Fig 1(a)-(b). The set of cells  $\mathcal{C}$ of the 
quadtree $\mathcal{T}$ is 
the union of internal cells $\mathcal{I}$ in blue and the leaf cells 
$\mathcal{L}$ in red. (b): All-Cells  $\overline{\mathcal{C}}$ of the 
parent quadtree $\overline{\mathcal{T}}$ is 
the union of internal cells $\mathcal{I}$ in blue, the leaf cells 
$\mathcal{L}$ in red and halo cells $\mathcal{H}$ in green)
  </em>
  </figcaption>
</figure>
{:refdef}

{:refdef: style="display:flex; flex-direction:column; align-items:center; text-align:center;"}
<figure>
  <div style="display:flex; justify-content:center; gap:20px; width:100%;">
  <img src="{{ site.baseurl }}/assets/jpg/graph.partition.jpg" style="width:30%; object-fit:cover;">
  <img src="{{ site.baseurl }}/assets/jpg/graph.partition.extended.jpg" style="width:30%; object-fit:cover;">
  </div>
  <figcaption>
  <em> Fig 2(a)-(b). Hierarchical structure of tree and parent tree
mentioned in Fig 1
  </em>
  </figcaption>
</figure>
{:refdef}

A cell or a node of a {tree} can be represented as $c$ which can be 
represented as a tuple, $c:=(i,j,l)$ in 2D or $c:=(i,j,k,l)$ in 3D, 
where $i,j,k\in$ { $0,1,..,2^{l}-1$ } are spatial indices of the cell 
corresponding to each dimension of $\mathbb{R}^D$ and 
$l\in$ { $0,1,..,L$ } represent  the refinement level of the cell.
The natural number $L$ here repesents the maximum depth of the tree. 
The index-set  ${\mathcal{C}}$  is the set of cells of the tree $\mathcal{T}$.
The sets of internal-cells $\mathcal{I}$ and leaf
cells $\mathcal{L}$ are mutually  exclusive and collectively exhaustive 
partition  of ${\mathcal{C}}$. 
If we represent $\mathscr{D}(c)$ represents the set of children or daughters
of a cell, then for every internal cell $c \in \mathcal{I}$, we have
$|\mathscr{D}(c)|=2^D$.

In order to do interpolations  of variables in a 
discretized equation, we need cells in the neighborhood 
which may be neither a leaf nor an *internal-cell*.
For a second-order interpolation in 3D, this neighborhood
is a $5\times5\times5$ grid of cells centered around
a *leaf-cell* Fig3. 
Cells in this neighborhood of a leaf which is neither an 
*internal-cell* nor a leaf is called a *halo-cell* and its set is
called as *halo-cells*, $\mathcal{H}$.  So at any 
the time step of the simulation, the algorithm maintains a 
superset of $\mathcal{C}$ called as *all-cells*
which is defined as $\overline{\mathcal{C}}:=\mathcal{H}\cup\mathcal{I}\cup\mathcal{L}$.
The corresponding tree is called as a parent-tree $\overline{\mathcal{T}}$.
The sets of internal-cells, leaves and halo cells of
a extended quadtree are represented in Fig:1(b).


{:refdef: style="display:flex; flex-direction:column; align-items:center; text-align:center;"}
<figure style="text-align:center;">
  <div style="display:flex; justify-content:center; gap:20px; width:100%;">
  <img src="{{ site.baseurl }}/assets/jpg/cell.cell.jpg" style="width:30%; object-fit:cover;">
  <img src="{{ site.baseurl }}/assets/jpg/cell.neighborhood.jpg" style="width:30%; object-fit:cover;">
  </div>
  <figcaption>
  <em> Fig 3(a)-(b). 
  </em>
  </figcaption>
</figure>
{:refdef}

The scalars in halo cells are calculated by an *prolongation*
operation from their parent leaf cell. So there is a set prolongation leaf 
cells $\mathcal{P} \subset \mathcal{L}$ such that all their children 
are halo cells $\mathcal{H} = \bigcup\limits_c(\mathcal{P}) \mathscr{D}(c)$. 
Similarly the scalar values in the internal cells which are in the
neighborhood of a leaf cell are found by *restriction* operation.
These internal leaf cells are called as restriction cell
whose set is represented as $\mathcal{R} \subset \mathcal{I}$.
   
## Lagrangian Mesh: Front or Connected Traingular Mesh

{:refdef: style="display:flex; flex-direction:column; align-items:center; text-align:center;"}
<figure style="text-align:center;">
  <div style="display:flex; justify-content:center; gap:20px; width:100%;">
  <img src="{{ site.baseurl }}/assets/jpg/front3d.jpg"  style="width:30%; object-fit:cover;"> 
  </div>
  <figcaption> <em> Fig 4: A spherical interface is represented here 
  where  the interface is constructed by  connected oriented triangular patches.
  </em> </figcaption>
</figure>
{:refdef}

An interface can be well represented by a front which is comprised 
of connected oriented triangular elements
whose vertices lies on the interface and a continuous and differentiable
orineted interface can be locally interpolated from the connected vertices.
We can represent a front $\mathcal{M}$ as a tuple of 
vertex set $\mathcal{V}$, triangular element set $\mathcal{E}$ and 
element connectivity set $\mathcal{N}$, which is written as
$\mathcal{M} :=  (\mathcal{V}, \mathcal{E}, \mathcal{N})$

If there are $|\mathcal{V}|$ vertices and $|\mathcal{E}|$ triangular elements,
then we have their sets written as 
{% raw %} $\mathcal{V} := \\{v_0,v_1,...\\}$ {% endraw %} and	
{% raw %} $\mathcal{E} := \\{e_0,e_2,...\\} \subseteq {\mathcal{V}}^3$ {% endraw %} .
where their res $(v_{i_0},v_{i_1},v_{i_2})\in{\mathcal{V}}^3`}$

Each triangle $e_i:=(v_{i_0},v_{i_1},v_{i_2})$ is comprised of 3 
cyclically ordered vertices $v_{i_0}$, $v_{i_1}$ and  $v_{i_2}$. Except for the triangles whose 
edge(s) lie(s) on the domain boundary, every  triangle $e_i \in \mathcal{E}$ 
share its edges  with three other distinct triangles 
$e_{i_0}, e_{i_1}, e_{i_2} \in \mathcal{E}$ which are called the
neighbors of $e_i$. Thus, we have a set of tuples of neighbors 
and their corresponding graph is defined as 
$\mathcal{N}:=\{ n_i=(e_{i_0},e_{i_1},e_{i_2}) \}\subset{\mathcal{V}}^3$

Even though $\mathcal{N}$ is redundant from the definition of $\mathcal{V}$ and 
$\mathcal{E}$ ($\mathcal{N}$ can always be derived from $\mathcal{V}$ and $\mathcal{E}$
by looking for shared edges) but we always maintain the $\mathcal{N}$ 
for computational efficiency.

## Lagrangian Mesh: Half Edge Mesh Respresentation.


