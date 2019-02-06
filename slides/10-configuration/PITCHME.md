## Part 10: Configuration

Cypress options can be set via:
- `cypress.json`
- command line arguments
- environment variables
- in plugin code
- at run-time

+++

## Question

> Where is the configuration documentation?

Note:
You should find docs at [https://on.cypress.io/configuration](https://on.cypress.io/configuration)

+++

## `cypress.json`

Open `cypress.json` and check which options are set in this project.

```json
{
  "viewportWidth": 400,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000"
}
```

+++

## `cypress.json` IntelliSense

![`cypress.json` IntelliSense in VSCode](/slides/10-configuration/img/cypress.json-intellisense.png)

You can have IntelliSense in `cypress.json` in a modern editor, like VSCode.

+++

## VSCode

In the user settings, global or workspace set

```json
{
  "json.schemas": [
    {
      "fileMatch": ["cypress.json"],
      "url": "https://on.cypress.io/cypress.schema.json"
    }
  ]
}
```

Read: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)

+++

## VSCode (alternative)

Add `$schema` property to `cypress.json`

```json
{
  "viewportWidth": 600,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000",
  "$schema": "https://on.cypress.io/cypress.schema.json"
}
```

Read: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)

+++

## command line arguments

You can override default and `cypress.json` settings using `--config` flag

```shell
npx cypress open \
  --config baseUrl=http://todomvc.com/examples/dojo/,defaultCommandTimeout=10000
```

Note:
Try running `cypress/integration/02-adding-items/demo.js` spec.
Commonly used with `cypress run` command (specific spec, longer timeouts)

+++

## package scripts

**Warning ⚠️** if you start Cypress via NPM package scripts, use `--` to add CLI arguments.

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

```shell
npm run cy:run -- --config baseUrl=http://todomvc.com/examples/dojo/
```

+++

## environment variables

You can override `cypress.json` settings using environment variables that start with `CYPRESS_`

```shell
CYPRESS_baseUrl=http://todomvc.com/examples/dojo/ npx cypress open
# same
CYPRESS_BASE_URL=http://todomvc.com/examples/dojo/ npx cypress open
```

Note:
`cypress.json` < environment variables < CLI parameter

+++

## environment variables

Use environment variables on CI. Especially to pass the private record key!

```shell
# bad practice, can accidentally show up in STDOUT
npx cypress run --record --recordKey abc...
# good
CYPRESS_RECORD_KEY=abc...
npx cypress run --record
```

+++

## plugin code

In `cypress/plugins/index.js`

```js
module.exports = (on, config) => {
  config.baseUrl = 'http://todomvc.com/examples/dojo/'
  // change more options ...
  return config
}
```

Docs: [https://on.cypress.io/configuration-api](https://on.cypress.io/configuration-api)

+++

## plugin code

You can return a resolved config as a promise.

```js
module.exports = (on, config) => {
  return new Promise((resolve, reject) => {
    // load config from file or network
    resolve(loadedConfig)
  })
}
```

+++

## Run-time configuration

You can change current setting _per spec_ using [Cypress.config](https://on.cypress.io/config) call.

```js
Cypress.config('baseUrl', 'http://todomvc.com/examples/dojo/')
beforeEach(function visitSite () {
  cy.log('Visiting', Cypress.config('baseUrl'))
  cy.visit('/')
})
```

Note:
Use at your own risk, because the order of mutations and the final config in each test can be confusing.

+++

## Resolved configuration

![resolved configuration](/slides/10-configuration/img/configuration.png)

+++

## Configuration precedence

`cypress.json` < environment variable < CLI parameter < plugin < run-time

+++

## Environment variables

*That are not `CYPRESS_`* - username, passwords, etc.

+++

## Todo: per-environment config
