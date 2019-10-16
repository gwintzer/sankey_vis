import ReactSankeyChart from './components/ReactSankeyChart'

import { AggGroupNames } from 'ui/vis/editors/default'
import { VisFactoryProvider } from 'ui/vis/vis_factory'
import { VisTypesRegistryProvider } from 'ui/registry/vis_types'
import { Schemas } from 'ui/vis/editors/default/schemas'
import { sankeyResponseHandler } from './sankey_response_handler'

const SankeyVisType = (Private) => {

  const VisFactory = Private(VisFactoryProvider)

  return VisFactory.createReactVisualization({
    name: 'sankey_vis',
    title: 'Sankey',
    icon: 'kqlFunction',
    description: 'Display a sankey visualization',
    visConfig: {
      component: ReactSankeyChart
    },
    responseHandler: sankeyResponseHandler,
    editorConfig: {
      schemas: new Schemas([
        {
          // description: "The metric to apply on links between nodes",
          group: AggGroupNames.Metrics,
          name: 'metric',
          title: 'links',
          aggFilter: ['sum', 'count', 'min', 'max', 'avg'],
          min: 1,
          max: 1,
          defaults: [{ type: 'count', schema: 'metric' }]
        },
        {
          // description: "Select the two terms aggs containing source nodes then target node",
          group: AggGroupNames.Buckets,
          name: 'bucket',
          title: 'source & target nodes',
          aggFilter: ['terms'],
          min : 2,
          max : 2
        }
      ])
    }
  });
}

VisTypesRegistryProvider.register(SankeyVisType);