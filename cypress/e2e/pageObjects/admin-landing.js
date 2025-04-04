import data from '../../../fixtures/es.json';

class AdminLandingPage{
    visit() {
        cy.visit(Cypress.config('baseUrl') +'/admin-landing');
    }
     
    SelectCompanyFromToggleButton(){
        cy.VerifyElementExistandVisible('.dx-menu-item-content');
        cy.ClickElement('.dx-menu-item-content');

        cy.VerifyElementExistandVisible('.dx-template-wrapper.dx-item-content.dx-menu-item-content');
        cy.get('.dx-template-wrapper.dx-item-content.dx-menu-item-content').contains(Cypress.env('company')).click();
    }

    //#region comapny create
    OpenPopupCreateNewCompany(){
        cy.VerifyElementExistandVisible('#companyCreatePopupBtn');
        cy.ClickElement('#companyCreatePopupBtn');
    }

    VerifyComppanyCreatePopupElementExistAndVisible(){
        cy.VerifyTitle('.custom-delete-popup .dx-popup-title',data.companyCreateTitle);
        cy.VerifyContains('#companyName',data.companyName);
        cy.VerifyContains('#email',data.email);
        cy.VerifyContains('#cif',data.cif);
        cy.VerifyContains('.dx-invalid-message-content',data.Mandatory);

        cy.VerifyElementExistandVisible('#companyName');
        cy.VerifyElementExistandVisible('#cif');
        cy.VerifyElementExistandVisible('#email');
        cy.VerifyElementExistandVisible('#saveCompany');
    }

    SaveNewCompany(){
        var companyName = '';     
        this.VerifyComppanyCreatePopupElementExistAndVisible();  
       
        cy.generateRandomText().then((randomText) => {
            companyName = randomText;
            Cypress.env('newCreatedcompany', companyName);
            cy.get('#companyName').type(companyName); 
        });

        cy.generateRandomText().then((randomText) => {
            cy.get('#cif').type(randomText);  
        });
        
        cy.generateRandomEmail(3).then((email) => {
            cy.get('#email').type(email);  
        });
        
        cy.get('body').click();

        cy.intercept('POST', '**/api/Company/AddCompany').as('addCompany');
        cy.intercept('GET', '**/api/Company/GetCompanies').as('getCompanies');

        cy.ClickElement('#saveCompany');
        
        cy.wait('@addCompany').its('response.statusCode').should('eq', 200);
        cy.wait('@getCompanies').its('response.statusCode').should('eq', 200);
        

        cy.get('body').click(); // Click outside
        cy.wait(2000);
        cy.get('#addEditCompanyPopup').should('not.be.visible'); 
        
    }
    //#endregion comapny create

    //#region company deactivate and activate
    deactivateCompany(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyElementExistandVisible('#company_list');
        cy.mouseHoverElement('#company_list',companyName);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#deactivateCompany'+companyName);
        cy.ClickElement('#deactivateCompany'+companyName);
    }
    activateCompany(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyElementExistandVisible('#company_list');
        cy.mouseHoverElement('#company_list',companyName);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#deactivateCompany'+companyName);
        cy.ClickElement('#deactivateCompany'+companyName);
    }
    //#endregion company deactivate and activate

    //#region company edit
    OpenPopupEditCompany(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyElementExistandVisible('#company_list');
        cy.mouseHoverElement('#company_list',companyName);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#editCompany'+companyName);
        cy.ClickElement('#editCompany'+companyName);
    }

    editCompany(){
        var companyName = '';           
       
        cy.generateRandomText().then((randomText) => {
            companyName = randomText;
            Cypress.env('newCreatedcompany', companyName);
            cy.clearInputField('#companyName');
            cy.get('#companyName').type(companyName); 
        });

        cy.generateRandomText().then((randomText) => {
            cy.clearInputField('#cif');
            cy.get('#cif').type(randomText);  
        });
        
        cy.generateRandomEmail(3).then((email) => {
            cy.clearInputField('#email');
            cy.get('#email').type(email);  
        });
        
        cy.get('body').click();

        cy.intercept('POST', '**/api/Company/AddCompany').as('addCompany');
        cy.intercept('GET', '**/api/Company/GetCompanies').as('getCompanies');

        cy.ClickElement('#saveCompany');
        
        cy.wait('@addCompany').its('response.statusCode').should('eq', 200);
        cy.wait('@getCompanies').its('response.statusCode').should('eq', 200);
        

        cy.get('body').click(); // Click outside
        cy.wait(2000);
        cy.get('#addEditCompanyPopup').should('not.be.visible'); 
    }
    //#endregion company edit

    //#region company delete
    openCompanyDeletePopup(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyElementExistandVisible('#company_list');
        cy.mouseHoverElement('#company_list',companyName);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#deleteCompany'+companyName);
        cy.ClickElement('#deleteCompany'+companyName);
    }

    deleteCompany(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyTitle('.dx-popup-title',data.deleteCompany);
        cy.VerifyTitle('.wrap-name',companyName);
        cy.VerifyElementExistandVisible('#deleteCompanyBtn');
        cy.ClickElement('#deleteCompanyBtn');
        cy.wait(2000);
    }
    //#endregion company delete
    

