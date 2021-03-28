/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
beforeEach(function resetData() {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite() {
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

it.skip('passes when object gets new property', () => {
  const o = {}
  setTimeout(() => {
    o.foo = 'bar'
  }, 1000)
  // TODO write "get" that returns the given property
  // from an object.
  // cy.wrap(o).pipe(get('foo'))
  // add assertions
})

it('creates todos', () => {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
  cy.get('.todo').should('have.length', 3)
  cy.window().its('app.todos').toMatchSnapshot()
})
