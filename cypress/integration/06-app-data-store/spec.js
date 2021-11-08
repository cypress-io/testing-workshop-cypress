/// <reference types="cypress" />
// application should be running at port 3000
// and the "localhost:3000" is set as "baseUrl" in "cypress.json"

beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: []
  })
  cy.visit('/')
})

it('has window.app property', () => {
  // get its "app" property
  // and confirm it is an object
  // see https://on.cypress.io/its
  cy.window().its('app').should('be.an', 'object')
})

it('has vuex store', () => {
  // check app's $store property
  // and confirm it has typical Vuex store methods
  // see https://on.cypress.io/its
  cy.window()
    .its('app.$store')
    .should('include.keys', ['commit', 'dispatch'])
    .its('state')
    .should('be.an', 'object')
    .its('todos')
    .should('be.an', 'array')
})

it('starts with an empty store', () => {
  // the list of todos in the Vuex store should be empty
  cy.window().its('app.$store.state.todos').should('be.empty')
})

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('creates items with deterministic ids 1 and 2 using a stub, and checks store', () => {
  // get the application's "window.Math" object using cy.window
  // replace Math.random with cy.stub and store the stub under an alias
  // otherwise the app is setup to give a random number for the id
  let count = 1
  // KEY: cy.stub(object, methodName).callsFake(function)
  cy.window()
    .its('Math')
    .then((Math) => cy.stub(Math, 'random').callsFake(() => `0.${count++}`))
    .as('random')
  // create todos using addItem("foo")
  addItem('something')
  addItem('else')
  // and then confirm that the stub was called
  cy.get('@random').should('be.calledTwice')

  cy.window()
    .its('app.$store.state.todos')
    .should('have.length', 2)
    .and('deep.equal', [
      { title: 'something', completed: false, id: '1' },
      { title: 'else', completed: false, id: '2' }
    ])
})

// bypass the UI and call app's actions directly from the test
// app.$store.dispatch('setNewTodo', <desired text>)
// app.$store.dispatch('addTodo')
// using https://on.cypress.io/invoke
const storeDispatch = (args) =>
  cy
    .window()
    .its('app.$store')
    .invoke('dispatch', ...args)
const addTodoAction = (todoText) => {
  storeDispatch(['setNewTodo', todoText])
  return storeDispatch(['addTodo', todoText])
}

it('adds todos via app action', () => {
  addTodoAction('new todo')
  cy.contains('li.todo', 'new todo')
})

it('handles todos with blank title, confirm the application is not breaking', () => {
  addTodoAction(' ')
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', ' ')
})
