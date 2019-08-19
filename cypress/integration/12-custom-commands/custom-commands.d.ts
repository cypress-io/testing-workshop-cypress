/// <reference types="cypress" />
// add custom command to Cypress declaration
// see https://github.com/cypress-io/cypress-example-todomvc/blob/master/cypress/support/index.d.ts
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Create one todo using UI
     * @example
     * cy.createTodo('new item')
     */
    createTodo(todo: string): Chainable<any>;
  }
}
