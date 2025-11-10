module.exports = ({ env }) => ({
  // Email configuration is handled via nodemailer in the service
  // SMTP settings should be configured via environment variables:
  // SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
  'elasticsearch': {
      enabled: true,
      config: {
        indexingCronSchedule: "00 23 * * *", //run daily at 11:00 PM
        searchConnector: {
          host: process.env.ELASTIC_HOST,
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
        indexAliasName: process.env.ELASTIC_ALIAS_NAME
      }  
    },

});
