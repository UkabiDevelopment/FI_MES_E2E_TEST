import LoginPage from '../pageObjects/login-page';

describe('Login Test', () => {
    const loginPage = new LoginPage();

    beforeEach(() => {
        loginPage.visit();       
    });


    it('Test Case 1: Element exists and is visible',()=>{
        loginPage.verifyElementExist();
    });

    it('Test Case 2: Login with valid credentials - Admin',()=>{
        loginPage.login(true);
        cy.VerifyUrl(`${Cypress.config('baseUrl')}/admin-landing`);
    });

    it('Test Case 3: Login with valid credentials - Normal User',()=>{
        loginPage.login();
        cy.VerifyUrl(`${Cypress.config('baseUrl')}/task-calender`);
    });

    it('Test Case 4: should logout successfully - Admin',()=>{
        loginPage.login(true);
        loginPage.logout();
        cy.VerifyUrl(`${Cypress.config('baseUrl')}`);
    });

    it('Test Case 5: should logout successfully -  Normal User',()=>{
        cy.login();
        loginPage.logout();
        cy.VerifyUrl(`${Cypress.config('baseUrl')}`);
    });
});