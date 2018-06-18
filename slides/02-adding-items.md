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

+++

## Refactor code 2/3

- move the url into `cypress.json`

**tip** look at [https://on.cypress.io/configuration](https://on.cypress.io/configuration)

+++

## Refactor code 3/3

- make a helper function to add todo item

**tip** it is just JavaScript

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

+++

### Bonus

- Core concepts [https://on.cypress.io/writing-and-organizing-tests](https://on.cypress.io/writing-and-organizing-tests)
