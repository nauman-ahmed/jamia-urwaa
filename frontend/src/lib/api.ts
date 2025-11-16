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

  console.log(responseData);
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

// Event types and API functions

export interface EventCover {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface Event {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  location?: string;
  slug: string;
  cover?: EventCover;
  locale?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsResponse {
  data: Event[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch events with optional filters
 */
export async function fetchEvents(
  options?: {
    locale?: string;
    upcoming?: boolean;
    date_from?: string;
    date_to?: string;
  }
): Promise<Event[]> {
  try {
    // Ensure API_BASE_URL is properly set
    const baseUrl = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api')
      : API_BASE_URL;
    
    const url = new URL(`${baseUrl}/events`);
    
    if (options?.locale) {
      url.searchParams.append('locale', options.locale);
    }
    if (options?.upcoming) {
      url.searchParams.append('upcoming', 'true');
    }
    if (options?.date_from) {
      url.searchParams.append('date_from', options.date_from);
    }
    if (options?.date_to) {
      url.searchParams.append('date_to', options.date_to);
    }

    console.log('Fetching events from:', url.toString());

    const response = await fetch(url.toString(), {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      console.error('API URL:', url.toString());
      console.error('Response status:', response.status);
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Handle both Strapi response format (data wrapper) and direct array
    return Array.isArray(result) ? result : (result.data || []);
  } catch (error) {
    console.error('Fetch events error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API. Please check if the backend server is running at http://localhost:1337');
    }
    throw error;
  }
}

// Elasticsearch types and functions

export interface ElasticsearchHit {
  _id: string;
  _score: number;
  _source: {
    contentType: string;
    id: number;
    title: string;
    slug: string;
    locale: string;
  };
}

export interface ElasticsearchResponse {
  took: number;
  timed_out: boolean;
  hits: {
    total: number | { value: number; relation?: string };
    max_score: number;
    hits: ElasticsearchHit[];
  };
}

/**
 * Search events using Elasticsearch
 */
export async function searchEvents(
  searchQuery: string,
  locale: string = 'en'
): Promise<ElasticsearchResponse> {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api')
      : API_BASE_URL;
    
    const url = new URL(`${baseUrl}/elasticsearch/search`);
    url.searchParams.append('locale', locale);

    // Build Elasticsearch query - search in title field
    const esQuery = {
      bool: {
        should: [
          {
            match: {
              title: {
                query: searchQuery,
                fuzziness: 'AUTO',
              },
            },
          },
          {
            match_phrase_prefix: {
              title: {
                query: searchQuery,
              },
            },
          },
        ],
        minimum_should_match: 1,
      },
    };

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: esQuery }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Elasticsearch API Error:', errorText);
      throw new Error(`Failed to search events: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the search API. Please check if the backend server is running.');
    }
    throw error;
  }
}

