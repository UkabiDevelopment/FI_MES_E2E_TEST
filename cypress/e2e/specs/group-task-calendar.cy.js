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

    it('Test Case 1: Verify the page task-calendar',()=>{
         // Arrange: Define the expected URL part
        const expectedUrl = '/task-calender';
        
        // Assert:
        cy.VerifyUrl(expectedUrl); 
    });

     it('Test Case 2: drag group task from grid and drop task to calendar',()=>{
        const uniqueId = data.groupTaskUniqueId;

        // Arrange: Set up initial conditions
        taskCalendar.filterTaskInGridUsingOfNumber(uniqueId);
        taskCalendar.preparesForDragAndDrop(uniqueId);

        // Act: Perform the drag-and-drop action
        taskCalendar.dragAndDropTaskFromGridToCalendar(uniqueId);
        cy.VerifyTitle('h2',es.groupTaskPopupHeader);
        cy.get('#machineDropdown0').select('Test 2');
        cy.ClickElement(':nth-child(2) > .box-item > .dx-widget > .dx-button-content');

        // Assert: Verify the task is successfully dropped and check for any popups or validation
        cy.wait(5000);
    });

    it('Test Case 3: delete group task from calendar',()=>{
        const ofNumber = data.groupTaskOfNumberIdCalendar;  

        // Arrange: Set up initial conditions
        cy.reload();
        taskCalendar.deleteTaskFromCalendar(ofNumber);

        // Assert: Verify the task is successfully dropped and check for any popups or validation
        cy.wait(5000);
    });

});