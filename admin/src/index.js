import { prefixPluginTranslations } from '@strapi/helper-plugin';

import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
export default {
  register(app) {
    app.customFields.register([
      {
        name: 'address',
        pluginId: PLUGIN_ID,
        type: 'string',

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
          Input: async () => import(/* webpackChunkName: "address-fields-component" */ './components/AddressFields'),
        },
        options: {
          advanced: [
            {
              sectionTitle: {
                id: 'global.settings',
                defaultMessage: 'Settings',
              },
              items: [
                {
                  name: 'required',
                  type: 'checkbox',
                  intlLabel: {
                    id: 'test1',
                    defaultMessage: 'Required field',
                  },
                  description: {
                    id: 'test2',
                    defaultMessage: "You won't be able to create an entry if this field is empty",
                  },
                },
              ],
            },
          ],
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
      }),
    );

    return importedTranslations;
  },
};
