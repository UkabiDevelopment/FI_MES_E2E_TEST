import TaskCalendar from '../pageObjects/task-calendar';
import data from '../../fixtures/data.json';

describe('Task Calendar Test', () => {
    const taskCalendar = new TaskCalendar();

    beforeEach(() => {
        cy.login();
        cy.wait(2000);
    });

    it('Test Case 1: Verify the page task-calendar',()=>{
         // Arrange: Define the expected URL part
        const expectedUrl = '/#/task-calender';
        
        // Assert:
        cy.VerifyUrl(expectedUrl); 
    });

    it('Test Case 2: Should navigate next and previous pages and change page size',()=>{
        // Arrange
        taskCalendar.ensureDefaultPaginationState();

        // Act: Perform pagination actions
        taskCalendar.paginationNextButton();
        taskCalendar.paginationPreviousButton();

        // Act: Change page size
        taskCalendar.selectPageSize(50);

        // Assert: Verify expected results
        taskCalendar.getCurrentPage().should('eq', 1); // Verify back to first page
        taskCalendar.getPageSize().should('eq', 50);
    });

    it('Test Case 3: Should select a task from the list and confirm deletion', () => {
        const uniqueId = data.delettionTaskUniqueIdGrid; 
    
        // Arrange: 
        taskCalendar.filterTaskInGridUsingOfNumber(uniqueId);
        cy.wait(2000);
        // Check if the task exists in the list and select the checkbox if available
        const taskFound = taskCalendar.checkTaskExistenceAndSelect(uniqueId);
    
        // Act: Perform actions if task is found
        if (taskFound) {
            taskCalendar.deleteTaskFromGrid();
        } else {
            // Log a message if task is not found
            cy.log('No task to delete.');
        }
    
        // Assert: Verify the task has been deleted or log a message if not found
        if (taskFound) {
            cy.log(`Task with unique ID ${uniqueId} has been deleted.`);
        } else {
            cy.log('No task was selected for deletion.');
        }
    });
    

   it('Test Case 4: drag task from grid and drop task to calendar', () => {
    const uniqueId = data.dragAndDropTaskUniqueId;
    const ofNumber = data.delettionTaskOfNumberIdCalendar;  

    // Arrange: intercepts before the drag
   cy.intercept('POST', '**/api/HrLineDetail/CheckHrLineScheduledDetails*').as('checkHrlineSchedule');
    cy.intercept('POST', '**/api/HrLineDetail/CheckYearlySchedule*').as('checkYearlySchedule');
    cy.intercept('POST', '**/api/HrLineDetail/AddHrLineDetailNew*').as('addHrLineDetailNew');
    cy.intercept('GET', '**/api/HrLine*').as('getHrLine');
    cy.intercept('GET', '**/api/HrLineDetail/GetHrLineDetails*').as('getHrLineDetails');
    cy.intercept('GET', '**/api/Machine/GetMachines*').as('getMachines');

    taskCalendar.filterTaskInGridUsingOfNumber(ofNumber);
    taskCalendar.preparesForDragAndDrop(uniqueId);

    // Act: drag from grid to calendar
    taskCalendar.dragAndDropTaskFromGridToCalendar(uniqueId);

    //cy.reload();
    // Wait for backend to confirm
   cy.wait([
        '@checkHrlineSchedule',
        '@checkYearlySchedule',
        '@addHrLineDetailNew',
        '@getHrLine',
        '@getHrLineDetails',
        '@getMachines'
    ], { timeout: 15000 }).each(xhr => {
        expect(xhr.response.statusCode).to.eq(200);
    });

});


    
    it('Test Case 5:  drag splitted task from one day in calendar and drop task to another day in calendar',()=>{
        const ofNumber = data.delettionTaskOfNumberIdCalendar;  

         const tasks = taskCalendar.checkTaskInCalendar(ofNumber);
        taskCalendar.filterTaskInGridUsingOfNumber(ofNumber);
        cy.wait(5000);
        cy.reload();

         // Arrange: Check if the task exists on the calendar before proceeding
         taskCalendar.filterTaskInGridUsingOfNumber(ofNumber);
         const taskFound = taskCalendar.checkTaskInCalendar(ofNumber);

         cy.reload();
        // Act: Perform the drag-and-drop action
        if (taskFound) {
            taskCalendar.dragAndDropTaskFromCalendarToCalendar(ofNumber);
            cy.wait(2000);
        } else {
            cy.log('No task found in the calendar.');
        }

        cy.wait(5000);
    });


    it('Test Case 6: Should delete task from calendar if available', () => {
        const ofNumber = data.delettionTaskOfNumberIdCalendar; 
        const uniqueId = data.dragAndDropTaskUniqueId;
    
        // Arrange: Check if the task exists on the calendar before proceeding
        taskCalendar.verifyTaskDroppedAndValidated(ofNumber);
        const taskFound = taskCalendar.checkTaskInCalendar(ofNumber);
        
        cy.reload();
        // Act: If the task exists, perform the delete action
        if (taskFound) {
             taskCalendar.dragAndDropTaskFromCalendarToCalendar(ofNumber);
            cy.wait(2000);
            cy.reload();
            taskCalendar.deleteTaskFromCalendar(ofNumber);
    
            // Assert: Verify the task is deleted
            taskCalendar.verifyTaskDeletion(ofNumber,uniqueId);
        } else {
            cy.log('No task found in the calendar to delete.');
        }
    });

    it('Test Case 7: drag task from one day in calendar and drop task to another day in calendar',()=>{
        const uniqueId = data.dragAndDropNotSplittedTaskUniqueId;
        const ofNumber = data.NotSplittedTaskTaskOfNumberIdCalendar;  

        // Arrange: Set up initial conditions
        taskCalendar.preparesForDragAndDrop(uniqueId);
        taskCalendar.dragAndDropTaskFromGridToCalendar(uniqueId);
        taskCalendar.verifyTaskDroppedAndValidated(ofNumber);
        const taskFound = taskCalendar.checkTaskInCalendar(ofNumber);
        cy.reload();
        // Act: Perform the drag-and-drop action
        if (taskFound) {
            taskCalendar.dragAndDropTaskFromCalendarToCalendar(ofNumber);
            cy.wait(2000);
            cy.reload();
            taskCalendar.deleteTaskFromCalendar(ofNumber);

             // Assert: Verify the task is deleted
             taskCalendar.verifyTaskDeletion(ofNumber,uniqueId);
        } else {
            cy.log('No task found in the calendar.');
        }
        cy.wait(5000);
    });

    
});