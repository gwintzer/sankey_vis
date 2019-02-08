// export default async function(){
//     console.log("arguments de request handler export : ", arguments)


//     uiModules.get('kibana')
//     .run(function (es) {
//         es.ping()
//         .then(result => {
//             console.log('ping server, res', res)
//         })
//         .catch(err => {
//             console.log('error pinging servers');
//         });
//     });

//     return true // datacluster.getHealth()
// }

const SankeyRequestHandlerProvider = function (Private, Notifier, config, $http, i18n) {
    const notify = new Notifier({ location: i18n('tsvb.requestHandler.notifier.locationNameTitle', { defaultMessage: 'Metrics' }) });
  
    return {
      name: 'sankey',
      handler: function ({ uiState, timeRange, filters, query, visParams }) {
        
        return new Promise((resolve) => {
          
          try {
            
            const httpResult = $http.get('../api/sankey/search')
              .then(resp => ({ ...resp.data }))
              .catch(resp => { throw resp.data; });

            return httpResult
              .then(resolve)
              .catch(resp => {
                resolve({});
                const err = new Error(resp.message);
                err.stack = resp.stack;
                notify.error(err);
              });
          } catch (e) {
            notify.error(e);
            return resolve();
          }
          
        });
      }
    };
  };
  
  export { SankeyRequestHandlerProvider };