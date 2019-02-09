## ☀️ Part 1: Basic tests

### 📚 You will learn

- `cy.contains` and command retries
- two ways to run Cypress
- screenshots and video recording

+++

- keep `todomvc` app running
- open Cypress from the root folder with `npm run cy:open`
- click on `01-basic/spec.js`

```js
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('h1', 'Todos App')
})
```

+++

`cy.contains('h1', 'Todos App')` is not working 😟

Note:
This is a good moment to show how Cypress stores DOM snapshots and shows them for each step.

+++

## Questions 1/3

- where are the docs for `cy.contains` command?
- why is the command failing?
  - **hint**: use DevTools
- can you fix this?

+++

## Questions 2/3

- do you see the command retrying (blue spinner)?
- use `timeout` option to force the command to try for longer

+++

## Cypress has 2 commands

- `cypress open`
- `cypress run`

+++

## How to?

- run just this spec `cypress/integration/01-basic/spec.js` in headless mode?

Hint: `npx cypress run --help`

+++

## Bonus

- video recording [https://on.cypress.io/configuration#Videos](https://on.cypress.io/configuration#Videos)
- `cy.screenshot` command

+++

## Fix the test

- can you fix the test?
- how would you select an element:
  - by text
  - by id
  - by class
  - by attributes

+++

## What kind of tests?

- discussion: what would you test in the TodoMVC app?

Note:
Longer tests, adding items then deleting one for example. Adding items via GUI and observing communication with the server. Adding items then reloading the page.
