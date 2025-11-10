'use strict';

/**
 * Runner script for event seed script
 * Usage: node scripts/run-seed-event.js
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
    const seed = require('./seed-event');
    await seed({ strapi });
    
    console.log('✅ Event seed script completed successfully!');
    
    // Destroy Strapi instance
    await strapi.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running event seed script:', error);
    if (strapi) {
      await strapi.destroy();
    }
    process.exit(1);
  }
}

runSeed();

