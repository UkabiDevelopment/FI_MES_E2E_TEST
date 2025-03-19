class LoginPage {
    visit() {
        cy.visit(Cypress.config('baseUrl') +'/login');
    }

    enterEmail(admin = false) {
        const email = admin ? Cypress.env('adminemail') : Cypress.env('email');
        cy.get('input[name="email"]').type(email);
    }

    enterPassword(admin = false) {
        const password = admin ? Cypress.env('adminpassword') : Cypress.env('password');
        cy.get('input[name="password"]').type(password);
    }
    
    clickLogin() {
        cy.get('dx-button[type="default"]').click();
    }

    verifyElementExist() {
        cy.VerifyElementExistandVisible('input[name="email"]');
        cy.VerifyElementExistandVisible('input[name="password"]');
        cy.VerifyElementExistandVisible('dx-button[type="default"]');
    }

    login(admin = false) {
        this.enterEmail(admin);
        this.enterPassword(admin);
        this.clickLogin();
    }

    logout() {
        cy.get('#logout').should('be.visible');
        cy.get('#logout').click();
    }
}

export default LoginPage;