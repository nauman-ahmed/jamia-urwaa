'use strict';

/**
 * elasticsearch router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/elasticsearch/search',
      handler: 'elasticsearch.search',
      config: {
        auth: true, // Public endpoint
      },
    },
  ],
};

