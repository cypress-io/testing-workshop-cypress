/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('/')
})
it('loads', () => {
  cy.contains('a', 'TodoMVC')
})
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('[data-cy="input"]').type(`${text}{enter}`)
}
it('adds two items', () => {
  addItem('first item')
  addItem('second item')
  cy.get('[data-cy="item"]').should('have.length', 2)
})