     //#region create user for company
     OpenPopupCreateUser(){
        const companyName = Cypress.env('newCreatedcompany');
        cy.selectElement('#company_list',companyName); 
        cy.VerifyElementExistandVisible('#userPopup');
        cy.ClickElement('#userPopup');
    }

    VerifyUserCreatePopupElementExistAndVisible(){
        cy.VerifyTitle('.custom-delete-popup .dx-popup-title',data.userCreateTitle);
        cy.VerifyContains('#userId',data.userName);
        cy.VerifyContains('#userEmail',data.email);
        cy.VerifyContains('#password',data.password);
        cy.VerifyContains('.dx-invalid-message-content',data.Mandatory);

        cy.VerifyElementExistandVisible('#userId');
        cy.VerifyElementExistandVisible('#userEmail');
        cy.VerifyElementExistandVisible('#password');
        cy.VerifyElementExistandVisible('#saveUserBtn');
    }

    
    createUser(){
        var userName = '';
        const companyName = Cypress.env('newCreatedcompany');     
        this.VerifyUserCreatePopupElementExistAndVisible();
        
        cy.generateRandomText().then((randomText) => {
            userName = randomText;
            Cypress.env('newCreatedUser', userName);
            cy.get('#userId').type(userName); 
        });
      
        cy.generateRandomEmail(3).then((email) => {
            cy.get('#userEmail').type(email);  
        });
        
        cy.generateRandomText().then((randomText) => {
            cy.get('#password').type(randomText);  
        });

        cy.get('body').click();

        cy.intercept('POST', '**/api/Login/AddUser').as('addUser');

        cy.ClickElement('#saveUserBtn');
        
        cy.wait('@addUser').its('response.statusCode').should('eq', 200);
        
        cy.get('body').click(); // Click outside
        cy.get('#addEditUserPopup').should('not.be.visible'); 

        cy.selectElement('#company_list',companyName); 
        cy.wait(2000);
    }
    //#endregion create user for company

    //#region user deactivate and activate
    
    deactivateUser(){
        const userId = Cypress.env('newCreatedUser');
        const companyName = Cypress.env('newCreatedcompany');    
        cy.selectElement('#company_list',companyName); 
        cy.mouseHoverElement('#user_list',userId);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#deactivateUser'+userId);
        cy.ClickElement('#deactivateUser'+userId);
    }
    activateUser(){
        const userId = Cypress.env('newCreatedUser');
        const companyName = Cypress.env('newCreatedcompany');    
        cy.selectElement('#company_list',companyName); 
        cy.mouseHoverElement('#user_list',userId);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#deactivateUser'+userId);
        cy.ClickElement('#deactivateUser'+userId);
    }
    //#endregion user deactivate and activate

     //#region user edit
     OpenPopupEditUser(){
        const userId = Cypress.env('newCreatedUser');
        const companyName = Cypress.env('newCreatedcompany');    
        cy.selectElement('#company_list',companyName); 
        cy.mouseHoverElement('#user_list',userId);
        cy.wait(2000);
        cy.VerifyElementExistandVisible('#editUser'+userId);
        cy.ClickElement('#editUser'+userId);
    }
    
    editUser(){
        var userName = '';
        const companyName = Cypress.env('newCreatedcompany');
        cy.VerifyContains('.dx-toolbar',data.editUser);        
       
        cy.generateRandomText().then((randomText) => {
            userName = randomText;
            Cypress.env('newCreatedUser', userName);
            cy.clearInputField('#userId');
            cy.get('#userId').type(userName); 
        });

        cy.generateRandomText().then((randomText) => {
            cy.clearInputField('#userEmail');
            cy.get('#userEmail').type(randomText);  
        });
        
        cy.generateRandomEmail(3).then((email) => {
            cy.clearInputField('#password');
            cy.get('#password').type(email);  
        });
        
        cy.get('body').click();

        cy.intercept('POST', '**/api/Login/AddUser').as('addUser');

        cy.ClickElement('#saveUserBtn');
        
        cy.wait('@addUser').its('response.statusCode').should('eq', 200);
        
        cy.get('body').click(); // Click outside
        cy.get('#addEditUserPopup').should('not.be.visible'); 

        cy.selectElement('#company_list',companyName); 
        cy.wait(2000);
    }

    togglePasswprdVisibility(){
        const userId = Cypress.env('newCreatedUser');
        const companyName = Cypress.env('newCreatedcompany');    
        cy.selectElement('#company_list',companyName); 
        cy.ClickElement('#togglePwd' + userId);
        cy.wait(2000);
        cy.ClickElement('#togglePwd' + userId);
    }
    //#endregion user edit

     //#region delete user
     openUserDeletePopup(){
        const userId = Cypress.env('newCreatedUser');
        const companyName = Cypress.env('newCreatedcompany');    
        cy.selectElement('#company_list',companyName); 
        cy.mouseHoverElement('#user_list',userId);
        cy.wait(2000);  

    }

    deleteUser(){
        const userId = Cypress.env('newCreatedUser');
        cy.VerifyElementExistandVisible('#deleteUser'+userId);
        cy.ClickElement('#deleteUser'+userId);
        cy.wait(2000);  
    }
    //#endregion delete user
}

export default AdminLandingPage;