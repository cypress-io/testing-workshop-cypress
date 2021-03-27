/// <reference types="cypress" />
import { enterTodo, resetData, removeTodo } from '../../support/utils'

describe('Stubbing window.track', () => {
  beforeEach(resetData)

  it('works on click', () => {
    cy.visit('/').then((win) => {
      cy.stub(win, 'track').as('track')
    })
    enterTodo('write code')
    cy.get('@track').should(
      'have.been.calledOnceWithExactly',
      'todo.add',
      'write code'
    )
  })

  it('tracks item delete', () => {
    cy.visit('/').then((win) => {
      cy.stub(win, 'track').as('track')
    })
    enterTodo('write code')
    removeTodo('write code')

    cy.get('@track').should('have.been.calledWith', 'todo.remove', 'write code')
  })

  it('resets the count', () => {
    cy.visit('/').then((win) => {
      cy.stub(win, 'track').as('track')
    })

    enterTodo('write code')
    cy.get('@track').should('be.calledOnce')

    enterTodo('write tests')
    cy.get('@track')
      .should('be.calledTwice')
      // reset the stub
      .invoke('reset')

    cy.get('@track').should('not.be.called')
    enterTodo('control the state')
    cy.get('@track').should('be.calledOnce')
  })

  it('stops working if window changes', () => {
    cy.visit('/').then((win) => {
      cy.stub(win, 'track').as('track')
    })

    enterTodo('write code')
    cy.get('@track').should('be.calledOnce')

    cy.reload()
    enterTodo('write tests')

    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(500) // wait just in case the call happens late

    // note that our stub was still called once
    // meaning the second todo was never counted
    cy.get('@track').should('be.calledOnce')
  })

  it('adds stub after reload', () => {
    const trackStub = cy.stub().as('track')

    cy.visit('/').then((win) => {
      cy.stub(win, 'track').callsFake(trackStub)
    })

    enterTodo('write code')
    cy.get('@track').should('be.calledOnce')

    cy.reload().then((win) => {
      cy.stub(win, 'track').callsFake(trackStub)
    })
    enterTodo('write tests')
    // our stub is called twice: the second time
    // from the new window object after cy.reload()
    cy.get('@track').should('be.calledTwice')
  })

  it('works on load', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // there is no "window.track" yet,
        // thus we cannot stub just yet
        let track // the real track when set by the app
        let trackStub // our stub around the real track

        Object.defineProperty(win, 'track', {
          get() {
            return trackStub
          },
          set(fn) {
            track = fn
            // give the created stub an alias so we can retrieve it later
            trackStub = cy.stub().callsFake(track).as('track')
          }
        })
      }
    })

    // make sure the page called the "window.track" with expected arguments
    cy.get('@track').should('have.been.calledOnceWith', 'window.load')
  })
})
