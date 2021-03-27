/// <reference types="cypress" />
/* eslint-disable-next-line no-unused-vars */
import { enterTodo, resetData, removeTodo } from '../../support/utils'

describe('Stubbing window.track', () => {
  beforeEach(resetData)

  // by default the "window.track" is called by the app
  // on load, on new todo, and on removing todo
  // and just prints the message using console.log

  it('works on click', () => {
    // visit the page
    // stub "window.track"
    // enter new todo
    // confirm the stub "window.track" was called once
    // with expected argument
    // tip: use 'have.been.calledOnceWithExactly' assertion
  })

  it('tracks item delete', () => {
    // visit the page
    // stub "window.track"
    // enter and remove new todo
    // assert the stub "window.track" was called
    // with expected arguments
  })

  it('resets the count', () => {
    // add a couple of items
    // confirm the stub was called N times
    // reset the stub
    // by invoking ".reset()" method
    // trigger more events
    // confirm the new number
  })

  it('adds stub after reload', () => {
    // create a single stub with
    // const trackStub = cy.stub().as('track')
    // stub the window.track after cy.visit
    // and after reload
    // and then count the number of calls
  })

  it('works on load', () => {
    // set up the stub when the window object exists
    // but before any code loads
    // see https://on.cypress.io/visit onBeforeLoad
    // use Object.defineProperty(win, 'track', {...}) to
    // get the "window.track = fn" assignment and call
    // the cy.stub wrapping the fn
    // after the visit command confirm the stub was called
  })

  it('works via cy.on event handler', () => {
    // need to return the same stub when using cy.visit
    // and cy.reload calls that create new "window" objects
    // tip: use the cy.on('window:before:load', ...) event listener
    // which is called during cy.visit and during cy.reload
    // during the test reload the page several times, then check
    // the right number of "window.track" calls was made
    // https://on.cypress.io/catalog-of-events
  })

  it('works via Cypress.on event handler', () => {
    // create a single stub in the test
    // return it to anyone trying to use window.track
    // from Cypress.on('window:before:load') callback
    // https://on.cypress.io/catalog-of-events
  })
})
