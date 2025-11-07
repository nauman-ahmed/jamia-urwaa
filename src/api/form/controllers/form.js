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
    
    // Log request details for debugging
    strapi.log.info('Form submission request:', {
      slug,
      method: ctx.request.method,
      contentType: ctx.request.headers['content-type'],
      hasBody: !!ctx.request.body,
      bodyKeys: ctx.request.body ? Object.keys(ctx.request.body) : [],
      hasFiles: !!ctx.request.files,
      fileKeys: ctx.request.files ? Object.keys(ctx.request.files) : [],
    });
    
    // Handle both JSON and multipart form data
    let submissionData = ctx.request.body?.data || ctx.request.body || {};
    const submissionFiles = ctx.request.files || {};

    // Ensure submissionData is an object
    if (!submissionData || typeof submissionData !== 'object' || Array.isArray(submissionData)) {
      submissionData = {};
    }

    try {
      // Get form
      const form = await strapi.db.query('api::form.form').findOne({
        where: { slug, active: true },
        populate: ['fields'],
      });

      if (!form) {
        strapi.log.warn(`Form not found: ${slug}`);
        return ctx.notFound('Form not found or inactive');
      }

      if (!form.fields || form.fields.length === 0) {
        strapi.log.warn(`Form has no fields: ${slug}`);
        ctx.status = 400;
        ctx.body = {
          data: null,
          error: {
            status: 400,
            name: 'BadRequestError',
            message: 'Form has no fields configured',
            details: {},
          },
        };
        return;
      }

      // Rate limiting check
      const forwardedFor = ctx.request.headers['x-forwarded-for'];
      const forwardedIP = Array.isArray(forwardedFor) 
        ? forwardedFor[0]?.split(',')[0] 
        : forwardedFor?.split(',')[0];
      const clientIP = ctx.request.ip || forwardedIP || 'unknown';
      
      const rateLimitService = strapi.service('api::form-submission.rate-limit');
      if (!rateLimitService) {
        strapi.log.warn('Rate limit service not found, skipping rate limit check');
      } else {
        const canSubmit = await rateLimitService.checkRateLimit(form.id, clientIP, form.rateLimitPerIP);

        if (!canSubmit) {
          return ctx.tooManyRequests('Rate limit exceeded. Please try again later.');
        }
      }

      strapi.log.info('SubmissionData:', submissionData);
      strapi.log.info('SubmissionFiles:', Object.keys(submissionFiles));
      
      // Log form fields structure for debugging
      strapi.log.info('Form fields structure:', JSON.stringify(
        form.fields.map(f => ({
          key: f.key,
          label: f.label,
          type: f.type,
          options: f.options,
          optionsType: Array.isArray(f.options) 
            ? (f.options.length > 0 && typeof f.options[0] === 'object' ? 'array-of-objects' : 'array-of-values')
            : typeof f.options === 'object' ? 'object' : typeof f.options
        })),
        null,
        2
      ));
      
      // Validate submission
      const validationService = strapi.service('api::form-submission.validation');
      if (!validationService) {
        strapi.log.error('Validation service not found');
        ctx.status = 500;
        ctx.body = {
          data: null,
          error: {
            status: 500,
            name: 'InternalServerError',
            message: 'Validation service not available',
            details: {},
          },
        };
        return;
      }
      
      const validationResult = await validationService.validateSubmission(
        form.fields,
        submissionData,
        submissionFiles
      );

      if (!validationResult.valid) {
        // Format errors properly for Strapi's badRequest response
        const errorMessage = validationResult.errors.length > 0
          ? validationResult.errors.map(e => e.message).join(', ')
          : 'Validation failed';
        
        ctx.status = 400;
        ctx.body = {
          data: null,
          error: {
            status: 400,
            name: 'ValidationError',
            message: errorMessage,
            details: {
              errors: validationResult.errors,
            },
          },
        };
        return;
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
      strapi.log.error('Form submission error:', {
        message: error.message,
        stack: error.stack,
        slug,
        body: ctx.request.body,
      });
      
      // If it's already a Strapi error, re-throw it
      if (error.status) {
        throw error;
      }
      
      ctx.status = 500;
      ctx.body = {
        data: null,
        error: {
          status: 500,
          name: 'InternalServerError',
          message: error.message || 'An error occurred while processing your submission',
          details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : {},
        },
      };
    }
  },
}));

