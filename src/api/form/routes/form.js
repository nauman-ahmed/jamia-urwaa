'use strict';

/**
 * form router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::form.form', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
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

// Add custom routes after router is created
// Routes are accessed lazily, so this should work
const customRoutes = [
  {
    method: 'GET',
    path: '/forms/:slug',
    handler: 'form.findBySlug',
    config: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/forms/:slug/submit',
    handler: 'form.submit',
    config: {
      auth: false,
    },
  },
];

// Override routes getter to include custom routes
// Don't access routes during module load - only in the getter
Object.defineProperty(defaultRouter, 'routes', {
  get() {
    try {
      // Access the original routes getter
      const originalGetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(defaultRouter), 'routes')?.get;
      const routes = originalGetter ? originalGetter.call(defaultRouter) : [];
      return Array.isArray(routes) ? [...routes, ...customRoutes] : customRoutes;
    } catch (error) {
      // If routes aren't ready yet, return custom routes only
      return customRoutes;
    }
  },
  configurable: true,
});

module.exports = defaultRouter;

