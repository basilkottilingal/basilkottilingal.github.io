
# Front Tracking Method
  Scalable Front Tracking 2D and  3D in AMR.
	This is implimented in basilisk.fr/ .
	Visit and install basilisk.fr/ .
  Clone this repository by 
  $ git clone git@github.com:basilkottilingal/FT.git

##	Status.
  !Not yet compilable

# Follow these basic rules
	(1) Should be minimal, commented and intended according to basilisk.fr rule.
	(2) Build on extra source files only after there is enough testcases to estblish whatever is already there.

# Still in Developing Mode
	As of now, The code is being is imported from the Current Stable 2D version which can be installed as below.
	$ mkdir FT2D
	$ cd FT2D
	$ git init
	$ git remote add origin git@github.com:basilkottilingal/FT2D.git
	$ git pull origin main

# 04/01/2024: Currently working on 
##	Long term objectives 
		(1) Regrid Parallel
##	Short term objectives (NOTE: very minimal headr files).
	  (1) Advection and Rebalance in serial only. 
		(2) the new partition method.
			In this rank of vertex = rank of owner cell of the vertex.
			rank of element = min of (ranks of it's vertices.)
		(3) Draw the headerfile dependencies.
		(4) 
## Later
		(1) Common routines for front elements and points.
		    Add, delete, foreach, foreach_all, is_local,

## Documentation
	-For immediate reference, use the Docs/documentation.pdf 
		(https://github.com/basilkottilingal/FT/tree/main/Docs/doc.pdf)
	-You can update the above mentioned Docs/doc.pdf using 
		$ cd Docs && make update
	-Read more here:
		https://github.com/basilkottilingal/FMPI_JCP
		https://github.com/basilkottilingal/OverleafDocu
		http://www.basilisk.fr

### Eulerian Mesh. AMR Grid.

*Quadtrees* in 2D and *octrees* in  3D are a 
hierarchical graph used to discretize computational domains 
as in Fig:2(a)(b) 
which will be mentioned as *tree* in general. The *nodes* of the graph 
are called *cells*. Every internal node has $2^{D}$ 
children nodes called as *children*. So
every internal node is the (only) *parent* to it's $2^{D}$
children. 
}$
<p align="center">
<img src="./Doc/jpg/quadtree.internal.jpg" width=25% height=25%>
<img src="./Doc/jpg/quadtree.extended.jpg" width=25% height=25%>
</p>
<figcaption> (Fig 1(a),(b). (a): Cells  $\mathcal{C}$ of the quadtree $\Graph{T}$ is 
the union of internal cells $\mathcal{I}$ in blue and the leaf cells 
$\mathcal{L}$ in red. (b): All-Cells  $\overbar{\mathcal{C}}$ of the 
parent quadtree $\overbar{\Graph{T}}$ is 
the union of internal cells $\mathcal{I}$ in blue, the leaf cells 
$\mathcal{L}$ in red and halo cells $\mathcal{H}$ in green) </figcaption>

<p align="center">
<img src="./Doc/jpg/graph.partition.jpg" width=25% height=25%>
<img src="./Doc/jpg/graph.partition.extended.jpg" width=25% height=25%>
</p>
<figcaption> (Fig 2(a),(b). Hierarchical structure of tree and parent tree
mentioned in Fig 1</figcaption>

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
	  
<p align="center">
<img src="./Doc/jpg/cell.cell.jpg" width=25% height=25%>
<img src="./Doc/jpg/cell.neighborhood.jpg" width=25% height=25%>
<figcaption> (Fig 3(a),(b)) </figcaption>
</p>

The scalars in halo cells are calculated by an *prolongation*
operation from their parent leaf cell. So there is a set prolongation leaf 
cells $\mathcal{P} \subset \mathcal{L}$ such that all their children 
are halo cells $\mathcal{H} = \bigcup\limits_c(\mathcal{P}) \mathscr{D}(c)$. 
Similarly the scalar values in the internal cells which are in the
neighborhood of a leaf cell are found by *restriction* operation.
These internal leaf cells are called as restriction cell
whose set is represented as $\mathcal{R} \subset \mathcal{I}$.
   
## Lagrangian Mesh: Front or Connected Traingular Mesh

<p align="center">
<img src="./Doc/jpg/front3d.jpg" width=40% height=40%>
<figcaption> 
(Fig 4: A spherical interface is represented here 
where  the interface is constructed by  connected oriented triangular patches.)
</figcaption>
</p>

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
$\mathcal{V}:=`{v_0,v_1,...`}$ and	
$\mathcal{E}:=`{e_0,e_2,...`}\subset{\mathcal{V}}^3$.
where their res (v_{i_0},v_{i_1},v_{i_2})\in{\mathcal{V}}^3`}$

Each triangle $e_i:=(v_{i_0},v_{i_1},v_{i_2})$ is comprised of 3 
cyclically ordered vertices $v_{i_0}$, $v_{i_1}$ and  $v_{i_2}$. Except for the triangles whose 
edge(s) lie(s) on the domain boundary, every  triangle $e_i \in \mathcal{E}$ 
share its edges  with three other distinct triangles 
$e_{i_0}, e_{i_1}, e_{i_2} \in \mathcal{E}$ which are called the
neighbors of $e_i$. Thus, we have a set of tuples of neighbors 
and their corresponding graph is defined as 
$\mathcal{N}:=`{n_i=(e_{i_0},e_{i_1},e_{i_2})`}\subset{\mathcal{V}}^3$

Even though $\mathcal{N}$ is redundant from the definition of $\mathcal{V}$ and 
$\mathcal{E}$ ($\mathcal{N}$ can always be derived from $\mathcal{V}$ and $\mathcal{E}$
by looking for shared edges) but we always maintain the $\mathcal{N}$ 
for computational efficiency.

## Lagrangian Mesh: Half Edge Mesh Respresentation.


