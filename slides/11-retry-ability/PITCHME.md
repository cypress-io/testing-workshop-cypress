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

@snap[north-west]
BDD
@snapend

@snap[west sidebar]
![BDD log](/slides/11-retry-ability/img/bdd.png)
@snapend

@snap[north-east]
TDD
@snapend

@snap[east sidebar]
![TDD log](/slides/11-retry-ability/img/tdd.png)
@snapend

