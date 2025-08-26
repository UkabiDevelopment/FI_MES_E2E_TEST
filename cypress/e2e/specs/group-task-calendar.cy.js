import GroupTaskCalendarPage from '../pageObjects/group-task-calendar';
import TaskCalendar from '../pageObjects/task-calendar';
import data from '../../fixtures/data.json';
import es from '../../fixtures/es.json';

describe('Group Task adding calendar Test', () => {
    const groupTaskCalendar = new GroupTaskCalendarPage();
    const taskCalendar = new TaskCalendar();

     beforeEach(() => {
        cy.login();
        cy.wait(2000);
    });

    it.only('Test Case 1: Verify the page task-calendar',()=>{
         // Arrange: Define the expected URL part
        const expectedUrl = '/#/task-calender';
        
        // Assert:
        cy.VerifyUrl(expectedUrl); 
    });

     it('Test Case 2: drag group task from grid and drop task to calendar',()=>{
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
        
        // Assert: Verify the task is successfully dropped and check for any popups or validation
        cy.wait(5000);
    });

    it('Test Case 3: delete group task from calendar',()=>{
        const ofNumber = data.delettionTaskOfNumberIdCalendar;  

        // Arrange: Set up initial conditions
        cy.reload();
        taskCalendar.deleteTaskFromCalendar(ofNumber);

        // Assert: Verify the task is successfully dropped and check for any popups or validation
        cy.wait(5000);
    });

});