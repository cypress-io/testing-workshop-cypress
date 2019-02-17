/// <reference types="cypress" />
const isLocalHost = () => Cypress.config('baseUrl').includes('localhost')

if (isLocalHost()) {
  // we can reset data only when running locally
  beforeEach(function resetData () {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
}

beforeEach(function visitSite () {
  cy.log('Visiting', Cypress.config('baseUrl'))
  cy.on('uncaught:exception', (e, runnable) => {
    console.log('error', e)
    console.log('runnable', runnable)
    cy.now('log', 'caught error', e)
    // return true if you WANT test to fail
    return false
  })
  cy.visit('/')
})

it('adds items', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('.todo-list li') // command
    .should('have.length', 4) // assertion
})
