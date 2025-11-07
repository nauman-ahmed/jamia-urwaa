# Forms System Setup

## Environment Variables

Add these to your `.env` file for email functionality:

```env
# SMTP Configuration for Email Notifications
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_SECURE=false  # true for port 465, false for other ports
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=your-email@example.com

# Optional
SERVER_URL=http://localhost:1337  # For email links and PDF URLs
APP_NAME=Jamia Urwaa  # App name for email footer
ADMIN_URL=http://localhost:1337/admin  # Admin panel URL for email links
```

## API Endpoints

### Public Endpoints

1. **GET /api/forms/:slug**
   - Returns form schema (no PII)
   - Used by frontend to render forms dynamically
   - Example: `GET /api/forms/admission-form`

2. **POST /api/forms/:slug/submit**
   - Submits form data
   - Accepts JSON or multipart form data
   - Returns: `{ submissionId, message }`
   - Example: `POST /api/forms/admission-form/submit`

### Admin Endpoints

1. **GET /api/form-submissions/:id/pdf**
   - Downloads submission PDF (protected)
   - Example: `GET /api/form-submissions/1/pdf`

## Content Types

### Form
- Create forms with fields, validation, and notification settings
- Set `active` to enable/disable forms
- Configure `notificationEmails` (JSON array of email addresses)
- Enable PDF generation with `storePdf` and `sendPdf`

### Form Submission
- Automatically created when forms are submitted
- View submissions in admin panel
- Download PDFs if generated

## Component: Form Field

Fields support:
- Types: text, textarea, email, number, select, radio, checkbox, date, file
- Validation: regex, min/max, email format
- Required fields
- Options for select/radio fields
- Help text and placeholders

## Features

- ✅ Form builder with dynamic fields
- ✅ Form submission handling
- ✅ Email notifications to admins
- ✅ PDF generation from submissions
- ✅ Rate limiting per IP
- ✅ File upload support
- ✅ Field validation
- ✅ Admin panel integration

## Notes

- Rate limiting uses in-memory storage (consider Redis for production)
- PDF generation requires Puppeteer (installed)
- Email uses Nodemailer (configured via environment variables)

