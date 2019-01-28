
export function transformDataWithIndex({nodes,links}) {
  
  return {
    nodes,
    links: links.map((link) => (
      { 
        ...link,
        source: findIndexForName(link.source, nodes),
        target: findIndexForName(link.target, nodes)
      }
    ))
  }
}

function findIndexForName(name, nodes) {

  let index = nodes.findIndex((element) => element.name === name)

  if (index === -1)
    console.log("Unable to find the node ", name, " in nodes list. Check the data.")

  return index
}
