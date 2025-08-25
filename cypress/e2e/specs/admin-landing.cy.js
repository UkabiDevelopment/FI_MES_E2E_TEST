import AdminLandingPage from '../pageObjects/admin-landing';

describe('Admin Landing Test', () => {
    const adminLanding = new AdminLandingPage();

    beforeEach(() => {
        cy.login(true);
        adminLanding.visit();
    });

    it('Test Case 1: Verify the page admin-landing',()=>{
        // Arrange: Define the expected URL part
        const expectedUrl = '/#/admin-landing';
        
        // Assert:
        cy.VerifyUrl(expectedUrl); 
    });

    it('Test Case 2: Should display company list after click ridirect to task calendar page',()=>{
        //check and click menu list icon
        adminLanding.SelectCompanyFromToggleButton();      
        cy.VerifyUrl('/#/task-calender');
        cy.wait(2000);  
    });

    it('Test Case 3: Should Create new company',()=>{   
        //open comapny create popup
        adminLanding.OpenPopupCreateNewCompany();
        adminLanding.SaveNewCompany();
        
        
        cy.wait(2000);     
    });

    it('Test Case 4: Company should deactivate and activated',()=>{   
        adminLanding.deactivateCompany();
        cy.wait(2000);     
        adminLanding.activateCompany();  
        cy.wait(2000);  
    });
    it('Test Case 5: Should  edit created company',()=>{  
         //open comapny edit popup 
        adminLanding.OpenPopupEditCompany();
        adminLanding.editCompany();    
        cy.wait(2000);     
    });

    it('Test Case 6: Should  create new user for company',()=>{  
        //open user create popup 
        adminLanding.OpenPopupCreateUser();
        adminLanding.createUser();    
        cy.wait(2000);     
   });

   it('Test Case 7: User should deactivate and activated',()=>{  
        adminLanding.deactivateUser();
        cy.wait(2000);     
        adminLanding.activateUser();  
        cy.wait(2000);    
    });

    it('Test Case 8: Should  edit user new created',()=>{  
        //open user edit popup 
        adminLanding.OpenPopupEditUser();
        adminLanding.editUser();       
    });

    it('Test case 9: should toggle password visibility',()=>{
        adminLanding.togglePasswprdVisibility();   
    });

    it('Test Case 10: Should  delete user from company',()=>{  
        //open user delete popup 
        adminLanding.openUserDeletePopup();
        adminLanding.deleteUser();    
        cy.wait(2000);     
    });

    it('Test Case 11: Should delete company',()=>{   
        //open comapny delete popup
        adminLanding.openCompanyDeletePopup(); 
        adminLanding.deleteCompany();
    });
}); 