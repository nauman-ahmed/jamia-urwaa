'use strict';

/**
 * rate-limit service
 */

module.exports = ({ strapi }) => {
  // In-memory store for rate limiting (use Redis in production)
  const rateLimitStore = new Map();

  // Clean up old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    for (const [key, timestamps] of rateLimitStore.entries()) {
      const filtered = timestamps.filter(ts => ts > oneHourAgo);
      if (filtered.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, filtered);
      }
    }
  }, 5 * 60 * 1000);

  return {
    /**
     * Check if IP can submit to form
     */
    async checkRateLimit(formId, ip, limit) {
      const key = `${formId}:${ip}`;
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;

      const timestamps = rateLimitStore.get(key) || [];
      const recentSubmissions = timestamps.filter(ts => ts > oneHourAgo);

      return recentSubmissions.length < limit;
    },

    /**
     * Record a submission for rate limiting
     */
    async recordSubmission(formId, ip) {
      const key = `${formId}:${ip}`;
      const now = Date.now();
      const timestamps = rateLimitStore.get(key) || [];
      timestamps.push(now);
      rateLimitStore.set(key, timestamps);
    },
  };
};

