# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

## 📋 Dynamic Forms System - Feature Documentation

This project includes a comprehensive dynamic forms system that allows you to create, manage, and handle form submissions entirely through the Strapi admin panel. This documentation will guide you through creating forms, configuring fields, and integrating them into your website.

### 🎯 Features Overview

- ✅ **Dynamic Form Builder** - Create forms with custom fields through the admin panel
- ✅ **Multiple Field Types** - Support for text, textarea, email, number, select, radio, checkbox, date, and file uploads
- ✅ **Field Validation** - Configure regex patterns, min/max values, and required fields
- ✅ **Multi-language Support** - Forms support i18n localization (English, Urdu, etc.)
- ✅ **Email Notifications** - Automatic email notifications to admins on form submission
- ✅ **PDF Generation** - Generate PDFs from form submissions
- ✅ **Rate Limiting** - Prevent spam with configurable rate limits per IP
- ✅ **File Upload Support** - Handle file attachments in form submissions
- ✅ **Admin Panel Integration** - View and manage all submissions in Strapi admin

---

## 🚀 How to Create a New Form

### Step 1: Access the Forms Section

1. Log in to your Strapi admin panel (usually at `http://localhost:1337/admin`)
2. Navigate to **Content Manager** → **Forms** in the left sidebar
3. Click the **"Create new entry"** button

### Step 2: Basic Form Configuration

Fill in the basic form information:

- **Name** (required): The display name of your form (e.g., "Contact Form", "Admission Form")
- **Slug** (auto-generated): A URL-friendly identifier (e.g., "contact-form", "admission-form")
  - The slug is automatically generated from the name, but you can edit it
  - This slug is used in the API endpoints: `/api/forms/{slug}`
- **Description** (optional): A description of what the form is for
- **Active** (default: true): Toggle to enable/disable the form
- **Success Message** (default: "Thank you for your submission!"): Message shown to users after successful submission

### Step 3: Add Form Fields

Click on the **"Add a field"** button in the Fields section. For each field, configure:

#### Field Configuration Options

1. **Key** (required): A unique identifier for the field (e.g., `firstName`, `email`, `message`)
   - Use camelCase (e.g., `firstName`, `phoneNumber`)
   - This key is used to identify the field in submissions

2. **Label** (required): The display label shown to users (e.g., "First Name", "Email Address")

3. **Type** (required): Choose from the following field types:
   - `text` - Single-line text input
   - `textarea` - Multi-line text input
   - `email` - Email input with validation
   - `number` - Numeric input
   - `select` - Dropdown select menu
   - `radio` - Radio button group
   - `checkbox` - Checkbox input
   - `date` - Date picker
   - `file` - File upload

4. **Required** (default: false): Mark the field as required

5. **Placeholder** (optional): Placeholder text shown in the input field

6. **Help Text** (optional): Additional instructions or help text displayed below the field

7. **Options** (required for select/radio): For `select` and `radio` fields, provide an array of options
   - In the admin panel, enter options as a JSON array: `["Option 1", "Option 2", "Option 3"]`
   - Example: `["Male", "Female"]` or `["Karachi", "Lahore", "Islamabad"]`

8. **Validation** (optional): Add custom validation rules as JSON
   - **Pattern** (regex): Custom regex pattern for validation
   - **Message**: Error message shown when validation fails
   - Example:
     ```json
     {
       "pattern": "^03[0-9]{2}-[0-9]{7}$",
       "message": "Please enter a valid mobile number (03XX-XXXXXXX)"
     }
     ```

9. **Visibility** (default: "public"): 
   - `public` - Field is visible to users
   - `admin-only` - Field is hidden from public but stored in submissions

### Step 4: Configure Form Settings

- **Notification Emails**: Enter email addresses (as JSON array) to receive notifications
  - Example: `["admin@example.com", "manager@example.com"]`
  - Leave empty if you don't want email notifications

- **Send PDF** (default: false): Enable to generate and attach PDF to email notifications

- **Rate Limit Per IP** (default: 10): Maximum number of submissions allowed per IP address per hour

### Step 5: Save and Publish

1. Click **"Save"** to save as draft
2. Click **"Publish"** to make the form active and available via API
3. The form is now accessible at: `GET /api/forms/{your-slug}`

---

## 📝 Field Type Examples

### Text Field
```json
{
  "key": "firstName",
  "label": "First Name",
  "type": "text",
  "required": true,
  "placeholder": "Enter your first name",
  "helpText": "Enter your legal first name"
}
```

