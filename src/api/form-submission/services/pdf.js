'use strict';

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

/**
 * pdf service
 */

module.exports = ({ strapi }) => ({
  /**
   * Generate PDF from form submission
   */
  async generatePdf(form, data, files) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Generate HTML content
      const html = this.generateHtml(form, data, files);

      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      });

      // Save to temporary file
      const tempDir = path.join(process.cwd(), '.tmp');
      await fs.mkdir(tempDir, { recursive: true });
      const tempPath = path.join(tempDir, `submission-${Date.now()}.pdf`);
      await fs.writeFile(tempPath, pdfBuffer);

      return {
        path: tempPath,
        size: pdfBuffer.length,
      };
    } catch (error) {
      strapi.log.error('PDF generation error:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },

  /**
   * Generate HTML template for PDF
   */
  generateHtml(form, data, files) {
    const submissionDate = new Date().toLocaleString();
    let fieldsHtml = '';

    for (const field of form.fields || []) {
      const value = data[field.key];
      if (value !== undefined && value !== null && value !== '') {
        fieldsHtml += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">${field.label}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${this.formatFieldValue(field, value)}</td>
          </tr>
        `;
      }
    }

    // Add file references if any
    if (files && files.length > 0) {
      fieldsHtml += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Attached Files</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            ${files.map(f => f.name || f.originalname || 'File').join(', ')}
          </td>
        </tr>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .info {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${form.name}</h1>
          ${form.description ? `<p>${form.description}</p>` : ''}
        </div>
        <div class="info">
          <p><strong>Submission Date:</strong> ${submissionDate}</p>
        </div>
        <table>
          ${fieldsHtml || '<tr><td colspan="2">No data submitted.</td></tr>'}
        </table>
        <div class="footer">
          <p>Generated on ${submissionDate}</p>
        </div>
      </body>
      </html>
    `;
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

