
// l'utilisation du responseHandler est obligatoire si on veut accéder directement au tableau de données "table",
// plutôt qu'utiliser l'incompréhensible objet visData passé dans "render"
export async function sankeyResponseHandler(visData) {

  const items = visData.hits.hits.map(hit => hit._source)

  const nodes = items.filter(hit => hit.type === "node")
  const links = items.filter(hit => hit.type === "link")

  return { nodes, links }
}
