/// <reference types="cypress" />
it('runs hello world', () => {
  cy.task('hello', 'world').should('equal', 'hello, world')
})
