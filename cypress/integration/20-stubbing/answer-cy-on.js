/// <reference types="cypress" />

describe('cy.on', () => {
  // these test handles every "window" object
  // by attaching the stub whenever any window is created
  // https://on.cypress.io/catalog-of-events
  it('works', () => {
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
          expect(trackCall.args, `call ${k + 1}`).to.deep.equal(['window.load'])
        })
      })
  })
})
