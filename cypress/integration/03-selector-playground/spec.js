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
const addItem = text => {}
it('adds two items', () => {
  addItem('first item')
  addItem('second item')
  cy.get('...').should('have.length', 2)
})
