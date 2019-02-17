## ☀️ Part 17: Component Testing

### 📚 You will learn

- how to test React components in isolation

+++
## Component testing

* [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test)
* [cypress-vue-unit-test](https://github.com/bahmutov/cypress-vue-unit-test)
* [cypress-cycle-unit-test](https://github.com/bahmutov/cypress-cycle-unit-test)
* [cypress-svelte-unit-test](https://github.com/bahmutov/cypress-svelte-unit-test)
* [cypress-angular-unit-test](https://github.com/bahmutov/cypress-angular-unit-test)
* [cypress-hyperapp-unit-test](https://github.com/bahmutov/cypress-hyperapp-unit-test)
* [cypress-angularjs-unit-test](https://github.com/bahmutov/cypress-angularjs-unit-test)

[on.cypress.io/plugins#component-testing](http://on.cypress.io/plugins#component-testing)

+++
## 💡 Idea

Instead of loading an HTML page, create an empty page and mount a component X
+++

```jsx
import React from 'react'
const HelloWorld = () => <p>Hello World!</p>
describe('HelloWorld component', () => {
  it('works', () => {
    cy.mount(<HelloWorld />)
    cy.contains('Hello World!')
  })
})
```

**⚠️ note:** component testing API is likely to change

+++

![Hello World component test](/slides/17-component-testing/img/hello-world.png)

