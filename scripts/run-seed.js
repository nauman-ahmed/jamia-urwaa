'use strict';

/**
 * Runner script for seed scripts
 * Usage: node scripts/run-seed.js
 */

const { createStrapi } = require('@strapi/strapi');

async function runSeed() {
  let strapi;
  
  try {
    // Create Strapi instance
    strapi = createStrapi();
    
    // Load Strapi
    await strapi.load();
    
    // Run the seed script
    const seed = require('./seed-admission-form');
    await seed({ strapi });
    
    console.log('✅ Seed script completed successfully!');
    
    // Destroy Strapi instance
    await strapi.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seed script:', error);
    if (strapi) {
      await strapi.destroy();
    }
    process.exit(1);
  }
}

runSeed();

