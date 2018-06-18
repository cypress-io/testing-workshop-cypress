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
