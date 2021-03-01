// type definitions for Cypress object "cy"
/// <reference types="cypress" />

// check this file using TypeScript if available
// @ts-check

import { TodoPage, todoPage } from './todo-page-object'

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

describe('TodoMVC - React', function () {
  beforeEach(function () {
    todoPage.visit()
  })

  // a very simple example helpful during presentations
  it('adds 2 todos', function () {
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })

  context('When page is initially opened', function () {
    it('should focus on the todo input field', function () {
      // get the currently focused element and assert
      // that it has class='new-todo'
      //
      // http://on.cypress.io/focused
      cy.focused().should('have.class', 'new-todo')
    })
  })

  context('No Todos', function () {
    it('should hide #main and #footer', function () {
      // Unlike the TodoMVC tests, we don't need to create
      // a gazillion helper functions which are difficult to
      // parse through. Instead we'll opt to use real selectors
      // so as to make our testing intentions as clear as possible.
      //
      // http://on.cypress.io/get
      cy.get('.todo-list li').should('not.exist')
      cy.get('.main').should('not.exist')
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

    it('should append new items to the bottom of the list', function () {
      todoPage.createTodos()

      // even though the text content is split across
      // multiple <span> and <strong> elements
      // `cy.contains` can verify this correctly
      cy.get('.todo-count').contains('3 items left')

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
    })

    it('should trim text input', function () {
      todoPage.createTodo(` ${TodoPage.TODO_ITEM_ONE} `)

      // we use as explicit assertion here about the text instead of
      // using 'contain' so we can specify the exact text of the element
      // does not have any whitespace around it
      cy.get('.todo-list li').eq(0).should('have.text', TodoPage.TODO_ITEM_ONE)
    })

    it('should show #main and #footer when items added', function () {
      todoPage.createTodo(TodoPage.TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
      cy.get('.footer').should('be.visible')
    })
  })

  context('Mark all as completed', function () {
    // New commands used here:
    // - cy.check    https://on.cypress.io/api/check
    // - cy.uncheck  https://on.cypress.io/api/uncheck

    beforeEach(function () {
      todoPage.createTodos()
    })

    it('should allow me to mark all items as completed', function () {
      // complete all todos
      // we use 'check' instead of 'click'
      // because that indicates our intention much clearer.
      // we need to pass force: true because the application
      // does not show a checkbox - instead ir shows a styled
      // label, while the checkbox is hidden
      // If you want to click on the label instead use
      //  cy.get('label[for=toggle-all]').click()
      cy.get('.toggle-all').check({ force: true })

      // get each todo li and ensure its class is 'completed'
      cy.get('@todos').eq(0).should('have.class', 'completed')
      cy.get('@todos').eq(1).should('have.class', 'completed')
      cy.get('@todos').eq(2).should('have.class', 'completed')
    })

    it('should allow me to clear the complete state of all items', function () {
      // check and then immediately uncheck
      cy.get('.toggle-all').check({ force: true }).uncheck({
        force: true
      })

      cy.get('@todos').eq(0).should('not.have.class', 'completed')
      cy.get('@todos').eq(1).should('not.have.class', 'completed')
      cy.get('@todos').eq(2).should('not.have.class', 'completed')
    })

    it('complete all checkbox should update state when items are completed / cleared', function () {
      // alias the .toggle-all for reuse later
      cy.get('.toggle-all')
        .as('toggleAll')
        .check({
          force: true
        })
        // this assertion is silly here IMO but
        // it is what TodoMVC does
        .should('be.checked')

      // alias the first todo and then click it
      cy.get('.todo-list li').eq(0).as('firstTodo').find('.toggle').uncheck()

      // reference the .toggle-all element again
      // and make sure its not checked
      cy.get('@toggleAll').should('not.be.checked')

      // reference the first todo again and now toggle it
      cy.get('@firstTodo').find('.toggle').check()

      // assert the toggle all is checked again
      cy.get('@toggleAll').should('be.checked')
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

    it('should allow me to edit an item', function () {
      todoPage.createTodos()

      cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        // TODO: fix this, dblclick should
        // have been issued to label
        .find('label')
        .dblclick()

      // clear out the inputs current value
      // and type a new value
      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        .type('{enter}')

      // explicitly assert about the text value
      cy.get('@todos').eq(0).should('contain', TodoPage.TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TodoPage.TODO_ITEM_THREE)
    })
  })

  context('Editing', function () {
    // New commands used here:
    // - cy.blur    https://on.cypress.io/api/blur

    beforeEach(function () {
      todoPage.createTodos()
    })

    it('should hide other controls when editing', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.toggle').should('not.be.visible')
      cy.get('@secondTodo').find('label').should('not.be.visible')
    })

    it('should save edits on blur', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        // we can just send the blur event directly
        // to the input instead of having to click
        // on another button on the page. though you
        // could do that its just more mental work
        .blur()

      cy.get('@todos').eq(0).should('contain', TodoPage.TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TodoPage.TODO_ITEM_THREE)
    })

    it('should trim entered text', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('    buy some sausages    ')
        .type('{enter}')

      cy.get('@todos').eq(0).should('contain', TodoPage.TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TodoPage.TODO_ITEM_THREE)
    })

    it('should remove the item if an empty text string was entered', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('{enter}')

      cy.get('@todos').should('have.length', 2)
    })

    it('should cancel edits on escape', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('foo{esc}')

      cy.get('@todos').eq(0).should('contain', TodoPage.TODO_ITEM_ONE)
      cy.get('@todos').eq(1).should('contain', TodoPage.TODO_ITEM_TWO)
      cy.get('@todos').eq(2).should('contain', TodoPage.TODO_ITEM_THREE)
    })
  })

  context('Counter', function () {
    it('should display the current number of todo items', function () {
      todoPage.createTodo(TodoPage.TODO_ITEM_ONE)
      cy.get('.todo-count').contains('1 item left')
      todoPage.createTodo(TodoPage.TODO_ITEM_TWO)
      cy.get('.todo-count').contains('2 items left')
    })
  })

  context('Clear completed button', function () {
    beforeEach(function () {
      todoPage.createTodos()
    })

    it('should display the correct text', function () {
      todoPage.toggle(0)
      cy.get('.clear-completed').contains('Clear completed')
    })

    it('should remove completed items when clicked', function () {
      todoPage.toggle(1)
      todoPage.clearCompleted()
      todoPage.todos().should('have.length', 2)
      todoPage.todos(0).should('contain', TodoPage.TODO_ITEM_ONE)
      todoPage.todos(1).should('contain', TodoPage.TODO_ITEM_THREE)
    })

    it('should be hidden when there are no items that are completed', function () {
      todoPage.toggle(1)
      cy.get('.clear-completed').should('be.visible').click()
      cy.get('.clear-completed').should('not.exist')
    })
  })

  context('Persistence', function () {
    it('should persist its data', function () {
      // mimicking TodoMVC tests
      // by writing out this function
      function testState() {
        cy.get('@firstTodo')
          .should('contain', TodoPage.TODO_ITEM_ONE)
          .and('have.class', 'completed')
        cy.get('@secondTodo')
          .should('contain', TodoPage.TODO_ITEM_TWO)
          .and('not.have.class', 'completed')
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

  context('Routing', function () {
    beforeEach(function () {
      todoPage.createTodos()
    })

    it('should allow me to display active items', function () {
      // instead letting Cypress manipulate the DOM
      // cy.get('@todos')
      //   .eq(1)
      //   .find('.toggle')
      //   .check()
      // go through the Page Object
      todoPage.toggle(1)
      todoPage.filter('Active')
      todoPage.todos(0).should('contain', TodoPage.TODO_ITEM_ONE)
      todoPage.todos(1).should('contain', TodoPage.TODO_ITEM_THREE)
    })

    it('should respect the back button', function () {
      todoPage.toggle(1)
      todoPage.filter('Active')
      todoPage.filter('Completed')
      todoPage.todos().should('have.length', 1)
      cy.go('back')
      todoPage.todos().should('have.length', 2)
      cy.go('back')
      todoPage.todos().should('have.length', 3)
    })

    it('should allow me to display completed items', function () {
      todoPage.toggle(1)
      todoPage.filter('Completed')
      todoPage.todos().should('have.length', 1)
    })

    it('should allow me to display all items', function () {
      todoPage.toggle(1)
      todoPage.filter('Active')
      todoPage.filter('Completed')
      todoPage.filter('All')
      todoPage.todos().should('have.length', 3)
    })

    it('should highlight the currently applied filter', function () {
      // using a within here which will automatically scope
      // nested 'cy' queries to our parent element <ul.filters>
      cy.get('.filters').within(function () {
        cy.contains('All').should('have.class', 'selected')
        cy.contains('Active').click().should('have.class', 'selected')
        cy.contains('Completed').click().should('have.class', 'selected')
      })
    })
  })
})
