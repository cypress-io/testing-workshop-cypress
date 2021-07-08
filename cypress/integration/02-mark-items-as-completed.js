beforeEach(() => {
  cy.visit('localhost:3000')
  cy.contains('[data-test-id=APP_TITLE]', 'todos')
})

it('can mark an item as completed', () => {
  // adds 2 items
  // marks the first item as completed
  // confirms the first item has the expected completed class
  // confirms the second items is still incomplete
})
