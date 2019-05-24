## ☀️ Part 2: Adding items tests

### 📚 You will learn

- common commands for working with elements
- organizing test code using Mocha hooks

+++

- keep `todomvc` app running
- open `cypress/integration/02-adding-items/spec.js` in your text editor
- click file `02-adding-items/spec.js` in Cypress

+++

## ⚠️ Todo items

**Note:** the tests we are about to write are NOT resetting the previously added Todo items. Delete the Todo items before each test manually.

We will reset the previously saved Todo items in section "4 Reset State".

+++

```js
it.only('starts with zero items', () => {
  // check if the list is empty initially:
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
})
```

**tip** use `cy.get`, `should('have.length', ...)`

[https://on.cypress.io/get](https://on.cypress.io/get)

+++

```js
it('adds two items', () => {
  // repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
})
```

**tip** use `cy.get`, `cy.type`, `cy.contains`, `cy.click`

Note:
Draw distinction between commands and assertions, show how commands can be chained,
each continues to work with the subject of the previous command. Assertions do
not change the subject.

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

## 💡 Pro tips

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
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}
it('can mark items as completed', () => {
  const ITEM_SELECTOR = 'li.todo'
  addItem('simple')
  addItem('difficult')
  cy.contains(ITEM_SELECTOR, 'simple').should('exist')
    .find('input[type="checkbox"]').check()
  // have to force click because the button does not appear unless we hover
  cy.contains(ITEM_SELECTOR, 'simple').find('.destroy').click({ force: true })
  cy.contains(ITEM_SELECTOR, 'simple').should('not.exist')
  cy.get(ITEM_SELECTOR).should('have.length', 1)
  cy.contains(ITEM_SELECTOR, 'difficult').should('be.visible')
})
```

- **tip** check out `cy.pause` command

Note:
Revisit the discussion about what kind of tests one should write. E2E tests can cover a lot of features in a single test, and that is a recommended practice. If a test fails, it is easy to debug it, and see how the application looks during each step.

+++

### Unit vs E2E

- if you are describing how code works: unit test
- if you are describing how code is used by the user: end-to-end test

+++

### Bonus

- Core concepts [https://on.cypress.io/writing-and-organizing-tests](https://on.cypress.io/writing-and-organizing-tests)

+++

Organize tests using folder structure and spec files

```text
cypress/integration/
  featureA/
    first-spec.js
    second-spec.js
  featureB/
    another-spec.js
    errors-spec.js
```

+++

Organize tests inside a spec using Mocha functions

```js
describe('Feature A', () => {
  beforeEach(() => {})

  it('works', () => {})

  it('handles error', () => {})

  // context is alias of describe
  context('in special case', () => {
    it('starts correctly', () => {})

    it('works', () => {})
  })
})
```
