/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('/')
})
it('loads', () => {
  cy.contains('h1', 'todos')
})
// optional test data attribute selector helper
const tid = (id) => `[data-cy="${id}"]`
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('[data-cy="input"]').type(`${text}{enter}`)
}

// to enable this test need to add appropriate "data-cy" attributes
it.skip('adds two items', () => {
  addItem('first item')
  addItem('second item')
  cy.get(tid('item')).should('have.length', 2)
})
