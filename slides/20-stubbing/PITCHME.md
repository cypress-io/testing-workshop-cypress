## ☀️ Stubbing methods

### 📚 You will learn

- how to spy on the methods
- how to stub methods
- how to register stubs before the application code

---
The application includes "analytics" library

```js
window.track = (eventName) => {
  console.log('tracking event "%s"', eventName)
}
window.addEventListener('load', () => {
  track('window.load')
})
```

The application calls the `track` method when adding and removing todos

```js
track('todo.add', todo.title)
...
track('todo.remove', todo.title)
```

---
## Let's spy on those calls

- [cy.spy](https://on.cypress.io/spy) observes the method calls

```js
it('works on click', () => {
  cy.visit('/').then((win) => {
    // need an object and a method name
    cy.spy(win, 'track').as('track')
  })
  enterTodo('write code')
  cy.get('@track')
  // TODO: assert the calls
})
```

**Tip:** read https://on.cypress.io/stubs-spies-and-clocks#Assertions

---
## Stub the method call

- with [cy.stub](https://on.cypress.io/stub) the original method is not called

```js
it('works on click', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })
  enterTodo('write code')
  cy.get('@track')
  // TODO: assert the calls
})
```

+++
## TODO: Confirm adding and removing todos

```js
it('tracks item delete', () => {
  // visit the page
  // stub "window.track"
  // enter and remove new todo
  // assert the stub "window.track" was called
  // with expected arguments
})
```

+++
## TODO: reset the count

```js
it('resets the count', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })

  enterTodo('write code')
  cy.get('@track').should('be.calledOnce')

  enterTodo('write tests')
  cy.get('@track')
    .should('be.calledTwice')
    // reset the stub?

  cy.get('@track').should('not.be.called')
  enterTodo('control the state')
  cy.get('@track').should('be.calledOnce')
})
```

---
## What if object changes

```js
it('stops working if window changes', () => {
  cy.visit('/').then((win) => {
    cy.stub(win, 'track').as('track')
  })

  enterTodo('write code')
  cy.get('@track').should('be.calledOnce')

  cy.reload()
  enterTodo('write tests')
  // note that our stub was still called once
  // meaning the second todo was never counted
  cy.get('@track').should('be.calledOnce')
})
```

Why hasn't the `window.track` been called the second time?

+++

Forward call to the same stub function

```js
it('adds stub after reload', () => {
  // create a single stub with
  // const trackStub = cy.stub().as('track')
  // stub the window.track after cy.visit
  // and after reload
  // and then count the number of calls
})
```

---
## What about window.track on load?

We know the property that will be assigned `window.track = fn`, we need to grab it.

```js
it('works on load', () => {
  // set up the stub when the window object exists
  // but before any code loads
  // see https://on.cypress.io/visit onBeforeLoad
  // use Object.defineProperty(win, 'track', {...}) to
  // get the "window.track = fn" assignment and call
  // the cy.stub wrapping the fn
  // after the visit command confirm the stub was called
})
```

+++
## Improvement: do this for every window

```js
it('works via event handler', () => {
  // need to return the same stub when using cy.visit
  // and cy.reload calls that create new "window" objects
  // tip: use the cy.on('window:before:load', ...) event listener
  // which is called during cy.visit and during cy.reload
  // during the test reload the page several times, then check
  // the right number of "window.track" calls was made
})
```

Confirm the number of `window.track('load')` calls with `cy.visit` + `cy.reload`

---
## 📚 See also

- Read Cypress "Stubs, Spies, and Clocks" guide at [https://on.cypress.io/stubs-spies-and-clocks](https://on.cypress.io/stubs-spies-and-clocks)
- "Stubbing and spying" recipes at [https://github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes#stubbing-and-spying)

---
## 🏁 Stubbing methods

- To create a spy or a stub you need an object and the method name
- Prepare for methods called on load using `onBeforeLoad` or via `cy.on('window:before:load', ...)`
