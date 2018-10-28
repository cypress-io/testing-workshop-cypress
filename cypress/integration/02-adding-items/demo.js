beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: []
  })
  cy.visit('localhost:3000')
})

it('adds items', function () {
  cy
    .get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('.todo-list li').should('have.length', 2)
})
