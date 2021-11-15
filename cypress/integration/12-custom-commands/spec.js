/// <reference types="cypress" />

import { resetData, visitSite } from '../../support/utils'

beforeEach(resetData)
beforeEach(visitSite)

// // simple custom command
// Cypress.Commands.add('createTodo', (todo) => {
//   cy.get('.new-todo').type(`${todo}{enter}`)
// })

// with full command log
Cypress.Commands.add('createTodo', (todo) => {
  Cypress.log({
    name: 'create todo (command name)',
    message: `${todo} (command message)`,
    consoleProps: () => ({ 'Create Todo (command consoleProps)': todo })
  })

  return cy
    .get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
})

it.skip('enters 10 todos - does not work when running all specs https://github.com/cypress-io/cypress/issues/3090', function () {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
    .type('todo 3{enter}')
    .type('todo 4{enter}')
    .type('todo 5{enter}')
    .type('todo 6{enter}')
    .type('todo 7{enter}')
    .type('todo 8{enter}')
    .type('todo 9{enter}')
  cy.get('.todo').should('have.length', 10).toMatchSnapshot()
})

// KEY: advanced logging, snapshots
it.skip('creates a todo, does advanced logging takes a snapshot - does not work when running all specs https://github.com/cypress-io/cypress/issues/3090', () => {
  cy.createTodo('my first todo')
  cy.window().its('app.todos').toMatchSnapshot()
})

it('cy.pipe keeps running our function until the assertion that follows is true', () => {
  const o = {}

  setTimeout(() => {
    o.foo = 'bar'
  }, 1000)

  const get = (name) => (from) => {
    console.log('getting', from)
    return from[name]
  }

  // KEY: cy.pipe keeps running our function until the assertion that follows is true
  cy.wrap(o).pipe(get('foo')).should('not.be.undefined').and('equal', 'bar')
})
