'use strict';

/**
 * form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
  /**
   * Download submission PDF
   * GET /api/form-submissions/:id/pdf
   */
  async downloadPdf(ctx) {
    const { id } = ctx.params;

    try {
      const submission = await strapi.entityService.findOne(
        'api::form-submission.form-submission',
        id,
        {
          populate: ['pdf'],
        }
      );

      if (!submission) {
        return ctx.notFound('Submission not found');
      }

      if (!submission.pdf) {
        return ctx.notFound('PDF not available for this submission');
      }

      const pdfFile = await strapi.entityService.findOne(
        'plugin::upload.file',
        submission.pdf.id || submission.pdf
      );

      if (!pdfFile) {
        return ctx.notFound('PDF file not found');
      }

      // Get file path
      const filePath = pdfFile.url.startsWith('http')
        ? pdfFile.url
        : `${process.env.SERVER_URL || 'http://localhost:1337'}${pdfFile.url}`;

      // For local files, serve directly
      if (!pdfFile.url.startsWith('http')) {
        const fs = require('fs');
        const path = require('path');
        const uploadPath = path.join(process.cwd(), 'public', pdfFile.url);
        
        if (fs.existsSync(uploadPath)) {
          ctx.set('Content-Type', 'application/pdf');
          ctx.set('Content-Disposition', `attachment; filename="${pdfFile.name}"`);
          ctx.body = fs.createReadStream(uploadPath);
          return;
        }
      }

      // Redirect to file URL if remote
      ctx.redirect(filePath);
    } catch (error) {
      strapi.log.error('PDF download error:', error);
      ctx.throw(500, 'Error downloading PDF');
    }
  },
}));

