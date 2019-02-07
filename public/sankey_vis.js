import ReactSankeyChart from './components/ReactSankeyChart'

import { i18n } from '@kbn/i18n'
import { VisFactoryProvider } from 'ui/vis/vis_factory'
import { VisTypesRegistryProvider } from 'ui/registry/vis_types'
import { Schemas } from 'ui/vis/editors/default/schemas'
import { legacyTableResponseHandler } from './legacy_response_handler';
import legacyTableRequestHandler from './legacy_request_handler';
import { VisController } from './vis_controller';

const SankeyVisType = (Private) => {

  const myRequestHandler = async (vis, appState, uiState, searchSource) => {
    console.log ("requestHandler", arguments)
    const data = { searchSource }
    console.log("data de requestHandler : ", data)
    return data;
  };

  const myResponseHandler = () => {
    console.log ("responseHandler", arguments)
    //console.log("data de responseHandler : ", data)
    return { data: "responseHandler", response: "ok" }
  }

  const VisFactory = Private(VisFactoryProvider)

  return VisFactory.createReactVisualization({
    name: 'sankey_vis',
    title: 'Sankey',
    type: 'table',
    icon: 'kqlFunction',
    description: 'Display a sankey visualization',
    // visualization: visController,
    visConfig: {
      component: ReactSankeyChart
    },
    //requestHandler: myRequestHandler,
    //requestHandler: courier,
    requestHandler: legacyTableRequestHandler,
    responseHandler: legacyTableResponseHandler,
    //responseHandler: myResponseHandler,
    // legacyTableResponseHandler, //appel au fichier legacy_response_handler qui sert à extraire le tableau des données du "visData",
    // responseHandlerConfig: {
    //   asAggConfigResults: true
    // }
    responseHandlerConfig: {
      asAggConfigResults: true
    },
    editorConfig: {
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: i18n.translate('tableVis.tableVisEditorConfig.schemas.metricTitle', {
            defaultMessage: 'Metric',
          }),
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          min: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        }, //groupe 1 : noeuds, groupe 2 links --> voir si on peut faire une requete dans un schema
        // le request handler permet peut-être de faire la requete soi-meme sans passer par le schema
        // faire des console.log(arguments)
        // esclient;SEARCH_
        {
          group: 'buckets',
          name: 'bucket',
          title: i18n.translate('tableVis.tableVisEditorConfig.schemas.bucketTitle', {
            defaultMessage: 'Split Rows',
          }),
          aggFilter: ['!filter']
        }
      ])
    }
  });
}


VisTypesRegistryProvider.register(SankeyVisType);