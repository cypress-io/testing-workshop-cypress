## Start testing

- `cd 00-start`
- install Cypress with `npm i -D cypress`
- open Cypress with `npm run cy:open`

+++

Look at the scaffolded example test files (specs).

Delete them.

+++

## First spec

- `cypress/integration/spec.js`

+++

```javascript
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
})
```

## Questions

- what does Cypress do?
- what happens when the server is down?
- why do we need `reference types ...` line?

+++

## Docs

Your best friend is [https://docs.cypress.io/](https://docs.cypress.io/)

![Doc search](todomvc/img/docs-search.png)

+++

## IntelliSense

![IntelliSense in VSCode](https://docs.cypress.io/img/snippets/intellisense-setup.a748a413.mp4)
