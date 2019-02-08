export function serverInit (server, adminCluster, dataCluster) {

  // Get the sankey search data
  server.route({
    path: '/api/sankey/search',
    method: 'GET',
    handler (req, reply) {

      console.log("req for search", req.params)

      dataCluster.callWithRequest(
        req, 'search', {
          index: 'sankey_data',
          body: {
            query: {
              match_all: {}
            }
          },
          size: 1000
        }).then((resp) => {
          return reply(resp)
        }).catch((err) => {
          return console.log('error getting ES index mappings: ', err)
        })
      
    }
  })

}
