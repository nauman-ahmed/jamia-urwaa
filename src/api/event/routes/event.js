'use strict';

/**
 * event router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::event.event', {
  config: {
    find: {
      middlewares: [],
      auth: false, // Public endpoint
    },
    findOne: {
      middlewares: [],
      auth: false, // Public endpoint
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
});

module.exports = defaultRouter;

