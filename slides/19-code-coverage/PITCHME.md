## ☀️ Part 19: Code Coverage

### 📚 You will learn

- how to collect code coverage information
- how to write e2e tests effectively using code coverage as your 🗺

+++

## ⚠️ use `todomvc-redux` application

- stop TodoMVC
- in one terminal go into `todomvc-redux` and `npm start` there

Note:
This will start application and instrument the code on the fly

+++

Open `localhost:3000` and observe instrumented code (the `.js` bundle). The original code can be seen via source maps.

+++

![Instrumented code](/slides/19-code-coverage/img/instrumented.png)

+++

The code coverage object keeping track of all code lines hit is in the `window.__coverage__` object.

Note:
Explain its structure

+++

We are going to use [cypress-istanbul](https://github.com/cypress-io/cypress-istanbul) to manage and save this `window.__coverage__` object and generate coverage reports.

## Todo

- enable `cypress-istanbul` in `cypress/support/index.js` file
- enable `cypress-istanbul` in `cypress/plugins/index.js` file

+++

## Todo

- start Cypress
- execute test `cypress/integration/19-code-coverage/spec.js`
- open generated `coverage/index.html` in your browser

+++

![Coverage report](/slides/19-code-coverage/img/coverage.png)

+++

Drill down into individual files, for example todos reducer

![Reducer coverage report](/slides/19-code-coverage/img/reducer.png)

+++

## Todo

- see code coverage summary from the terminal with

```shell
npx nyc report --reporter=text
```

+++

## Todo

- add tests to cover more source lines

**Note:** this application does not have data persistance or server API calls

+++
## 🏁 Code coverage

Plugin [cypress-istanbul](https://github.com/cypress-io/cypress-istanbul) manages coverage information from e2e and unit tests and generates HTML report

+++
## 🏁 Code coverage

You can send code coverage information to external services. Read [https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/](https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/)
