/// <reference types="cypress" />
/* eslint-disable no-unused-vars */

describe('retry-ability', () => {
  beforeEach(function resetData() {
    cy.request('POST', '/reset', {
      todos: []
    })
    cy.visit('/')
  })
  context('BDD, TDD, then, should, cy.wrap', () => {
    beforeEach(() => {
      cy.get('.new-todo')
        .type('todo A{enter}')
        .type('todo B{enter}')
        .type('todo C{enter}')
        .type('todo D{enter}')
    })

    // confirm that the element
    //  1. is visible
    //  2. has class "todo-list"
    //  3. css property "list-style-type" is equal "none"
    // note: you can verify CSS with have.css and assert Computed styles
    // KEY: there are 4 assertion styles, 3 of which can retry
    it('BDD style - retries', function () {
      cy.contains('ul', 'todo A')
        .should('be.visible')
        .should('have.class', 'todo-list')
        .and('have.css', 'list-style-type', 'none')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'color', 'rgb(221, 221, 221)')
    })

    it('TDD with then() - does not retry', function () {
      cy.contains('ul', 'todo A').then(($ul) => {
        // KEY: after then(), there will not be any built-in cypress retries
        expect($ul).to.be.visible
        expect($ul).to.have.class('todo-list')
        expect($ul).to.have.css('list-style-type', 'none')
        expect($ul).to.have.css('font-size', '14px')
        expect($ul).to.have.css('color', 'rgb(221, 221, 221)')
      })
    })

    it('TDD with should() - retries', function () {
      cy.contains('ul', 'todo A').should(($ul) => {
        // KEY: using should(), TDD style tests can retry
        expect($ul).to.be.visible
        expect($ul).to.have.class('todo-list')
        expect($ul).to.have.css('list-style-type', 'none')
        expect($ul).to.have.css('font-size', '14px')
        expect($ul).to.have.css('color', 'rgb(221, 221, 221)')
      })
    })

    it('BDD with then() using cy.wrap - retries', function () {
      cy.contains('ul', 'todo A').then(($ul) => {
        // KEP: wrap is used for BDD style and retry ability inside the then() block
        cy.wrap($ul)
          .should('have.class', 'todo-list')
          .and('have.css', 'list-style-type', 'none')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'color', 'rgb(221, 221, 221)')
      })
    })

    it.skip('BDD with should - WILL NOT WORK', function () {
      cy.contains('ul', 'todo A').should(($ul) => {
        cy.wrap($ul)
          .should('have.class', 'todo-list')
          .and('have.css', 'list-style-type', 'none')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'color', 'rgb(221, 221, 221)')
      })
    })

    it('assert style - terrible, do not use it', () => {
      cy.contains('ul', 'todo A').should(($ul) => {
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

    it('every item starts with todo', function () {
      cy.get('.todo label').should(($labels) => {
        // confirm that there are 4 labels
        // and that each one starts with "todo-"
        // KEY: since we are in should context, we have to use TDD style
        expect($labels).to.have.length(4)

        $labels.each((index, $label) => {
          // assertions that do the same thing
          expect($label).to.contain.text(`todo`)
          expect($label.textContent).to.match(/^todo /)
        })
      })
    })
  })

  context('flaky chains: merge queries or use CA CA pattern', () => {
    // flaky test - can pass or not depending on the app's speed
    // to make the test flaky add the timeout
    // in todomvc/app.js "addTodo({ commit, state })" method
    it.skip(
      'has two labels - may flake, because only the last command is retried',
      { retries: 2 },
      () => {
        cy.get('.new-todo').type('todo A{enter}')
        cy.get('.todo-list li') // command 1
          .find('label') // command 2. KEY: only the last command is retried
          .should('contain', 'todo A') // assertion

        cy.get('.new-todo').type('todo B{enter}')
        cy.get('.todo-list li') // command
          .find('label') // command
          .should('contain', 'todo B') // assertion
      }
    )

    it('solution 1: merges queries; retry the whole query vs one command at a time', () => {
      cy.get('.new-todo').type('todo A{enter}')
      cy.get('.todo-list li label') // KEY: retry the whole query vs one command at a time
        .should('contain', 'todo A')

      cy.get('.new-todo').type('todo B{enter}')
      cy.get('.todo-list li label').should('contain', 'todo B')
    })

    /* instead of chaining too man its() together, merge them
    cy.window()
      .its('app')             // runs once
      .its('model')           // runs once
      .its('todos')           // retried
      .should('have.length', 2)

    // ✅ recommended
    cy.window()
      .its('app.model.todos') // retried
      .should('have.length', 2)
    */

    it('solution 2: alternate commands and assertions', () => {
      cy.get('.new-todo').type('todo A{enter}')
      // KEY: CA CA pattern
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
  })

  it('retries reading the JSON file', () => {
    // add N items via UI
    cy.get('.new-todo')
      .type('todo A{enter}')
      .type('todo B{enter}')
      .type('todo C{enter}')
      .type('todo D{enter}')
    // then read the file ./todomvc/data.json
    // note cy.readFile retries reading the file until the should(cb) passes
    // https://on.cypress.io/readfil
    cy.readFile('./todomvc/data.json').should((data) => {
      expect(data).to.have.property('todos')
      expect(data.todos).to.have.length(4, '4 items yo')
      // and assert it has the N items and the first item
      // assert that the first entered is the first on the list
      expect(data.todos[0], 'first item yo').to.have.property('title', 'todo A')
      // KEY: in TDD style to.include can be used for partial matching of object properties
      // similar to BDD style partial matching of object properties with 'should('have.contain', '...') or should('contain')
      expect(data.todos[0], 'first item yo').to.include({
        title: 'todo A',
        completed: false
      })
    })
  })
})

// if the tests are flaky, add test retries
// https://on.cypress.io/test-retries
describe('Careful with negative assertions', () => {
  it('hides the loading element', () => {
    cy.visit('/')
    // the loading element should not be visible
    cy.get('.loading').should('not.be.visible')
  })

  it('uses negative assertion and passes for the wrong reason', () => {
    cy.visit('/?delay=3000')
    // the loading element should not be visible
    cy.get('.loading').should('not.be.visible')
  })

  it('slows down the network response', () => {
    // use cy.intercept to delay the mock response
    cy.intercept('GET', 'todos', {
      body: [],
      statusCode: 200, // change to 404, see what happens
      delayMs: 1000
    }).as('delayedResponse')
    cy.visit('/?delay=1000')

    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.wait('@delayedResponse')
    cy.get('.loading').should('not.be.visible')
  })

  it('slows down the network response (programmatic)', () => {
    // when would we prefer to use programmatic response?
    // in this case does not matter, but imagine the response depends on the request 
    // like "respond with the object computed from the request". Then we would use it
    cy.intercept('GET', '/todos', (req) => {
      req.reply({
        body: [],
        statusCode: 200,
        delayMs: 1000
      })
    }).as('delayedResponse')
    cy.visit('/?delay=1000')

    // first, make sure the loading indicator shows up (positive assertion)
    cy.get('.loading').should('be.visible')
    // then assert it goes away (negative assertion)
    cy.wait('@delayedResponse')
    cy.get('.loading').should('not.be.visible')
  })
})

// KEY: working with aliases
describe('aliases', () => {
  context('are reset before each test', () => {
    before(() => {
      cy.fixture('two-items').as('twoItems')
    })

    it('works in the first test', () => {
      cy.get('@twoItems').should('have.length', 2)
    })

    // NOTE the second test is failing because the alias is reset
    it.skip('does not work in the second test', () => {
      // there is not alias because it is created once before
      // the first test, and is reset before the second test
      cy.get('@twoItems').should('have.length', 2)
    })
  })

  context('should be created before each test', () => {
    beforeEach(() => {
      cy.fixture('two-items').as('twoItems')
    })

    it('works in the first test', () => {
      cy.get('@twoItems').should('have.length', 2)
      // expect(twoItems).to.have.length(2) // will not work, undefined
    })

    it('works in the second test', () => {
      cy.get('@twoItems').should('have.length', 2)
      // expect(twoItems).to.have.length(2) // will not work, undefined
    })
  })

  context('can refer to the alias with this when using function callbacks', () => {
    // cannot use before, still have to repeat the alias before each test, or the 2nd test will fail
    beforeEach(() => { 
      cy.fixture('two-items').as('twoItems')
    })

    it('works in the first test', function () {
      cy.get('@twoItems').should('have.length', 2)
      expect(this.twoItems).to.have.length(2)
      cy.wrap(this.twoItems).should('have.length', 2)
    })

    it('works in the second test', function () {
      cy.get('@twoItems').should('have.length', 2)
      expect(this.twoItems).to.have.length(2)
      cy.wrap(this.twoItems).should('have.length', 2)
    })
  })

  context('If you do not want beforeEach and want to use arrow function expressions', () => {
    // declare a value in the outer scope
    let twoItems

    before(() => {
      // set that value in a then callback
      cy.fixture('two-items').then(items => twoItems = items)
    })

    it('works in the first test', () => {
      expect(twoItems).to.have.length(2)
      cy.wrap(twoItems).should('have.length', 2)
    })

    it('works in the second test', () => {
      expect(twoItems).to.have.length(2)
      cy.wrap(twoItems).should('have.length', 2)
    })
  })

  context('this is similar to what you would do in a unit test, for example with Jest', () => {
    let exampleValue

    before(() => {
      exampleValue = 'some value'
    })

    it('works in the first test', () => {
      expect(exampleValue).to.equal('some value')
      cy.wrap(exampleValue).should('eq', 'some value')
    })

    it('works in the second test', () => {
      expect(exampleValue).to.equal('some value')
      cy.wrap(exampleValue).should('eq', 'some value')
    })
  })
})

describe('timing commands', () => {
  beforeEach(function resetData() {
    cy.request('POST', '/reset', {
      todos: []
    })
  })

  // see solution in the video
  // "Time Part Of A Cypress Test Or A Single Command"
  // https://youtu.be/tjK_FCYikzI
  it('takes less than 2 seconds for the app to load', () => {
    // intercept the GET /todos load and randomly delay the response
    cy.intercept('GET', '/todos', {
      fixture: 'two-items',
      delay: Cypress._.random(1000, 1999)
    })
    cy.visit('/')

    // check the loading indicator is visible
    // take a timestamp after the loading indicator is visible
    let started
    cy.get('.loading').should('be.visible').then(() => started = Date.now())
    // how to check if the loading element goes away in less than 2 seconds?
    // take another timestamp when the indicator goes away.
    // compute the elapsed time
    // assert the elapsed time is less than 2 seconds
    cy.get('.loading').should('not.be.visible').then(() => {
      const finished = Date.now() - started
      expect(finished).to.be.lessThan(2000)
    })
  })
})
