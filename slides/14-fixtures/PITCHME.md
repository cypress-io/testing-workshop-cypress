## ☀️ Part 14: Fixtures and Backend Code

### 📚 You will learn

- how to load and use fixtures
- how to execute code in Node context

+++

- start TodoMVC application using `npm start`
- open `14-fixtures/fixture-spec.js`

+++

## Todo: reset server using a fixture

⌨️ test "sets list of todos on the server"

- load fixture file "cypress/integration/two-items.json"
- post the list to "/reset" as `{ todos: list }`

Tip: we are going to need [`cy.fixture`](https://on.cypress.io/fixture)

+++

## Load fixture before each test

⌨️ test "closure variable"

```js
let list
beforeEach(() => {
  cy.fixture('two-items')
  // then store the loaded items in variable "list"
})
it('sets list from context', () => {
  // post items to the server
})
```

+++

## Store data in test context

In Mocha, hooks like `before`, `beforeEach`, `it` can store data in "this" object, if the callbacks use "function () { ... }" form.

```js
beforeEach(function () {
  this.foo = 'bar'
})
it('has foo', function () {
  expect(this.foo).to.equal('bar')
})
```

+++

## Load fixture before each test

⌨️ test context "this.list"

```js
context('this.list', () => {
  beforeEach(function () {
    cy.fixture('two-items')
    // then assign value to "this.list"
  })
  it('sets list from context', function () {
    // POST "this.list" to the server using "/reset"
  })
  it('has valid list with 2 items', function () {
    // check that "this.list" has 2 items
  })
})
```

+++

### ⚠️ Be careful trying to replace `beforeEach` with `before`

⌨️ test context "this.list"

Try saving time by replacing `beforeEach` with `before`.

What happens? How do you solve this?

Note:
Each test wipes away the previous context object. Thus "this.list" becomes undefined when the second test runs. You can use closure variable instead of "this" to get around this. This is a common problem when trying to save time on login.

+++

## Fixtures recipe

Check out the "Fixtures" recipe in [github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes) repository.

+++

## Log in once

```js
let token
before(() => {
  cy.request(...)
    .its('response.body.token')
    .then(t => {
      // save token in closure variable
      token = t
    })
})
beforeEach(() => {
  localStorage.setItem('login-token', token)
})
// each test is logged in
```

Note:
This is common solution to speeding up slow login - log in once, then store cookies and tokens and set them before each test.

+++

## `@ = this` shortcut

⌨️ test context "@list"

```js
beforeEach(function () {
  // cy.fixture(<filename>).as(<alias name>)
  cy.fixture('two-items').as('list')
})
it('works', function () {
  // inside test use "this.list
})
```

+++

## Remember the queue of commands

```js
it('does not work', function () {
  cy.fixture('two-items').as('list')
  // we are using "this.list" BEFORE it was set in
  // the above asynchronous call
  expect(this.list).to.have.length(2)
  cy.request('POST', '/reset', { todos: this.list })
})
```

Note:
Walk through each line to number the order in which commands are executed

+++

## Add command to the queue

```js
it('works if we change the order', function () {
  cy.fixture('two-items')
    .as('list')
    .then(() => {
      // by now the fixture has been saved into "this.list"
      // check that "this.list" has 2 items
      // use it to post to the server
    })
})
```

Note:
Using `cy.then` to schedule another callback will solve the problem.

+++

## Fixtures in different encoding

Todo: in file `cypress/support/index.js` uncomment

```js
require('cypress-dark/src/halloween')
```

Run at least one failing test

+++

![Halloween theme](/slides/14-fixtures/img/halloween.png)

How did the test load and play MP3?

+++

In `node_modules/cypress-dark/halloween.js`

```js
const witchLaughs = () => {
  const filename = join(getSourceFolder(), 'halloween-laugh.mp3')
  cy.readFile(filename, 'base64', { log: false }).then(mp3 => {
    const uri = 'data:audio/mp3;base64,' + mp3
    const audio = new Audio(uri)
    audio.play()
  })
}
```

+++

You can do the same with MP3 files in your fixtures folder

```js
cy.fixture('audio/sound.mp3', 'base64').then((mp3) => {
  const uri = 'data:audio/mp3;base64,' + mp3
  const audio = new Audio(uri)

  audio.play()
})
```

+++

## Other formats

```js
cy.fixture('images/logo.png').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})
cy.fixture('images/logo.png', 'binary').then((logo) => {
  // logo will be encoded as binary
  // and should look something like this:
  // 000000000000000000000000000000000000000000...
})
```

+++

## `readFile` and `writeFile`

`cy.readFile` will retry until file exists and assertions that follow it pass

```js
// note: path is relative to the project's root
cy.readFile('some/nested/path/story.txt')
  .should('eq', 'Once upon a time...')
```

[on/readfile](https://on.cypress.io/readfile) and [on/writefile](https://on.cypress.io/writefile)

+++

## Todo `readFile` after POST

```js
it('reads items loaded from fixture', () => {
  cy.fixture('two-items').then(todos => {
    // post items
    // read file 'todomvc/data.json',
    // should be equal to the loaded fixture
    // note: JSON is parsed automatically!
  })
})
```

+++
## Todo `readFile` entered through UI

```js
it('saves todo', () => {
  // reset data on the server
  // visit the page
  // type new todo via GUI
  // read file - it should have the item you have entered
})
```

+++
## Cypress architecture: browser

There are two iframes: one for the app, one for the specs.

[on.cypress.io/key-differences](https://on.cypress.io/key-differences)

+++
![two iframes](/slides/14-fixtures/img/two-iframes.png)

One iframes has the application, second iframe has spec code for isolation

+++
![iframes HTML](/slides/14-fixtures/img/iframes.png)

Note:
You can find the iframe HTML elements side by side. The one with the specs has zero dimensions. The Cypress Command Log is in the top window around the iframes.

+++
![set domain](/slides/14-fixtures/img/set-domain.png)

Note:
In order for spec iframe (coming from localhost) to access the app iframe (coming from any domain), we inject a little JavaScript snippet shown here at the very start, which sets the document domain to be `localhost`. This gives Cypress access to the application's DOM and `window` and everything.

+++
![start step 1](/slides/14-fixtures/img/start-1.png)

Note:
Cypress starts the browser in proxy mode. Every request your application makes to its domain goes through Cypress

+++
![start step 2](/slides/14-fixtures/img/start-2.png)

Note:
Before Cypress forwards the request to the external domain, it creates and injects a self-signed certificate for that domain - and then forwards the request.

+++
![start step 3](/slides/14-fixtures/img/start-3.png)

Note:
When the external server responds with the page, Cypress injects the little script I have shown to set the document's domain to `localhost`

+++
![start step 4](/slides/14-fixtures/img/start-4.png)

Specs can access the app iframe.

Note:
After that Cypress can access everything inside the application iframe, except for inner iframes coming from other domains.

+++
![start step 5](/slides/14-fixtures/img/start-5.png)

Note:
And Cypress can observe and stub network calls coming from the application because it still acts as a proxy.

+++
## Cypress architecture: Node

- tests run in the browser
- what if you need OS actions during test?
  * access file system
  * access database

+++
![cy.task](/slides/14-fixtures/img/cy-task.png)

Run code in Node using [`cy.task`](https://on.cypress.io/task)

+++
## Explore tasks

- keep running TodoMVC application using `npm start`
- open `14-fixtures/task-spec.js`
- open `cypress/plugins/index.js` with task code

+++
## Todo: write a "hello world" task

- caller will pass the name from the test
- task will respond with `hello ${name}`
- test should confirm the result

**Tip:** you can call "on('task')" multiple times, the task names will be merged.

+++
```js
it('runs hello world', () => {
  cy.task('hello', 'world').should('equal', 'hello, world')
})
```
```js
// in plugins file
on('task', {
  hello: name => `hello, ${name}`
})
```
**note:** Cypress does not watch plugins file.

+++
## Bonus

Print `process.version` from the task

+++
## Todo: write asynchronous task

Change task "runs hello world" to return a Promise.

+++
```js
on('task', {
  hello: name => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`hello, ${name}`)
      }, 1000)
    })
  }
})
```
**note:** there is no handy `Cypress.Promise` Bluebird in Node

+++
## Retries in tasks

@ul
- Look at existing task `hasSavedRecord` and trace what it does
- Write a test that calls task `hasSavedRecord`
- Delay application to demonstrate that task retries
@ulend

+++
## Retries libraries

You can do retries yourself, or bring a library like

- [promise-retry](https://github.com/IndigoUnited/node-promise-retry#readme)
- [bigtestjs/convergence](https://github.com/bigtestjs/convergence)
- [wait-for-expect](https://github.com/TheBrainFamily/wait-for-expect)

+++
## Dynamic tasks

Make a task that makes new tasks

```js
it('makes task and runs it', () => {
  function hello (name) {
    return 'hello, ' + name
  }
  cy.task('eval', hello.toString())
  cy.task('hello', 'eval').should('equal', 'hello, eval')
})
```

+++
```js
on('task', {
  eval (newTaskFn) {
    const name = newTaskFn.match(/^function (\w+)/)[1]
    const newTask = /* js */ `
      on('task', {
        ${name}: ${newTaskFn}
      })
    `
    eval(newTask)
    return null
  }
})
```
**tip:** use "Comment tagged templates" to syntax highlight using `/* js */`

Note:
While this is possible, you still are sending just a string to the backend, so you linter cannot tell you if the code you are sending makes sense or not.

+++
## 🏁 Fixtures

When loading fixtures remember JavaScript + Mocha lifecycle and `this` context

+++
## 🏁 Architecture

There are 2 iframes in the browser controlled by Cypress. Specs have full access to the application.

+++
## 🏁 Architecture

Node context is _strongly_ separated from the browser context. Use `cy.task` to cross the border.

- initializing data before the test
- checking external services during test
