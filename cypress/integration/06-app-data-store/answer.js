/// <reference types="cypress" />
beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(() => {
  cy.visit('/')
})
beforeEach(function stubRandomId () {
  let count = 1
  cy.window().its('Math').then(Math => {
    cy
      .stub(Math, 'random', () => {
        return `0.${count++}`
      })
      .as('random') // save reference to the spy
  })
})
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

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
  cy
    .window()
    .its('app.$store.state.todos')
    .should('deep.equal', [
      { title: 'something', completed: false, id: '1' },
      { title: 'else', completed: false, id: '2' }
    ])
})
