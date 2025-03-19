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
    //Visit the login page
    cy.visit(Cypress.config('baseUrl'));

    //Perform login
    const email = admin ? Cypress.env('adminemail') : Cypress.env('email');
    const password = admin ? Cypress.env('adminpassword') : Cypress.env('password');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('dx-button[type="default"]').click();

    cy.wait(2000);
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