'use client';

import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import { FormField as FormFieldType } from '@/lib/api';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export default function FormFieldComponent({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field.type === 'checkbox') {
      onChange((event.target as HTMLInputElement).checked);
    } else if (field.type === 'number') {
      onChange(event.target.value ? Number(event.target.value) : '');
    } else {
      onChange(event.target.value);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  // Render help text
  const renderHelpText = () => {
    if (field.helpText) {
      return (
        <FormHelperText sx={{ mt: 0.5 }}>
          {field.helpText}
        </FormHelperText>
      );
    }
    return null;
  };

  // Render error text
  const renderError = () => {
    if (error) {
      return (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {error}
        </FormHelperText>
      );
    }
    return null;
  };

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <TextField
          fullWidth
          label={field.label}
          type={field.type}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          error={!!error}
          disabled={disabled}
          helperText={error || field.helpText}
          variant="outlined"
        />
      );

    case 'textarea':
      return (
        <TextField
          fullWidth
          label={field.label}
          multiline
          rows={4}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          error={!!error}
          disabled={disabled}
          helperText={error || field.helpText}
          variant="outlined"
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          label={field.label}
          type="number"
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          error={!!error}
          disabled={disabled}
          helperText={error || field.helpText}
          inputProps={{
            min: field.validation?.min,
            max: field.validation?.max,
          }}
          variant="outlined"
        />
      );

    case 'date':
      return (
        <TextField
          fullWidth
          label={field.label}
          type="date"
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={!!error}
          disabled={disabled}
          helperText={error || field.helpText}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      );

    case 'select':
      return (
        <FormControl fullWidth required={field.required} error={!!error}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            label={field.label}
            disabled={disabled}
          >
            {field.options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {renderError()}
          {!error && renderHelpText()}
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl component="fieldset" required={field.required} error={!!error} fullWidth>
          <FormLabel component="legend">{field.label}</FormLabel>
          <RadioGroup
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            row
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio disabled={disabled} />}
                label={option}
              />
            ))}
          </RadioGroup>
          {renderError()}
          {!error && renderHelpText()}
        </FormControl>
      );

    case 'checkbox':
      return (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={handleChange}
                disabled={disabled}
                required={field.required}
              />
            }
            label={
              <Box>
                <Typography variant="body1">{field.label}</Typography>
                {field.helpText && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {field.helpText}
                  </Typography>
                )}
              </Box>
            }
          />
          {error && (
            <FormHelperText error sx={{ ml: 4 }}>
              {error}
            </FormHelperText>
          )}
        </Box>
      );

    case 'file':
      return (
        <FormControl fullWidth required={field.required} error={!!error}>
          <Box>
            <Typography variant="body2" gutterBottom>
              {field.label}
              {field.required && ' *'}
            </Typography>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
              accept={
                field.helpText?.includes('PDF')
                  ? '.pdf,.jpg,.jpeg,.png'
                  : field.helpText?.includes('JPG') || field.helpText?.includes('PNG')
                  ? '.jpg,.jpeg,.png'
                  : undefined
              }
              style={{
                width: '100%',
                padding: '8px',
                border: error ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
            {value && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Selected: {(value as File).name}
              </Typography>
            )}
            {renderError()}
            {!error && renderHelpText()}
          </Box>
        </FormControl>
      );

    default:
      return (
        <TextField
          fullWidth
          label={field.label}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          error={!!error}
          disabled={disabled}
          helperText={error || field.helpText}
          variant="outlined"
        />
      );
  }
}

