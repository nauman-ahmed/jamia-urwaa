'use strict';

module.exports = (plugin) => {
  // Add custom action for PDF download
  plugin.controllers['form-submission'].downloadPdf = async (ctx) => {
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

      // Redirect to PDF URL
      const fileUrl = pdfFile.url.startsWith('http')
        ? pdfFile.url
        : `${process.env.SERVER_URL || 'http://localhost:1337'}${pdfFile.url}`;

      ctx.redirect(fileUrl);
    } catch (error) {
      strapi.log.error('PDF download error:', error);
      ctx.throw(500, 'Error downloading PDF');
    }
  };

  return plugin;
};

