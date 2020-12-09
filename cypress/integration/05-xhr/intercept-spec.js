/// <reference types="cypress" />

import { resetDatabase } from '../../support/utils'

// this spec shows several "gotchas" our users experience
// when using cy.intercept method
// read https://glebbahmutov.com/blog/cypress-intercept-problems/

describe('intercept', () => {
  // TODO: figure out how to overwrite the `cy.intercept` command
  // to print the log message when intercepting
  // https://github.com/cypress-io/cypress/issues/9580
  // Cypress.Commands.overwrite('intercept', function(intercept, ...args) {
  //   return cy.log('intercept!').then(function() {
  //     return intercept.apply(null, args)
  //   })
  // })

  context('late registration', () => {
    it.skip('is registered too late', () => {
      cy.visit('/')
      cy.intercept('/todos').as('todos')
      cy.wait('@todos')
    })

    it('is registered before the call', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
    })
  })

  context('wait followed by get', () => {
    it.skip('is taken by the wait', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('@todos').should('not.be.null')
    })

    it('is taken by the wait (unlike cy.route)', () => {
      cy.server()
      cy.route('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('@todos').should('not.be.null')
    })

    it('should use wait value', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').should('include.all.keys', ['request', 'response'])
    })

    it('verifies the waited interception via .then(cb)', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').then(interception => {
        expect(interception).to.be.an('object')
        expect(interception.request.url).to.match(/\/todos$/)
      })
    })
  })

  context('cached data', () => {
    // this test might pass or not when the DevTools is open
    // depending on the Network "Disable cache" setting
    it.skip('does not have response', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
        .its('response')
        .should('deep.include', {
          statusCode: 304,
          statusMessage: 'Not Modified',
          body: ''
        })
    })

    it('always gets the new data', () => {
      cy.intercept('/todos', req => {
        delete req.headers['if-none-match']
      }).as('todos')
      cy.visit('/')
      cy.wait('@todos')
        .its('response')
        .should('deep.include', {
          statusCode: 200,
          statusMessage: 'OK'
        })
        .and('have.property', 'body') // yields the "response.body"
        .then(body => {
          // since we do not know the number of items
          // just check if it is an array
          expect(body).to.be.an('array')
        })
    })
  })

  context('multiple intercepts', () => {
    describe('using just spies', () => {
      beforeEach(resetDatabase)

      beforeEach(() => {
        cy.intercept('/todos').as('todos') // spy
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post')
          .its('request.body')
          .should('deep.include', {
            title: 'Write a test',
            completed: false
          })
      })
    })

    describe('using stub and spy', () => {
      beforeEach(() => {
        cy.intercept('GET', '/todos', []).as('todos') // stub
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post')
          .its('request.body')
          .should('deep.include', {
            title: 'Write a test',
            completed: false
          })
      })
    })
  })
})
