'use strict';

const { Client } = require('@elastic/elasticsearch');

/**
 * Elasticsearch search controller
 * POST /api/elasticsearch/search?locale=ur
 */
module.exports = {
  async search(ctx) {
    try {
      const { locale = 'en' } = ctx.query;
      const { query } = ctx.request.body;

      if (!query) {
        return ctx.badRequest('Query is required in request body');
      }

      // Create Elasticsearch client
      const client = new Client({
        node: process.env.ELASTIC_NODE,
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
        tls: { rejectUnauthorized: process.env.ELASTIC_TLS_REJECT_UNAUTHORIZED !== 'false' },
      });

      const alias = process.env.ELASTIC_ALIAS || process.env.ELASTIC_ALIAS_NAME || 'strapi-plugin-elasticsearch-index';

      // Build the search query with locale filter
      // For Elasticsearch v9, query parameters are at the top level, not in 'body'
      const searchQuery = {
        index: alias,
        query: {
          bool: {
            must: [
              query, // The user's query (e.g., { match: { title: "سالانہ" } })
              {
                term: {
                  locale: locale,
                },
              },
            ],
          },
        },
      };

      // Execute the search
      const result = await client.search(searchQuery);

      // Format the response
      const hits = result.hits.hits.map((hit) => ({
        _id: hit._id,
        _score: hit._score,
        _source: hit._source,
      }));

      ctx.body = {
        took: result.took,
        timed_out: result.timed_out,
        hits: {
          total: result.hits.total,
          max_score: result.hits.max_score,
          hits: hits,
        },
      };
    } catch (error) {
      strapi.log.error('Elasticsearch search error:', error);
      ctx.throw(500, error.message || 'Elasticsearch search failed');
    }
  },
};

