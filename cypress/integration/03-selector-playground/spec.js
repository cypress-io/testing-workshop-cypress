/// <reference types="cypress" />
/* eslint-disable no-unused-vars */

beforeEach(() => {
  // application should be running at port 3000
  // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
  cy.visit('/')
})
it('loads', () => {
  cy.contains('h1', 'todos')
})
// optional test data attribute selector helper
// const tid = id => `[data-cy="${id}"]`
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  // write Cy commands here to add the new item
}
it('adds two items', () => {
  addItem('first item')
  addItem('second item')
  // fill the selector
  // maybe use "tid" function
  cy.get('...').should('have.length', 2)
})
