/// <reference types="cypress" />
it('does not allow entered empty title', () => {
  // let's reset the data
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/') // loads 2 todos
  cy.on('uncaught:exception', e => {
    // only ignore the error message from blank title
    return !e.message.includes('Cannot add a blank todo')
  })
  cy.get('input.new-todo')
    .type('write code{enter}')
    .type('write tests{enter}')
    .type(' {enter}')
  // confirm the blank todo has not been added
  cy.get('li.todo').should('have.length', 2)
  cy.get('li.todo label').should('not.have.text', ' ')
})

it('renders empty title', () => {
  // prepare to stub network request BEFORE it is made
  // by the loading application
  cy.server()
  cy.route('/todos', 'fixture:empty-title')
  cy.visit('/')
})

it('handles todos with blank title', () => {
  // stub the initial data load
  // so the application always starts with 0 items
  cy.server()
  cy.route('/todos', []).as('initial')
  cy.visit('/')
  // make sure the network call has finished
  cy.wait('@initial')

  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'setNewTodo', ' ')

  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'addTodo')

  // confirm the application is not breaking
  cy.get('li.todo').should('have.length', 1)
    .find('label').should('have.text', ' ')
})

