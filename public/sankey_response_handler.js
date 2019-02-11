//We need to use the response handler to to access to the data table rather than go through the incomprehensible visData
//object and also for split our data as we need

export async function sankeyResponseHandler(table) {

  // creation of nodes list from links (we keep only once each node)
  const sourceField = table.columns.find(column => (column.aggConfig.__schema.name ==="bucket1"))
  const targetField = table.columns.find(column => (column.aggConfig.__schema.name ==="bucket2"))
  const weightField = table.columns.find(column => (column.aggConfig.__schema.name ==="metric"))

  if (!sourceField || !sourceField.id) throw new Error("Please fill a source field")
  if (!targetField || !targetField.id) throw new Error("Please fill a target field")
  if (!weightField || !weightField.id) throw new Error("Please fill a weight field")

  // put each source name into sourceRows variable
  let sourceRows = table.rows.map(row => { return row[sourceField.id] }) 
  // row will take rows[0], rows[1], rows[2] etc..
  let targetRows = table.rows.map(row => { return row[targetField.id] })

  let myNodes = [
    ...sourceRows,
    ...targetRows
  ].filter(onlyUnique) // take sourceRows and targetRows values without duplication
  
  let myData = {
    nodes: myNodes.map(node => ({id: node})),
    links: table.rows.map(row => ({
      source: row[sourceField.id],
      target: row[targetField.id],
      value: row[weightField.id]
    }))
  }

  return myData
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}
