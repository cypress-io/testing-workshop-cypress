/// <reference types="cypress" />
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
    // assert the stub "window.track" was called once
    // with expected argument
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

  it('works via event handler', () => {
    // need to return the same stub when using cy.visit
    // and cy.reload calls that create new "window" objects
    // tip: use the cy.on('window:before:load', ...) event listener
    // which is called during cy.visit and during cy.reload
    // during the test reload the page several times, then check
    // the right number of "window.track" calls was made
  })
})
