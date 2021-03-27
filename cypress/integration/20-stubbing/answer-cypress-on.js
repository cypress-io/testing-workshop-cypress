/// <reference types="cypress" />

// variable that will hold cy.stub created in the test
let stub

// use Cypress.on in its own spec to avoid every test running it
// https://on.cypress.io/catalog-of-events
Cypress.on('window:before:load', (win) => {
  // if the test has prepared a stub
  if (stub) {
    // the stub function is ready
    // always returns it when the application
    // is trying to use "window.track"
    Object.defineProperty(win, 'track', {
      get() {
        return stub
      }
    })
  }
})

describe('Cypress.on', () => {
  beforeEach(() => {
    // let the test create the stub if it needs it
    stub = null
  })

  it('works', () => {
    // note: cy.stub returns a function
    stub = cy.stub().as('track')
    cy.visit('/')

    // make sure the page called the "window.track" with expected arguments
    cy.get('@track').should('have.been.calledOnceWith', 'window.load')

    cy.reload()
    cy.reload()

    cy.get('@track')
      .should('have.been.calledThrice')
      // confirm every call was with "window.load" argument
      .invoke('getCalls')
      .should((calls) => {
        calls.forEach((trackCall, k) => {
          expect(trackCall.args, `call ${k + 1}`).to.deep.equal(['window.load'])
        })
      })
  })

  it('works with reset', () => {
    stub = cy.stub().as('track')
    cy.visit('/')

    // make sure the page called the "window.track" with expected arguments
    cy.get('@track')
      .should('have.been.calledOnceWith', 'window.load')
      // cy.stub().reset() brings the counts back to 0
      .invoke('reset')

    cy.reload()
    cy.reload()

    cy.get('@track').should('have.been.calledTwice')
  })
})
