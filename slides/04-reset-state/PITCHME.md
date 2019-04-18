## ☀️ Part 4: Reset state data

### 📚 You will learn

- how one test can affect another test by leaving its data behind
- when and how to reset state during testing

+++

- keep `todomvc` app running
- open `cypress/integration/04-reset-state/spec.js`
- if you reload the test it starts failing 😕

+++

![First test run](/slides/04-reset-state/img/passing-test.png)

+++

![Second test run](/slides/04-reset-state/img/failing-test.png)

+++

![Inspect first XHR call](/slides/04-reset-state/img/inspect-first-get-todos.png)

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

```
$ http POST :3000/reset todos:=[]
```

Note:
I am using httpie to easily send the empty list to reset the database.

+++

- how to make an arbitrary cross-domain XHR request from Cypress?
- reset the database before each test
  - modify `04-reset-state/spec.js` to make XHR call to reset the database
  - before or after `cy.visit`?

Note:
Students should modify `cypress/integration/04-reset-state/spec.js` and make the request to reset the database before each test using `cy.request`.

+++

## Best practices

- reset state before each test
  - in our [Best practices guide](https://on.cypress.io/best-practices)
- use [`cy.request`](https://on.cypress.io/request), [`cy.exec`](https://on.cypress.io/exec), [`cy.task`](https://on.cypress.io/task)
