---
layout: post
title: d3.js
---

<style>
  .d3-tooltip {
    position: absolute;
    background: white;
    border: 1px solid black;
    color: black;
    padding: 1px;
    pointer-events: none;
    opacity: 0;
    z-index: 99999;
  }
</style>

## [d3.js](https://d3js.org/)

D3.js is a free and opensource javascript library used for creating interactive visualization.
It binds data to document elements, then manipulate those elements based on the data.
It provides low-level control for manipulation.

I came across d3.js and found it as a powerful tool for online scientific documentations.

There is a wide range of examples given <a target="_blank" href="https://observablehq.com/@d3/gallery">here</a>.

### sample
A sample plot is here. 
<a target="_blank" href="{{ site.baseurl }}/assets/js/charts/how-to-d3.js">javascript source code</a> 
<div id="chart"></div>
<!--script src="/assets/js/vendors/d3.min.js"></script-->
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="/assets/js/charts/how-to-d3.js"></script>
