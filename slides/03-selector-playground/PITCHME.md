## ☀️ Part 3: Selector playground

### 📚 You will learn

- Cypress Selector Playground tool
- best practices for selecting elements

+++

- keep `todomvc` app running
- open `03-selector-playground/spec.js`

+++

> How do we select element in `cy.get(...)`?

- Browser's DevTools can suggest selector

+++

![Chrome suggests selector](/slides/03-selector-playground/img/chrome-copy-js-path.png)

+++

![Selector playground](/slides/03-selector-playground/img/selector-playground.png)

+++

It can suggest a weird selector

![Default suggestion](/slides/03-selector-playground/img/default-suggestion.png)

+++

## Questions

- read [best-practices.html#Selecting-Elements](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)
- add test data ids to `todomvc/index.html` DOM markup
- use new selectors to write `cypress/integration/spec.js`

+++

![Selectors](/slides/03-selector-playground/img/selectors.png)

+++

## Cypress is just JavaScript

```js
import {selectors} from './common-selectors'
it('finds element', () => {
  cy.get(selectors.todoInput).type(`...`)
})
```
