## ☀️ Part 15: Debugging

### 📚 You will learn

- how to see debug messages from Cypress itself
- how to debug individual commands
- common sources of problems

Also: [on.cypress.io/debugging](http://on.cypress.io/debugging)

+++

## Something goes wrong

👎 Documentation, [GH issues](https://github.com/cypress-io/cypress/issues) and [chat](https://on.cypress.io/chat) do not help.

Open an issue 🎉

- reproduction code
- expected results
- video / screenshots
- Cypress internal messages

+++

Typically `cypress open` works and `cypress run` does not work

+++

## Run Cypress with `DEBUG`

Stop the application server and run Cypress only.

```sh
DEBUG=cypress* \
  npx cypress run \
  --spec cypress/integration/02-adding-items/demo.js
```

Note:
You should see a LOT of messages before the error is shown

+++

Cypress uses [debug](https://github.com/visionmedia/debug#readme) module to control debug CLI messages.

## Todo

```sh
# See CLI messages
DEBUG=cypress:cli npx ...
```

+++

![Debugging CLI](/slides/15-debugging/img/debug-cli.png)

A few debug messages from CLI module

+++

In addition to `cypress:cli` there are DEBUG name for each package in [https://github.com/cypress-io/cypress/tree/develop/packages](https://github.com/cypress-io/cypress/tree/develop/packages)

- `cypress:launcher` - controls finding and opening browsers
- `cypress:server` - the ❤️ of Cypress that controls everything

and [others](https://github.com/cypress-io/cypress/blob/develop/CONTRIBUTING.md#cypress-and-packages)

+++

## Detailed logs

**note:** there are more levels to DEBUG messages

```sh
# prints very few top-level messages
DEBUG=cypress:server ...
# prints ALL messages from server package
DEBUG=cypress:server* ...
# prints messages only from config parsing
DEBUG=cypress:server:config ...
```

This allows you to isolate the problem a little better

+++

## Debug logs in the browser

If the problem is seen during `cypress open` you can print debug logs too. Open browser DevTools

```js
localStorage.debug = 'cypress*'
```

Reload the browser "Cmd + R"

+++

![Debugging browser](/slides/15-debugging/img/debug-driver.jpg)

There is only "cypress:driver" package that runs in the browser

+++
## Step through test

Open 'cypress/integration/02-adding-items/demo.js' and add [cy.pause()](https://on.cypress.io/pause) command

```js
it('adds items', function () {
  cy.pause()
  cy.get('.new-todo')
    // ...
})
```

Note:
You can observe the application, the DOM, the network, the storage after each command to make sure everything happens as expected.

+++

## After the test has finished

```js
cy.now('command name', ...args)
  .then(console.log)
```

Runs single command _right now_. Might change in the future.

+++

## Common problems

### Missing `--`

Forgetting to use `--` when calling `npm run cy:run` with arguments

```sh
npm run cy:run --record --spec ...
```

NPM "swallows" `--record` argument

+++

Separate NPM and Cypress arguments with `--`

```sh
npm run cy:run -- --record --spec ...
```

**note:** in the future, we will try to do the right thing even if you forget to separate with `--`, see [#3470](https://github.com/cypress-io/cypress/issues/3470)

+++

### Cypress GUI slows down on longer tests

Usually caused by large DOM snapshots for time-traveling debugger

- run individual specs, do not use "Run all"
- split longer tests
- use config [numTestsKeptInMemory](https://on.cypress.io/configuration#Global)
