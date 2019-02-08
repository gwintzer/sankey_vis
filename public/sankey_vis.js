import ReactSankeyChart from './components/ReactSankeyChart'

import { i18n } from '@kbn/i18n'
import { VisFactoryProvider } from 'ui/vis/vis_factory'
import { VisTypesRegistryProvider } from 'ui/registry/vis_types'
import { Schemas } from 'ui/vis/editors/default/schemas'
import { sankeyResponseHandler } from './sankey_response_handler';
import { SankeyRequestHandlerProvider } from './sankey_request_handler';


const SankeyVisType = (Private) => {
  
  const VisFactory = Private(VisFactoryProvider);
  const sankeyRequestHandler = Private(SankeyRequestHandlerProvider).handler;

  return VisFactory.createReactVisualization({
    name: 'sankey_vis',
    title: 'Sankey',
    type: 'table',
    icon: 'kqlFunction',
    description: 'Display a sankey visualization',

    visConfig: {
      component: ReactSankeyChart
    },
    
    requestHandler: sankeyRequestHandler,
    responseHandler: sankeyResponseHandler,
    
    
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