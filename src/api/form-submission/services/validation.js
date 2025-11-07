'use strict';

/**
 * validation service
 */

module.exports = ({ strapi }) => ({
  /**
   * Validate form submission against form fields
   */
  async validateSubmission(fields, data, files) {
    const errors = [];

    for (const field of fields) {
      const value = data[field.key];
      const fieldFiles = files?.[field.key] || [];

      // Check required fields
      if (field.required) {
        if (field.type === 'file') {
          if (!fieldFiles || fieldFiles.length === 0) {
            errors.push({
              field: field.key,
              message: `${field.label} is required`,
            });
            continue;
          }
        } else {
          if (value === undefined || value === null || value === '') {
            errors.push({
              field: field.key,
              message: `${field.label} is required`,
            });
            continue;
          }
        }
      }

      // Skip validation if field is empty and not required
      if ((!value || value === '') && field.type !== 'file') {
        continue;
      }

      // Type-specific validation
      switch (field.type) {
        case 'email':
          if (value && !this.validateEmail(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid email address`,
            });
          }
          break;

        case 'number':
          if (value && isNaN(Number(value))) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a number`,
            });
          } else if (value && field.validation) {
            const numValue = Number(value);
            if (field.validation.min !== undefined && numValue < field.validation.min) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at least ${field.validation.min}`,
              });
            }
            if (field.validation.max !== undefined && numValue > field.validation.max) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at most ${field.validation.max}`,
              });
            }
          }
          break;

        case 'select':
        case 'radio':
          if (value && field.options) {
            let validOptions;
            
            // Handle different option structures
            if (Array.isArray(field.options)) {
              // Check if options are objects with 'value' property
              if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0] !== null && 'value' in field.options[0]) {
                // Extract values from objects like [{value: "male", label: "Male"}]
                validOptions = field.options.map(opt => opt.value);
                strapi.log.debug(`[Validation] Field ${field.key}: Options are objects, extracted values:`, validOptions);
              } else {
                // Options are plain strings/values
                validOptions = field.options;
                strapi.log.debug(`[Validation] Field ${field.key}: Options are plain array:`, validOptions);
              }
            } else if (typeof field.options === 'object' && field.options !== null) {
              // Check if options has a 'values' property (e.g., {values: ["Male", "Female"]})
              if ('values' in field.options && Array.isArray(field.options.values)) {
                validOptions = field.options.values;
                strapi.log.debug(`[Validation] Field ${field.key}: Options have 'values' property:`, validOptions);
              } else {
                // Options is an object, get values
                validOptions = Object.values(field.options);
                strapi.log.debug(`[Validation] Field ${field.key}: Options are object, values:`, validOptions);
              }
            } else {
              validOptions = [];
            }
            
            // Convert value to string for comparison (form-data sends strings)
            const stringValue = String(value).trim();
            const stringOptions = validOptions.map(opt => String(opt).trim());
            
            strapi.log.debug(`[Validation] Field ${field.key}: Submitted value="${stringValue}", Valid options:`, stringOptions);
            
            // Case-insensitive comparison for better user experience
            const normalizedValue = stringValue.toLowerCase();
            const normalizedOptions = stringOptions.map(opt => opt.toLowerCase());
            
            if (!normalizedOptions.includes(normalizedValue)) {
              strapi.log.warn(`[Validation] Field ${field.key}: Invalid value "${stringValue}" not in options:`, stringOptions);
              errors.push({
                field: field.key,
                message: `${field.label} has an invalid option`,
              });
            }
          }
          break;

        case 'checkbox':
          // Checkbox can be boolean or array
          if (value !== undefined && typeof value !== 'boolean' && !Array.isArray(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a checkbox value`,
            });
          }
          break;

        case 'date':
          if (value && isNaN(Date.parse(value))) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid date`,
            });
          }
          break;

        case 'text':
        case 'textarea':
          if (value && field.validation) {
            if (field.validation.minLength && value.length < field.validation.minLength) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at least ${field.validation.minLength} characters`,
              });
            }
            if (field.validation.maxLength && value.length > field.validation.maxLength) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at most ${field.validation.maxLength} characters`,
              });
            }
            if (field.validation.regex && !new RegExp(field.validation.regex).test(value)) {
              errors.push({
                field: field.key,
                message: `${field.label} format is invalid`,
              });
            }
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
});

