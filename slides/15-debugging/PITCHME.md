## ☀️ Part 14: Debugging

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

## Run Cypress with `DEBUG`

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

![Debugging CLI](/slides/14-fixtures/img/debug-cli.png)

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
