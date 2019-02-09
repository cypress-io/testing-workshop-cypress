## ☀️ Part 12: Custom commands

### 📚 You will learn

- adding new commands to `cy`
- supporting retry-ability
- TypeScript definition for new command
- useful 3rd party commands

+++

- keep `todomvc` app running
- open `12-custom-commands/spec.js`

+++

### 💯 Code reuse and clarity

```js
beforeEach(function resetData () {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite () {
  cy.visit('/')
})
```

Note:
Before each test we need to reset the server data and visit the page. The data clean up and opening the site could be a lot more complex that our simple example. We probably want to factor out `resetData` and `visitSite` into reusable functions every spec and test can use.

+++

### Todo: move them into `cypress/support/index.js`

Now these `beforeEach` hooks will be loaded _before every_ test in every spec.

Note:
Is this a good solution?

+++

### Todo: move them into `cypress/support/hooks.js`

And load from the spec file:

```js
import '../../support/hooks'

it('enters 10 todos', function () {
  ...
})
```

Note:
A better solution, because only the spec file that needs these hooks can load them.

+++

### Todo: export the `resetData` and `visitSite`

```js
// cypress/support/hooks.js
export function resetData ...
export function visitSite ...
```

⌨️ and update `spec.js`

+++

## My opinion

> Little reusable functions are the best

```js
import {
  enterTodo, getTodoApp, getTodoItems, resetDatabase, visit
} from '../../support/utils'
it('loads the app', () => {
  resetDatabase()
  visit()
  getTodoApp().should('be.visible')
  enterTodo('first item')
  enterTodo('second item')
  getTodoItems().should('have.length', 2)
})
```

+++

Pro: functions are easy to document with JSDoc

![JSDoc example](/slides/12-custom-commands/img/jsdoc.png)

+++

And then IntelliSense works immediately

![IntelliSense](/slides/12-custom-commands/img/intellisense.jpeg)
