'use strict';

/**
 * form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
  /**
   * Override update to merge JSON data field instead of replacing it
   * PUT /api/form-submissions/:id?locale=en
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    try {
      // Get existing submission - handle both document ID and database ID
      let existingSubmission = null;
      
      // Check if ID is a document ID (string) or database ID (number)
      if (isNaN(id)) {
        // Document ID - use db query with documentId
        existingSubmission = await strapi.db.query('api::form-submission.form-submission').findOne({
          where: { documentId: id },
        });
      } else {
        // Database ID - use db query with id
        existingSubmission = await strapi.db.query('api::form-submission.form-submission').findOne({
          where: { id: parseInt(id) },
        });
      }

      if (!existingSubmission) {
        return ctx.notFound('Submission not found');
      }

      // If updating the data field, merge with existing data
      if (data && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        const existingData = existingSubmission.data;
        // Ensure existingData is an object
        const existingDataObj = existingData && typeof existingData === 'object' && !Array.isArray(existingData) 
          ? existingData 
          : {};
        
        // Merge the data objects (new values override existing ones)
        data.data = {
          ...existingDataObj,
          ...data.data,
        };
      }

      // Call the default update method with merged data
      const response = await super.update(ctx);
      return response;
    } catch (error) {
      strapi.log.error('Update error:', error);
      ctx.throw(500, 'Error updating submission');
    }
  },

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

