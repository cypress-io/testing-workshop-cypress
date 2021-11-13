/// <reference types="cypress" />
/* eslint-disable-next-line no-unused-vars */
import { enterTodo, resetData, removeTodo } from '../../support/utils'

describe('Stubbing ', () => {
  beforeEach(resetData)

  // by default the "window.track" is called by the app
  // on load, on new todo, and on removing todo
  // and just prints the message using console.log

  context('stubbing basics', () => {
    beforeEach(() => {
      // visit the page, stub "window.track"
      // KEY: when stubbing, best not to return the cy.stub, messes up invoke('reset')
      cy.visit('/').then((win) => {
        cy.stub(win, 'track').as('track')
      })
    })
    it('adds an item, removes it, tracks both add and delete', () => {
      // enter and remove new todo
      enterTodo('write code')
      removeTodo('write code')
      // assert the stub "window.track" was called
      // with expected arguments
      cy.get('@track').should('have.been.calledTwice')

      cy.get('@track').should(
        'have.been.calledWithExactly',
        'todo.add',
        'write code'
      )
      cy.get('@track').should(
        'have.been.calledWith',
        'todo.remove',
        'write code'
      )
    })

    it("resets the count: stubs can be reset by invoke('reset')", () => {
      // add a couple of items
      enterTodo('write code once')
      enterTodo('write code twice')
      // confirm the stub was called N times and reset the stub
      // by invoking ".reset()" method

      // KEY: stubs can be reset with invoke('reset')
      cy.get('@track').should('have.been.calledTwice').invoke('reset')
      // trigger more events
      // confirm the new number
      removeTodo('write code once')
      cy.get('@track').should('have.been.calledOnce')
    })

    it('stubs stop working if the window changes: for example stubs reset on page reload', () => {
      enterTodo('write code')
      cy.get('@track').should('be.calledOnce')

      cy.reload()
      enterTodo('write tests')

      // after reload and then count the number of calls
      // KEY: stubs reset on page reload
      cy.get('@track').should('be.calledOnce')
    })
  })

  context('we can preserve the stub if needed', () => {
    it('KEY: can preserve the stub on window reload by using the same stub', () => {
      // create a single stub with
      // const trackStub = cy.stub().as('track')
      // stub the window.track after cy.visit, and after reload
      // and then count the number of calls

      // KEY: if you need to preserve the stub on reload, forward the call to the same stub function
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

    it('KEY:can stub before there is a window, using onBeforeLoad', () => {
      // set up the stub when the window object exists but before any code loads
      // see https://on.cypress.io/visit onBeforeLoad
      // use Object.defineProperty(win, 'track', {...}) to get the "window.track = fn" assignment
      // and call the cy.stub wrapping the fn
      // after the visit command confirm the stub was called

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
              if (!track) {
                track = fn
                // give the created stub an alias so we can retrieve it later
                trackStub = cy.stub().callsFake(track).as('track')
              }
            }
          })
        }
      })

      // make sure the page called the "window.track" with expected arguments
      cy.get('@track').should('have.been.calledOnceWith', 'window.load')
    })

    it('KEY:can stub for every window (visits & reloads), using cy.on window:before:load event handler', () => {
      // need to return the same stub when using cy.visit and cy.reload calls that create new "window" objects
      // tip: use the cy.on('window:before:load', ...) event listener
      // which is called during cy.visit and during cy.reload

      // during the test reload the page several times, then check
      // the right number of "window.track" calls was made https://on.cypress.io/catalog-of-events

      // these test handles every "window" object
      // by attaching the stub whenever any window is created
      // https://on.cypress.io/catalog-of-events
      // there is no "window.track" yet,
      // thus we cannot stub just yet
      let track // the real track when set by the app
      let trackStub // our stub around the real track

      // use "cy.on" to prepare for "window.track" assignment
      // this code runs for every window creation, thus we
      // can track events from the "cy.reload()"
      cy.on('window:before:load', (win) => {
        Object.defineProperty(win, 'track', {
          get() {
            return trackStub
          },
          set(fn) {
            // if the stub does not exist yet, create it
            if (!track) {
              track = fn
              // give the created stub an alias so we can retrieve it later
              trackStub = cy.stub().callsFake(track).as('track')
            }
          }
        })
      })

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
            expect(trackCall.args, `call ${k + 1}`).to.deep.equal([
              'window.load'
            ])
          })
        })
    })
  })

  context(
    'KEY: we can preserve the stub across tests, using Cypress.on window:before:load event handler',
    () => {
      // create a single stub in the test
      // return it to anyone trying to use window.track
      // from Cypress.on('window:before:load') callback
      // https://on.cypress.io/catalog-of-events

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
                expect(trackCall.args, `call ${k + 1}`).to.deep.equal([
                  'window.load'
                ])
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
    }
  )
})
