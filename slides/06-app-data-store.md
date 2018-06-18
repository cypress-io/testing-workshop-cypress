## Application data store

- use `06-app-data-store`
- test that Vuex data store is working correctly

+++

![Random id](06-app-data-store/img/new-todo.png)

+++

## Non-determinism

- random data in tests makes it very hard
- UUIDs, dates, etc
- [https://on.cypress.io/stubs-spies-and-clocks](https://on.cypress.io/stubs-spies-and-clocks)

+++

## Questions

- how does a new item get its id?
- can you override random id generator from DevTools?

+++

## Iframed contexts

![Contexts](06-app-data-store/img/contexts.png)

+++

## Application under test

![Application under test](06-app-data-store/img/app-in-window.png)

+++

## Stub application's random generator

- get the application's context using `cy.window`
- get application's `window.Math` object
- can you stub application's random generator?
  - **hint** use `cy.stub`

+++

## Confirm spy's behavior

- write a test that adds 2 items
- name spy with an alias `cy.spy(...).as('name')`
- get the spy using the alias and confirm it was called twice

+++

## Application data store

- inspect in DevTools 'window.app' variable
- can you find the items in the data store as they are added?
  - **hint** you might need 'JSON.parse(JSON.stringify(...))' to get a "simple" object

+++

## Todo

Write a test that:

- adds 2 todos
- gets the data store
- confirms the objects in the data store

+++

## Advanced

Write a test that:

- dispatches actions to the store to add items
- confirms new items are added to the DOM
