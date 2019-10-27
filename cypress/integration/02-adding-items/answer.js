/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('localhost:3000')
})

it('loads', () => {
  cy.contains('h1', 'todos')
})

it('adds two items', () => {
  cy.get('.new-todo').type('first item{enter}')
  cy.contains('li.todo', 'first item').should('be.visible')
  cy.get('.new-todo').type('second item{enter}')
  cy.contains('li.todo', 'second item').should('be.visible')
})

it('can mark an item as completed', () => {
  // adds a few items
  addItem('simple')
  addItem('hard')

  // marks the first item as completed
  cy.contains('li.todo', 'simple')
    .should('exist')
    .find('.toggle')
    .check()

  // confirms the first item has the expected completed class
  cy.contains('li.todo', 'simple').should('have.class', 'completed')
  // confirms the other items are still incomplete
  cy.contains('li.todo', 'hard').should('not.have.class', 'completed')
})

it('can delete an item', () => {
  // adds a few items
  addItem('simple')
  addItem('hard')
  // deletes the first item
  cy.contains('li.todo', 'simple')
    .should('exist')
    .find('.destroy')
    // use force: true because we don't wsnt to hover
    .click({ force: true })

  // confirm the deleted item is gone from the dom
  cy.contains('li.todo', 'simple').should('not.exist')
  // confirm the other item still exists
  cy.contains('li.todo', 'hard').should('exist')
})

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('can add many items', () => {
  // assumes there are no items at the beginning

  const N = 5
  for (let k = 0; k < N; k += 1) {
    addItem(`item ${k}`)
  }
  // check number of items
  cy.get('li.todo').should('have.length', 5)
})

it('adds item with random text', () => {
  const randomLabel = `Item ${Math.random()
    .toString()
    .slice(2, 14)}`

  addItem(randomLabel)
  cy.contains('li.todo', randomLabel)
    .should('be.visible')
    .and('not.have.class', 'completed')
})

it('starts with zero items', () => {
  cy.get('li.todo').should('have.length', 0)
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
