'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({

  // GET /api/events?date_from&date_to&upcoming&locale
  async find(ctx) {
    const { date_from, date_to, upcoming, locale = 'en' } = ctx.query;

    // Build filters using Document Service syntax
    const filters = {
      ...(date_from ? { startAt: { $gte: new Date(date_from) } } : {}),
      ...(date_to   ? { endAt:   { $lte: new Date(date_to) } }   : {}),
    };

    if (upcoming === 'true' || upcoming === true) {
      filters.endAt = { ...(filters.endAt || {}), $gte: new Date() };
    }

    const events = await strapi.documents('api::event.event').findMany({
      locale,
      status: 'published',               // v5 replacement for publicationState
      filters,
      populate: ['cover'],
      sort: { startAt: 'asc' },
    });

    const sanitized = await this.sanitizeOutput(events, ctx);
    return this.transformResponse(sanitized);
  },

  // GET /api/events/:idOrSlugOrDocumentId?locale&includeUnpublished
  async findOne(ctx) {
    const { id } = ctx.params;
    const { locale = 'en', includeUnpublished } = ctx.query;

    // Try by documentId first (v5 primary identifier)
    let doc = await strapi.documents('api::event.event').findFirst({
      where: { documentId: id },
      locale,
      status: includeUnpublished === 'true' ? undefined : 'published',
      populate: ['cover'],
    });

    // If not a documentId, try numeric id or slug to resolve documentId
    if (!doc) {
      const fallback = await strapi.db.query('api::event.event').findOne({
        where: isNaN(+id)
          ? { slug: id, locale }
          : { id: +id, locale },
        populate: ['cover'],
      });
      if (fallback) {
        doc = await strapi.documents('api::event.event').findFirst({
          where: { documentId: fallback.documentId },
          locale,
          status: includeUnpublished === 'true' ? undefined : 'published',
          populate: ['cover'],
        });
      }
    }

    if (!doc) return ctx.notFound('Event not found');
    const sanitized = await this.sanitizeOutput(doc, ctx);
    return this.transformResponse(sanitized);
  },

  // POST /api/events
  async create(ctx) {
    const reqLocale = ctx.query.locale || ctx.request.body.locale || 'en';
    const { locale: _dropped, published, documentId, ...data } = ctx.request.body;

    if (!data.title || !data.startAt || !data.endAt)
      return ctx.badRequest('Missing required fields: title, startAt, endAt');

    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    if (isNaN(startAt) || isNaN(endAt)) return ctx.badRequest('Invalid dates');
    if (endAt < startAt) return ctx.badRequest('endAt must be after startAt');

    // Create a new document or a new locale for an existing document
    const created = await strapi.documents('api::event.event').create({
      locale: reqLocale,
      ...(documentId ? { documentId } : {}),     // if provided, attach to existing doc
      data: {
        title: data.title,
        description: data.description ?? null,
        location: data.location ?? null,
        startAt, endAt,
        allDay: !!data.allDay,
        slug: data.slug ?? null,
        cover: data.cover,
      },
      status: published ? 'published' : 'draft',
      populate: ['cover'],
    });

    const sanitized = await this.sanitizeOutput(created, ctx);
    ctx.status = 201;
    return this.transformResponse(sanitized);
  },

  // PUT/PATCH /api/events/:idOrDocumentId
  async update(ctx) {
    const { id } = ctx.params;
    const reqLocale = ctx.query.locale || ctx.request.body.locale || 'en';
    const { locale: _drop, published, ...data } = ctx.request.body;

    // Resolve a documentId that we can safely update
    let target = await strapi.documents('api::event.event').findFirst({
      where: { documentId: id },
      locale: reqLocale,
      populate: ['cover'],
    });

    if (!target) {
      const fallback = await strapi.db.query('api::event.event').findOne({
        where: isNaN(+id)
          ? { slug: id, locale: reqLocale }
          : { id: +id, locale: reqLocale },
        populate: ['cover'],
      });
      if (fallback) {
        target = await strapi.documents('api::event.event').findFirst({
          where: { documentId: fallback.documentId },
          locale: reqLocale,
          populate: ['cover'],
        });
      }
    }

    if (!target) return ctx.notFound(`Event not found in locale '${reqLocale}'`);

    // Validate dates if provided
    if (data.startAt) {
      const d = new Date(data.startAt);
      if (isNaN(d)) return ctx.badRequest('Invalid date format for startAt');
      data.startAt = d;
    }
    if (data.endAt) {
      const d = new Date(data.endAt);
      if (isNaN(d)) return ctx.badRequest('Invalid date format for endAt');
      data.endAt = d;
    }
    if (data.startAt && data.endAt && data.endAt < data.startAt)
      return ctx.badRequest('endAt must be after startAt');

    // Perform the update on the specific locale
    const updated = await strapi.documents('api::event.event').update({
      documentId: target.documentId,
      locale: reqLocale,
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        allDay: data.allDay,
        slug: data.slug,
        startAt: data.startAt,
        endAt: data.endAt,
        cover: data.cover,          // relations can be set here in v5
      },
      ...(published !== undefined ? { status: published ? 'published' : 'draft' } : {}),
      populate: ['cover'],
    });

    const sanitized = await this.sanitizeOutput(updated, ctx);
    return this.transformResponse(sanitized);
  },

  // DELETE /api/events/:idOrDocumentId?locale=de
  async delete(ctx) {
    const { id } = ctx.params;
    const reqLocale = ctx.query.locale || ctx.request.body?.locale || 'en';

    // Resolve documentId (works whether :id is a documentId, numeric id, or slug)
    let docId = id;
    if (!/^[a-z0-9]{24,}$/i.test(id)) {
      const entry = await strapi.db.query('api::event.event').findOne({
        where: isNaN(+id)
          ? { slug: id, locale: reqLocale }
          : { id: +id, locale: reqLocale },
      });
      if (!entry) return ctx.notFound(`Event not found in locale '${reqLocale}'`);
      docId = entry.documentId;
    }

    await strapi.documents('api::event.event').delete({
      documentId: docId,
      locale: reqLocale, // delete only that locale version
    });

    ctx.status = 204;
    return; // Strapi v5 DELETE commonly responds with 204 + no body
  },

}));
