import {dataCy} from '../../support/utils'

/// <reference types="cypress" />
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
const addTodo = (content) => {
  cy.get(dataCy('new-todo'))
    .type(`${content}{enter}`)
}

it('adds two items', () => {
  addTodo('first item')
  addTodo('second item')
  // fill the selector
  // maybe use "tid" function
  cy.get(dataCy('todo')).should('have.length', 2)
})
