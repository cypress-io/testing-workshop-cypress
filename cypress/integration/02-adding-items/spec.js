/// <reference types="cypress" />

beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: [],
    retryOnStatusCodeFailure: true,
    retryOnNetworkError: true
  })
  cy.visit('localhost:3000')
})

it('loads and checks', () => {
  cy.contains('h1', 'todos')
  const selectors = ['.new-todo', 'footer', 'header']
  selectors.forEach((selector) => cy.get(selector).should('be.visible'))
})

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('can add items and mark an item as completed', () => {
  // adds a few items
  addItem('simple')
  addItem('hard')
  // marks the first item as completed
  cy.contains('li.todo', 'simple').should('exist').find('.toggle').check()
  // confirms the first item has the expected completed class
  cy.contains('li.todo', 'simple').should('have.class', 'completed')
  // confirms the other items are still incomplete
  cy.contains('li.todo', 'hard').should('not.have.class', 'completed')
  // deletes the first item
  // use force: true because we don't want to hover
  cy.contains('li.todo', 'simple').find('.destroy').click({ force: true })
  // confirm the deleted item is gone from the dom
  cy.contains('li.todo', 'simple').should('not.exist')
  // confirm the other item still exists
  cy.contains('li.todo', 'hard').should('exist')
  // resets state
  cy.contains('li.todo', 'hard').find('.destroy').click({ force: true })
  cy.contains('li.todo', 'hard').should('not.exist')
})

it('adds item with random text', () => {
  // use a helper function with Math.random()
  // or Cypress._.random() to generate unique text label
  // KEY: ._.random is so much nicer than Math.floor(Math.random() * 10) + 1
  cy.get('li.todo').should('have.length', 0)
  const randomLabel = `Item ${Cypress._.random(1, 10)}`
  cy.log(randomLabel)
  // add such item
  addItem(randomLabel)
  // and make sure it is visible and does not have class "completed"
  cy.contains('li.todo', randomLabel)
    .should('be.visible')
    .and('not.have.class', 'completed')

  cy.contains('li.todo', randomLabel).find('.destroy').click({ force: true })
})

it('does not allow adding blank todos', () => {
  // KEY uncaught exceptions can just return false, or filter by error message content
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', (e) => {
    // check e.message to match expected error text
    // return false if you want to ignore the error
    return !e.message.includes('Cannot add a blank todo')
  })

  addItem('')
  addItem(' ')
  cy.get('li.todo').should('not.exist')
  // try adding an item with just spaces
})
