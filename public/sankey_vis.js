import ReactSankeyChart from './components/ReactSankeyChart'
//import React, { Component, Fragment } from 'react'

import {
  EuiCode,
  EuiText
} from '@elastic/eui'

import { i18n } from '@kbn/i18n'
import { VisFactoryProvider } from 'ui/vis/vis_factory'
import { VisTypesRegistryProvider } from 'ui/registry/vis_types'
import { Schemas } from 'ui/vis/editors/default/schemas'

// class SankeyVisualization {
  
//   constructor(el, vis) {
//     this.el = el;
//     this.vis = vis;
//   }

//   async render(visData, status) {

//     // ...
//     // mettre le code pour recup les données de visdata 
//     // et afficher dans un graphe sankey

//     console.log("visData", visData)

//     console.log("vis", this.vis)

//     this.el = <EuiText>yes</EuiText>


//     return 'done rendering'
//   }
  
//   destroy() {
//     console.log('destroying');
//   }
// }




const SankeyVisType = (Private) => {

  const requestHandler = async (vis, appState, uiState, searchSource) => {
    console.log ("requestHandler", arguments)
    const data = { dataRequest: "requestHandler", request: "ok" }
    return data;
  };

  const responseHandler = () => {

    console.log ("responseHandler", arguments)
    return { data: "responseHandler", response: "ok" }
  }

  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createReactVisualization({
    name: 'sankey_vis',
    title: 'Sankey',
    type: 'table',
    icon: 'kqlFunction',
    description: 'Display a sankey visualization',
    visConfig: {
      component: ReactSankeyChart
    },
    //visualization: SankeyVisualization,
    requestHandler,
    responseHandler,
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
      },
      {
        group: 'buckets',
        name: 'bucket',
        title: i18n.translate('tableVis.tableVisEditorConfig.schemas.bucketTitle', {
          defaultMessage: 'Split Rows',
        }),
        aggFilter: ['!filter']
      }
    ])

  });
}

VisTypesRegistryProvider.register(SankeyVisType);