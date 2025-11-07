'use strict';

/**
 * form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form.form', ({ strapi }) => ({
  /**
   * Get form schema by slug (public endpoint)
   * GET /api/forms/:slug
   */
  async findBySlug(ctx) {
    const { slug } = ctx.params;

    try {
      const form = await strapi.db.query('api::form.form').findOne({
        where: { slug, active: true },
        populate: ['fields'],
      });

      if (!form) {
        return ctx.notFound('Form not found');
      }

      // Return only schema data (no PII)
      const schema = {
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        fields: form.fields.map(field => ({
          key: field.key,
          label: field.label,
          type: field.type,
          options: field.options,
          required: field.required,
          validation: field.validation,
          placeholder: field.placeholder,
          helpText: field.helpText,
          visibility: field.visibility,
        })),
        successMessage: form.successMessage,
      };

      ctx.body = schema;
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Submit form (public endpoint)
   * POST /api/forms/:slug/submit
   */
  async submit(ctx) {
    const { slug } = ctx.params;
    
    // Handle both JSON and multipart form data
    let submissionData = ctx.request.body.data || ctx.request.body;
    const submissionFiles = ctx.request.files || {};

    try {
      // Get form
      const form = await strapi.db.query('api::form.form').findOne({
        where: { slug, active: true },
        populate: ['fields'],
      });

      if (!form) {
        return ctx.notFound('Form not found or inactive');
      }

      // Rate limiting check
      const clientIP = ctx.request.ip || ctx.request.connection.remoteAddress || ctx.request.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
      const rateLimitService = strapi.service('api::form-submission.rate-limit');
      const canSubmit = await rateLimitService.checkRateLimit(form.id, clientIP, form.rateLimitPerIP);

      if (!canSubmit) {
        return ctx.tooManyRequests('Rate limit exceeded. Please try again later.');
      }

      // Validate submission
      const validationService = strapi.service('api::form-submission.validation');
      const validationResult = await validationService.validateSubmission(
        form.fields,
        submissionData,
        submissionFiles
      );

      if (!validationResult.valid) {
        return ctx.badRequest(validationResult.errors);
      }

      // Create submission
      const submissionService = strapi.service('api::form-submission.submission');
      const submission = await submissionService.createSubmission({
        form,
        data: submissionData,
        files: submissionFiles,
        ip: clientIP,
        userAgent: ctx.request.headers['user-agent'],
        locale: ctx.request.headers['accept-language']?.split(',')[0] || 'en',
      });

      // Send email notifications
      if (form.notificationEmails && form.notificationEmails.length > 0) {
        const emailService = strapi.service('api::form-submission.email');
        await emailService.sendNotificationEmail({
          form,
          submission,
          emails: form.notificationEmails,
          includePdf: form.sendPdf,
        });
      }

      // Record rate limit
      await rateLimitService.recordSubmission(form.id, clientIP);

      ctx.body = {
        submissionId: submission.id,
        message: form.successMessage || 'Thank you for your submission!',
      };
    } catch (error) {
      strapi.log.error('Form submission error:', error);
      ctx.throw(500, 'An error occurred while processing your submission');
    }
  },
}));

