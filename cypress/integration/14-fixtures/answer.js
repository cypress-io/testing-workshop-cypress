/// <reference types="cypress" />
it('sets list of todos on the server', () => {
  // load fixture "two-items.json" from the fixtures folder
  cy.fixture('two-items').then(list => {
    // then use it in the POST request
    cy.request('POST', '/reset', { todos: list })
  })
})

context('this.list', () => {
  // it is important to use "function () {}"
  // as a callback to "beforeEach", so we have
  // "this" pointing at the test context
  beforeEach(function () {
    cy.fixture('two-items').then(list => {
      // inner callback can be a function or an arrow expression
      this.list = list
    })
  })

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it('sets list from context', function () {
    // we can check that the list is valid
    expect(this.list).to.have.length(2)
    cy.request('POST', '/reset', { todos: this.list })
  })
})

context('@list', () => {
  beforeEach(function () {
    // it is important to use "function () {}"
    // as a callback to "beforeEach"
    // shortcut "as(list)" will save the value into "this.list"
    cy.fixture('two-items').as('list')
  })

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it('sets list from context', function () {
    // we can check that the list is valid
    expect(this.list).to.have.length(2)
    cy.request('POST', '/reset', { todos: this.list })
  })
})

it.skip('does not work', function () {
  cy.fixture('two-items').as('list')
  // we are using "this.list" BEFORE it was set in
  // the above asynchronous call
  expect(this.list).to.have.length(2)
  cy.request('POST', '/reset', { todos: this.list })
})

it('works if we change the order', function () {
  cy.fixture('two-items')
    .as('list')
    .then(() => {
      // by now the fixture has been saved into "this.list"
      expect(this.list).to.have.length(2)
      cy.request('POST', '/reset', { todos: this.list })
    })
})
