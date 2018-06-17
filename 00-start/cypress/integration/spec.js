/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('Part of TodoMVC')
})
