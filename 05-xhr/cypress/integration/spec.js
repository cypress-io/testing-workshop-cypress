/// <reference types="cypress" />
// note, we are not resetting the server before each test
it('starts with zero items', () => {
  // start Cypress network server spying
  // spy on route `GET /todos`
  // THEN visit the page
  cy.visit('/')
  // wait for `GET /todos` route
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})
