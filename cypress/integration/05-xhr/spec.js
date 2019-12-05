/// <reference types="cypress" />

import { dataCy } from '../../support/utils'

// note, we are not resetting the server before each test
// and we want to confirm that IF the application has items already
// (for example add them manually using the browser localhost:3000)
// then these tests fail!

it('starts with zero items (waits)', () => {
  cy.visit('/')
  // wait 1 second
  cy.wait(1000)
  // then check the number of items
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items', () => {
  // start Cypress network proxy with cy.server()
  // spy on route `GET /todos`
  //  with cy.route(...).as(<alias name>)
  // THEN visit the page
  cy.server()
  cy.route('GET', '/todos').as('getTodos')
  cy.visit('/')
  // wait for `GET /todos` route
  //  using "@<alias name>" string
  cy.wait('@getTodos')
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  // stub `GET /todos` with []
  // save the stub as an alias
  cy.server()
  cy.route('GET', '/todos', []).as('getTodos')

  // THEN visit the page
  cy.visit('/')
  // wait for the route alias
  // grab its response body
  // and make sure the body is an empty list
  cy.wait('@getTodos')
    .its('responseBody')
    .should('have.length', 0)
})

it('starts with zero items (fixture)', () => {
  // start Cypress network server
  // stub `GET /todos` with fixture "empty-list"
  cy.server()
  cy.route('GET', 'todos', 'fixture:empty-list')
  // visit the page
  cy.visit('/')

  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('loads several items from a fixture', () => {
  // start Cypress network server
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  // THEN visit the page
  cy.server()
  cy.route('GET', 'todos', 'fixture:two-items')
  cy.visit('/')
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
  cy.get('.completed').should('exist')
})

it('posts new item to the server', () => {
  // start Cypress network server
  // spy on "POST /todos", save as alias
  cy.server()
  cy.route('POST', 'todos').as('postTodos')
  cy.visit('/')
  cy.get(dataCy('new-todo')).type('test api{enter}')

  // wait on XHR call using the alias, grab its request or response body
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
  cy.wait('@postTodos')
    .its('responseBody')
    .should('have.contain', { title: 'test api', completed: false })
})

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail with 404 to GET /todos
  // after delay of 2 seconds
  // cy.server()
  // cy.route({
  //   url,
  //   response,
  //   status,
  //   delay
  // })
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: win => {
      // spy
    }
  })
  // observe external effect from the app - console.error(...)
  // cy.get('@console-error')
  //   .should(...)
})

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  // and respond with an empty list
  // shows Loading element
  // wait for the network call to complete
  // now the Loading element should go away
})
