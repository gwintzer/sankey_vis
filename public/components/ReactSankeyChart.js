import React, { Component, Fragment } from 'react'

import { 
  format as d3Format,
  interpolateRainbow as d3InterpolateRainbow,
  color as d3Color
} from 'd3'
import { 
  sankey as d3Sankey, 
  sankeyCenter, 
  sankeyLinkHorizontal,
} from 'd3-sankey'

import data from '../data/data'

import style from './sankey.css';

import {
  EuiCode,
  EuiText
} from '@elastic/eui'

// marge du tableau / graphique
const margin = { top: 10, right: 10, bottom: 10, left: 10 }
// largeur
const width = 1410
// hauteur
const height = 750
// couleur de fond du graphique
const svgBackground = "#eee"
// bord du svg
const svgBorder = "1px solid #333"

//   NODE
// largeur du node
const nodeWidth = 24
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
const nodeAlignment = sankeyCenter
const colorScale = d3InterpolateRainbow
let initialMousePosition = {}
let initialNodePosition = {}

const path = sankeyLinkHorizontal()

//const graphSize = [width - 2*margin, height - 2*margin]

function addGradientStop(gradients, offset, fn) {
  return gradients.append("stop")
                  .attr("offset", offset)
                  .attr("stop-color", fn);
}

function color(index) {
  let ratio = index / (data.nodes.length - 1.0);
  return colorScale(ratio);
}

function darkenColor(color, factor) {
  return d3Color(color).darker(factor)
}

function getGradientId(d) {
  return `gradient_${d.source.id}_${d.target.id}`;
}

// <SankeyChart/>
export default () => {

  var svgNode = ReactFauxDOM.createElement('div');





  
  const formatNumber = d3Format(",.0f"); // zero decimal places
  const format = (d) => formatNumber(d);
  
  const sankey = d3Sankey().size([width, height])
                          .nodeId(d => d.id)
                          .nodeWidth(nodeWidth)
                          .nodePadding(nodePadding)
                          .nodeAlign(nodeAlignment)
  console.log(sankey)
  
  const graph = sankey(data)

  console.log(graph.nodes)
  console.log(graph.links)

  // Loop through the nodes. Set additional properties to make a few things
  // easier to deal with later.
  graph.nodes.forEach(node => {
    let fillColor = color(node.id);
    node.fillColor = fillColor;
    node.strokeColor = darkenColor(fillColor, nodeDarkenFactor);
    node.width = node.x1 - node.x0;
    node.height = node.y1 - node.y0;
  });

  // Above D3 manipaluation equal to following jsx if didn't rely on faux-dom 
  // ------------------------------------------------------------------------
  var links = graph.links.map((link, i) => {
    return (
      <g key={i}>
        <path className="link" onClick={()=>{this.props.openModal(link)}} d={path(link)} /*style={{strokeWidth: Math.max(1, link.dy)}}*/>
          <title>{link.source.id + " → " + link.target.id + "\n Weight: " + format(link.value)}</title>
        </path>
      </g>
    );
  });

  var nodes = graph.nodes.map((node, i) => {

    node.dy = node.y1 - node.y0
    node.dx = node.x1 - node.x0

    return (
      <g key={i} className="node" onClick={()=>{this.props.openModal(node)}} transform={"translate(" + node.dx + "," + node.dy + ")"}>
        <rect height={node.dy} width={sankey.nodeWidth()}>
          <title>{node.id + "\n" + format(node.value)}</title>
        </rect>
        { (node.x >= width / 2) ? 
          <text x={-6} y={node.dy / 2} dy={".35em"} textAnchor={"end"} >{node.name}</text> :
          <text x={6 + sankey.nodeWidth()} /*y={node.dy / 2}*/ dy={".35em"} textAnchor={"start"} >{node.name}</text>
        }
      </g>
    );
  });

  // JSX rendering return if didn't rely on faux-dom
  // ------------------------------------------------------------------------
  return (
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
        {links}
        {nodes}
      </g>
    </svg>
  );
  
  // return (
  //   <svg width={width} height={height}>
  //     <g fill="none" stroke="#000" strokeOpacity="0.2"></g>
  //     <g className="links">
  //       <path d={graph.links} />
  //     </g>
  //     <g className="nodes">
  //       <path d={graph.nodes} />
  //     </g>
  //   </svg>
  // )
}


// export default class ReactSankeyChart extends Component {
//   constructor(props){
//      super(props)
//      this.createSankeyChart = this.createSankeyChart.bind(this)
//   }
//   componentDidMount() {
//      this.createSankeyChart()
//   }
//   componentDidUpdate() {
//      this.createSankeyChart()
//   }
//   createSankeyChart() {
//     const node = this.node
//     //const dataMax = max(this.props.data)

