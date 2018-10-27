/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')
  // this assertion fails on purpose
  // can you fix it?
  cy.contains('h1', 'Todos App')
})
