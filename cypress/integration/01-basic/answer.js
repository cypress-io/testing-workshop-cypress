/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  cy.visit('localhost:3000')
  // use "selector", "text" arguments to "cy.contains"
  cy.contains('a', 'TodoMVC')
})
