/// <reference types="cypress" />
it('sets list of todos on the server', () => {
  // load fixture "two-items.json" from the fixtures folder
  cy.fixture('two-items').then((list) => {
    // then use it in the POST request
    cy.request('POST', '/reset', { todos: list })
  })
})

context('closure variable', () => {
  // store loaded list in this closure variable
  let list

  beforeEach(() => {
    cy.fixture('two-items').then((l) => {
      list = l
    })
  })

  it('sets list from context', () => {
    // we can check that the list is valid
    expect(list).to.have.length(2)
    cy.request('POST', '/reset', { todos: list })
  })
})

context('this.list', () => {
  // it is important to use "function () {}"
  // as a callback to "beforeEach", so we have
  // "this" pointing at the test context
  beforeEach(function () {
    cy.fixture('two-items').then((list) => {
      // inner callback can be a function or an arrow expression
      this.list = list
    })
  })

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it('sets list from context', function () {
    cy.request('POST', '/reset', { todos: this.list })
  })

  it('has valid list with 2 items', function () {
    // we can check that the list is valid
    expect(this.list).to.have.length(2)
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

context('reading todos.json', () => {
  it('loads empty list', () => {
    cy.request('POST', '/reset', { todos: [] })
    cy.readFile('todomvc/data.json', 'utf8').should('deep.equal', { todos: [] })
  })

  it('reads items loaded from fixture', () => {
    cy.fixture('two-items').then((todos) => {
      cy.request('POST', '/reset', { todos })
      cy.readFile('todomvc/data.json').should('deep.equal', { todos })
    })
  })

  // NOT RECOMMENDED
  // because json-server can restart itself on file change
  // and not bind to its port :( and never start again
  it.skip('saves todo', () => {
    cy.request('POST', '/reset', { todos: [] })
    cy.visit('/')
    cy.get('.new-todo').type('for test{enter}')
    cy.readFile('todomvc/data.json').should((data) => {
      expect(data.todos).to.have.length(1)
      expect(data.todos[0].title).to.equal('for test')
    })
  })
})

context('app actions with fixtures', () => {
  beforeEach(() => {
    cy.fixture('two-items').as('two')
    // make sure loading has finished
    cy.server()
    cy.route('/todos').as('initial')
    cy.visit('/')
    cy.wait('@initial')
  })

  it('invokes app action to set data from fixture', function () {
    cy.window()
      .its('app.$store')
      .then(($store) => {
        this.two.forEach((item) =>
          $store.dispatch('addEntireTodo', {
            title: item.title,
            completed: item.completed
          })
        )
      })
  })
})
