## @fa[graduation-cap](Part 11: Retry-ability)

And a deeper dive into assertions

- keep `todomvc` app running
- open `11-retry-ability/spec.js`

+++

## Todo: finish the test "shows UL"

```js
it('shows list of items', function () {
  // ...
  cy.contains('ul', 'todo A')
  // confirm that the above element
  //  1. is visible
  //  2. has class "todo-list"
  //  3. css property "list-style-type" is equal "none"
})
```

+++

Most assertions I write are BDD

```js
cy.contains('ul', 'todo A').should('be.visible')
expect($el).to.have.prop('disabled', false)
```

[on/assertions#BDD-Assertions](https://on.cypress.io/assertions#BDD-Assertions)

+++

1, 2, or 3 arguments

```js
.should('be.visible')
.should('have.class', 'todo-list')
.should('have.css', 'list-style-type', 'none')
```

+++

## There is IntelliSense

![BDD IntelliSense](/slides/11-retry-ability/img/assertion-intellisense.png)

+++

⚠️ straight Chai IntelliSense is not so good

![Chai assertion IntelliSense](/slides/11-retry-ability/img/chai-intellisense.png)

+++

If you must, there are TDD assertions like

```
assert.equal(3, 3, 'vals equal')
assert.isTrue(true, 'this val is true')
```

[on/assertions#TDD-Assertions](https://on.cypress.io/assertions#TDD-Assertions)

+++

## Todo: BDD vs TDD

Finish test "shows UL - TDD"

```js
it('shows UL - TDD', function () {
  cy.contains('ul', 'todo A').then($ul => {
    // use TDD assertions
    // $ul is visible
    // $ul has class "todo-list"
    // $ul css has "list-style-type" = "none"
  })
})
```

+++

## @fa[question](do you see the difference?)

Which style do you prefer?

⚠️ [Chai-jQuery](https://on.cypress.io/assertions#Chai-jQuery) and [Sinon-Chai](https://on.cypress.io/assertions#Sinon-Chai) are only available in BDD mode.

+++

## BDD
![BDD log](/slides/11-retry-ability/img/bdd.png)

+++

## TDD
![TDD log](/slides/11-retry-ability/img/tdd.png)

+++

## What if you need more complex assertions?

Write you own [should(cb)](http://on.cypress.io/should#Function) assertion

```js
cy.get('.docs-header').find('div')
  .should(($div) => {
    expect($div).to.have.length(1)
    const className = $div[0].className
    expect(className).to.match(/heading-/)
  })
```

+++

## Todo: write complex assertion

```js
it('every item starts with todo', function () {
  // ...
  cy.get('.todo label').should($labels => {
    // confirm that there are 4 labels
    // and that each one starts with "todo-"
  })
})
```

+++

## Common use cases

- dynamic data, like scoped class names
- text between two cells is unknown but should be the same
- displayed value should be the same as API has returned

[https://example.cypress.io/commands/assertions](https://example.cypress.io/commands/assertions)

+++

## @fa[lightbulb](Retry-ability)

> Key concept in Cypress, yet should go unnoticed mostly.

Note:
Add link to retry-ability page when finished https://github.com/cypress-io/cypress-documentation/pull/1314
+++

### Commands and assertions

```javascript
it('creates 2 items', function () {
  cy.visit('/')                       // command
  cy.focused()                        // command
    .should('have.class', 'new-todo') // assertion
  cy.get('.new-todo')                 // command
    .type('todo A{enter}')            // command
    .type('todo B{enter}')            // command
  cy.get('.todo-list li')             // command
    .should('have.length', 2)         // assertion
})
```

+++

### Look at the last command + assertion

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
```

Command `cy.get()` will be retried _until_ the assertion `should('have.length', 2)` passes.

Note:
If not shown, this is a good moment to slow down the app and show how the assertion still works, especially when slowing down progressively - 1 item, slow down by 1 second, 2 items - slow down by 2 seconds.

+++

Command `cy.contains` will be retried _until 3 assertions_ that follow it all pass.

```js
cy.contains('ul', 'todo A')                   // command
  .should('be.visible')                       // assertion
  .and('have.class', 'todo-list')             // assertion
  .and('have.css', 'list-style-type', 'none') // assertion
```

+++

Command `cy.get` will be retried _until 5 assertions_ that follow it all pass.

```js
cy.get('.todo label')                 // command
  .should($labels => {
    expect($labels).to.have.length(4) // assertion

    $labels.each((k, el) => {         // 4 assertions
      expect(el.textContent).to.match(/^todo /)
    })
  })
```
