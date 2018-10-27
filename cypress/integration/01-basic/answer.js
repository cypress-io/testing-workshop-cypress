/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  cy.visit('localhost:3000')
  // use ("selector", "text") arguments to "cy.contains"
  cy.contains('h1', 'todos')
  // also good practice is to use data attributes specifically for testing
  //
  // which play well with "Selector Playground" tool
  cy.contains('[data-cy=app-title]', 'todos')
})
