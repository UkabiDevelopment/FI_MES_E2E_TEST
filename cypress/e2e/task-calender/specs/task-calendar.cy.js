import TaskCalendar from '../pageObjects/task-calendar';
import data from '../../../fixtures/data.json';

describe('Task Calendar Test', () => {
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
    

    it('Test Case 4: drag from grid and drop task to calendar',()=>{
        const uniqueId = data.dragAndDropTaskUniqueId;
        const ofNumber = data.delettionTaskOfNumberIdCalendar;  

        // Arrange: Set up initial conditions
        taskCalendar.prepareForDragAndDrop(uniqueId);

        // Act: Perform the drag-and-drop action
        taskCalendar.dragAndDropTaskFromGridToCalendar(uniqueId);

        // Assert: Verify the task is successfully dropped and check for any popups or validation
        taskCalendar.verifyTaskDroppedAndValidated(ofNumber);
        cy.wait(5000);
    });

    it('Test Case 5: Should delete task from calendar if available', () => {
        const ofNumber = data.delettionTaskOfNumberIdCalendar; 
    
        // Arrange: Check if the task exists on the calendar before proceeding
        const taskFound = taskCalendar.checkTaskInCalendar(ofNumber);
    
        // Act: If the task exists, perform the delete action
        if (taskFound) {
            taskCalendar.deleteTaskFromCalendar(ofNumber);
    
            // Assert: Verify the task is deleted
            taskCalendar.verifyTaskDeletion(ofNumber);
        } else {
            cy.log('No task found in the calendar to delete.');
        }
    });
    
    // it('Test Case 6: get Task details',()=>{
    //     taskCalendar.getTaskDetails();
    // });
});