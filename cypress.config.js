const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: ["**/node_modules/**"],
    baseUrl: "https://fimes.alfa.ukabi.com",
    // baseUrl: "http://localhost:4200",
    env: {
      email:process.env.EMAIL || '', // Read email from environment variable
      password:process.env.PASSWORD || '', //Read password from environment variable
      adminemail:process.env.ADMINEMAIL || '', // Read Admin email from environment variable
      adminpassword:process.env.ADMINPASSWORD || '', //Read Admin password from environment variable
      company:process.env.company || '' //Read company from environment variable
    },
    defaultCommandTimeout: 10000, // Increases default timeout to 10 seconds
    pageLoadTimeout: 10000, // Increases page load timeout to 10 seconds
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports', // Directory for reports
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
