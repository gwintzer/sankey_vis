import { serverInit } from './server/index'

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'sankey_vis',
    uiExports: {
      visTypes: [
        'plugins/sankey_vis/sankey_vis'  //c'est ici qu'on définit qu'on veut un plugin visualize
      ]
    },

    init(server) {
      // Add server routes and initialize the plugin here
      const adminCluster = server.plugins.elasticsearch.getCluster('admin')
      const dataCluster = server.plugins.elasticsearch.getCluster('data')

      serverInit(server, adminCluster, dataCluster)
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
