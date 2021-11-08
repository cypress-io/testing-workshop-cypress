/// <reference types="cypress" />

import { resetDatabase } from '../../support/utils'

beforeEach(() => {
  // application should be running at port 3000
  // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
  resetDatabase()
  cy.visit('/')
})
it('loads', () => {
  cy.contains('h1', 'todos')
})
// optional test data attribute selector helper
const getBySel = (sel) => cy.get(`[data-cy="${sel}"]`)
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  // write Cy commands here to add the new item
  getBySel('new-todo').type(text).type('{enter}')
}
it('adds two items', () => {
  addItem('first item')
  addItem('second item')
  // fill the selector
  // maybe use "tid" function
  getBySel('todo').should('have.length', 2)
  getBySel('destroy').click({ multiple: true, force: true })
})

it('uses experimental studio', () => {
  /* ==== Generated with Cypress Studio ==== */
  cy.get('[data-cy=new-todo]').clear()
  cy.get('[data-cy=new-todo]').type('first item{enter}')
  cy.get('.view').click()
  cy.get('[data-cy=new-todo]').clear()
  cy.get('[data-cy=new-todo]').type('2nd item{enter}')
  cy.get(':nth-child(1) > .view > [data-cy=destroy]').click({ force: true })
  cy.get('[data-cy=destroy]').click({ force: true })
  /* ==== End Cypress Studio ==== */
})