### Email Field
```json
{
  "key": "email",
  "label": "Email Address",
  "type": "email",
  "required": true,
  "placeholder": "your.email@example.com"
}
```

### Select Dropdown
```json
{
  "key": "city",
  "label": "City",
  "type": "select",
  "required": true,
  "options": ["Karachi", "Lahore", "Islamabad", "Rawalpindi"]
}
```

### Radio Buttons
```json
{
  "key": "gender",
  "label": "Gender",
  "type": "radio",
  "required": true,
  "options": ["Male", "Female", "Other"]
}
```

### Textarea
```json
{
  "key": "message",
  "label": "Your Message",
  "type": "textarea",
  "required": true,
  "placeholder": "Enter your message here...",
  "helpText": "Please provide as much detail as possible"
}
```

### File Upload
```json
{
  "key": "resume",
  "label": "Upload Resume",
  "type": "file",
  "required": false,
  "helpText": "Accepted formats: PDF, DOC, DOCX (Max 5MB)"
}
```

### Date Field
```json
{
  "key": "dateOfBirth",
  "label": "Date of Birth",
  "type": "date",
  "required": true
}
```

### Number Field with Validation
```json
{
  "key": "age",
  "label": "Age",
  "type": "number",
  "required": true,
  "validation": {
    "min": 18,
    "max": 100,
    "message": "Age must be between 18 and 100"
  }
}
```

### Text Field with Regex Validation
```json
{
  "key": "phoneNumber",
  "label": "Phone Number",
  "type": "text",
  "required": true,
  "placeholder": "03XX-XXXXXXX",
  "validation": {
    "pattern": "^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$",
    "message": "Please enter a valid mobile number (03XX-XXXXXXX)"
  }
}
```

---

## 🌐 How to Add Forms to Your Website/Frontend

### Step 1: Fetch Form Schema

First, retrieve the form schema from the API:

```javascript
// Fetch form schema
const response = await fetch('http://localhost:1337/api/forms/contact-form');
const formSchema = await response.json();

// formSchema contains:
// {
//   id: 1,
//   name: "Contact Form",
//   slug: "contact-form",
//   description: "...",
//   fields: [...],
//   successMessage: "Thank you for your submission!"
// }
```

### Step 2: Render Form Dynamically

Use the schema to render form fields dynamically:

```javascript
function renderForm(formSchema) {
  const form = document.createElement('form');
  form.id = 'dynamic-form';
  
  formSchema.fields.forEach(field => {
    if (field.visibility === 'admin-only') return; // Skip admin-only fields
    
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-field';
    
    // Create label
    const label = document.createElement('label');
    label.textContent = field.label;
    if (field.required) {
      label.innerHTML += ' <span class="required">*</span>';
    }
    fieldContainer.appendChild(label);
    
    // Create input based on type
    let input;
    switch(field.type) {
      case 'textarea':
        input = document.createElement('textarea');
        break;
      case 'select':
        input = document.createElement('select');
        field.options.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option;
          optionEl.textContent = option;
          input.appendChild(optionEl);
        });
        break;
      case 'radio':
        field.options.forEach(option => {
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = field.key;
          radio.value = option;
          radio.id = `${field.key}-${option}`;
          const radioLabel = document.createElement('label');
          radioLabel.htmlFor = radio.id;
          radioLabel.textContent = option;
          fieldContainer.appendChild(radio);
          fieldContainer.appendChild(radioLabel);
        });
        break;
      case 'checkbox':
        input = document.createElement('input');
        input.type = 'checkbox';
        break;
      case 'file':
        input = document.createElement('input');
        input.type = 'file';
        break;
      default:
        input = document.createElement('input');
        input.type = field.type;
    }
    
    if (input) {
      input.name = field.key;
      input.id = field.key;
      input.required = field.required;
      if (field.placeholder) input.placeholder = field.placeholder;
      fieldContainer.appendChild(input);
    }
    
    // Add help text
    if (field.helpText) {
      const helpText = document.createElement('small');
      helpText.className = 'help-text';
      helpText.textContent = field.helpText;
      fieldContainer.appendChild(helpText);
    }
    
    form.appendChild(fieldContainer);
  });
  
  // Add submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';
  form.appendChild(submitBtn);
  
  return form;
}
```

### Step 3: Handle Form Submission

