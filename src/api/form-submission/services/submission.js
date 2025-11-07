'use strict';

/**
 * submission service
 */

module.exports = ({ strapi }) => ({
  /**
   * Create a form submission
   */
  async createSubmission({ form, data, files, ip, userAgent, locale }) {
    const pdfService = strapi.service('api::form-submission.pdf');

    // Upload files if any
    let uploadedFiles = [];
    if (files && Object.keys(files).length > 0) {
      const filesToUpload = [];
      
      // Handle different file input formats
      for (const [key, fileInput] of Object.entries(files)) {
        if (Array.isArray(fileInput)) {
          filesToUpload.push(...fileInput);
        } else if (fileInput) {
          filesToUpload.push(fileInput);
        }
      }

      if (filesToUpload.length > 0) {
        try {
          const uploaded = await strapi.plugins.upload.services.upload.upload({
            data: {},
            files: filesToUpload,
          });
          uploadedFiles = Array.isArray(uploaded) ? uploaded : [uploaded];
        } catch (error) {
          strapi.log.error('File upload error:', error);
          // Continue without files if upload fails
        }
      }
    }

    // Generate PDF if needed
    let pdfFile = null;
    if (form.storePdf || form.sendPdf) {
      try {
        const pdfResult = await pdfService.generatePdf(form, data, uploadedFiles);
        
        // Upload PDF file using Strapi's upload service
        const fs = require('fs');
        const pdfFileName = `submission-${Date.now()}.pdf`;
        
        // Read file as stream for upload
        const pdfStream = fs.createReadStream(pdfResult.path);
        const stats = await fs.promises.stat(pdfResult.path);
        
        // Create file object compatible with Strapi upload
        const pdfFileObj = {
          name: pdfFileName,
          path: pdfResult.path,
          type: 'application/pdf',
          size: stats.size,
          stream: pdfStream,
        };
        
        const pdfUploaded = await strapi.plugins.upload.services.upload.upload({
          data: {
            fileInfo: {
              name: pdfFileName,
              caption: `Form submission PDF for ${form.name}`,
              alternativeText: `Form submission PDF for ${form.name}`,
            },
          },
          files: [pdfFileObj],
        });
        
        pdfFile = Array.isArray(pdfUploaded) ? pdfUploaded[0] : pdfUploaded;
        
        // Clean up temp file after a short delay to ensure upload completes
        setTimeout(async () => {
          try {
            await fs.promises.unlink(pdfResult.path);
          } catch (cleanupError) {
            strapi.log.warn('Could not clean up temp PDF file:', cleanupError);
          }
        }, 1000);
      } catch (error) {
        strapi.log.error('PDF generation error:', error);
        // Continue without PDF if generation fails
      }
    }

    // Create submission record
    const submission = await strapi.entityService.create('api::form-submission.form-submission', {
      data: {
        form: form.id,
        data,
        submittedAt: new Date(),
        files: uploadedFiles.map(f => f.id),
        pdf: pdfFile ? pdfFile.id : null,
        ip,
        userAgent,
        locale,
      },
      populate: ['form', 'files', 'pdf'],
    });

    return submission;
  },
});

