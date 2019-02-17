## ☀️ Part 16: Preprocessors

A preprocessor is the plugin responsible for preparing a support file or a test file for the browser.

### 📚 You will learn

- how to change options when bundling specs
- how to use TypeScript specs

Also: [on.cypress.io/preprocessors-api](https://on.cypress.io/preprocessors-api)

+++
## Specs

Are bundled by default using [Cypress browserify preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)

Or you can use [Cypress webpack preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor)

+++
## Default options

```sh
npm i -D @cypress/browserify-preprocessor
```
```js
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
module.exports = (on, config) => {
  on('file:preprocessor', browserify())
}
```

+++
## Todo: print default options

Add `debug` call to show default browserify options used to bundle spec files

```js
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')
// convention: use name of the repo
const debug = require('debug')('testing-workshop-cypress')
module.exports = (on, config) => {
  const options = browserify.defaultOptions
  // try %o - prints object on a single line
  // or %O - prints object on multiple lines
  debug('browserify options %o', options)
  on('file:preprocessor', browserify(options))
}
```

+++

![Default options](/slides/16-preprocessors/img/default-options.png)

+++
We need to print deeper options. Use `DEBUG_DEPTH=10`

![Default options deep](/slides/16-preprocessors/img/default-options-deep.png)
