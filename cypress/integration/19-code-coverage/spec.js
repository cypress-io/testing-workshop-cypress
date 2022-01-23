/// <reference types="cypress" />

// only enable the test if you are testing the todomvc-redux application : cd into todomvc-redux, npm start
describe(`
this test is meant for the todomvc-redux application which is instrumented, 
unlike the vue app that is used in the course `, () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds 2 todos', () => {
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })
})
// add more tests to cover more application source code
