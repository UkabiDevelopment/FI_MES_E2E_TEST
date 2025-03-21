import 'cypress-real-events';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (admin = false) => {
    // Visit the login page
    cy.visit(Cypress.config('baseUrl'));

    // Set up intercepts before triggering the requests
    cy.intercept('POST', '**/api/Login').as('login');
    cy.intercept('GET', '**/api/Company/GetCompanies').as('getCompanies');
    cy.intercept('POST', '**/api/HrLineDetail/CheckAllDayWorkingHours').as('checkWorkingHours');
    cy.intercept('GET', '**/api/HrLineDetail/GetDayWorkingHours*').as('getDayWorkingHours');

    if (!admin) {
        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
        cy.intercept('GET', '**/api/Machine/GetMachines*').as('getMachines');
        cy.intercept('GET', '**/api/HrLineDetail/GetHrLineDetails*').as('getHrLineDetails');
    }

    // Perform login
    const email = admin ? Cypress.env('adminemail') : Cypress.env('email');
    const password = admin ? Cypress.env('adminpassword') : Cypress.env('password');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('dx-button[type="default"]').click();

    // Wait for login request to complete
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    // Wait for companies and other requests after login
    cy.wait('@getCompanies').its('response.statusCode').should('eq', 200);
    cy.wait('@checkWorkingHours').its('response.statusCode').should('eq', 200);
    cy.wait('@getDayWorkingHours').its('response.statusCode').should('eq', 200);

    // If not admin, wait for additional requests
    if (!admin) {
        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
        cy.wait('@getMachines').its('response.statusCode').should('eq', 200);
        cy.wait('@getHrLineDetails').its('response.statusCode').should('eq', 200);
    }
});

Cypress.Commands.add('logout', () => {
    cy.get('#logout').should('be.visible');
    cy.get('#logout').click();
});


Cypress.Commands.add('generateRandomText', (length = 10) => {
    const randomString = Math.random().toString(36).substring(2, 2 + length);
    return randomString;
});

Cypress.Commands.add('generateRandomEmail', (length = 10) => {
    const randomString = Math.random().toString(36).substring(2, 2 + length);
    return `${randomString}@gmail.com`;
});


Cypress.Commands.add('VerifyElementExistandVisible', (selector) => {
    cy.get(selector).should('exist');
    cy.get(selector).should('be.visible');
});

// Cypress.Commands.add('VerifyElementVisisble', (selector) => {
//     cy.get(selector).should('be.visible');
// });

Cypress.Commands.add('VerifyUrl', (url) => {
    cy.url().should('include', url);
});

Cypress.Commands.add('ClickElement', (selector) => {
    cy.wait(1000);
    cy.get(selector).click();
});

Cypress.Commands.add('VerifyTitle', (selector, value) => {
    cy.get(selector).should('have.text', value);
});

Cypress.Commands.add('VerifyContains', (selector, value) => {
    cy.get(selector).should('contain', value);
});

Cypress.Commands.add('mouseHoverElement', (selector, value) => {
    cy.get(selector).contains(value).realHover(); 
});

Cypress.Commands.add('clearInputField', (selector) => {
    cy.get(selector).clear();
});

Cypress.Commands.add('selectElement', (selector,value) => {
    cy.VerifyElementExistandVisible(selector);
    cy.get(selector).contains(value).click(); 
});

Cypress.Commands.add('selectDropdownValue', (selector,value) => {
    cy.get(selector).select(value); 
    cy.get(selector).should('have.value', value);
});

Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
    // Trigger mousedown on the source element
  cy.get(sourceSelector)
  .trigger('mousedown', { which: 1, button: 0 });

    // Trigger mousemove and mouseup on the target element
    cy.get(targetSelector)
    .trigger('mousemove', { clientX: 500, clientY: 500 }) // Adjust coordinates as needed
    .trigger('mouseup', { force: true });
});