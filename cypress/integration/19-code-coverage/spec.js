/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('/')
})

it('adds 2 todos', () => {
  cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
  cy.get('.todo-list li').should('have.length', 2)
})

// add more tests to cover more application source code
