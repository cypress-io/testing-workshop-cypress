beforeEach(() => {
  cy.visit('localhost:3000')
  cy.contains('[data-test-id=APP_TITLE]', 'todos')
})

it('can delete an item', () => {
  // adds items
  cy.get('[data-test-id=NEW_TODO]').type('first item{enter}')
  cy.contains('[data-test-id=TODO_LIST_ITEM]', 'first item').should(
    'be.visible'
  )
  cy.get('[data-test-id=NEW_TODO]').type('second item{enter}')
  cy.contains('[data-test-id=TODO_LIST_ITEM]', 'second item').should(
    'be.visible'
  )

  // deletes the first item
  cy.contains('[data-test-id=TODO_LIST_ITEM]', 'first item')
    .should('exist')
    .find('[data-test-id=DELETE]')
    // use force: true because we don't want to hover
    .click({ force: true })

  // confirm the deleted item is gone from the dom
  cy.contains('[data-test-id=TODO_LIST_ITEM]', 'first item').should('not.exist')
  // confirm the other item still exists
  cy.contains('[data-test-id=TODO_LIST_ITEM]', 'second item').should('exist')
})
