/// <reference types="cypress" />

it('runs hello world', () => {
  // call task "hello" with a name
  // and confirm the result
})

it.skip('makes task and runs it', () => {
  function hello(name) {
    return 'hello, ' + name
  }
  cy.task('eval', hello.toString())
  cy.task('hello', 'eval').should('equal', 'hello, eval')
})
