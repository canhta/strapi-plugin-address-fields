import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app) {
    app.customFields.register([
      {
        name: 'address',
        pluginId: PLUGIN_ID,
        type: 'json',
        intlLabel: {
          id: `${PLUGIN_ID}.address.label`,
          defaultMessage: 'Address',
        },
        intlDescription: {
          id: `${PLUGIN_ID}.address.description`,
          defaultMessage: 'Select address',
        },
        icon: PluginIcon,
        components: {
          Input: async () =>
            import(
              /* webpackChunkName: "address-fields-component" */ './components/AddressFields'
            ),
        },
      },
    ]);
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
