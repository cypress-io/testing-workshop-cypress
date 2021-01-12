/// <reference types="cypress" />
describe('retry-ability', () => {
  beforeEach(function resetData() {
    cy.request('POST', '/reset', {
      todos: []
    })
  })

  beforeEach(function visitSite() {
    cy.visit('/')
  })

  it('shows UL', function() {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.contains('ul', 'todo A')
      // confirm that the above element
      //  1. is visible
      .should('be.visible')
      // 2. has class "todo-list"
      .and('have.class', 'todo-list')
      // 3. css property "list-style-type" is equal "none"
      .and('have.css', 'list-style-type', 'none')
  })

  it('shows UL - TDD', function() {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.contains('ul', 'todo A').should($ul => {
      // use TDD assertions
      // $ul is visible
      // $ul has class "todo-list"
      // $ul css has "list-style-type" = "none"
      assert.isTrue($ul.is(':visible'), 'ul is visible')
      assert.include($ul[0].className, 'todo-list')
      assert.isTrue($ul.hasClass('todo-list'))
      assert.equal($ul.css('list-style-type'), 'none')
    })
  })

  it('every item starts with todo', function() {
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.get('.todo label').should($labels => {
      // confirm that there are 4 labels
      // and that each one starts with "todo-"
      expect($labels).to.have.length(4)

      $labels.each((k, el) => {
        expect(el.textContent).to.match(/^todo /)
      })
    })
  })

  it('has 2 items', () => {
    cy.get('.new-todo') // command
      .type('todo A{enter}') // command
      .type('todo B{enter}') // command
    cy.get('.todo-list li') // command
      .should('have.length', 2) // assertion
  })

  it('has the right label', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo A') // assertion
  })

  // flaky test - can pass or not depending on the app's speed
  // to make the test flaky add the timeout
  // in todomvc/app.js "addTodo({ commit, state })" method
  it('has two labels', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li') // command
      .find('label') // command
      .should('contain', 'todo B') // assertion
  })

  it('solution 1: merges queries', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li label') // command
      .should('contain', 'todo B') // assertion
  })

  it('solution 2: alternate commands and assertions', () => {
    cy.get('.new-todo').type('todo A{enter}')
    cy.get('.todo-list li') // command
      .should('have.length', 1) // assertion
      .find('label') // command
      .should('contain', 'todo A') // assertion

    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li') // command
      .should('have.length', 2) // assertion
      .find('label') // command
      .should('contain', 'todo B') // assertion
  })

  it('retries reading the JSON file', () => {
    // note cy.readFile retries reading the file until the should(cb) passes
    // https://on.cypress.io/readfile
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    cy.readFile('./todomvc/data.json').should(data => {
      expect(data).to.have.property('todos')
      expect(data.todos).to.have.length(4, '4 saved items')
      expect(data.todos[0], 'first item').to.include({
        title: 'todo A',
        completed: false
      })
    })
  })
})

describe('Careful with negative assertions', { retries: 2 }, () => {
  beforeEach(function resetData() {
    // cy.intercept('/todos', { body: [], delayMs: 5000 })
  })

  it('uses negative assertion and passes for the wrong reason', () => {
    cy.visit('/?delay=3000')
    cy.get('.loading').should('not.be.visible')
  })

  it('use positive then negative assertion (flakey)', () => {
    cy.visit('/?delay=3000')
    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.get('.loading').should('not.be.visible')
  })

  it('uses cy.route to slow down network response', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/todos',
      response: [],
      delay: 2000
    })
    cy.visit('/?delay=3000')
    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.get('.loading').should('not.be.visible')
  })

  // NOTE: https://github.com/cypress-io/cypress/issues/14511
  it.skip('slows down the network response (does not work)', () => {
    cy.intercept('/todos', {
      body: [],
      delayMs: 2000
    })
    cy.visit('/?delay=3000')
    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.get('.loading').should('not.be.visible')
  })

  it('slows down the network response (works)', () => {
    cy.intercept('/todos', {
      body: [],
      delayMs: 5000
    })
    cy.visit('/?delay=3000')
    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.get('.loading').should('not.be.visible')
  })

  it('slows down the network response (programmatic)', () => {
    cy.intercept('/todos', req => {
      req.reply({
        body: [],
        delayMs: 2000
      })
    })
    cy.visit('/?delay=3000')
    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.get('.loading').should('not.be.visible')
  })
})
