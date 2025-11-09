'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Custom routes are handled in the route files themselves
    // This bootstrap runs after content types are loaded
    
    // Optionally seed the admission form on startup
    // Set SEED_ADMISSION_FORM=true in .env to enable
    if (process.env.SEED_ADMISSION_FORM === 'true') {
      try {
        const seedScript = require('../scripts/seed-admission-form');
        await seedScript({ strapi });
      } catch (error) {
        strapi.log.error('Error seeding admission form:', error);
      }
    }
  },
};
