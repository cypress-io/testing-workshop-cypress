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

Open "Selector Playground"

![Selector playground button](/slides/03-selector-playground/img/selector-button.png)

+++

Selector playground can suggest much better selectors.

![Selector playground](/slides/03-selector-playground/img/selector-playground.png)

+++

⚠️ It can suggest a weird selector

![Default suggestion](/slides/03-selector-playground/img/default-suggestion.png)

+++

## Questions

- read [best-practices.html#Selecting-Elements](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)
- add test data ids to `todomvc/index.html` DOM markup
- use new selectors to write `03-selector-playground/spec.js`

+++

![Selectors](/slides/03-selector-playground/img/selectors.png)

+++

## Cypress is just JavaScript

```js
import {selectors, tid} from './common-selectors'
it('finds element', () => {
  cy.get(selectors.todoInput).type(`...`)
  // "tid" forms "data-test-id" attribute selector
  // like "[data-test-id='item']"
  cy.get(tid('item')).should('have.length', 1)
})
```
