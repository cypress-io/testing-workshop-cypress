/// <reference types="cypress" />
describe('reset data using XHR call', () => {
  beforeEach(() => {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
  beforeEach(() => {
    cy.visit('/')
  })
  /**
   * Adds a todo item
   * @param {string} text
   */
  const addItem = text => {
    cy.get('.new-todo').type(`${text}{enter}`)
  }
  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    cy.task('resetData')
  })
  beforeEach(() => {
    cy.visit('/')
  })
  /**
   * Adds a todo item
   * @param {string} text
   */
  const addItem = text => {
    cy.get('.new-todo').type(`${text}{enter}`)
  }
  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })

  it('sets data to complex object right away', () => {
    cy.task('resetData', {
      todos: [{
        id: '123456abc',
        completed: true,
        title: 'reset data before test'
      }]
    })

    cy.visit('/')
  })

  it('sets data using fixture', () => {
    cy.fixture('two-items').then(todos => {
      cy.task('resetData', { todos })
    })

    cy.visit('/')
  })
})
