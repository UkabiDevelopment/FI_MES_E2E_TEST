export function updatejsonFile(filename, key, value){
 const filePath = `cypress/fixtures/${filename}.json`;

 return cy.readFile(filePath).then((data) => {
        data[key] = value;
         // Write the updated data back to the file
         return cy.writeFile(filePath, data).then(() => {
            // Confirm that the file write is complete
            cy.log(`Updated ${key} to ${value}`);
        });
 });
}