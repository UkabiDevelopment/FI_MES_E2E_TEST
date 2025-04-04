class TaskCalendar{

    visit() {
        // cy.visit(Cypress.config('baseUrl') +'/task-calender');        
    }

    SelectCompanyFromToggleButton(){
        cy.VerifyElementExistandVisible('.dx-menu-item-content');
        cy.ClickElement('.dx-menu-item-content');

        cy.VerifyElementExistandVisible('.dx-template-wrapper.dx-item-content.dx-menu-item-content');
        cy.get('.dx-template-wrapper.dx-item-content.dx-menu-item-content').contains(Cypress.env('company')).click();
    }

    ensureDefaultPaginationState(){        
        cy.get('.left-chevron-div').then(($btn) => {
            if (!$btn.hasClass('dx-state-disabled')) {
                cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
                cy.get('.left-chevron-div').click();
                cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
            }
        });

        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
        cy.selectDropdownValue('#pageSizeSelector','5');
        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
    }

    paginationNextButton(){
        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
        cy.VerifyElementExistandVisible('.right-chevron-div');
        cy.ClickElement('.right-chevron-div');

        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);

    }

    paginationPreviousButton(){
        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
        cy.VerifyElementExistandVisible('.left-chevron-div');
        cy.ClickElement('.left-chevron-div');

        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
    }

    selectPageSize(pageSize) {
        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
    
        cy.VerifyElementExistandVisible('#pageSizeSelector');
    
        cy.get('#pageSizeSelector').select(pageSize.toString());
    
        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
    }
    

    getCurrentPage() {
        return cy.get('.left-chevron-span')
            .invoke('text')
            .then((text) => {
                const match = text.match(/Página (\d+)/);
                return match ? parseInt(match[1], 10) : null;
            });
    }    

    getPageSize() {
        return cy.get('#pageSizeSelector')
            .invoke('val')
            .then((value) => parseInt(value, 10));
    }
    

    clickTaskCheckbox(){
        cy.get('#scrollview .list-row').first().within(() => {
            cy.get('.list-cell').eq(1).invoke('text').then((cellText) => {
                const uniqueId = cellText.trim().split(' ')[0];
                cy.get(`#taskCheckbox${uniqueId}`).find('.dx-checkbox-icon').click({ force: true });
                Cypress.env('uniqueId', uniqueId);
            });
        });
    }

    checkTaskExistenceAndSelect = (uniqueId) => {
        return cy.get('#scrollview .list-row').then(($rows) => {
            let taskFound = false;
            const formattedUniqueId = String(uniqueId).trim();
            cy.wrap($rows).each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('.list-cell').eq(1).invoke('text').then((cellText) => {
                        const rowTaskId = cellText.trim().split(' ')[0];
                        if (rowTaskId === formattedUniqueId) {
                            taskFound = true;
                            cy.log(`Task with unique ID ${formattedUniqueId} found.`);
                            cy.get(`#taskCheckbox${formattedUniqueId}`).find('.dx-checkbox-icon').click({ force: true });
                            Cypress.env('uniqueId', formattedUniqueId);
                        }
                    });
                });
            }).then(() => {
                if (!taskFound) {
                    cy.log(`Task with unique ID ${formattedUniqueId} was not found.`);
                }
                return cy.wrap(taskFound);
            });
        });
    };
    
    


    deleteTaskFromGrid(){
        cy.get('.dx-button-danger > .dx-button-content').click();
        cy.VerifyElementExistandVisible(`.dx-box-item-flex-base > .dx-item > .box-item > .dx-widget > .dx-button-content`);
        cy.VerifyElementExistandVisible(`:nth-child(2) > .box-item > .dx-widget > .dx-button-content`);
        cy.ClickElement(`.dx-box-item-flex-base > .dx-item > .box-item > .dx-widget > .dx-button-content`);
        cy.then(()=>{
            cy.get(`#taskCheckbox${Cypress.env('uniqueId')}`).find('.dx-checkbox-icon').click({ force: true });
        });
    }


    preparesForDragAndDrop = (uniqueId) => {
        // Ensure grid and calendar are visible
        cy.VerifyElementExistandVisible('#scrollview');
        cy.VerifyElementExistandVisible('#schedule_calendar');
    
        const formattedUniqueId = String(uniqueId).trim();
        // Check if the task with the given unique ID exists in the grid
        cy.get('#scrollview .list-row').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('.list-cell').eq(1).invoke('text').then((cellText) => {
                    const taskId = cellText.trim().split(' ')[0];
        
                    if (taskId === formattedUniqueId) {
                        cy.log('Task with ID ' + formattedUniqueId + ' found.');
                    }
                });
            });
        }).then(() => {
            cy.log('Finished checking all tasks.');
        });
        
    };

    dragAndDropTaskFromGridToCalendar = (uniqueId) => {
        const formattedUniqueId = String(uniqueId).trim();

        const draggableTask = cy.get('#scrollview .list-row')
            .filter(`:contains(${formattedUniqueId})`); // Filter the task by uniqueId in grid
    
        const dropTarget = cy.get('#schedule_calendar');
    
        // Trigger the drag-and-drop event
        draggableTask.trigger('mousedown', { which: 1 });
        dropTarget.trigger('mousemove', { clientX: 500, clientY: 500 });
        dropTarget.trigger('mouseup', { force: true });
    
        cy.log(`Dragged task with uniqueId ${formattedUniqueId} and dropped on the calendar.`);
    };

    dragAndDropTaskFromCalendarToCalendar = (ofNumber) => {
        const formattedOfNumber = String(ofNumber).trim();

        const draggableTask = cy.get('.dx-scheduler-appointment')
            .contains(formattedOfNumber)
            .first();
    
        // Target the third cell in the first row
        const dropTarget = cy.get('tbody > tr:nth-child(1) > td:nth-child(2)');
        
        // Perform drag-and-drop
        draggableTask.trigger('mousedown', { which: 1, force: true });
        dropTarget.trigger('mousemove', { force: true }).trigger('mouseup', { force: true });
        
        cy.log(`Dragged task ${formattedOfNumber} to the third cell.`);
    };
    

    verifyTaskDroppedAndValidated = (formattedUniqueId) => {
        cy.get('body').then(($body) => {
            cy.wait(3000); // Wait for any possible popup to appear
    
            // Check if a popup is visible
            if ($body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).length > 0 && 
                $body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).is(':visible')) {
                cy.log('Popup is visible');
            } else {
                // Check if the task with the uniqueId is successfully dropped on the calendar
                cy.get('#schedule_calendar').should('contain', formattedUniqueId);
                cy.log(`Task with uniqueId ${formattedUniqueId} successfully dropped onto the calendar.`);
            }
        });
    };


    dragAndDropTaskFromGridToCalendar1(){
        
        cy.VerifyElementExistandVisible('#scrollview');
        cy.VerifyElementExistandVisible('#schedule_calendar');

        const draggableTask = cy.get('#scrollview .list-row').first();
        
        cy.get('#scrollview .list-row')
        .first()
        .invoke('text')
        .then((text) => {
            cy.log('Task Text:', text.trim());
            console.log('Task Text:', text.trim());
        });

        const dropTarget = cy.get('#schedule_calendar');

        draggableTask.trigger('mousedown', { which: 1 });
        dropTarget.trigger('mousemove', { clientX: 500, clientY: 500 });
        dropTarget.trigger('mouseup', { force: true });
        

        cy.get('body').then(($body) => {
            cy.wait(3000);
            if($body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).length > 0 && $body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).is(':visible')){
                cy.log('Popup is visible');
            }else{
                cy.get('#schedule_calendar').should('contain', 1536);
            }        
          });
    }

    checkTaskInCalendar = (uniqueId) => {
        const formattedUniqueId = String(uniqueId).trim();
        return cy.get('.dx-scheduler-appointment').then(($appointments) => {
            let taskFound = false;
    
            cy.wrap($appointments).each(($appointment) => {
                cy.wrap($appointment).invoke('text').then((taskText) => {
                    if (taskText.includes(formattedUniqueId)) {
                        taskFound = true;
                        cy.log('Task with ID ' + formattedUniqueId + ' found in calendar.');
                    }
                });
            }).then(() => {
                if (!taskFound) {
                    cy.log('Task with ID ' + formattedUniqueId + ' not found in the calendar.');
                }
                return cy.wrap(taskFound);
            });
        });
    };
    
    

    deleteTaskFromCalendar = (uniqueId) => {
        const formattedUniqueId = String(uniqueId).trim();
        cy.VerifyElementExistandVisible('.dx-scheduler');
        cy.VerifyElementExistandVisible('.dx-scheduler-appointment');
        cy.get('.dx-scheduler-appointment').contains(formattedUniqueId).click(); 
        cy.get('.actions > .ng-star-inserted > .dx-widget > .dx-button-content').click();
    };

    verifyTaskDeletion = (ofNumber,uniqueId) => {
        const formattedOfNumber = String(ofNumber).trim();
        const formattedUniqueId = String(uniqueId).trim();
        this.filterTaskInGridUsingOfNumber(formattedOfNumber);
        cy.VerifyElementExistandVisible('#scrollview .list-row');
    
        cy.get('#scrollview .list-row').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('.list-cell').eq(1).invoke('text').then((cellText) => {
                    const taskId = cellText.trim().split(' ')[0];
        
                    if (taskId === formattedUniqueId) {
                        cy.log('Task with ID ' + formattedUniqueId + ' found.');
                        
                        // ✅ Assert that the task exists
                        expect(taskId).to.eq(formattedUniqueId);
                    }
                });
            });
        });

        cy.log('Task with ID ' + formattedOfNumber + ' successfully deleted.');
    };
    
   filterTaskInGridUsingOfNumber = (ofNumber) => {
    cy.VerifyElementExistandVisible('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input');
    cy.get('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input').clear();
    cy.get('.searchTextBox > .dx-texteditor-container > .dx-texteditor-input-container > .dx-texteditor-input').type(ofNumber);
    cy.ClickElement('.ml-4 > .dx-box-item-flex-base > :nth-child(1) > .dx-template-wrapper > .dx-widget > .dx-button-content');
   }
}

export default TaskCalendar;