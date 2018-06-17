## Reset state

- use `04-reset-state`
- if you reload the test it starts failing 😕

+++

![First test run](04-reset-state/img/passing-test.png)

+++

![Second test run](04-reset-state/img/failing-test.png)

+++

![Inspect first XHR call](04-reset-state/img/inspect-first-get-todos.png)

+++

```javascript
beforeEach(() => {
  cy.visit('/')
})
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}
it.only('adds two items', () => {
  addItem('first item')
  addItem('second item')
  cy.get('li.todo').should('have.length', 2)
})
```

+++

## Questions

- how to reset the database?
  - **tip** we are using [json-server-reset](https://github.com/bahmutov/json-server-reset#readme) middleware
  - try to reset it from command line
- how to make arbitrary XHR request from Cypress?
- reset the database before each test

+++

## Best practices

- reset state before each test
  - in our [Best practices guide](https://on.cypress.io/best-practices)
