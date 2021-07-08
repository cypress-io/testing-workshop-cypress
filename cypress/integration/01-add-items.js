beforeEach(() => {
  cy.visit('localhost:3000')
  cy.contains('[data-test-id=APP_TITLE]', 'todos')
})

it('adds two items', () => {
  // repeat the following twice:
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item has been added to the list
})
