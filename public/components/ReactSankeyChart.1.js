import React, { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'


import * as d3Core from 'd3'
import * as d3Sankey from 'd3-sankey'

const d3 = {
  ...d3Core,
  ...d3Sankey
}

import uid from '../lib/uid'

import data from '../data/data.json'

//import style from './sankey.css';

//   NODE
// largeur du node
const nodeWidth = 24;
// espace entre les noeuds
const nodePadding = 10;
// opacité des noeuds
const nodeOpacity = 1;
// opacité des liens
const linkOpacity = 0.5;

const width = 964
const height = 600

const nodeAlignment = d3.sankeyCenter;

// const edgeColor="input" : Color by input
// const edgeColor="output" : Color by output
// const edgeColor="path" : Color by input-output
const edgeColor = "path"


const colorize = d3.scaleOrdinal(d3.schemeCategory10)
function color(name) {
  return colorize(name.replace(/ .*/, ""))
}

const d3format = d3.format(",.0f")
function format(d) {
  return `${d3format(d)} OTs`;
}

function sankey({nodes, links}) {
  sankey = d3.sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeAlign(nodeAlignment)
    .nodeId(d => d.id)
    .extent([[1, 1], [width - 1, height - 5]]);
  return sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}

function chart() {
  
  var svgNode = ReactFauxDOM.createElement('svg');

  svgNode.style.setProperty('width', width)
  svgNode.style.setProperty('height', height)

  const svg = d3.select(svgNode)
      .style("width", "100%")
      .style("height", "auto")
      .style("background-color", "#eee")


  const {nodes, links} = sankey(data)

  svg.append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .enter().append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d =>  Math.abs(d.y0 - d.y1))
      .attr("width", d => Math.abs(d.x0 - d.x1))
      .attr("fill", d => color(d.id))
      .attr("opacity", nodeOpacity)
    .append("title")
      .text(d => `${d.id}\n${format(d.value)}`)

  const link = svg.append("g")
      .attr("fill", "#333")
      .attr("stroke-opacity", 0.8)
    .selectAll("g")
    .data(links)
    .enter().append("g")
      .style("mix-blend-mode", "multiply")


  if (edgeColor === "path") {
    const gradient = link.append("linearGradient")
        .attr("id", d => {
          console.log(d.uid = uid("link").id)
          return d.uid
        })
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.id))

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.id))
  }

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => {
        
        edgeColor === "path" ? d.uid 
          : edgeColor === "input" ? color(d.source.id) 
          : color(d.target.id)
        })
      .attr("stroke-width", d => Math.abs(d.width))
      .attr("stroke-opacity", linkOpacity);

  link.append("title")
      .text(d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`)

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.id)

  return svg.node()
}

// <SankeyChart/>
export default () => {

  const reactChart = chart().toReact()
  return (
    <svg>
      {reactChart}
    </svg>
  )
}