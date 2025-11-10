'use strict';

/**
 * submission service
 */

const fsP = require('fs/promises'); // promises API
// const fsSync = require('fs');     // only needed if you actually use streams

module.exports = ({ strapi }) => ({
  /**
   * Create a form submission
   */
  async createSubmission({ form, data, files, ip, userAgent, locale }) {
    const pdfService = strapi.service('api::form-submission.pdf');
    const uploadService = strapi.service('plugin::upload.upload');

    // 1) Upload incoming files (if any)
    let uploadedFiles = [];
    if (files && Object.keys(files).length > 0) {
      const filesToUpload = [];
      for (const [, fileInput] of Object.entries(files)) {
        if (Array.isArray(fileInput)) filesToUpload.push(...fileInput);
        else if (fileInput) filesToUpload.push(fileInput);
      }

      if (filesToUpload.length > 0) {
        try {
          // v5 accessor + let the provider handle incoming multipart files
          const uploaded = await uploadService.upload({
            data: {},
            files: filesToUpload,
          });
          uploadedFiles = Array.isArray(uploaded) ? uploaded : [uploaded];
        } catch (error) {
          strapi.log.error('File upload error:', error);
          // continue without files
        }
      }
    }

    // 2) Generate + upload PDF (optional)
    let pdfFile = null;
    let pdfBuffer = null;
    let pdfFileName = null;

    if (form.sendPdf) {
      try {
        strapi.log.info('PDF step 1: generating');
        const pdfResult = await pdfService.generatePdf(form, data, uploadedFiles);

        // Read generated pdf as Buffer
        pdfBuffer = await fsP.readFile(pdfResult.path);
        pdfFileName = `submission-${Date.now()}.pdf`;

        const fileForUpload = {
          // IMPORTANT: do NOT include "path" here
          name: pdfFileName,
          type: 'application/pdf',
          size: pdfBuffer.length,
          buffer: pdfBuffer,
        };

        strapi.log.info('PDF step 2: uploading');
        // const uploaded = await uploadService.upload({
        //   data: {
        //     fileInfo: {
        //       name: pdfFileName,
        //       caption: `Form submission PDF for ${form.name}`,
        //       alternativeText: `Form submission PDF for ${form.name}`,
        //     },
        //   },
        //   files: fileForUpload, // single object or [fileForUpload]
        // });

        // pdfFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;

        // Clean temp file
        setTimeout(async () => {
          try {
            await fsP.unlink(pdfResult.path);
          } catch (cleanupError) {
            strapi.log.warn('Could not clean up temp PDF file:', cleanupError);
          }
        }, 1000);
      } catch (error) {
        strapi.log.error('PDF generation/upload error:', error);
        // continue without PDF
      }
    }

    // 3) Create submission record (v5 Document Service, locale-aware)
    const submission = await strapi
      .documents('api::form-submission.form-submission')
      .create({
        locale: locale || 'en',
        status: 'published', // or 'draft' if you want to moderate
        data: {
          form: form.id,
          formName: form.name,
          data,
          submittedAt: new Date(),
          files: uploadedFiles.map((f) => f.id),
          pdf: pdfFile ? pdfFile.id : null,
          ip,
          userAgent,
        },
        populate: ['form', 'files', 'pdf'],
      });
    
    submission.pdf = pdfBuffer;
    submission.pdfFileName = pdfFileName
    return submission;
  },
});
