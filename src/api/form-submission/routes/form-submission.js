'use strict';

/**
 * form-submission router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::form-submission.form-submission');

// Add custom routes after router is created
const customRoutes = [
  {
    method: 'GET',
    path: '/form-submissions/:id/pdf',
    handler: 'form-submission.downloadPdf',
    config: {
      policies: [],
      middlewares: [],
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

