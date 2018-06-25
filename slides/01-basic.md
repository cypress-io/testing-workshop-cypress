## Basic test

- keep `todomvc` app running
- open Cypress from the root folder with `npm run cy:open`
- click on `01-basic/spec.js`

```js
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('Part of TodoMVC')
})
```

+++

`cy.contains('Part of TodoMVC')` is not working 😟

![Fails to find text](img/fails-to-find-text.png)

Note:
This is a good moment to show how Cypress stores DOM snapshots and shows them for each step.

+++

## Questions 1/3

- what happens when you execute `npm run cy:run` or `npx cypress run`?

+++

## Questions 2/3

- where are the docs for `cy.contains` command?
- why is the command failing?
  - **hint**: use DevTools
- can you fix this?

+++

## Questions 3/3

- do you see the command retrying (blue spinner)?
- use `timeout` option to force the command to try for longer

+++

## Bonus

- video recording [https://on.cypress.io/configuration#Videos](https://on.cypress.io/configuration#Videos)
- `cy.screenshot` command

+++

## What kind of tests?

- discussion: what would you test in the TodoMVC app?

Note:
Longer tests, adding items then deleting one for example. Adding items via GUI and observing communication with the server. Adding items then reloading the page.
