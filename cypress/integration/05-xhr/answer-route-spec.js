/// <reference types="cypress" />
// note, we are not resetting the server before each test
it('starts with zero items (waits)', () => {
  cy.visit('/')
  /* eslint-disable-next-line cypress/no-unnecessary-waiting */
  cy.wait(1000)
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items', () => {
  // start Cypress network server
  // spy on route `GET /todos`
  // THEN visit the page
  cy.server()
  cy.route('GET', '/todos').as('todos')
  cy.visit('/')
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0)
  // then check the DOM
  // note that we don't have to use "cy.wait(...).then(...)"
  // because all Cypress commands are flattened into a single chain
  // automatically. Thus just write "cy.wait(); cy.get();" naturally
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  // spy on route `GET /todos`
  // THEN visit the page
  cy.server()
  cy.route('GET', '/todos', []).as('todos')
  cy.visit('/')
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0)
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (fixture)', () => {
  // start Cypress network server
  // stub route `GET /todos`, return data from fixture file
  // THEN visit the page
  cy.server()
  cy.route('GET', '/todos', 'fixture:empty-list').as('todos')
  cy.visit('/')
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0)
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('posts new item to the server', () => {
  cy.server()
  cy.route('POST', '/todos').as('new-item')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')
  cy.wait('@new-item').its('request.body').should('have.contain', {
    title: 'test api',
    completed: false
  })
})

it('posts new item to the server response', () => {
  cy.server()
  cy.route('POST', '/todos').as('new-item')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')
  cy.wait('@new-item').its('response.body').should('have.contain', {
    title: 'test api',
    completed: false
  })
})

it('loads several items from a fixture', () => {
  // start Cypress network server
  // stub route `GET /todos` with data from a fixture file
  // THEN visit the page
  cy.server()
  cy.route('GET', '/todos', 'fx:two-items')
  cy.visit('/')
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
  cy.get('li.todo').should('have.length', 2)
  cy.get('li.todo.completed').should('have.length', 1)
  cy.contains('.todo', 'first item from fixture')
    .should('not.have.class', 'completed')
    .find('.toggle')
    .should('not.be.checked')
  cy.contains('.todo.completed', 'second item from fixture')
    .find('.toggle')
    .should('be.checked')
})

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail
  cy.server()
  cy.route({
    url: '/todos',
    response: 'test does not allow it',
    status: 404,
    delay: 2000
  })
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: (win) => {
      cy.spy(win.console, 'error').as('console-error')
    }
  })
  // observe external effect from the app - console.error(...)
  cy.get('@console-error').should(
    'have.been.calledWithExactly',
    'test does not allow it'
  )
})

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  // and respond with an empty list
  cy.server()
  cy.route({
    url: '/todos',
    delay: 2000,
    response: []
  }).as('loading')
  cy.visit('/')

  // shows Loading element
  cy.get('.loading').should('be.visible')

  // wait for the network call to complete
  cy.wait('@loading')

  // now the Loading element should go away
  cy.get('.loading').should('not.be.visible')
})

it('handles todos with blank title', () => {
  cy.server()
  cy.route('/todos', [
    {
      id: '123',
      title: '  ',
      completed: false
    }
  ])

  cy.visit('/')
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ')
})
