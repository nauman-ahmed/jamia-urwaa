'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Custom routes are handled in the route files themselves
    // This bootstrap runs after content types are loaded
    
    // Optionally seed the admission form on startup
    // Set SEED_ADMISSION_FORM=true in .env to enable
    if (process.env.SEED_ADMISSION_FORM === 'true') {
      try {
        const seedScript = require('../scripts/seed-admission-form');
        await seedScript({ strapi });
      } catch (error) {
        strapi.log.error('Error seeding admission form:', error);
      }
    }

    const { Client } = require('@elastic/elasticsearch');

    const client = new Client({
      node: process.env.ELASTIC_NODE,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
      tls: { rejectUnauthorized: process.env.ELASTIC_TLS_REJECT_UNAUTHORIZED !== 'false' },
    });

    const alias = process.env.ELASTIC_ALIAS || 'strapi-plugin-elasticsearch-index';

    // ---------- Per-collection config ----------
    // Choose fields (fast) and a serializer (shapes output, strips PII).
    const COLLECTIONS = {
      'api::event.event': {
        fields: ['id', 'title', 'slug', 'locale'],
        populate: {}, // add relations if you need them, e.g. { cover: true, categories: true }
        serialize: (doc) => ({
          contentType: 'api::event.event',
          id: doc.id,
          title: doc.title ?? null,
          slug: doc.slug ?? null,
          locale: doc.locale ?? 'en',
        }),
      },

      'api::form.form': {
        fields: ['id', 'name', 'slug', 'description', 'locale'],
        populate: {},
        serialize: (doc) => ({
          contentType: 'api::form.form',
          id: doc.id,
          name: doc.name ?? null,
          slug: doc.slug ?? null,
          description: doc.description ?? null,
          locale: doc.locale ?? 'en',
        }),
      },

      'api::form-submission.form-submission': {
        // keep locale + meta, drop PII from "data"
        fields: ['id', 'formName', 'data', 'locale'],
        populate: {},
        serialize: (doc) => {
          const { data = {}, ...rest } = doc;
          // strip obvious PII keys — adjust as needed
          const { cnicBForm, mobileNumber, emailAddress, guardianContact, ...safeData } = data || {};
          return {
            contentType: 'api::form-submission.form-submission',
            id: doc.id,
            formName: doc.formName ?? null,
            data: safeData,
            locale: doc.locale ?? 'en',
          };
        },
      },
    };

    const UIDS = Object.keys(COLLECTIONS);
    const pageSize = 500;

    for (const uid of UIDS) {
      const cfg = COLLECTIONS[uid];

      let start = 0;
      for (;;) {
        const rows = await strapi.entityService.findMany(uid, {
          // publicationState: 'live',
          locale: '*',  
          fields: cfg.fields,
          populate: cfg.populate,
          start,
          limit: pageSize,
        });
        strapi.log.info(`[ES bulk] Indexing ${rows.length} ${uid} docs`);
        if (!rows.length) break;

        // Bulk ops to alias (allowed if alias points to a single index)
        const operations = [];
        for (const doc of rows) {
          const body = cfg.serialize(doc);
          const esId = `${uid}::${doc.id}`;       // stable id per content type
          operations.push({ index: { _index: alias, _id: esId } });
          operations.push(body);
        }

        const res = await client.bulk({ refresh: true, operations });
        if (res.errors) {
          const errors = res.items
            .map(i => i.index?.error)
            .filter(Boolean);
          strapi.log.error(`[ES bulk] ${uid} had ${errors.length} errors`);
          throw new Error(errors[0]?.reason || 'Bulk indexing failed');
        }

        start += rows.length;
      }
    }

    strapi.log.info('[ES bulk] Completed ALL locales reindex to alias');

  },
};
