/// <reference types="cypress" />

it('runs a task', () => {
  // KEY: first arg is the task name
  cy.task('helloWorld', 'World').should('equal', 'Hello World')
})

it('runs a task with 2 arguments', () => {
  // KEY: first arg is the task name
  cy.task('helloMultipleArgs', { name: 'Murat', lastName: 'Ozcan' }).should(
    'equal',
    'Hello Murat Ozcan'
  )
})

it('runs a task from a separate task block', () => {
  cy.task('helloSeparateTaskBlock', 'World').should('equal', 'Hello World')
})

it('runs a task from a separate task file', () => {
  cy.task('helloSeparateTaskFile', 'World').should('equal', 'Hello World')
})

it('runs tasks from multiple separate files', () => {
  cy.task('helloSeparateTaskFile2', 'World').should('equal', 'Hello World')
  cy.task('helloSeparateTaskFile3', 'World').should('equal', 'Hello World')
})
