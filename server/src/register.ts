import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register([
    {
      name: 'address',
      plugin: 'address-fields',
      type: 'json',
    },
  ]);
};
