// type definitions for Cypress object "cy"
/// <reference types="cypress" />
// @ts-check
import {
  addDefaultTodos,
  addTodos,
  allItems,
  TODO_ITEM_ONE,
  TODO_ITEM_THREE,
  TODO_ITEM_TWO
} from './utils'
import { resetData, visitSite } from '../../support/utils'

describe('TodoMVC', function () {
  beforeEach(resetData)
  beforeEach(visitSite)

  context('No Todos', function () {
    it('should hide #main and #footer', function () {
      // Unlike the TodoMVC tests, we don't need to create
      // a gazillion helper functions which are difficult to
      // parse through. Instead we'll opt to use real selectors
      // so as to make our testing intentions as clear as possible.
      //
      // http://on.cypress.io/get
      allItems().should('not.exist')
      cy.get('.footer').should('not.exist')
    })
  })

  context('New Todo', function () {
    // These tests confirm that add new Todo items works.
    // All tests go through the DOM and events just like a real user would.

    // Input element selector for typing new todo title
    const NEW_TODO = '.new-todo'

    it('should allow me to add todo items', function () {
      cy.get(NEW_TODO).type(TODO_ITEM_ONE).type('{enter}')
      allItems().eq(0).find('label').should('contain', TODO_ITEM_ONE)
      cy.get(NEW_TODO).type(TODO_ITEM_TWO).type('{enter}')
      allItems().should('have.length', 2)
      allItems().eq(1).find('label').should('contain', TODO_ITEM_TWO)
    })

    it('adds items', function () {
      // create several todos then check the number of items in the list
      cy.get(NEW_TODO)
        .type('todo A{enter}')
        .type('todo B{enter}') // we can continue working with same element
        .type('todo C{enter}') // and keep adding new items
        .type('todo D{enter}')
      allItems().should('have.length', 4)
    })

    it('should append new items to the bottom of the list', function () {
      // this is an example of a custom command
      // which is stored in tests/_support/spec_helper.js
      // you should open up the spec_helper and look at
      addDefaultTodos()

      allItems().eq(0).find('label').should('contain', TODO_ITEM_ONE)
      allItems().eq(1).find('label').should('contain', TODO_ITEM_TWO)
      allItems().eq(2).find('label').should('contain', TODO_ITEM_THREE)
    })

    it('should trim text input', function () {
      // this is an example of another custom command
      // since we repeat the todo creation over and over
      // again. It's up to you to decide when to abstract
      // repetitive behavior and roll that up into a custom
      // command vs explicitly writing the code.
      cy.get(NEW_TODO).type(`    ${TODO_ITEM_ONE}    {enter}`)

      // we use as explicit assertion here about the text instead of
      // using 'contain' so we can specify the exact text of the element
      // does not have any whitespace around it
      allItems().eq(0).should('contain', TODO_ITEM_ONE)
    })

    it('KEY: using app action to add todos. Should show #main when items added', function () {
      addTodos(TODO_ITEM_ONE)
      allItems().eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
    })
  })

  context('KEY: app action spy example', () => {
    it('calls store dispatch', () => {
      cy.window()
        .its('app.$store')
        .then((store) => cy.spy(store, 'dispatch').as('dispatch'))

      addDefaultTodos()
      cy.get('@dispatch').should('have.callCount', 6)
    })
  })

  context('Item', function () {
    it('should allow me to mark items as complete', function () {
      addTodos(TODO_ITEM_ONE, TODO_ITEM_TWO)

      allItems().eq(0).as('firstTodo')
      allItems().eq(1).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()
      cy.get('@firstTodo').should('have.class', 'completed')

      cy.get('@secondTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').find('.toggle').check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('have.class', 'completed')
    })

    it('should allow me to un-mark items as complete', function () {
      addTodos(TODO_ITEM_ONE, TODO_ITEM_TWO)

      allItems().eq(0).as('firstTodo')
      allItems().eq(1).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()
      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo').find('.toggle').uncheck()
      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })
  })

  context('Persistence', function () {
    // mimicking TodoMVC tests
    // by writing out this function
    function testState() {
      allItems()
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
        .and('have.class', 'completed')
      allItems()
        .eq(1)
        .should('contain', TODO_ITEM_TWO)
        .and('not.have.class', 'completed')
    }

    it('should persist its data', function () {
      addTodos(TODO_ITEM_ONE, TODO_ITEM_TWO)

      allItems().eq(0).as('firstTodo')
      cy.get('@firstTodo').find('.toggle').check().then(testState)

      cy.log('note: app actions do not persist!')
    })
  })
})
