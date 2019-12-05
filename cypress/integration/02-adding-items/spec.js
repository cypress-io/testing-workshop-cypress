const dataCy = (cy) => {
  return `[data-cy="${cy}"]`
}

const addTodo = (content) => {
  cy.get(dataCy('new-todo'))
  .type(`${content}{enter}`)
}

const toggleTodo = (index) => {
  cy.get(dataCy('toggle'))
  .eq(index)
  .click()
}

const deleteTodo = (index) => {
  cy.get(dataCy('destroy'))
  .eq(index)
  .invoke('show')
  .click()
}

/// <reference types="cypress" />
it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
})

beforeEach(() => {
  cy.visit('/')
})
// remember to manually delete all items before running the test

it('adds two items', () => {
  // repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
  // cy.get(...).should('have.length', 2)
  addTodo('Visit NG-BE')
  addTodo('Follow Cypress workshop')

  cy.get(dataCy('todo')).should('have.length', 2)
})

it('can mark an item as completed', () => {
  // adds a few items
  // marks the first item as completed
  // confirms the first item has the expected completed class
  // confirms the other items are still incomplete

  addTodo('Visit NG-BE')
  addTodo('Follow Cypress workshop')
  toggleTodo(0)

  cy.get(dataCy('todo')).first().should('have.class', 'completed')
  cy.get(dataCy('todo')).eq(1).should('not.have.class', 'completed')
})

it('can delete an item', () => {
  // adds a few items
  // deletes the first item
  // use force: true because we don't want to hover
  // confirm the deleted item is gone from the dom
  // confirm the other item still exists
  addTodo('Visit NG-BE')
  addTodo('Follow Cypress workshop')
  deleteTodo(0)

  cy.get(dataCy('todo')).should('have.length', 1)
  cy.get(dataCy('todo')).contains('Follow Cypress workshop')
})

it('can add many items', () => {
  const N = 5
  for (let k = 0; k < N; k += 1) {
    // add an item
    // probably want to have a reusable function to add an item!
    addTodo(`Todo: ${k + 1}`)
  }
  // check number of items
  cy.get(dataCy('todo')).should('have.length', N);
})

it('adds item with random text', () => {
  // use a helper function with Math.random()
  // or Cypress._.random() to generate unique text label
  // add such item
  // and make sure it is visible and does not have class "completed"
  addTodo(Cypress._.random(255))

  cy.get(dataCy('todo')).first().should('not.have.class', 'completed')
})

it('starts with zero items', () => {
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get

  cy.get(dataCy('todo')).should('have.length', 0)
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
