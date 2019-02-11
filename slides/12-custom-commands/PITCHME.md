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
export function resetData () { ... }
export function visitSite () { ... }
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

Note:
Some functions can return `cy` instance, some don't, whatever is convenient. I also find small functions that return complex selectors very useful to keep selectors from duplication.

+++

Pro: functions are easy to document with JSDoc

![JSDoc example](/slides/12-custom-commands/img/jsdoc.png)

+++

And then IntelliSense works immediately

![IntelliSense](/slides/12-custom-commands/img/intellisense.jpeg)


+++

And MS IntelliSense can understand types from JSDoc and check those!

[https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript)

More details in: [https://slides.com/bahmutov/ts-without-ts](https://slides.com/bahmutov/ts-without-ts)

+++

## Custom commands

- share code in entire project without individual imports
- complex logic with custom logging into Command Log
  * login sequence
  * many application actions

📝 [on.cypress.io/custom-commands](https://on.cypress.io/custom-commands)

+++

Let's create a command to create a todo

```js
// instead of this
cy.get('.new-todo')
  .type('todo 0{enter}')
// use this
cy.createTodo('todo 0')
```

+++

## Todo: write and use "createTodo"

```js
Cypress.Commands.add('createTodo', todo => {
  cy.get('.new-todo').type(`${todo}{enter}`)
})
it('creates a todo', () => {
  cy.createTodo('my first todo')
})
```

+++

## ⬆️ Make it better

- have IntelliSense working for `createTodo`
- have nicer Command Log

+++

## Todo: add `createTodo` to `cy` object

How: [https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense)

+++

⌨️ in file `cypress/integration/12-custom-commands/custom-commands.d.ts`

```ts
/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Creates one Todo using UI
     * @example
     * cy.createTodo('new item')
     */
    createTodo(todo: string): Chainable<any>
  }
}
```

+++

Load the new definition file in `cypress/integration/12-custom-commands/spec.js`

```js
/// <reference path="./custom-commands.d.ts" />
```

+++

![Custom command IntelliSense](/slides/12-custom-commands/img/create-todo-intellisense.jpeg)

More JSDoc examples: [https://slides.com/bahmutov/ts-without-ts](https://slides.com/bahmutov/ts-without-ts)

Note:
Editors other than VSCode might require work.

+++

## Better Command Log

```js
Cypress.Commands.add('createTodo', todo => {
  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
  cy.log('createTodo', todo)
})
```

+++

## Even better Command Log

```js
Cypress.Commands.add('createTodo', todo => {
  const cmd = Cypress.log({
    name: 'create todo',
    message: todo,
    consoleProps () {
      return {
        'Create Todo': todo
      }
    }
  })
  cy.get('.new-todo', { log: false })
    .type(`${todo}{enter}`, { log: false })
})
```

+++

### Mark command completed

```js
cy.get('.new-todo', { log: false })
  .type(`${todo}{enter}`, { log: false })
  .then($li => {
    cmd
      .set({ $el: $li })
      .snapshot()
      .end()
  })
```

**Pro-tip:** you can have multiple command snapshots.

+++

## Custom command with retries

+++

## Best practices

@ul
- Making reusable function is often faster than writing a custom command
- Know Cypress API to avoid writing what's already available
@ulend


