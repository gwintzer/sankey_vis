//We need to use the response handler to to access to the data table rather than go through the incomprehensible visData
//object and also for split our data as we need

export async function sankeyResponseHandler(table) {

  if (table.columns.length < 3) throw new Error("Please fill a source and target field")

  // creation of nodes list from links (we keep only once each node)
  const sourceField = table.columns[0]
  const targetField = table.columns[1]
  const weightField = table.columns[2]

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
