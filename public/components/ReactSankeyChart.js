import React, { Component, Fragment } from 'react'
import ReactFauxDOM from 'react-faux-dom'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer
} from '@elastic/eui'

import * as d3Core from 'd3'
import * as d3Sankey from 'd3-sankey'

const d3 = {
  ...d3Core,
  ...d3Sankey
}

// <SankeyChart/>
export default ({vis, appState, updateStatus, visData}) => {

  console.log("vis", vis)
  console.log("appState", appState)
  console.log("updateStatus", updateStatus)
  console.log("visData", visData)
  
  // largeur
  const width = vis.size[0]
  // hauteur
  const height = vis.size[1]
  // marge du tableau / graphique
  const margin = 10
  // couleur de fond du graphique
  const svgBackground = "#eee"
  // bord du svg
  const svgBorder = "1px solid #333"


  //   NODE
  // largeur du node
  const nodeWidth = 30
  // espace entre les noeuds
  const nodePadding = 6
  // opacité des noeuds
  const nodeOpacity = 1
  // opacité des liens
  const linkOpacity = 0.5
  // ??
  const nodeDarkenFactor = 0.3
  //  ???
  const nodeStrokeWidth = 4
  const arrow = "\u2192"
  const nodeAlignment = d3.sankeyCenter

  const path = d3.sankeyLinkHorizontal()


  function addGradientStop(gradients, offset, fn) {
      return gradients.append("stop")
                      .attr("offset", offset)
                      .attr("stop-color", fn)
  }

  const colorize = d3.scaleOrdinal(d3.schemeCategory10)
  function color(name) {
    return colorize(name.replace(/ .*/, ""))
  }

  function darkenColor(color, factor) {
    return d3.color(color).darker(factor)
  }

  function getGradientId(d) {
    return `gradient_${d.source.id}_${d.target.id}`
  }

  function getCleanId(id) {
    return id.replace(/^W[1-9]_/, "").replace("empty-", "")
  }

  function reduceUnique(previous, current) {
    if (previous.indexOf(current) < 0) {
      previous.push(current)
    }
    return previous
  }
      
  function sumValues(previous, current) {
    previous += current
    return previous
  }

  function chart() {
    
    var canvas = ReactFauxDOM.createElement('div')

    const svg = d3.select(canvas).append('svg')
                  .attr("width", width)
                  .attr("height", height)
                  .style("background-color", svgBackground)
                  .style("border", svgBorder)
                  .append("g")
                  .attr("transform", `translate(${margin},${margin})`)
    
    const graphSize = [width - 2*margin, height - 2*margin]
    const sankey = d3.sankey()
                      .size(graphSize)
                      .nodeId(d => d.id)
                      .nodeWidth(nodeWidth)
                      .nodePadding(nodePadding)
                      .nodeAlign(nodeAlignment)
                      .extent([[1, 1], [width - 1, height - 5]])


    let graph = sankey(visData)
    
    // Loop through the nodes. Set additional properties to make a few things
    // easier to deal with later.
    graph.nodes.forEach(node => {
      let fillColor = color(getCleanId(node.id))

      node.fillColor = fillColor;
      node.strokeWidth = nodeStrokeWidth
      node.strokeColor = darkenColor(fillColor, nodeDarkenFactor)
      node.width = node.x1 - node.x0
      node.height = node.y1 - node.y0
    });
    
    // Build the links.
    let svgLinks = svg.append("g")
                      .classed("links", true)
                      .selectAll("g")
                      .data(graph.links)
                      .enter()
                      .append("g");
    let gradients = svgLinks.append("linearGradient")
                            .attr("gradientUnits", "userSpaceOnUse")
                            .attr("x1", d => d.source.x1)
                            .attr("x2", d => d.target.x0)
                            .attr("id", d => getGradientId(d))
    addGradientStop(gradients, 0.0, d => color(getCleanId(d.source.id)))
    addGradientStop(gradients, 1.0, d => color(getCleanId(d.target.id)))
    svgLinks.append("path")
            .classed("link", true)
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", d => `url(#${getGradientId(d)})`)
            .attr("stroke-width", d => Math.max(1.0, d.width))
            .attr("stroke-opacity", linkOpacity)
    
    // Add hover effect to links.
    svgLinks.append("title")
            .text(d => `${d.source.id} ${arrow} ${d.target.id}\n${d.value}`)

    let svgNodes = svg.append("g")
                      .classed("nodes", true)
                      .selectAll("rect")
                      .data(graph.nodes)
                      .enter()
                      .append("rect")
                      .classed("node", true)
                      .attr("x", d => d.x0)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width)
                      .attr("height", d => d.height)
                      .attr("fill", d => d.fillColor)
                      .attr("opacity", nodeOpacity)
                      .attr("stroke", d => d.strokeColor)
                      .attr("stroke-width", 0);
    
    let nodeDepths = graph.nodes
        .map(n => n.depth)
        .reduce(reduceUnique, []);
    
    nodeDepths.forEach(d => {
        let nodesAtThisDepth = graph.nodes.filter(n => n.depth === d);
        let numberOfNodes = nodesAtThisDepth.length;
        let totalHeight = nodesAtThisDepth
                            .map(n => n.height)
                            .reduce(sumValues, 0);
        let whitespace = graphSize[1] - totalHeight;
        let balancedWhitespace = whitespace / (numberOfNodes + 1.0);
        //console.log("depth", d, "total height", totalHeight, "whitespace", whitespace, "balanced whitespace", balancedWhitespace);
    });
    
    // Add hover effect to nodes.
    svgNodes.append("title")
            .text(d => `${d.id}\n${d.value} unit(s)`);
    
    svgNodes.append("text")
            .text(d => `${d.id}\n${d.value} unit(s)`);
            
    let svgLabels = svg.append("g")
      .style("font", "10px sans-serif")
      .selectAll("text")
      .data(graph.nodes.filter(d => d.depth === 0))
      .enter().append("text")
      //.attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("x", d => d.x0 + 5 )
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => getCleanId(d.id))

    return svg.node()
  }
  
  const reactChart = chart().toReact()

  return (
    <svg width={vis.size[0]} height={vis.size[1]}>
      {reactChart}
    </svg>
  )
}