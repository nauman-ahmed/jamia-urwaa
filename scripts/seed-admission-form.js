'use strict';

/**
 * Seed script to create the Admission Form with all required fields
 * Run with: node scripts/seed-admission-form.js
 * Or via Strapi CLI: strapi scripts:seed-admission-form
 */

module.exports = async ({ strapi }) => {
  const formName = 'Admission Form';
  const formSlug = 'admission-form';

  try {
    // Check if form already exists
    const existingForm = await strapi.db.query('api::form.form').findOne({
      where: { slug: formSlug },
    });

    if (existingForm) {
      console.log(`Form "${formName}" already exists. Updating...`);
      
      // Update existing form with new fields
      const fields = getFormFields();
      
      await strapi.entityService.update('api::form.form', existingForm.id, {
        data: {
          name: formName,
          description: 'Comprehensive admission form for Jamia Urwaa with student, family, educational, and program information',
          fields: fields,
          active: true,
          successMessage: 'Thank you for your admission application! We will review your submission and contact you soon.',
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Form "${formName}" updated successfully with ${fields.length} fields!`);
      return;
    }

    // Create new form
    const fields = getFormFields();

    const form = await strapi.entityService.create('api::form.form', {
      data: {
        name: formName,
        slug: formSlug,
        description: 'Comprehensive admission form for Jamia Urwaa with student, family, educational, and program information',
        fields: fields,
        active: true,
        successMessage: 'Thank you for your admission application! We will review your submission and contact you soon.',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Form "${formName}" created successfully with ${fields.length} fields!`);
    console.log(`   Slug: ${formSlug}`);
    console.log(`   Access via: GET /api/forms/${formSlug}`);
    
  } catch (error) {
    console.error('❌ Error creating form:', error);
    throw error;
  }
};

/**
 * Get all form fields organized by sections
 */
function getFormFields() {
  return [
    // ==================== SECTION 1: Student Information ====================
    {
      key: 'fullNameEnglish',
      label: 'Full Name (English)',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name in English',
      visibility: 'public',
    },
    {
      key: 'fullNameUrdu',
      label: 'Full Name (Urdu)',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name in Urdu',
      visibility: 'public',
    },
    {
      key: 'fathersName',
      label: "Father's Name",
      type: 'text',
      required: true,
      placeholder: "Enter your father's full name",
      visibility: 'public',
    },
    {
      key: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      visibility: 'public',
    },
    {
      key: 'cnicBForm',
      label: 'CNIC / B-Form Number',
      type: 'text',
      required: true,
      placeholder: 'Enter CNIC or B-Form number',
      validation: {
        pattern: '^[0-9]{5}-[0-9]{7}-[0-9]{1}$|^[0-9]{13}$',
        message: 'Please enter a valid CNIC (XXXXX-XXXXXXX-X) or B-Form number',
      },
      visibility: 'public',
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: ['Male', 'Female'],
      visibility: 'public',
    },
    {
      key: 'mobileNumber',
      label: 'Mobile Number',
      type: 'text',
      required: true,
      placeholder: '03XX-XXXXXXX',
      validation: {
        pattern: '^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$',
        message: 'Please enter a valid mobile number (03XX-XXXXXXX)',
      },
      visibility: 'public',
    },
    {
      key: 'emailAddress',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@example.com',
      visibility: 'public',
    },
    {
      key: 'currentAddress',
      label: 'Current Address',
      type: 'textarea',
      required: true,
      placeholder: 'Enter your complete current address',
      visibility: 'public',
    },
    {
      key: 'city',
      label: 'City',
      type: 'select',
      required: true,
      options: [
        'Karachi',
        'Lahore',
        'Islamabad',
        'Rawalpindi',
        'Faisalabad',
        'Multan',
        'Hyderabad',
        'Gujranwala',
        'Peshawar',
        'Quetta',
        'Sialkot',
        'Bahawalpur',
        'Sargodha',
        'Sukkur',
        'Larkana',
        'Sheikhupura',
        'Rahim Yar Khan',
        'Jhang',
        'Gujrat',
        'Kasur',
        'Other',
      ],
      visibility: 'public',
    },
    {
      key: 'studentPhoto',
      label: 'Student Photo',
      type: 'file',
      required: true,
      helpText: 'Upload a recent passport-size photograph (JPG/PNG, max 5MB)',
      visibility: 'public',
    },

    // ==================== SECTION 2: Family Information ====================
    {
      key: 'fathersOccupation',
      label: "Father's Occupation",
      type: 'text',
      required: true,
      placeholder: "Enter your father's occupation",
      visibility: 'public',
    },
    {
      key: 'fathersContactNumber',
      label: "Father's Contact Number",
      type: 'text',
      required: true,
      placeholder: '03XX-XXXXXXX',
      validation: {
        pattern: '^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$',
        message: 'Please enter a valid mobile number (03XX-XXXXXXX)',
      },
      visibility: 'public',
    },
    {
      key: 'monthlyIncome',
      label: 'Monthly Income',
      type: 'select',
      required: true,
      options: [
        'Less than PKR 20,000',
        'PKR 20,000 - PKR 50,000',
        'PKR 50,000 - PKR 100,000',
        'PKR 100,000 - PKR 200,000',
        'PKR 200,000 - PKR 500,000',
        'More than PKR 500,000',
        'Prefer not to say',
      ],
      visibility: 'public',
    },
    {
      key: 'guardianName',
      label: 'Guardian Name (if applicable)',
      type: 'text',
      required: false,
      placeholder: 'Enter guardian name if different from father',
      helpText: 'Only required if guardian is different from father',
      visibility: 'public',
    },
    {
      key: 'guardianContact',
      label: 'Guardian Contact',
      type: 'text',
      required: false,
      placeholder: '03XX-XXXXXXX',
      validation: {
        pattern: '^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$',
        message: 'Please enter a valid mobile number (03XX-XXXXXXX)',
      },
      helpText: 'Only required if guardian is different from father',
      visibility: 'public',
    },

    // ==================== SECTION 3: Educational Background ====================
    {
      key: 'lastSchoolMadrasa',
      label: 'Last School / Madrasa Name',
      type: 'text',
      required: true,
      placeholder: 'Enter the name of your last school or madrasa',
      visibility: 'public',
    },
    {
      key: 'classGradeCompleted',
      label: 'Class / Grade Completed',
      type: 'text',
      required: true,
      placeholder: 'e.g., 10th, Matric, Intermediate, etc.',
      visibility: 'public',
    },
    {
      key: 'yearCompleted',
      label: 'Year Completed',
      type: 'number',
      required: true,
      placeholder: 'YYYY',
      validation: {
        min: 1990,
        max: new Date().getFullYear(),
        message: `Please enter a valid year between 1990 and ${new Date().getFullYear()}`,
      },
      visibility: 'public',
    },
    {
      key: 'percentageGrades',
      label: 'Percentage / Grades',
      type: 'text',
      required: true,
      placeholder: 'e.g., 85%, A+, First Division, etc.',
      visibility: 'public',
    },
    {
      key: 'hifzStatus',
      label: 'Hifz Status',
      type: 'select',
      required: true,
      options: ['Complete', 'In Progress', 'None'],
      visibility: 'public',
    },
    {
      key: 'previousCertificate',
      label: 'Previous Certificate Upload',
      type: 'file',
      required: true,
      helpText: 'Upload a scanned copy of your last educational certificate (PDF/JPG/PNG, max 10MB)',
      visibility: 'public',
    },

    // ==================== SECTION 4: Program Selection ====================
    {
      key: 'programApplyingFor',
      label: 'Program Applying For',
      type: 'select',
      required: true,
      options: [
        'Hifz',
        'Aalim',
        'Dars-e-Nizami',
        'Nazira',
        'Tajweed',
        'Arabic Language',
        'Islamic Studies',
        'Other',
      ],
      visibility: 'public',
    },
    {
      key: 'classYearApplyingFor',
      label: 'Class / Year Applying For',
      type: 'text',
      required: true,
      placeholder: 'e.g., First Year, Second Year, Beginner, etc.',
      visibility: 'public',
    },
    {
      key: 'hostelRequired',
      label: 'Hostel Required',
      type: 'select',
      required: true,
      options: ['Yes', 'No'],
      visibility: 'public',
    },

    // ==================== SECTION 5: Documents (File Uploads) ====================
    {
      key: 'cnicBFormCopy',
      label: 'CNIC / B-Form Copy',
      type: 'file',
      required: true,
      helpText: 'Upload a scanned copy of your CNIC or B-Form (PDF/JPG/PNG, max 10MB)',
      visibility: 'public',
    },
    {
      key: 'educationalCertificate',
      label: 'Educational Certificate',
      type: 'file',
      required: true,
      helpText: 'Upload a scanned copy of your educational certificate (PDF/JPG/PNG, max 10MB)',
      visibility: 'public',
    },
    {
      key: 'fathersCNIC',
      label: "Father's CNIC",
      type: 'file',
      required: true,
      helpText: 'Upload a scanned copy of your father\'s CNIC (PDF/JPG/PNG, max 10MB)',
      visibility: 'public',
    },

    // ==================== SECTION 6: Additional ====================
    {
      key: 'whyJoin',
      label: 'Why do you want to join?',
      type: 'textarea',
      required: true,
      placeholder: 'Please explain your motivation for joining Jamia Urwaa...',
      helpText: 'Please provide a brief statement about why you want to join this institution',
      visibility: 'public',
    },
    {
      key: 'scholarshipRequired',
      label: 'Scholarship Required',
      type: 'select',
      required: true,
      options: ['Yes', 'No'],
      visibility: 'public',
    },
    {
      key: 'declarationAgreement',
      label: 'Declaration Agreement',
      type: 'checkbox',
      required: true,
      helpText: 'I agree to abide by the rules and regulations of Jamia Urwaa',
      visibility: 'public',
    },
    {
      key: 'parentGuardianSignature',
      label: 'Parent / Guardian Signature',
      type: 'file',
      required: true,
      helpText: 'Upload a scanned copy of parent/guardian signature or digital signature (PDF/JPG/PNG, max 5MB)',
      visibility: 'public',
    },
  ];
}

