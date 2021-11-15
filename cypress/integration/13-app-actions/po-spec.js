// type definitions for Cypress object "cy"
/// <reference types="cypress" />

// check this file using TypeScript if available
// @ts-check

import { TodoPage, todoPage } from './todo-page-object'
import { resetData, visitSite } from '../../support/utils'

// ***********************************************
// All of these tests are written to implement
// the official TodoMVC tests written for Selenium.
//
// The Cypress tests cover the exact same functionality,
// and match the same test names as TodoMVC.
// Please read our getting started guide
// https://on.cypress.io/introduction-to-cypress
//
// You can find the original TodoMVC tests here:
// https://github.com/tastejs/todomvc/blob/master/tests/test.js
// ***********************************************

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
      cy.get('.todo-list li').should('not.exist')
      cy.get('.footer').should('not.exist')
    })
  })

  context('New Todo', function () {
    it('should allow me to add todo items', function () {
      // create 1st todo
      cy.get('.new-todo').type(TodoPage.TODO_ITEM_ONE).type('{enter}')

      // make sure the 1st label contains the 1st todo text
      cy.get('.todo-list li')
        .eq(0)
        .find('label')
        .should('contain', TodoPage.TODO_ITEM_ONE)

      // create 2nd todo
      cy.get('.new-todo').type(TodoPage.TODO_ITEM_TWO).type('{enter}')

      // make sure the 2nd label contains the 2nd todo text
      cy.get('.todo-list li')
        .eq(1)
        .find('label')
        .should('contain', TodoPage.TODO_ITEM_TWO)
    })

    it('adds items', function () {
      // create several todos then check the number of items in the list
      cy.get('.new-todo')
        .type('todo A{enter}')
        .type('todo B{enter}') // we can continue working with same element
        .type('todo C{enter}') // and keep adding new items
        .type('todo D{enter}')
      cy.get('.todo-list li').should('have.length', 4)
    })

    it('should clear text input field when an item is added', function () {
      cy.get('.new-todo').type(TodoPage.TODO_ITEM_ONE).type('{enter}')
      cy.get('.new-todo').should('have.text', '')
    })

    it(
      'should append new items to the bottom of the list',
      { defaultCommandTimeout: 10000 },
      function () {
        todoPage.createTodos()

        // even though the text content is split across
        // multiple <span> and <strong> elements
        // `cy.contains` can verify this correctly

        cy.get('@todos')
          .eq(0)
          .find('label')
          .should('contain', TodoPage.TODO_ITEM_ONE)
        cy.get('@todos')
          .eq(1)
          .find('label')
          .should('contain', TodoPage.TODO_ITEM_TWO)
        cy.get('@todos')
          .eq(2)
          .find('label')
          .should('contain', TodoPage.TODO_ITEM_THREE)
      }
    )

    it('should trim text input', function () {
      todoPage.createTodo(` ${TodoPage.TODO_ITEM_ONE} `)

      cy.get('.todo-list li').eq(0).should('contain', TodoPage.TODO_ITEM_ONE)
    })

    it('should show #main when items added', function () {
      todoPage.createTodo(` ${TodoPage.TODO_ITEM_ONE} `)
      todoPage
        .todos()
        .eq(0)
        .find('label')
        .should('contain', TodoPage.TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
    })
  })

  context('Item', function () {
    // New commands used here:
    // - cy.clear    https://on.cypress.io/api/clear

    it('should allow me to mark items as complete', function () {
      // we are aliasing the return value of
      // our custom command 'createTodo'
      //
      // the return value is the <li> in the <ul.todos-list>
      todoPage.createTodo(TodoPage.TODO_ITEM_ONE).as('firstTodo')
      todoPage.createTodo(TodoPage.TODO_ITEM_TWO).as('secondTodo')

      todoPage.toggle(0)
      cy.get('@firstTodo').should('have.class', 'completed')

      cy.get('@secondTodo').should('not.have.class', 'completed')
      todoPage.toggle(1)

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('have.class', 'completed')
    })

    it('should allow me to un-mark items as complete', function () {
      todoPage.createTodo(TodoPage.TODO_ITEM_ONE).as('firstTodo')
      todoPage.createTodo(TodoPage.TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()
      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo').find('.toggle').uncheck()
      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })
  })

  context('Persistence', function () {
    it('should persist its data', function () {
      // mimicking TodoMVC tests
      // by writing out this function
      function testState() {
        cy.get('@firstTodo').should('contain', TodoPage.TODO_ITEM_ONE)
        cy.get('@secondTodo').should('contain', TodoPage.TODO_ITEM_TWO)
      }

      todoPage.createTodo(TodoPage.TODO_ITEM_ONE).as('firstTodo')
      todoPage.createTodo(TodoPage.TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo')
        .find('.toggle')
        .check()
        .then(testState)

        .reload()
        .then(testState)
    })
  })
})
