## Basic test

- work in the folder `01-basic`
- open `cypress/integration/spec.js`

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

+++

## Questions 1/2

- what happens when you execute `npm run cy:run` or `npx cypress run`?

## Questions 2/2

- where are the docs for `cy.contains` command?
- why is the command failing?
  - **hint**: use DevTools
- can you fix this?
