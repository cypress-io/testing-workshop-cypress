// resets the database by executing HTTP call to a special endpoint
// and passing an empty list of todos
beforeEach(function resetDatabase() {
  cy.request('POST', '/reset', {
    todos: []
  })
})
