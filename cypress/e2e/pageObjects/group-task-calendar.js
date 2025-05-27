class GroupTaskCalendar{

    filterTaskInGridUsingOfNumber = (ofNumber) => {
        cy.VerifyElementExistandVisible('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input');
        cy.get('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input').clear();
        cy.get('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input').type(ofNumber);
        cy.ClickElement('.ml-4 > .dx-box-item-flex-base > :nth-child(1) > .dx-template-wrapper > .dx-widget > .dx-button-content');
   }

   
}
export default GroupTaskCalendar;