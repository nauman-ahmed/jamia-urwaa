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

### 📑 Table of Contents

- [Features Overview](#-features-overview)
- [How to Create a New Form - Complete Step-by-Step Guide](#-how-to-create-a-new-form---complete-step-by-step-guide)
  - [Step 1: Access the Forms Section](#step-1-access-the-forms-section)
  - [Step 2: Basic Form Configuration](#step-2-basic-form-configuration)
  - [Step 3: Add Form Fields](#step-3-add-form-fields)
  - [Step 4: Configure Form Settings](#step-4-configure-form-settings)
  - [Step 5: Save and Publish](#step-5-save-and-publish)
  - [Step 6: View and Manage Submissions](#step-6-view-and-manage-submissions)
- [Quick Reference: Creating a Form with New Fields](#-quick-reference-creating-a-form-with-new-fields)
- [Field Type Examples](#-field-type-examples)
- [How to Add Forms to Your Website/Frontend](#-how-to-add-forms-to-your-websitefrontend)
  - [Using the Existing Form Components](#option-1-using-the-existing-form-components-recommended)
  - [Simple React Hook Example](#option-2-simple-react-hook-example)
- [Localization (i18n) Guide](#-localization-i18n-guide)
  - [Setting Up i18n in Strapi](#setting-up-i18n-in-strapi)
  - [Creating Localized Forms](#creating-localized-forms)
  - [Translating Form Content](#translating-form-content)
  - [Using Locales in Frontend](#using-locales-in-frontend)
  - [Best Practices](#best-practices)
- [Reusing Features in a New Website](#-reusing-features-in-a-new-website---complete-guide)
  - [Option 1: Use as a Headless CMS](#option-1-use-as-a-headless-cms-recommended-for-multiple-websites)
  - [Option 2: Copy the Form System to Another Strapi Project](#option-2-copy-the-form-system-to-another-strapi-project)
  - [Option 3: Use as a Microservice](#option-3-use-as-a-microservice)
  - [Option 4: Copy Frontend Components Only](#option-4-copy-frontend-components-only)
- [Complete Example: Adding a Form to a New Page](#-complete-example-adding-a-form-to-a-new-page)
- [Troubleshooting](#-troubleshooting-common-issues)
- [API Reference](#-api-reference)

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

## 🚀 How to Create a New Form - Complete Step-by-Step Guide

This guide will walk you through creating a form from scratch in the Strapi admin panel, adding fields, and integrating it into your website.

### Step 1: Access the Forms Section

1. **Start your Strapi server** (if not already running):
   ```bash
   npm run develop
   # or
   yarn develop
   ```

2. **Log in to Strapi Admin Panel**:
   - Open your browser and navigate to `http://localhost:1337/admin`
   - Enter your admin credentials

3. **Navigate to Forms**:
   - In the left sidebar, click on **Content Manager**
   - Click on **Forms** (under Collection Types)
   - You'll see a list of existing forms (if any)

4. **Create a New Form**:
   - Click the **"Create new entry"** button (top right)
   - You'll see the form creation interface

### Step 2: Basic Form Configuration

Fill in the basic form information in the form editor:

#### Required Fields:

- **Name** (required): The display name of your form
  - Example: `"Contact Form"`, `"Admission Form"`, `"Feedback Form"`
  - This name appears in the admin panel and can be localized

- **Slug** (auto-generated, but editable): A URL-friendly identifier
  - Example: `"contact-form"`, `"admission-form"`, `"feedback-form"`
  - **Important**: The slug is automatically generated from the name, but you can edit it
  - **This slug is used in API endpoints**: `/api/forms/{slug}`
  - Use lowercase letters, numbers, and hyphens only
  - No spaces or special characters

#### Optional Fields:

- **Description** (optional): A description of what the form is for
  - Example: `"Use this form to contact our team"`
  - This can help you remember the form's purpose later

- **Active** (checkbox, default: checked): Toggle to enable/disable the form
  - Uncheck this to temporarily disable the form without deleting it
  - Disabled forms won't be accessible via the API

- **Success Message** (default: "Thank you for your submission!"): 
  - Message shown to users after successful submission
  - Example: `"Your message has been received. We'll get back to you soon!"`
  - This message is returned in the API response after submission

### Step 3: Add Form Fields

This is where you define what fields your form will have. Each field represents an input that users will fill out.

1. **Click "Add a field"** button in the Fields section
2. A new field configuration panel will appear
3. Configure each field with the following options:

#### Field Configuration Options - Detailed Guide

**1. Key** (required): A unique identifier for the field
   - **Format**: Use camelCase (e.g., `firstName`, `email`, `phoneNumber`, `dateOfBirth`)
   - **Rules**: 
     - Must be unique within the form
     - No spaces or special characters (except underscore)
     - This key is used to identify the field in API responses and submissions
   - **Examples**: 
     - ✅ Good: `firstName`, `lastName`, `emailAddress`, `phoneNumber`
     - ❌ Bad: `First Name`, `first-name`, `first name`

**2. Label** (required): The display label shown to users
   - This is what users see next to the input field
   - **Examples**: `"First Name"`, `"Email Address"`, `"Your Message"`, `"Phone Number"`
   - Can be localized (supports multiple languages)

**3. Type** (required): Choose from the following field types:
   - `text` - Single-line text input (for names, addresses, etc.)
   - `textarea` - Multi-line text input (for messages, descriptions)
   - `email` - Email input with automatic email validation
   - `number` - Numeric input (for age, quantity, etc.)
   - `select` - Dropdown select menu (for choosing one option from many)
   - `radio` - Radio button group (for choosing one option from a few)
   - `checkbox` - Checkbox input (for yes/no or agreement fields)
   - `date` - Date picker (for dates of birth, event dates, etc.)
   - `file` - File upload (for documents, images, etc.)

**4. Required** (checkbox, default: unchecked): Mark the field as required
   - When checked, users must fill this field before submitting
   - Required fields are marked with an asterisk (*) in the frontend
   - Backend validation will reject submissions with missing required fields

**5. Placeholder** (optional): Placeholder text shown in the input field
   - Helps guide users on what to enter
   - **Examples**: 
     - `"Enter your first name"`
     - `"your.email@example.com"`
     - `"03XX-XXXXXXX"`
   - Disappears when user starts typing

**6. Help Text** (optional): Additional instructions displayed below the field
   - Provides guidance or additional information
   - **Examples**: 
     - `"Enter your legal first name as it appears on your ID"`
     - `"Accepted formats: PDF, DOC, DOCX (Max 5MB)"`
     - `"We'll never share your email with anyone"`

**7. Options** (required for `select` and `radio` types): Array of available choices
   - **Format**: Enter as a JSON array in the admin panel
   - **How to enter in Strapi admin**: 
     - Click on the Options field
     - Select "JSON" format
     - Enter: `["Option 1", "Option 2", "Option 3"]`
   - **Examples**:
     - Gender: `["Male", "Female", "Other"]`
     - City: `["Karachi", "Lahore", "Islamabad", "Rawalpindi"]`
     - Program: `["Hifz", "Aalim", "Fazil", "Takhassus"]`
   - **Note**: For `select` fields, users see a dropdown. For `radio` fields, users see radio buttons.

**8. Validation** (optional): Custom validation rules as JSON
   - **Format**: Enter as JSON in the admin panel
   - **Available validation options**:
     - `pattern` (string): Regex pattern for validation
     - `message` (string): Error message shown when validation fails
     - `min` (number): Minimum value (for number fields)
     - `max` (number): Maximum value (for number fields)
   - **Example for phone number**:
     ```json
     {
       "pattern": "^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$",
       "message": "Please enter a valid mobile number (03XX-XXXXXXX)"
     }
     ```
   - **Example for age (number field)**:
     ```json
     {
       "min": 18,
       "max": 100,
       "message": "Age must be between 18 and 100"
     }
     ```
   - **How to enter in Strapi admin**:
     - Click on the Validation field
     - Select "JSON" format
     - Paste the JSON object

**9. Visibility** (dropdown, default: "public"): Control field visibility
   - `public` - Field is visible to users and appears in the form
   - `admin-only` - Field is hidden from public view but can be set programmatically
     - Useful for tracking, timestamps, or internal data
     - Still stored in submissions but not shown to users

### Step 4: Configure Form Settings

After adding all your fields, configure the form's behavior:

**Notification Emails** (optional): Email addresses to receive notifications on submission
   - **Format**: Enter as a JSON array
   - **How to enter in Strapi admin**:
     - Click on the Notification Emails field
     - Select "JSON" format
     - Enter: `["admin@example.com", "manager@example.com"]`
   - **Example**: `["admin@jamia-urwaa.com", "admissions@jamia-urwaa.com"]`
   - **Note**: Leave empty if you don't want email notifications
   - Emails are sent automatically when a form is submitted

**Send PDF** (checkbox, default: unchecked): Generate and attach PDF to email notifications
   - When enabled, a PDF version of the submission is generated and attached to notification emails
   - Useful for keeping records or printing submissions
   - PDF includes all form field values in a formatted layout

**Rate Limit Per IP** (number, default: 10): Maximum submissions per IP address per hour
   - Prevents spam and abuse
   - Example: If set to 10, each IP can submit the form 10 times per hour
   - After limit is reached, users will see an error message
   - Set to 0 to disable rate limiting (not recommended for public forms)

### Step 5: Save and Publish

1. **Review your form**: 
   - Check that all fields are configured correctly
   - Verify field keys are unique and in camelCase
   - Ensure required fields are marked appropriately

2. **Save as Draft** (optional):
   - Click **"Save"** button to save without publishing
   - Draft forms are not accessible via API
   - Useful for testing or incomplete forms

3. **Publish the Form**:
   - Click **"Publish"** button to make the form active
   - Published forms are immediately available via API
   - The form is now accessible at: `GET /api/forms/{your-slug}`
   - Example: If your slug is `contact-form`, the API endpoint is `/api/forms/contact-form`

4. **Test the Form**:
   - You can test by fetching the form schema:
     ```bash
     curl http://localhost:1337/api/forms/contact-form
     ```
   - Or visit the form in your frontend application

### Step 6: View and Manage Submissions

After users submit the form:

1. **View Submissions**:
   - Go to **Content Manager** → **Form Submissions**
   - You'll see all submissions for all forms
   - Each submission shows:
     - Form name
     - Submission date
     - All field values
     - Uploaded files (if any)

2. **Filter Submissions**:
   - Use the filter options to find specific submissions
   - Filter by form, date, or field values

3. **Export Data** (if needed):
   - Use Strapi's export features or custom scripts
   - Submissions are stored in the database and can be queried via API

---

## 📋 Quick Reference: Creating a Form with New Fields

This is a quick step-by-step guide for creating a form with custom fields. Use this as a checklist when creating new forms.

### Example: Creating a "Contact Form" from Scratch

**Step 1: Basic Information**
- Name: `Contact Form`
- Slug: `contact-form` (auto-generated, verify it's correct)
- Description: `Get in touch with us`
- Active: ✅ Checked
- Success Message: `Thank you for contacting us! We'll get back to you soon.`

**Step 2: Add Fields**

Click "Add a field" for each field below:

**Field 1: Name**
- Key: `name`
- Label: `Your Name`
- Type: `text`
- Required: ✅ Checked
- Placeholder: `Enter your full name`

**Field 2: Email**
- Key: `email`
- Label: `Email Address`
- Type: `email`
- Required: ✅ Checked
- Placeholder: `your.email@example.com`
- Help Text: `We'll never share your email with anyone`

**Field 3: Phone (with validation)**
- Key: `phone`
- Label: `Phone Number`
- Type: `text`
- Required: ✅ Checked
- Placeholder: `03XX-XXXXXXX`
- Validation (JSON):
  ```json
  {
    "pattern": "^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$",
    "message": "Please enter a valid mobile number (03XX-XXXXXXX)"
  }
  ```

**Field 4: Subject (dropdown)**
- Key: `subject`
- Label: `Subject`
- Type: `select`
- Required: ✅ Checked
- Options (JSON): `["General Inquiry", "Support", "Partnership", "Other"]`

**Field 5: Message**
- Key: `message`
- Label: `Your Message`
- Type: `textarea`
- Required: ✅ Checked
- Placeholder: `Enter your message here...`
- Help Text: `Please provide as much detail as possible`

**Step 3: Configure Settings**
- Notification Emails: `["admin@example.com"]`
- Send PDF: ❌ Unchecked (optional)
- Rate Limit Per IP: `10`

**Step 4: Publish**
- Click "Publish" button
- Form is now available at: `/api/forms/contact-form`

**Step 5: Test**
- Visit your frontend page that uses this form
- Or test via API: `curl http://localhost:1337/api/forms/contact-form`

### Common Field Patterns

Here are some common field configurations you might need:

**Phone Number (Pakistan format)**:
```json
{
  "key": "phoneNumber",
  "label": "Phone Number",
  "type": "text",
  "required": true,
  "placeholder": "03XX-XXXXXXX",
  "validation": {
    "pattern": "^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$",
    "message": "Please enter a valid mobile number"
  }
}
```

**Age (with min/max)**:
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

**Gender Selection (Radio)**:
```json
{
  "key": "gender",
  "label": "Gender",
  "type": "radio",
  "required": true,
  "options": ["Male", "Female", "Other"]
}
```

**City Selection (Dropdown)**:
```json
{
  "key": "city",
  "label": "City",
  "type": "select",
  "required": true,
  "options": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Peshawar"]
}
```

**File Upload (with help text)**:
```json
{
  "key": "resume",
  "label": "Upload Resume",
  "type": "file",
  "required": false,
  "helpText": "Accepted formats: PDF, DOC, DOCX (Max 5MB)"
}
```

**Agreement Checkbox**:
```json
{
  "key": "agreeToTerms",
  "label": "I agree to the terms and conditions",
  "type": "checkbox",
  "required": true,
  "helpText": "You must agree to proceed"
}
```

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

This section explains how to integrate forms created in the admin panel into your website pages. The forms are dynamically rendered based on the schema fetched from the API.

### Understanding the Form Integration Process

1. **Fetch Form Schema**: Get the form definition from Strapi API
2. **Render Form Fields**: Dynamically create form inputs based on the schema
3. **Handle Submission**: Submit form data back to Strapi API
4. **Display Results**: Show success/error messages to users

### Step 1: Fetch Form Schema

First, retrieve the form schema from the API. The schema contains all the field definitions you configured in the admin panel.

**Using Fetch API (Vanilla JavaScript)**:

```javascript
// Fetch form schema
const response = await fetch('http://localhost:1337/api/forms/contact-form');
const formSchema = await response.json();

// formSchema structure:
// {
//   id: 1,
//   name: "Contact Form",
//   slug: "contact-form",
//   description: "Get in touch with us",
//   fields: [
//     {
//       key: "name",
//       label: "Your Name",
//       type: "text",
//       required: true,
//       placeholder: "Enter your name",
//       helpText: null,
//       options: null,
//       validation: null,
//       visibility: "public"
//     },
//     // ... more fields
//   ],
//   successMessage: "Thank you for your submission!"
// }
```

**Using the Provided API Utility (React/Next.js)**:

If you're using the React frontend in this project, use the provided API utility:

```typescript
import { fetchFormSchema } from '@/lib/api';

// In your component
const formSchema = await fetchFormSchema('contact-form', 'en'); // 'en' is optional locale
```

### Step 2: Render Form Dynamically

Use the schema to render form fields dynamically. The form will automatically adapt to whatever fields you configured in the admin panel.

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

### React/Next.js Example - Complete Implementation

This project includes a reusable form component system. Here's how to add a form to a new page:

#### Option 1: Using the Existing Form Components (Recommended)

The project already includes `FormField` component and API utilities. Here's how to create a new form page:

**1. Create a Form Component** (`frontend/src/components/ContactForm.tsx`):

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import FormFieldComponent from './FormField';
import { fetchFormSchema, submitForm, FormSchema, FormField } from '@/lib/api';

interface FormData {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm({ initialLocale = 'en' }: { initialLocale?: string }) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locale] = useState<string>(initialLocale);

  useEffect(() => {
    loadFormSchema();
  }, [locale]);

  const loadFormSchema = async () => {
    try {
      setLoading(true);
      const schema = await fetchFormSchema('contact-form', locale); // Use your form slug
      setFormSchema(schema);
      
      // Initialize form data with empty values
      const initialData: FormData = {};
      schema.fields.forEach((field) => {
        if (field.type === 'checkbox') {
          initialData[field.key] = false;
        } else if (field.type === 'file') {
          initialData[field.key] = null;
        } else {
          initialData[field.key] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    // Clear error for this field
    if (formErrors[fieldKey]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fieldKey]: file,
      }));
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || 'Invalid format';
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'number' && value !== '' && value !== null) {
      const num = Number(value);
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return `Value must be at most ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate all fields
    const errors: FormErrors = {};
    if (formSchema) {
      formSchema.fields.forEach((field) => {
        if (field.visibility === 'public') {
          const value = field.type === 'file' ? files[field.key] : formData[field.key];
          const error = validateField(field, value);
          if (error) {
            errors[field.key] = error;
          }
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      await submitForm('contact-form', formData, files, locale); // Use your form slug
      setSubmitSuccess(true);
      // Reset form
      const initialData: FormData = {};
      formSchema?.fields.forEach((field) => {
        if (field.type === 'checkbox') {
          initialData[field.key] = false;
        } else if (field.type === 'file') {
          initialData[field.key] = null;
        } else {
          initialData[field.key] = '';
        }
      });
      setFormData(initialData);
      setFiles({});
      setFormErrors({});
    } catch (error: any) {
      if (error.details?.errors) {
        const errors: FormErrors = {};
        error.details.errors.forEach((err: { field: string; message: string }) => {
          errors[err.field] = err.message;
        });
        setFormErrors(errors);
      } else {
        setSubmitError(error.message || 'Failed to submit form. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!formSchema) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Form not found. Please check the form slug.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formSchema.name}
        </Typography>
        {formSchema.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {formSchema.description}
          </Typography>
        )}

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {formSchema.successMessage || 'Thank you for your submission!'}
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {formSchema.fields
            .filter((field) => field.visibility === 'public')
            .map((field) => (
              <Box key={field.key} sx={{ mb: 3 }}>
                <FormFieldComponent
                  field={field}
                  value={field.type === 'file' ? files[field.key] : formData[field.key]}
                  onChange={(value) => {
                    if (field.type === 'file') {
                      handleFileChange(field.key, value as File);
                    } else {
                      handleFieldChange(field.key, value);
                    }
                  }}
                  error={formErrors[field.key]}
                  disabled={submitting}
                />
              </Box>
            ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
```

**2. Create a Page** (`frontend/src/app/contact/page.tsx`):

```tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContactForm from '@/components/ContactForm';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const localeFromUrl = searchParams.get('locale') || 'en';
  
  return <ContactForm initialLocale={localeFromUrl} />;
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}
```

**3. Access the Form**:
- Navigate to `http://localhost:3000/contact` (or your frontend URL)
- The form will automatically load and display all fields configured in the admin panel

#### Option 2: Simple React Hook Example

For a simpler implementation without Material-UI:

```jsx
import { useState, useEffect } from 'react';
import { fetchFormSchema, submitForm } from '@/lib/api';

function SimpleForm({ formSlug, locale = 'en' }) {
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFormSchema(formSlug, locale).then(setFormSchema);
  }, [formSlug, locale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await submitForm(formSlug, formData, files, locale);
      setMessage(result.message || 'Submitted successfully!');
      setFormData({});
      setFiles({});
    } catch (error) {
      setMessage(error.message || 'Error submitting form');
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
            {/* Render field based on type */}
            {field.type === 'textarea' ? (
              <textarea
                name={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                required={field.required}
                placeholder={field.placeholder}
              />
            ) : field.type === 'file' ? (
              <input
                type="file"
                name={field.key}
                onChange={(e) => setFiles({...files, [field.key]: e.target.files[0]})}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                name={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                required={field.required}
                placeholder={field.placeholder}
              />
            )}
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

## 🌍 Localization (i18n) Guide

This section provides a complete guide to setting up and using multi-language support (i18n) for your dynamic forms. With i18n enabled, you can create forms in multiple languages (e.g., English, Urdu, Arabic) and serve the appropriate version based on the user's locale.

### Setting Up i18n in Strapi

Before you can use localization with forms, you need to enable and configure the i18n plugin in Strapi.

#### Step 1: Install i18n Plugin (if not already installed)

The i18n plugin is usually included with Strapi by default. To verify or install:

```bash
npm install @strapi/plugin-i18n
# or
yarn add @strapi/plugin-i18n
```

#### Step 2: Configure i18n in Strapi

1. **Enable i18n in Content Types**:
   - Go to **Content-Type Builder** in Strapi admin
   - Click on **Form** content type
   - In the settings, enable **"Enable localization for this Content-Type"**
   - Click **Save**

2. **Configure Available Locales**:
   - Go to **Settings** → **Internationalization** in Strapi admin
   - Click **"Add new locale"** to add languages
   - Common locales:
     - `en` - English
     - `ur` - Urdu
     - `ar` - Arabic
     - `fr` - French
     - etc.
   - Set a default locale (usually `en`)

3. **Verify Configuration**:
   - After enabling i18n, you should see a locale selector in the top-right of the admin panel
   - The Form content type should now show locale options when creating/editing forms

#### Step 3: Enable i18n for Form Fields Component

If you're using a component for form fields (like `field.json`), you may need to enable i18n for that component as well:

1. Go to **Content-Type Builder** → **Components**
2. Find your form field component
3. Enable **"Enable localization for this Component"**
4. Save

### Creating Localized Forms

Once i18n is enabled, you can create different language versions of the same form.

#### Method 1: Create Separate Forms for Each Language

**Step-by-Step:**

1. **Create English Form**:
   - Go to **Content Manager** → **Forms**
   - Click **"Create new entry"**
   - Select locale: **English (en)** (from dropdown in top-right)
   - Fill in form details:
     - Name: `Contact Form`
     - Slug: `contact-form`
     - Description: `Get in touch with us`
   - Add fields with English labels
   - Publish

2. **Create Urdu Form**:
   - Click **"Create new entry"** again
   - Select locale: **Urdu (ur)** (from dropdown)
   - Fill in form details:
     - Name: `رابطہ فارم` (Contact Form in Urdu)
     - Slug: `contact-form` (same slug!)
     - Description: `ہم سے رابطہ کریں` (Get in touch with us)
   - Add fields with Urdu labels
   - Publish

**Important**: Use the **same slug** for all language versions. The API will return the correct version based on the `locale` query parameter.

#### Method 2: Use Strapi's Localization Feature (Recommended)

If you enabled localization for the Form content type:

1. **Create Base Form**:
   - Create a form in the default locale (e.g., English)
   - Fill in all details and fields

2. **Add Translations**:
   - In the form editor, look for a **"Locales"** or **"Add locale"** button
   - Click to add a new locale (e.g., Urdu)
   - Strapi will create a copy linked to the original
   - Translate all fields:
     - Form name
     - Description
     - Field labels
     - Placeholders
     - Help text
     - Success message
     - Options (for select/radio fields)

3. **Publish All Locales**:
   - Make sure to publish each locale version
   - Unpublished locales won't be accessible via API

### Translating Form Content

When creating localized forms, you need to translate all user-facing text. Here's what needs translation:

#### 1. Form-Level Content

- **Name**: The form's display name
  - English: `Contact Form`
  - Urdu: `رابطہ فارم`
  
- **Description**: Form description
  - English: `Get in touch with us`
  - Urdu: `ہم سے رابطہ کریں`
  
- **Success Message**: Message shown after submission
  - English: `Thank you for your submission!`
  - Urdu: `آپ کی جمع کرائی کا شکریہ!`

#### 2. Field-Level Content

For each field, translate:

- **Label**: Field label shown to users
  - English: `Your Name`
  - Urdu: `آپ کا نام`
  
- **Placeholder**: Placeholder text
  - English: `Enter your name`
  - Urdu: `اپنا نام درج کریں`
  
- **Help Text**: Additional instructions
  - English: `Enter your legal first name`
  - Urdu: `اپنا قانونی پہلا نام درج کریں`
  
- **Validation Messages**: Error messages
  - English: `This field is required`
  - Urdu: `یہ فیلڈ ضروری ہے`
  
- **Options** (for select/radio fields): Available choices
  - English: `["Male", "Female", "Other"]`
  - Urdu: `["مرد", "عورت", "دیگر"]`

#### Example: Complete Field Translation

**English Version:**
```json
{
  "key": "firstName",
  "label": "First Name",
  "type": "text",
  "required": true,
  "placeholder": "Enter your first name",
  "helpText": "Enter your legal first name as it appears on your ID"
}
```

**Urdu Version:**
```json
{
  "key": "firstName",
  "label": "پہلا نام",
  "type": "text",
  "required": true,
  "placeholder": "اپنا پہلا نام درج کریں",
  "helpText": "اپنا قانونی پہلا نام درج کریں جیسا کہ آپ کی شناختی کارڈ پر ہے"
}
```

**Important**: Keep the `key` the same across all locales. Only translate user-facing text (labels, placeholders, help text, options).

### Using Locales in Frontend

Once you have localized forms, you can fetch and display the correct version based on the user's language preference.

#### 1. Fetch Form with Locale

**Using API directly:**
```javascript
// Fetch English version
const response = await fetch('http://localhost:1337/api/forms/contact-form?locale=en');
const formSchema = await response.json();

// Fetch Urdu version
const urduResponse = await fetch('http://localhost:1337/api/forms/contact-form?locale=ur');
const urduFormSchema = await urduResponse.json();
```

**Using the provided API utility:**
```typescript
import { fetchFormSchema } from '@/lib/api';

// Fetch with locale
const formSchema = await fetchFormSchema('contact-form', 'en'); // English
const urduFormSchema = await fetchFormSchema('contact-form', 'ur'); // Urdu
```

#### 2. Detect User Locale

You can detect the user's preferred language in several ways:

**From URL parameter:**
```typescript
// In Next.js
import { useSearchParams } from 'next/navigation';

function ContactPage() {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  // Use locale when fetching form
}
```

**From browser language:**
```typescript
function getBrowserLocale(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.languages[0];
  // Map browser language to your supported locales
  if (browserLang.startsWith('ur')) return 'ur';
  if (browserLang.startsWith('ar')) return 'ar';
  return 'en'; // Default
}
```

**From stored preference:**
```typescript
// Store user's language preference in localStorage
const savedLocale = localStorage.getItem('preferredLocale') || 'en';
```

#### 3. Submit Form with Locale

When submitting forms, include the locale parameter:

```typescript
import { submitForm } from '@/lib/api';

// Submit with locale
await submitForm('contact-form', formData, files, 'ur'); // Urdu locale
```

The locale ensures:
- Validation messages are in the correct language
- Email notifications use the correct language
- Submission records include locale information

#### 4. Complete Example: Multi-Language Form Component

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchFormSchema, submitForm } from '@/lib/api';
import FormFieldComponent from './FormField';

export default function LocalizedContactForm() {
  const searchParams = useSearchParams();
  
  // Get locale from URL, browser, or default to 'en'
  const [locale, setLocale] = useState(() => {
    const urlLocale = searchParams.get('locale');
    if (urlLocale) return urlLocale;
    
    // Fallback to browser language
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language;
      if (browserLang.startsWith('ur')) return 'ur';
      if (browserLang.startsWith('ar')) return 'ar';
    }
    
    return 'en';
  });
  
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForm();
  }, [locale]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const schema = await fetchFormSchema('contact-form', locale);
      setFormSchema(schema);
      // Initialize form data...
    } catch (error) {
      console.error('Failed to load form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitForm('contact-form', formData, {}, locale);
      // Show success message...
    } catch (error) {
      // Handle error...
    }
  };

  // Language switcher
  const switchLanguage = (newLocale: string) => {
    setLocale(newLocale);
    // Optionally update URL
    window.history.pushState({}, '', `?locale=${newLocale}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!formSchema) return <div>Form not found</div>;

  return (
    <div>
      {/* Language Switcher */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => switchLanguage('en')}>English</button>
        <button onClick={() => switchLanguage('ur')}>اردو</button>
        <button onClick={() => switchLanguage('ar')}>العربية</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <h1>{formSchema.name}</h1>
        {formSchema.description && <p>{formSchema.description}</p>}
        
        {formSchema.fields
          .filter(f => f.visibility === 'public')
          .map(field => (
            <FormFieldComponent
              key={field.key}
              field={field}
              value={formData[field.key]}
              onChange={(value) => setFormData({...formData, [field.key]: value})}
            />
          ))}
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

### Best Practices

#### 1. Consistent Slug Usage

- ✅ **DO**: Use the same slug for all language versions
  - English: `contact-form` (slug)
  - Urdu: `contact-form` (same slug)
  - Arabic: `contact-form` (same slug)

- ❌ **DON'T**: Use different slugs per language
  - English: `contact-form`
  - Urdu: `رابطہ-فارم` (different slug - wrong!)

#### 2. Consistent Field Keys

- ✅ **DO**: Keep field keys identical across all locales
  - All locales: `firstName`, `email`, `phoneNumber`

- ❌ **DON'T**: Use different keys per language
  - English: `firstName`
  - Urdu: `پہلا_نام` (different key - wrong!)

#### 3. Complete Translations

- Translate **all** user-facing text:
  - Form names and descriptions
  - All field labels
  - Placeholders
  - Help text
  - Success messages
  - Options for select/radio fields
  - Validation error messages (if custom)

#### 4. RTL (Right-to-Left) Support

For languages like Urdu and Arabic:

```css
/* Add RTL support in your CSS */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .form-field {
  text-align: right;
}

[dir="rtl"] input,
[dir="rtl"] textarea,
[dir="rtl"] select {
  text-align: right;
}
```

```tsx
// Set dir attribute based on locale
<div dir={locale === 'ur' || locale === 'ar' ? 'rtl' : 'ltr'}>
  {/* Form content */}
</div>
```

#### 5. Fallback Locale

Always provide a fallback to the default locale:

```typescript
const locale = userLocale || 'en'; // Fallback to English
```

#### 6. Testing

Test each locale version:
- ✅ Verify all text is translated
- ✅ Check form submission works
- ✅ Verify email notifications use correct language
- ✅ Test RTL layout (if applicable)
- ✅ Test validation messages

#### 7. Locale Storage

Consider storing user's language preference:

```typescript
// Save preference
localStorage.setItem('preferredLocale', 'ur');

// Load preference
const savedLocale = localStorage.getItem('preferredLocale') || 'en';
```

### Troubleshooting i18n Issues

**Issue: Form not found for locale**
- ✅ Check that the form is published in that locale
- ✅ Verify the locale code matches exactly (case-sensitive: `en` not `EN`)
- ✅ Ensure i18n is enabled for the Form content type

**Issue: Fields showing in wrong language**
- ✅ Verify you're passing the correct locale parameter
- ✅ Check that all fields are translated in the admin panel
- ✅ Clear browser cache and reload

**Issue: Locale selector not appearing**
- ✅ Verify i18n plugin is installed and enabled
- ✅ Check that localization is enabled for Form content type
- ✅ Restart Strapi server after enabling i18n

**Issue: Validation messages in wrong language**
- ✅ Check that validation messages are translated
- ✅ Verify locale is passed to submit function
- ✅ Check backend locale configuration

---

## 🔄 Reusing Features in a New Website - Complete Guide

This section explains how to reuse the dynamic forms system in a new website or project. There are several approaches depending on your needs.

### Option 1: Use as a Headless CMS (Recommended for Multiple Websites)

This Strapi instance can serve as a headless CMS for multiple websites. This is the best approach if you want to manage forms from one place and use them across multiple frontend applications.

#### Step-by-Step Setup:

**1. Deploy Strapi Backend**:
   - Deploy to a server (Heroku, AWS, DigitalOcean, Railway, etc.)
   - Ensure the server has Node.js and a database (PostgreSQL, MySQL, etc.)
   - Set environment variables (see `FORMS_SETUP.md`)

**2. Configure CORS**:
   - Edit `config/middlewares.js` (or `config/middlewares.ts`)
   - Add your frontend domains to allowed origins:
     ```javascript
     module.exports = [
       'strapi::logger',
       'strapi::errors',
       {
         name: 'strapi::security',
         config: {
           contentSecurityPolicy: {
             useDefaults: true,
             directives: {
               'connect-src': ["'self'", 'https:'],
               'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
               'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
               upgradeInsecureRequests: null,
             },
           },
         },
       },
       {
         name: 'strapi::cors',
         config: {
           enabled: true,
           origin: [
             'http://localhost:3000',
             'https://your-website.com',
             'https://another-website.com',
           ],
           credentials: true,
         },
       },
       'strapi::poweredBy',
       'strapi::query',
       'strapi::body',
       'strapi::session',
       'strapi::favicon',
       'strapi::public',
     ];
     ```

**3. Update Frontend API URL**:
   - In your frontend project, set the API base URL:
     ```typescript
     // frontend/.env.local or frontend/.env
     NEXT_PUBLIC_API_URL=https://your-strapi-backend.com/api
     ```

**4. Use the Same API Endpoints**:
   - All frontends can use the same endpoints:
   - `GET /api/forms/{slug}` - Fetch form schema
   - `POST /api/forms/{slug}/submit` - Submit form data
   - Forms are managed centrally in Strapi admin
   - Submissions are stored in one database

**5. Benefits**:
   - ✅ Single source of truth for all forms
   - ✅ Forms can be updated without deploying frontends
   - ✅ Centralized submission management
   - ✅ Multiple websites can share the same forms
   - ✅ Easy to add new forms or modify existing ones

### Option 2: Copy the Form System to Another Strapi Project

To reuse this form system in a completely new Strapi project (fresh installation):

#### Step-by-Step Migration:

**1. Set Up New Strapi Project**:
   ```bash
   npx create-strapi-app@latest my-new-project
   cd my-new-project
   ```

**2. Copy API Structure**:
   Copy these folders from this project to your new project:
   ```
   src/api/form/                    → Copy entire folder
   src/api/form-submission/          → Copy entire folder
   src/components/form/              → Copy entire folder
   ```

   **File structure to copy**:
   ```
   src/
   ├── api/
   │   ├── form/
   │   │   ├── content-types/
   │   │   │   └── form/
   │   │   │       ├── schema.json
   │   │   │       └── ...
   │   │   └── controllers/
   │   │       └── form.js (or .ts)
   │   └── form-submission/
   │       ├── content-types/
   │       │   └── form-submission/
   │       │       ├── schema.json
   │       │       └── ...
   │       └── controllers/
   │           └── form-submission.js (or .ts)
   └── components/
       └── form/
           └── field.json
   ```

**3. Copy Routes Configuration**:
   - Copy route definitions from `src/api/form/routes/` and `src/api/form-submission/routes/`
   - Ensure routes are properly registered

**4. Install Required Dependencies**:
   ```bash
   npm install puppeteer nodemailer
   # or
   yarn add puppeteer nodemailer
   ```

**5. Set Up Environment Variables**:
   Create or update `.env` file:
   ```env
   # SMTP Configuration for Email Notifications
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   
   # Application URLs
   APP_URL=http://localhost:1337
   FRONTEND_URL=http://localhost:3000
   APP_NAME=Your Application Name
   ```

**6. Configure Plugins** (if using i18n):
   - Ensure `@strapi/plugin-i18n` is installed and configured
   - Forms support multi-language if i18n is enabled

**7. Start Strapi and Run Migrations**:
   ```bash
   npm run develop
   # or
   yarn develop
   ```
   - Strapi will automatically create database tables based on schemas
   - You may need to run migrations if upgrading Strapi versions

**8. Verify Installation**:
   - Log into admin panel
   - Check that "Forms" and "Form Submissions" appear in Content Manager
   - Test creating a form

**9. Copy Frontend Components** (if needed):
   If you want to reuse the frontend components:
   ```
   frontend/src/components/FormField.tsx     → Copy to your frontend
   frontend/src/lib/api.ts                   → Copy API utilities
   ```

### Option 3: Use as a Microservice

Run this Strapi instance as a dedicated forms microservice that multiple applications can use.

#### Architecture:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Website A  │     │  Website B  │     │  Website C  │
│  (Frontend) │     │  (Frontend) │     │  (Frontend)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                  │                    │
       └──────────────────┼────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Forms Service    │
              │  (This Strapi)    │
              │  - Form Schemas   │
              │  - Submissions    │
              │  - Notifications  │
              └──────────────────┘
```

#### Setup Steps:

**1. Deploy Strapi as Microservice**:
   - Deploy to a dedicated server
   - Use a subdomain like `forms.yourcompany.com`
   - Configure for high availability if needed

**2. Configure CORS for All Frontends**:
   ```javascript
   // config/middlewares.js
   {
     name: 'strapi::cors',
     config: {
       enabled: true,
       origin: [
         'https://website-a.com',
         'https://website-b.com',
         'https://website-c.com',
       ],
       credentials: true,
     },
   }
   ```

**3. Set Up API Gateway** (Optional):
   - Use an API gateway for rate limiting, authentication, etc.
   - Examples: Kong, AWS API Gateway, Nginx

**4. Benefits**:
   - ✅ Centralized form management
   - ✅ Single database for all submissions
   - ✅ Consistent form behavior across sites
   - ✅ Easy to scale independently
   - ✅ Can add authentication/authorization at service level

### Option 4: Copy Frontend Components Only

If you already have a Strapi backend with forms, you can just copy the frontend components.

#### Steps:

**1. Copy Form Components**:
   ```
   frontend/src/components/FormField.tsx  → Your frontend project
   ```

**2. Copy API Utilities**:
   ```
   frontend/src/lib/api.ts  → Your frontend project
   ```
   - Update `API_BASE_URL` to point to your Strapi instance

**3. Install Dependencies** (if using Material-UI):
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

**4. Use the Components**:
   - Follow the examples in "How to Add Forms to Your Website/Frontend" section
   - Create form pages using the provided components

### Comparison of Options

| Option | Best For | Complexity | Maintenance |
|--------|----------|------------|-------------|
| **Headless CMS** | Multiple websites, centralized management | Low | Low |
| **Copy to New Project** | Fresh start, complete control | Medium | Medium |
| **Microservice** | Large scale, multiple teams | High | Medium |
| **Frontend Only** | Existing Strapi backend | Low | Low |

### Testing After Migration

After setting up forms in a new project:

1. **Create a Test Form**:
   - Use the admin panel to create a simple form
   - Add 2-3 fields (text, email, textarea)

2. **Test API Endpoints**:
   ```bash
   # Fetch form schema
   curl http://localhost:1337/api/forms/test-form
   
   # Submit form
   curl -X POST http://localhost:1337/api/forms/test-form/submit \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
   ```

3. **Test Frontend Integration**:
   - Create a test page with the form
   - Verify fields render correctly
   - Submit and check for success message
   - Verify submission appears in admin panel

4. **Check Email Notifications** (if configured):
   - Submit a form
   - Verify email is received
   - Check PDF attachment (if enabled)

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

## 🎯 Complete Example: Adding a Form to a New Page

This is a complete walkthrough of creating a form and adding it to a page.

### Scenario: Create a "Newsletter Signup" Form

**Part 1: Create Form in Admin Panel**

1. Go to Content Manager → Forms → Create new entry
2. Fill in:
   - Name: `Newsletter Signup`
   - Slug: `newsletter-signup`
   - Description: `Subscribe to our newsletter`
   - Success Message: `Thank you for subscribing!`
3. Add fields:
   - Email (required, type: email)
   - Name (optional, type: text)
   - Interests (optional, type: select, options: `["News", "Events", "Updates"]`)
4. Configure:
   - Notification Emails: `["newsletter@example.com"]`
5. Click "Publish"

**Part 2: Create Frontend Component**

Create `frontend/src/components/NewsletterForm.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchFormSchema, submitForm } from '@/lib/api';
import FormFieldComponent from './FormField';
// ... (use the ContactForm example as a template, but change formSlug to 'newsletter-signup')
```

**Part 3: Create Page**

Create `frontend/src/app/newsletter/page.tsx`:

```tsx
'use client';
import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterPage() {
  return <NewsletterForm />;
}
```

**Part 4: Test**

1. Start frontend: `npm run dev` (in frontend folder)
2. Visit: `http://localhost:3000/newsletter`
3. Fill and submit the form
4. Check admin panel → Form Submissions to see the submission

### Troubleshooting Common Issues

**Issue: Form not loading**
- ✅ Check form slug matches exactly (case-sensitive)
- ✅ Verify form is published (not draft)
- ✅ Check API URL is correct in `.env`
- ✅ Verify CORS is configured if using different domains

**Issue: Fields not displaying**
- ✅ Check field visibility is set to "public" (not "admin-only")
- ✅ Verify field keys are unique and in camelCase
- ✅ Check browser console for errors

**Issue: Submission failing**
- ✅ Check all required fields are filled
- ✅ Verify validation rules (regex patterns, min/max)
- ✅ Check file size limits for file uploads
- ✅ Verify rate limiting hasn't been exceeded
- ✅ Check server logs for detailed error messages

**Issue: Email notifications not sending**
- ✅ Verify SMTP settings in `.env`
- ✅ Check notification emails are configured in form settings
- ✅ Test SMTP connection separately
- ✅ Check spam folder

## 📚 Additional Resources

- **Form Setup Guide**: See `FORMS_SETUP.md` for detailed setup instructions
- **Seed Scripts**: Check `scripts/` folder for example form creation scripts
- **Strapi Documentation**: [https://docs.strapi.io](https://docs.strapi.io)
- **API Reference**: See "📡 API Reference" section above for endpoint details

## 🔍 Quick Troubleshooting Checklist

When creating or using forms, check:

- [ ] Form is published (not draft)
- [ ] Form slug is correct and matches API call
- [ ] All required fields are marked correctly
- [ ] Field keys are unique and in camelCase
- [ ] Options are provided for select/radio fields
- [ ] Validation JSON is properly formatted
- [ ] CORS is configured for your frontend domain
- [ ] API URL is correct in frontend environment variables
- [ ] SMTP is configured if using email notifications
- [ ] Rate limiting allows your testing

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
