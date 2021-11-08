/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

// allow re-running each test up to 2 more attempts
// on failure. This avoids flaky tests on CI
// https://on.cypress.io/test-retries
describe('App Data Store', { retries: 2 }, () => {
  beforeEach(() => {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
  beforeEach(() => {
    cy.visit('/')
  })
  beforeEach(function stubRandomId() {
    let count = 1
    cy.window()
      .its('Math')
      .then((Math) => {
        cy.stub(Math, 'random', () => {
          return `0.${count++}`
        }).as('random') // save reference to the spy
      })
  })

  afterEach(function () {
    // makes debugging failing tests much simpler
    cy.screenshot(this.currentTest.fullTitle(), { capture: 'runner' })
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
    cy.window().its('app.$store.state.todos').should('have.length', 0)
  })

  it('adds items to store', () => {
    addItem('something')
    addItem('something else')
    cy.window().its('app.$store.state.todos').should('have.length', 2)
  })

  it('creates an item with id 1', () => {
    cy.server()
    cy.route('POST', '/todos').as('new-item')
    addItem('something')
    cy.wait('@new-item').its('request.body').should('deep.equal', {
      id: '1',
      title: 'something',
      completed: false
    })
  })

  it('calls spy twice', () => {
    addItem('something')
    addItem('else')
    cy.get('@random').should('have.been.calledTwice')
  })

  it('puts todos in the store', () => {
    addItem('something')
    addItem('else')
    cy.window()
      .its('app.$store.state.todos')
      .should('deep.equal', [
        { title: 'something', completed: false, id: '1' },
        { title: 'else', completed: false, id: '2' }
      ])
  })

  it('adds todos via app', () => {
    // bypass the UI and call app's actions directly from the test
    // app.$store.dispatch('setNewTodo', <desired text>)
    // app.$store.dispatch('addTodo')
    // using https://on.cypress.io/invoke
    cy.window().its('app.$store').invoke('dispatch', 'setNewTodo', 'new todo')

    cy.window().its('app.$store').invoke('dispatch', 'addTodo')
    // and then check the UI
    cy.contains('li.todo', 'new todo')
  })

  it('handles todos with blank title', () => {
    // bypass the UI and call app's actions directly from the test
    // app.$store.dispatch('setNewTodo', <desired text>)
    // app.$store.dispatch('addTodo')
    cy.window().its('app.$store').invoke('dispatch', 'setNewTodo', '  ')

    cy.window().its('app.$store').invoke('dispatch', 'addTodo')

    // confirm the application is not breaking
    cy.get('li.todo')
      .should('have.length', 1)
      .first()
      .should('not.have.class', 'completed')
      .find('label')
      .should('have.text', '  ')
  })
})
