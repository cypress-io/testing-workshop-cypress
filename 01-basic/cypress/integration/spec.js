/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  // this assertion fails on purpose
  // can you fix it?
  cy.contains('Part of TodoMVC')
})
