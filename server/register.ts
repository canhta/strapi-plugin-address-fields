import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // register phase
  strapi.customFields.register([
    {
      name: 'address',
      plugin: 'address-fields',
      type: 'string',
      inputSize: {
        default: 12,
        isResizable: false,
      },
    },
  ]);
};
