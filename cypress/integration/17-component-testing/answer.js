/// <reference types="cypress" />
import React from 'react'
import Footer from './Footer'
// adds custom command "cy.mount"
import 'cypress-react-unit-test'
import { filters } from './filters'

beforeEach(() => {
  cy.viewport(500, 300)
})
it('shows Footer', () => {
  cy.mount(<Footer count={10} nowShowing={filters.ALL_TODOS} />)

  cy.get('footer')
    .should('be.visible')
    .find('[data-cy=show-all]')
    .should('have.class', 'selected')
})

it('clears completed on click', () => {
  cy.mount(
    <Footer
      count={10}
      completedCount={4}
      nowShowing={filters.ALL_TODOS}
      onClearCompleted={cy.stub().as('onClearCompleted')}
    />
  )

  cy.get('footer')
    .find('.clear-completed')
    .should('be.visible')
    .click()

  cy.get('@onClearCompleted').should('have.been.calledOnce')
})
