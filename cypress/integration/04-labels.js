beforeEach(() => {
  cy.visit('localhost:3000')
  cy.contains('[data-test-id=APP_TITLE]', 'todos')
})

it('has two labels', () => {
  cy.get('[data-test-id=NEW_TODO]').type('first item{enter}')
  cy.get('[data-test-id=TODO_LIST_ITEM]')
    .find('[data-test-id=TODO_LIST_ITEM_LABEL]')
    .should('contain', 'first item')

  cy.get('[data-test-id=NEW_TODO]').type('second item{enter}')
  cy.get('[data-test-id=TODO_LIST_ITEM]')
    .find('[data-test-id=TODO_LIST_ITEM_LABEL]')
    .should('contain', 'second item')
})
