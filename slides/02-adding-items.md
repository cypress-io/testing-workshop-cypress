## Adding items test

- work in the folder `02-adding-items`
- open `cypress/integration/spec.js`
- get the input field
  - type some text
  - type special "Enter" key
  - check that has been added to the list
  - delete the new item

**tip** use `cy.get`, `cy.type`, `cy.contains`, `cy.click`

+++

## Refactor code 1/3

- visit the page before each test

Note:
Avoid duplicate `cy.visit('localhost:3000')` command at the start of each test.

+++

## Refactor code 2/3

- move the url into `cypress.json`

**tip** look at [https://on.cypress.io/configuration](https://on.cypress.io/configuration)

+++

## Refactor code 3/3

- make a helper function to add todo item

**tip** it is just JavaScript

Note:
Move `addItem` function into a separate file and import from the spec file. It is just JavaScript, and Cypress bundles each spec file, so utilities can have `cy...` commands too!

+++

## Pro tips

- resize the viewport in `cypress.json`
- set up IntelliSense in `cypress.json` using [https://on.cypress.io/intelligent-code-completion](https://on.cypress.io/intelligent-code-completion)

+++

## Bonus

Unit tests vs end-to-end tests

### Unit tests

```javascript
import add from './add'
test('add', () => {
  expect(add(2, 3)).toBe(5)
})
```

- arrange - action - assertion

+++

### End-to-end tests

```javascript
it('adds two and deletes first', () => {
  enterTodo('first item')
  enterTodo('second item')

  getTodoItems()
    .contains('first item')
    .parent()
    .find('.destroy')
    // because it only becomes visible on hover
    .click({ force: true })

  cy.contains('first item').should('not.exist')
  cy.contains('second item').should('exist')
  getTodoItems().should('have.length', 1)
})
```

- **tip** check out `cy.pause` command

Note:
Revisit the discussion about what kind of tests one should write. E2E tests can cover a lot of features in a single test, and that is a recommended practice. If a test fails, it is easy to debug it, and see how the application looks during each step.

+++

### Bonus

- Core concepts [https://on.cypress.io/writing-and-organizing-tests](https://on.cypress.io/writing-and-organizing-tests)
