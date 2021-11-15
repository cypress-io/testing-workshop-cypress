/// <reference types="cypress" />
import { resetData } from '../../support/utils'
describe('fixtures', function () {
  beforeEach(resetData)

  it('sets list of todos on the server', () => {
    // load fixture "two-items.json" from the fixtures folder
    // then use it in the POST request
    cy.fixture('two-items').then((list) =>
      cy.request('POST', '/reset', { todos: list })
    )
    // bonus: check that the list has 2 items
    cy.request('GET', '/todos').its('body').should('have.length', 2)
  })

  context('closure variable - much better than using this', () => {
    // store loaded list in this closure variable
    let list

    beforeEach(() => {
      // then store the loaded items in variable "list"
      cy.fixture('two-items').then((l) => (list = l))
    })

    it('has two items', () => {
      if (list) {
        expect(list).to.have.length(2)
      }
    })

    it('sets list from context', () => {
      // post items to the server
      cy.request('POST', '/reset', { todos: list })
      cy.request('GET', '/todos').its('body').should('deep.eq', list)
    })
  })

  context('this.list', () => {
    // it is important to use "function () {}"
    // as a callback to "beforeEach", so we have
    // "this" pointing at the test context
    beforeEach(function () {
      // then assign value to "this.list"
      cy.fixture('two-items').then((list) => (this.list = list))
    })

    // again, it is important to use "function () {}" callback
    // to make sure "this" points at the test context
    it('sets list from context, checks 2 items', function () {
      // POST the items to the server using "/reset"
      cy.request('POST', '/reset', { todos: this.list })
      cy.request('GET', '/todos').its('body').should('deep.eq', this.list)
    })
  })

  context('@list', () => {
    // again, it is important to use "function () {}"
    // as a callback to "beforeEach" to set the right "this"
    beforeEach(function () {
      // use shortcut "as('list')" will save the value into "this.list"
      // cy.fixture(<filename>).as(<alias name>)
      cy.fixture('two-items').as('list')
    })

    // again, it is important to use "function () {}" callback
    // to make sure "this" points at the test context
    it('sets list from context', function () {
      // use "this.list" like before to send the list to the server
      cy.request('POST', '/reset', { todos: this.list })
      cy.request('GET', '/todos').its('body').should('deep.eq', this.list)
    })
  })

  // show that immediately using "this.list" does not work
  it.skip('does not work', function () {
    // load fixture and set it as "list"
    cy.fixture('two-items').as('list')
    // then try checking "this.list" immediately
    // we are using "this.list" BEFORE it was set in
    // the above asynchronous call
    expect(this.list).to.have.length(2)
    cy.request('POST', '/reset', { todos: this.list })
    cy.request('GET', '/todos').its('body').should('deep.eq', this.list)
  })

  it('works if we use it in the then closure', function () {
    cy.fixture('two-items')
      .as('list')
      .then(() => {
        // by now the fixture has been saved into "this.list"
        // check that "this.list" has 2 items
        // use it to post to the server
        expect(this.list).to.have.length(2)
        cy.request('POST', '/reset', { todos: this.list })
        cy.request('GET', '/todos').its('body').should('deep.eq', this.list)
      })
  })

  it('reads file items loaded from fixture', () => {
    cy.fixture('two-items').then((todos) => {
      // post items
      cy.request('POST', '/reset', todos)
      // read file 'todomvc/data.json',
      cy.readFile('todomvc/data.json').then((data) => {
        // should be equal to the loaded fixture
        // note: JSON is parsed automatically!
        expect(data).to.deep.eq(todos)
      })
    })
  })

  context('app actions with fixtures', () => {
    beforeEach(() => {
      // load fixture two-items
      // visit the page, make sure it has been loaded
      cy.fixture('two-items').as('two')

      cy.intercept('GET', '/todos').as('initial')
      cy.visit('/')
      cy.wait('@initial')
    })

    it('invokes app action to set data from fixture', function () {
      // grab window app.$store
      cy.window()
        .its('app.$store')
        .then(($store) => {
          // and for each item from the fixture
          this.two.forEach((item) => {
            // dispatch action "addEntireTodo"
            // create items by dispatching actions
            $store
              .dispatch('addEntireTodo', {
                title: item.title,
                completed: item.completed
              })
              .then(() => {
                cy.get('li.todo').should('have.length', 2)
              })
          })
        })
    })
  })
})
