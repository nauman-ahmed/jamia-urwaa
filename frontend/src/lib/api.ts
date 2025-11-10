// API utility functions for form operations

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  options?: string[];
  required?: boolean;
  validation?: {
    pattern?: string;
    message?: string;
    min?: number;
    max?: number;
  };
  placeholder?: string;
  helpText?: string;
  visibility?: 'public' | 'admin-only';
}

export interface FormSchema {
  id: number;
  name: string;
  slug: string;
  description?: string;
  locale?: string;
  fields: FormField[];
  successMessage?: string;
}

export interface FormSubmissionResponse {
  submissionId: number;
  message: string;
}

export interface FormSubmissionError {
  status: number;
  name: string;
  message: string;
  details?: {
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Fetch form schema by slug
 */
export async function fetchFormSchema(slug: string, locale?: string): Promise<FormSchema> {
  const url = new URL(`${API_BASE_URL}/forms/${slug}`);
  if (locale) {
    url.searchParams.append('locale', locale);
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Form not found');
    }
    throw new Error(`Failed to fetch form: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit form data
 */
export async function submitForm(
  slug: string,
  data: Record<string, any>,
  files: Record<string, File>,
  locale?: string
): Promise<FormSubmissionResponse> {
  const formData = new FormData();
  
  // Add form data
  formData.append('data', JSON.stringify(data));
  
  // Add files
  Object.entries(files).forEach(([key, file]) => {
    formData.append(key, file);
  });

  const url = new URL(`${API_BASE_URL}/forms/${slug}/submit`);
  if (locale) {
    url.searchParams.append('locale', locale);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error: FormSubmissionError = responseData.error || {
      status: response.status,
      name: 'SubmissionError',
      message: responseData.message || 'Failed to submit form',
    };
    throw error;
  }

  return responseData;
}

