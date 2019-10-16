export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'sankey_vis',
    uiExports: {
      visTypes: [
        'plugins/sankey_vis/sankey_vis'
      ]
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
