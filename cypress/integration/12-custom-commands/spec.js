/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
beforeEach(function resetData () {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite () {
  cy.visit('/')
})

it('enters 10 todos', function () {
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
  cy.get('.todo').should('have.length', 10)
})

// it('creates a todo')
Cypress.Commands.add('createTodo', todo => {
  const cmd = Cypress.log({
    name: 'create todo',
    message: todo,
    consoleProps () {
      return {
        'Create Todo': todo
      }
    }
  })

  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
    .then($li => {
      cmd
        .set({ $el: $li })
        .snapshot()
        .end()
    })
})
it.only('creates a todo', () => {
  cy.createTodo('my first todo')
})
