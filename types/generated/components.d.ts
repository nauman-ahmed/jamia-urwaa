import type { Schema, Struct } from '@strapi/strapi';

export interface FormField extends Struct.ComponentSchema {
  collectionName: 'components_form_fields';
  info: {
    description: 'A field definition for a form';
    displayName: 'Form Field';
  };
  attributes: {
    helpText: Schema.Attribute.String;
    key: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.JSON;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'textarea',
        'email',
        'number',
        'select',
        'radio',
        'checkbox',
        'date',
        'file',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    validation: Schema.Attribute.JSON;
    visibility: Schema.Attribute.Enumeration<['public', 'admin-only']> &
      Schema.Attribute.DefaultTo<'public'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'form.field': FormField;
    }
  }
}
