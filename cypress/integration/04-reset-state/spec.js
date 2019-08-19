/// <reference types="cypress" />
beforeEach(() => {
  // application should be running at port 3000
  // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
  cy.request("POST", "/reset", {
    todos: []
  });
  cy.visit("/");
});
it("loads", () => {
  cy.contains("h1", "todos");
});
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get(".new-todo").type(`${text}{enter}`);
};
it("adds two items", () => {
  addItem("first item");
  addItem("second item");
  cy.get("li.todo").should("have.length", 2);
});
