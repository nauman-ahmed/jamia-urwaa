# Jamia Urwaa Frontend

Next.js frontend application for Jamia Urwaa admission forms.

## Features

- Material UI components for a modern, clean interface
- Dynamic form rendering based on Strapi form schema
- Multi-step form with section navigation
- File upload support
- Form validation
- Responsive design

## Getting Started

### Prerequisites

- Node.js >= 20.9.0 (required for Next.js 16)
- npm or yarn
- Strapi backend running (default: http://localhost:1337)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Accessing the Admission Form

Navigate to `/admission` to view and submit the admission form:
- http://localhost:3000/admission

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admission/    # Admission form page
│   │   └── layout.tsx     # Root layout with theme
│   ├── components/       # React components
│   │   ├── AdmissionForm.tsx    # Main admission form component
│   │   ├── FormField.tsx         # Dynamic form field component
│   │   └── ThemeProvider.tsx    # Material UI theme provider
│   ├── lib/              # Utility functions
│   │   └── api.ts        # API client for Strapi
│   └── theme.ts          # Material UI theme configuration
└── package.json
```

## Form Features

The admission form includes all fields from the Strapi backend:

### Sections:
1. **Student Information** - Personal details, contact info, photo
2. **Family Information** - Family details, income, guardian info
3. **Educational Background** - Previous education, certificates
4. **Program Selection** - Program choice, class, hostel requirement
5. **Documents** - Required document uploads
6. **Additional Information** - Motivation, scholarship, declaration

### Field Types Supported:
- Text inputs
- Email inputs
- Number inputs
- Date pickers
- Textareas
- Select dropdowns
- Radio buttons
- Checkboxes
- File uploads

## API Integration

The frontend communicates with the Strapi backend through:

- `GET /api/forms/{slug}` - Fetch form schema
- `POST /api/forms/{slug}/submit` - Submit form data

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Strapi API base URL (default: http://localhost:1337/api)

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The form dynamically loads fields from the Strapi backend
- All validation rules are enforced both client-side and server-side
- File uploads are handled via FormData
- The form uses a multi-step stepper for better UX
