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

+++

## Todo: write create todos test

use the page object methods

```js
beforeEach(() => {
  // reset data and visit the page
})

it('creates 3 todos', () => {
  // create default todos
  // and check that there are 3 of them
})
```

+++

## Todo: write toggle test

```js
// cypress/integration/13-app-actions/using-po-spec.js
context('toggles items', () => {
  beforeEach(() => {
    // what should you do before each test?
  })

  it('completes second item', () => {
    // toggle 1 item
    // check class names for all 3 items
  })
})
```

+++

![Toggle test](/slides/13-app-actions/img/toggle.png)

Note:
Our goal is to use todo page instance to create todos, then toggle one of them (again using the page object), then confirm class names like `todoPage.todos(0).should('not.have.class', 'completed')`.

+++

> What methods do you have in the Page Object?

Compare to the methods in `app.js`
