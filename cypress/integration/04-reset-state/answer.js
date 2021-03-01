/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  // you can use separate "beforeEach" hooks or a single one
  beforeEach(() => {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    const emptyTodos = {
      todos: []
    }
    const str = JSON.stringify(emptyTodos, null, 2) + '\n'
    // file path is relative to the project's root folder
    // where cypress.json is located
    cy.writeFile('todomvc/data.json', str, 'utf8')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    cy.task('resetData')
    cy.visit('/')
    cy.get('li.todo').should('have.length', 0)
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('set initial data', () => {
  it('sets data to complex object right away', () => {
    cy.task('resetData', {
      todos: [
        {
          id: '123456abc',
          completed: true,
          title: 'reset data before test'
        }
      ]
    })

    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 1)
  })

  it('sets data using fixture', () => {
    cy.fixture('two-items').then((todos) => {
      // "todos" is an array
      cy.task('resetData', { todos })
    })

    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 2)
  })
})
