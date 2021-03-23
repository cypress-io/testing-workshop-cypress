/// <reference types="cypress" />
describe('Stubbing window.track', () => {
  it('works first', () => {
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
