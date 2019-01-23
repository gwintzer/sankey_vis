export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'sankey_vis',
    uiExports: {
      visTypes: [
        'plugins/sankey_vis/sankey_vis'  //c'est ici qu'on définit qu'on veut un plugin visualize
      ]
    },

    // config(Joi) {
    //   return Joi.object({
    //     enabled: Joi.boolean().default(true),
    //   }).default();
    // },
  });
}
