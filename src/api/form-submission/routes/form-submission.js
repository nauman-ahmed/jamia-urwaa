'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::form-submission.form-submission', {
  config: {
    find: { middlewares: [] },
    findOne: { middlewares: [] },
    create: { middlewares: [] },
    update: { middlewares: [] },
    delete: { middlewares: [] },
  },
});