```javascript
document.getElementById('dynamic-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const formSlug = 'contact-form'; // Your form slug
  
  try {
    const response = await fetch(`http://localhost:1337/api/forms/${formSlug}/submit`, {
      method: 'POST',
      body: formData // FormData handles both regular fields and files
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert(result.message || 'Form submitted successfully!');
      e.target.reset();
    } else {
      alert(result.error?.message || 'An error occurred');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit form. Please try again.');
  }
});
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function DynamicForm({ formSlug }) {
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:1337/api/forms/${formSlug}`)
      .then(res => res.json())
      .then(data => setFormSchema(data));
  }, [formSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submitData.append(key, files[key]);
      }
    });

    try {
      const response = await fetch(
        `http://localhost:1337/api/forms/${formSlug}/submit`,
        { method: 'POST', body: submitData }
      );
      const result = await response.json();
      setMessage(result.message || 'Submitted successfully!');
      setFormData({});
      setFiles({});
    } catch (error) {
      setMessage('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  if (!formSchema) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {formSchema.fields
        .filter(f => f.visibility === 'public')
        .map(field => (
          <div key={field.key} className="form-field">
            <label>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            {renderField(field, formData, setFormData, files, setFiles)}
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        ))}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
}
```

---

## 🔄 Reusing Features in a New Website

### Option 1: Use as a Headless CMS

This Strapi instance can serve as a headless CMS for multiple websites:

1. **Deploy Strapi** to a server (e.g., Heroku, AWS, DigitalOcean)
2. **Configure CORS** in `config/middlewares.js` to allow your frontend domains
3. **Use the same API endpoints** from any frontend:
   - `GET /api/forms/{slug}` - Fetch form schema
   - `POST /api/forms/{slug}/submit` - Submit form data

### Option 2: Copy the Form System to Another Strapi Project

To reuse this form system in a new Strapi project:

1. **Copy the API structure**:
   ```
   src/api/form/          → Copy entire folder
   src/api/form-submission/ → Copy entire folder
   src/components/form/    → Copy entire folder
   ```

2. **Copy configuration** (if needed):
   ```
   config/plugins.js      → Check for any form-related plugins
   config/middlewares.js  → Check CORS and other middleware
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install puppeteer nodemailer
   ```

4. **Set up environment variables** (see `FORMS_SETUP.md`):
   ```env
   SMTP_HOST=your-smtp-host.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-password
   SMTP_FROM=your-email@example.com
   ```

5. **Run migrations** (if needed):
   ```bash
   npm run develop
   ```

6. **Create your first form** through the admin panel following the steps above

### Option 3: Use as a Microservice

You can run this Strapi instance as a dedicated forms microservice:

1. Deploy this Strapi instance separately
2. Configure it to handle only form-related requests
3. Connect multiple frontend applications to use the same forms API
4. All form submissions are centralized in one place

---

## 📡 API Reference

### Get Form Schema

**Endpoint:** `GET /api/forms/:slug`

**Query Parameters:**
- `locale` (optional): Language locale (e.g., `en`, `ur`)

**Example:**
```bash
curl http://localhost:1337/api/forms/contact-form
curl http://localhost:1337/api/forms/contact-form?locale=ur
```

**Response:**
```json
{
  "id": 1,
  "name": "Contact Form",
  "slug": "contact-form",
  "description": "Get in touch with us",
  "locale": "en",
  "fields": [
    {
      "key": "name",
      "label": "Your Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your name",
      "helpText": null,
      "options": null,
      "validation": null,
      "visibility": "public"
    }
  ],
  "successMessage": "Thank you for your submission!"
}
```

### Submit Form

**Endpoint:** `POST /api/forms/:slug/submit`

**Content-Type:** `multipart/form-data` (for file uploads) or `application/json`

**Query Parameters:**
- `locale` (optional): Language locale

**Example (JSON):**
```bash
curl -X POST http://localhost:1337/api/forms/contact-form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, this is a test message"
  }'
```

**Example (with files):**
```bash
curl -X POST http://localhost:1337/api/forms/contact-form/submit \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "message=Hello" \
  -F "resume=@/path/to/resume.pdf"
```

**Response (Success):**
```json
{
  "submissionId": 123,
  "message": "Thank you for your submission!"
}
```

**Response (Error):**
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Email is required"
        }
      ]
    }
  }
}
```

---

## 🔧 Environment Setup

See `FORMS_SETUP.md` for detailed environment variable configuration for:
- SMTP email settings
- Server URLs
- Application names

---

## 📚 Additional Resources

- **Form Setup Guide**: See `FORMS_SETUP.md` for detailed setup instructions
- **Seed Scripts**: Check `scripts/` folder for example form creation scripts
- **Strapi Documentation**: [https://docs.strapi.io](https://docs.strapi.io)

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
