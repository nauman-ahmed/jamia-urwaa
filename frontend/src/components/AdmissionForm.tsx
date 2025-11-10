'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import FormFieldComponent from './FormField';
import { fetchFormSchema, submitForm, FormSchema, FormField } from '@/lib/api';

interface FormData {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

// Organize fields into sections based on the seed file structure
// Maps field keys to their section names
const FIELD_SECTIONS: { [key: string]: string } = {
  // Student Information
  firstName: 'Student Information',
  lastName: 'Student Information',
  fathersName: 'Student Information',
  dateOfBirth: 'Student Information',
  cnicBForm: 'Student Information',
  gender: 'Student Information',
  mobileNumber: 'Student Information',
  emailAddress: 'Student Information',
  currentAddress: 'Student Information',
  city: 'Student Information',
  studentPhoto: 'Student Information',
  // Family Information
  fathersOccupation: 'Family Information',
  fathersContactNumber: 'Family Information',
  monthlyIncome: 'Family Information',
  guardianName: 'Family Information',
  guardianContact: 'Family Information',
  // Educational Background
  lastSchoolMadrasa: 'Educational Background',
  classGradeCompleted: 'Educational Background',
  yearCompleted: 'Educational Background',
  percentageGrades: 'Educational Background',
  hifzStatus: 'Educational Background',
  previousCertificate: 'Educational Background',
  // Program Selection
  programApplyingFor: 'Program Selection',
  classYearApplyingFor: 'Program Selection',
  hostelRequired: 'Program Selection',
  // Documents
  cnicBFormCopy: 'Documents',
  educationalCertificate: 'Documents',
  fathersCNIC: 'Documents',
  // Additional Information
  whyJoin: 'Additional Information',
  scholarshipRequired: 'Additional Information',
  declaration: 'Additional Information',
  parentGuardianSignature: 'Additional Information',
};

interface AdmissionFormProps {
  initialLocale?: string;
}

export default function AdmissionForm({ initialLocale = 'en' }: AdmissionFormProps) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [locale, setLocale] = useState<string>(initialLocale);

  useEffect(() => {
    loadFormSchema();
  }, [locale]);

  const loadFormSchema = async () => {
    try {
      setLoading(true);
      const schema = await fetchFormSchema('admission-form', locale);
      console.log(schema);
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
    // Clear error for this field when user starts typing
    if (formErrors[fieldKey]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    // Required field validation
    if (field.required) {
      if (field.type === 'checkbox' && !value) {
        return `${field.label} is required`;
      }
      if (field.type === 'file' && !value) {
        return `${field.label} is required`;
      }
      if (field.type !== 'checkbox' && field.type !== 'file' && (!value || value === '')) {
        return `${field.label} is required`;
      }
    }

    // Pattern validation
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(String(value))) {
        return field.validation.message || `Invalid ${field.label}`;
      }
    }

    // Min/Max validation for numbers
    if (field.type === 'number' && value !== '' && value !== null) {
      const numValue = Number(value);
      if (field.validation?.min !== undefined && numValue < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation?.max !== undefined && numValue > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max}`;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    if (!formSchema) return false;

    const errors: FormErrors = {};
    let isValid = true;

    formSchema.fields.forEach((field) => {
      if (field.visibility === 'admin-only') return;

      const value = formData[field.key];
      const error = validateField(field, value);

      if (error) {
        errors[field.key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!formSchema) return;

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form before submitting.');
      return;
    }

    try {
      setSubmitting(true);

      // Separate files from regular data
      const files: Record<string, File> = {};
      const data: Record<string, any> = {};

      formSchema.fields.forEach((field) => {
        if (field.visibility === 'admin-only') return;

        const value = formData[field.key];
        if (field.type === 'file' && value) {
          files[field.key] = value as File;
        } else {
          data[field.key] = value;
        }
      });

      const response = await submitForm('admission-form', data, files, locale);
      setSubmitSuccess(true);
      setFormData({});
      
      // Reset form after successful submission
      setTimeout(() => {
        loadFormSchema();
        setSubmitSuccess(false);
        setActiveStep(0);
      }, 3000);
    } catch (error: any) {
      if (error.details?.errors) {
        const errors: FormErrors = {};
        error.details.errors.forEach((err: { field: string; message: string }) => {
          errors[err.field] = err.message;
        });
        setFormErrors(errors);
        setSubmitError('Please fix the errors in the form.');
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
        <Alert severity="error">
          {submitError || 'Failed to load form. Please refresh the page.'}
        </Alert>
      </Container>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {formSchema.successMessage || 'Thank you for your submission!'}
          </Alert>
          <Typography variant="body1" color="text.secondary">
            We will review your application and contact you soon.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Group fields by sections for better organization
  const sections: { [key: string]: FormField[] } = {};

  formSchema.fields.forEach((field) => {
    if (field.visibility === 'admin-only') return;

    // Get section name for this field, default to 'Additional Information' if not found
    const sectionName = FIELD_SECTIONS[field.key] || 'Additional Information';

    if (!sections[sectionName]) {
      sections[sectionName] = [];
    }
    sections[sectionName].push(field);
  });

  const sectionNames = Object.keys(sections);
  const steps = sectionNames.map((name) => name);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {formSchema.name}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={locale}
              label="Language"
              onChange={(e) => {
                setLocale(e.target.value);
                setActiveStep(0);
                setFormErrors({});
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ur">Urdu</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {formSchema.description && (
          <Typography variant="body1" color="text.secondary" align="left" sx={{ mb: 4 }}>
            {formSchema.description}
          </Typography>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {sectionNames.map((sectionName, sectionIndex) => (
            <Box
              key={sectionName}
              sx={{ display: activeStep === sectionIndex ? 'block' : 'none' }}
            >
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, mb: 3 }}>
                {sectionName}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {sections[sectionName].map((field) => (
                <Box key={field.key} sx={{ mb: 3 }}>
                  <FormFieldComponent
                    field={field}
                    value={formData[field.key]}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    error={formErrors[field.key]}
                    disabled={submitting}
                  />
                </Box>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0 || submitting}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    disabled={submitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    size="large"
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </form>
      </Paper>
    </Container>
  );
}

