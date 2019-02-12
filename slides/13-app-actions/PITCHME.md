## ☀️ Part 13: App Actions

### 📚 You will learn

- how to organize test code using Page Objects
- how to call into application directly from tests
- benefits of App Actions

+++

## Based on

- 📝 blog [Stop using Page Objects and Start using App Actions](https://www.cypress.io/blog/2019/01/03/stop-using-page-objects-and-start-using-app-actions/)
- 💻 code [bahmutov/test-todomvc-using-app-actions](https://github.com/bahmutov/test-todomvc-using-app-actions)

+++

## How do we organize our tests?

@ul
- 👍 Cypress allows you to write a lot of E2E tests
- 👎 Cypress allows you to write a LOT of E2E tests
@ulend

+++

## Let us write a Page Object

- keep `todomvc` app running
- find Page Object in `13-app-actions/todo-page-object.js`
- open `13-app-actions/using-po-spec.js`

### Todo: write tests by calling page object methods

