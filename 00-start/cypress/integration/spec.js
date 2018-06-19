/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  // this assertion fails on purpose
  // https://on.cypress.io/contains
  cy.contains('Part of TodoMVC', { timeout: 60000 })
})