//     // Define our sankey instance.
//     const graphSize = [width - 2*margin, height - 2*margin];
//     d3Sankey().size(graphSize)
//             .nodeId(d => d.id)
//             .nodeWidth(nodeWidth)
//             .nodePadding(nodePadding)
//             .nodeAlign(nodeAlignment)
//     let graph = d3Sankey(data)

    
//   }
  
//   render() {
//      return <svg ref={node => this.node = node}
//      width={500} height={500}>
//      </svg>
//   }
// }

// export default class ReactSankeyChart extends Component {

  
  
//   render() {

//     const svg = d3.select("#canvas")
//                   .attr("width", width)
//                   .attr("height", height)
//                   .style("background-color", svgBackground)
//                   .style("border", svgBorder)
//                   .append("g")
//                   .attr("transform", `translate(${margin},${margin})`);
    
//     // Define our sankey instance.
//     const graphSize = [width - 2*margin, height - 2*margin];
//     const sankey = d3.sankey()
//                      .size(graphSize)
//                      .nodeId(d => d.id)
//                      .nodeWidth(nodeWidth)
//                      .nodePadding(nodePadding)
//                      .nodeAlign(nodeAlignment);
//     let graph = sankey(data);
    
//     // Loop through the nodes. Set additional properties to make a few things
//     // easier to deal with later.
//     graph.nodes.forEach(node => {
//         let fillColor = color(node.index);
//         node.fillColor = fillColor;
//         node.strokeColor = darkenColor(fillColor, nodeDarkenFactor);
//         node.width = node.x1 - node.x0;
//         node.height = node.y1 - node.y0;
//     });
    
//     // Build the links.
//     let svgLinks = svg.append("g")
//                       .classed("links", true)
//                       .selectAll("g")
//                       .data(graph.links)
//                       .enter()
//                       .append("g");
//     let gradients = svgLinks.append("linearGradient")
//                             .attr("gradientUnits", "userSpaceOnUse")
//                             .attr("x1", d => d.source.x1)
//                             .attr("x2", d => d.target.x0)
//                             .attr("id", d => getGradientId(d));
//     addGradientStop(gradients, 0.0, d => color(d.source.index));
//     addGradientStop(gradients, 1.0, d => color(d.target.index));
//     svgLinks.append("path")
//             .classed("link", true)
//             .attr("d", path)
//             .attr("fill", "none")
//             .attr("stroke", d => `url(#${getGradientId(d)})`)
//             .attr("stroke-width", d => Math.max(1.0, d.width))
//             .attr("stroke-opacity", linkOpacity);
    
//     // Add hover effect to links.
//     svgLinks.append("title")
//             .text(d => `${d.source.id} ${arrow} ${d.target.id}\n${d.value}`);

//     let svgNodes = svg.append("g")
//                       .classed("nodes", true)
//                       .selectAll("rect")
//                       .data(graph.nodes)
//                       .enter()
//                       .append("rect")
//                       .classed("node", true)
//                       .attr("x", d => d.x0)
//                       .attr("y", d => d.y0)
//                       .attr("width", d => d.width)
//                       .attr("height", d => d.height)
//                       .attr("fill", d => d.fillColor)
//                       .attr("opacity", nodeOpacity)
//                       .attr("stroke", d => d.strokeColor)
//                       .attr("stroke-width", 0);
    
//     let nodeDepths = graph.nodes
//         .map(n => n.depth)
//         .reduce(reduceUnique, []);
    
//     nodeDepths.forEach(d => {
//         let nodesAtThisDepth = graph.nodes.filter(n => n.depth === d);
//         let numberOfNodes = nodesAtThisDepth.length;
//         let totalHeight = nodesAtThisDepth
//                             .map(n => n.height)
//                             .reduce(sumValues, 0);
//         let whitespace = graphSize[1] - totalHeight;
//         let balancedWhitespace = whitespace / (numberOfNodes + 1.0);
//         console.log("depth", d, "total height", totalHeight, "whitespace", whitespace, "balanced whitespace", balancedWhitespace);
//     });
    
//     // Add hover effect to nodes.
//     svgNodes.append("title")
//             .text(d => `${d.id}\n${d.value} unit(s)`);
    
//     svgNodes.append("text")
//             .text(d => `${d.id}\n${d.value} unit(s)`);
            
//     svgNodes.call(d3.drag()
//                     .on("start", onDragStart)
//                     .on("drag", onDragDragging)
//                     .on("end", onDragEnd));

//     console.log("sankey1.js loaded.");

//     console.log("MyReactTab props", this.props)

//     return (
//       <Fragment>
//         <div>Sankey</div>
//         {svgNodes}
        
//       </Fragment>
//     );
//   }
// }