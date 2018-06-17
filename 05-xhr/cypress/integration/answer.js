/// <reference types="cypress" />
// note, we are not resetting the server before each test
it.only('starts with zero items', () => {
  // start Cypress network server spying
  // spy on route `GET /todos`
  // THEN visit the page
  // cy.server()
  // cy.route('GET', '/todos').as('todos')
  cy.visit('/')
  cy.wait(1000)
  // wait for `GET /todos` response
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})
