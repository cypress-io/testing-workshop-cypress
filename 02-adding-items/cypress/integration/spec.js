/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('a', 'TodoMVC')
})
it('adds two items', () => {
  // repeat twice
  // get the input field
  // type text and "enter"
  // assert that the new Todo item
  // has been added added to the list
})
