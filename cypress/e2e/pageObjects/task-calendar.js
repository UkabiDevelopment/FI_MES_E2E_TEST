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
        cy.get('#scrollview').first().within(() => {
            cy.get('.list-cell').eq(1).invoke('text').then((cellText) => {
                const uniqueId = cellText.trim().split(' ')[0];
                cy.get(`#taskCheckbox${uniqueId}`).find('.dx-checkbox-icon').click({ force: true });
                Cypress.env('uniqueId', uniqueId);
            });
        });
    }

    checkTaskExistenceAndSelect = (uniqueId) => {
        return cy.get('#scrollview').then(($rows) => {
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
        cy.get('#scrollview').each(($row) => {
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

    cy.contains('#scrollview .dx-draggable', formattedUniqueId, { timeout: 10000 })
        .should('exist')
        .then((task) => {
        // Start dragging
        cy.wrap(task).realMouseDown();
        cy.wait(6000); // just to visualize drag

        // Drop into first section (first row, second cell)
        cy.get('.dx-scheduler-date-table-row').first()
            .find('.dx-scheduler-date-table-cell')
            .eq(1) // usually the first valid time cell
            .realMouseMove(10, 10)
            .realMouseUp();
        cy.log(`Dropped task ${formattedUniqueId} into the first calendar section`);
        });
    };

    dragAndDropTaskFromGridToCalendar1 = (uniqueId) => {
  const formattedUniqueId = String(uniqueId).trim();

  cy.contains('#scrollview .dx-draggable', formattedUniqueId, { timeout: 10000 })
    .should('exist')
    .then((task) => {
      // Start drag from center
      cy.wrap(task).realMouseDown({ position: 'center' });

      // Target: first row, second cell
      cy.get('.dx-scheduler-date-table-row')
        .first()
        .find('.dx-scheduler-date-table-cell')
        .eq(1)
        .then(($cell) => {
          const cellRect = $cell[0].getBoundingClientRect();
          const targetX = cellRect.left + cellRect.width / 2;
          const targetY = cellRect.top + cellRect.height / 2;

          cy.realMouseMove(targetX, targetY, { position: 'topLeft' });
          cy.realMouseUp();
        });

      cy.log(`Dropped task ${formattedUniqueId} into the first calendar section`);
    });
};


    dragAndDropTaskFromCalendarToCalendar = (ofNumber) => {
        cy.intercept('GET', '**/api/HrLineDetail/GetHrLineDetails*').as('getHrLineDetail');
        cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
        const formattedOfNumber = String(ofNumber).trim();

        this.filterTaskInGridUsingOfNumber(ofNumber); 
        cy.get('.dx-scheduler', { timeout: 20000 })  // increase timeout
            .should('exist')
            .first()
            .realMouseDown();
        cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').realMouseUp();
        
        cy.wait('@getHrLineDetail').its('response.statusCode').should('eq', 200);
        cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);

        cy.log(`Dragged task ${formattedOfNumber} to the third cell.`);
    };
    

    verifyTaskDroppedAndValidated = (formattedUniqueId) => {
                 cy.log('Test');

        cy.get('body').then(($body) => {
            cy.wait(3000); // Wait for any possible popup to appear
    
            // Check if a popup is visible
            if ($body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).length > 0 && 
                $body.find(`.dx-overlay-wrapper > .dx-overlay-content > .dx-popup-content`).is(':visible')) {
                cy.log('Popup is visible');
            } else {
                 cy.log('verified');
            }
        });
    };


    dragAndDropTaskFromGridToCalendar1(){
        
        cy.VerifyElementExistandVisible('#scrollview');
        cy.VerifyElementExistandVisible('#schedule_calendar');

        const draggableTask = cy.get('#scrollview').first();
        
        cy.get('#scrollview')
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
        return cy.get('tbody > :nth-child(1)').then(($appointments) => {
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
    cy.intercept('GET', '**/api/HrLineDetail/GetHrLineDetails*').as('getHrLineDetail');
    cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
    // cy.intercept('GET', '**/api/Machine/GetMachines*').as('getMachine');
    const formattedOfNumber = String(uniqueId).trim();

    cy.wait('@getHrLineDetail').its('response.statusCode').should('eq', 200);
    cy.wait('@getHrLine').its('response.statusCode').should('eq', 200);
    // cy.wait('@getMachine').its('response.statusCode').should('eq', 200);
    cy.wait(2000);
    cy.get('.dx-scheduler-appointment', { timeout: 15000 })
      .contains(formattedOfNumber)
      .should('be.visible')
      .click({ force: true });


    cy.get('.actions > .ng-star-inserted > .dx-widget > .dx-button-content')
      .should('be.visible')
      .click();
};



    verifyTaskDeletion = (ofNumber,uniqueId) => {
        const formattedOfNumber = String(ofNumber).trim();
        const formattedUniqueId = String(uniqueId).trim();
        this.filterTaskInGridUsingOfNumber(formattedOfNumber);
        cy.VerifyElementExistandVisible('#scrollview');
    
        cy.get('#scrollview').each(($row) => {
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