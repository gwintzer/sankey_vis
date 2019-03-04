import ReactSankeyChart from './components/ReactSankeyChart'

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
          group: 'metrics',
          name: 'metric',
          title: 'Node weight',
          aggFilter: ['sum'],
          min: 1,
          max: 1,
          defaults: [
            { type: 'sum', schema: 'metric' }
          ]
        },
        {
          group: 'buckets',
          name: 'bucket1',
          title: 'Source field',
          aggFilter: ['terms'],
          min : 1,
          max : 1
        },
        {
          group: 'buckets',
          name: 'bucket2',
          title: 'Target field',
          aggFilter: ['terms'],
          min : 1,
          max : 1
        }
      ])
    }
  });
}

VisTypesRegistryProvider.register(SankeyVisType);