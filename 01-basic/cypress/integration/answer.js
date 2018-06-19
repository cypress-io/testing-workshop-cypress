/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  // use "selector", "text" arguments to "cy.contains"
  cy.contains('a', 'TodoMVC')
})
