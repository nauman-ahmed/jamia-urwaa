'use strict';

const nodemailer = require('nodemailer');

/**
 * email service
 */

module.exports = ({ strapi }) => ({
  /**
   * Send notification email to admins
   */
  async sendNotificationEmail({ form, submission, emails, includePdf, submissionFiles }) {
    try {
      // Get SMTP configuration from environment
      const smtpConfig = {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };

      // Create transporter
      const transporter = nodemailer.createTransport(smtpConfig);

      // Format submission data for email
      const submissionDataHtml = this.formatSubmissionData(form, submission);

      // Email content
      const emailSubject = `New Form Submission: ${form.name}`;
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #4CAF50; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; color: #777; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Form Submission</h1>
            </div>
            <div class="content">
              <p><strong>Form:</strong> ${form.name}</p>
              <p><strong>Submitted At:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
              <p><strong>IP Address:</strong> ${submission.ip || 'N/A'}</p>
              <hr>
              <h3>Submission Data:</h3>
              ${submissionDataHtml}
              <hr>
              <p>
                <a href="${process.env.ADMIN_URL || 'http://localhost:1337'}/admin/content-manager/collection-types/api::form-submission.form-submission/${submission.id}" class="button">
                  View in Admin Panel
                </a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated notification from ${process.env.APP_NAME || 'Strapi Forms'}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const attachments = [];
      if (includePdf && submission.pdf) {
        attachments.push({
          filename: submission.pdfFileName,
          content: submission.pdf,            // Buffer
          contentType: 'application/pdf',
        });
      }
      
      /* (B) NEW: include uploaded files from submissionFiles */
      const fs = require('fs');
      const path = require('path');
      
      const rawFiles = Object.values(submissionFiles || {})
        .flatMap(v => Array.isArray(v) ? v : [v])
        .filter(Boolean);
      
      for (const f of rawFiles) {
        const filePath = f.filepath || f.path || f.tmpPath;
        const filename = f.originalFilename || f.name || (filePath ? path.basename(filePath) : 'upload');
        const mime = f.mimetype || f.type || 'application/octet-stream';
      
        if (filePath && fs.existsSync(filePath)) {
          attachments.push({
            filename,
            content: fs.createReadStream(filePath),
            contentType: mime,
          });
        } else if (f.buffer) {
          attachments.push({
            filename,
            content: f.buffer,
            contentType: mime,
          });
        }
      }

      // Send email to all notification addresses
      const emailPromises = emails.map(email => {
        return transporter.sendMail({
          from: process.env.SMTP_FROM || smtpConfig.auth.user,
          to: email,
          subject: emailSubject,
          html: emailHtml,
          attachments,
        });
      });

      await Promise.all(emailPromises);
      strapi.log.info(`Notification emails sent for submission ${submission.id}`);
    } catch (error) {
      strapi.log.error('Email sending error:', error);
      // Don't throw - email failure shouldn't break submission
    }
  },

  /**
   * Format submission data as HTML
   */
  formatSubmissionData(form, submission) {
    let html = '';
    const data = submission.data || {};

    for (const field of form.fields || []) {
      const value = data[field.key];
      if (value !== undefined && value !== null && value !== '') {
        html += `
          <div class="field">
            <div class="field-label">${field.label}:</div>
            <div class="field-value">
              ${this.formatFieldValue(field, value)}
            </div>
          </div>
        `;
      }
    }

    return html || '<p>No data submitted.</p>';
  },

  /**
   * Format field value for display
   */
  formatFieldValue(field, value) {
    if (field.type === 'checkbox' && Array.isArray(value)) {
      return value.join(', ');
    }
    if (field.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value).replace(/\n/g, '<br>');
  },
});

