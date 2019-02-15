# testing-workshop-cypress [![CircleCI][ci-badge]][ci-url] [![renovate-app badge][renovate-badge]][renovate-app]

> A 3-4 hour testing workshop complete with application, exercise tests and speaker slides for [Cypress.io](https://www.cypress.io/)

## Requirements ⚙️

- Any computer: Mac, Windows, Linux
- [Node 6+](https://nodejs.org/)
- [git](https://git-scm.com)

In order to get the code and install dependencies

```bash
git clone git@github.com:cypress-io/testing-workshop-cypress.git
cd testing-workshop-cypress
npm install
```

If necessary, install dependencies inside TodoMVC folder

```bash
cd todomvc
npm install
```

### Quick check ✅

You can test the installation by starting TodoMVC in the first terminal window

```shell
cd todomvc
npm start
```

and you should see in the terminal

```text
> json-server --static . data.json --middlewares ./node_modules/json-server-reset


  \{^_^}/ hi!

  Loading data.json
  Loading ./node_modules/json-server-reset
  Done

  Resources
  http://localhost:3000/todos

  Home
  http://localhost:3000
```

and from the second terminal you should be able to open Cypress with

```bash
$ npm run cy:open

> testing-workshop-cypress@1.0.0 cy:open /git/testing-workshop-cypress
> cypress open
```

## Application 💾

[Vue.js](https://vuejs.org/) + [Vuex](https://vuex.vuejs.org/) + REST server application that we are going to test is in the folder `todomvc`. This application and its full testing is described in [this blog post](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/). The application should run fine without network access.

## Slides 🖥

[https://gitpitch.com/cypress-io/testing-workshop-cypress][presentation] with the starting file in [PITCHME.md](PITCHME.md) presented using [GitPitch](https://gitpitch.com/). The pitch file includes files from the [slides](slides) folder. Students should open the [presentation slides][presentation] and follow along. You can also show each section separately by clicking on the "slides" link in the table below. The full presentation includes all these presentations.

[presentation]: https://gitpitch.com/cypress-io/testing-workshop-cypress

## Content 🗂

| topics                                 | folder                                                                                   | contents                                                       | slides |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ |
| Introduction, TodoMVC application      | [todomvc](todomvc)                                                                       | [intro.md](slides/intro/PITCHME.md)                                   | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/intro)
| Loading page                           | [00-start](00-start)                                                                     | [00-start](slides/00-start/PITCHME.md)                             | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/00-start)
| `cypress open` vs `cypress run`        | [01-basic](cypress/integration/01-basic)                             | [01-basic](slides/01-basic/PITCHME.md)                             | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/01-basic)
| Adding items test, `cypress.json` file | [02-adding-items](cypress/integration/02-adding-items)               | [02-adding-items](slides/02-adding-items/PITCHME.md)               | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/02-adding-items)
| Selector Playground                    | [03-selector-playground](cypress/integration/03-selector-playground) | [03-selector-playground](slides/03-selector-playground/PITCHME.md) | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/03-selector-playground)
| Reset database using `cy.request`      | [04-reset-state](cypress/integration/04-reset-state)                 | [04-reset-state](slides/04-reset-state/PITCHME.md)                 | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/04-reset-state)
| Spy and stub XHR requests, fixtures    | [05-xhr](cypress/integration/05-xhr)                                 | [05-xhr](slides/05-xhr/PITCHME.md)                                 | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/05-xhr)
| Access application code and data       | [06-app-data-store](cypress/integration/06-app-data-store)           | [06-app-data-store](slides/06-app-data-store/PITCHME.md)           | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/06-app-data-store)
| Setting up E2E tests on CI             | [07-ci](cypress/integration/07-ci)                                   | [07-ci](slides/07-ci/PITCHME.md)                                   | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/07-ci)
| Setting up Cypress Dashboard           | [07-ci](cypress/integration/07-ci)                                   | [08-dashboard](slides/08-dashboard/PITCHME.md)                     | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/08-dashboard)
| Test reporters             | - | [09-reporters](slides/09-reporters/PITCHME.md)                     | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/09-reporters)
| Configuration | - | [10-configuration](slides/10-configuration/PITCHME.md) | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/10-configuration)
| Retry-ability | [11-retry-ability](cypress/integration/11-retry-ability) | [11-retry-ability](slides/11-retry-ability/PITCHME.md) | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/11-retry-ability)
| Custom commands | [12-custom-commands](cypress/integration/12-custom-commands) | [12-custom-commands](slides/12-custom-commands/PITCHME.md)| [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/12-custom-commands)
| Page Objects vs App Actions | [13-app-actions](cypress/integration/13-app-actions) | [13-app-actions](slides/13-app-actions/PITCHME.md) | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/13-app-actions)
| Fixtures and backend | [14-fixtures](cypress/integration/14-fixtures) | [14-fixtures](slides/14-fixtures/PITCHME.md) | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/14-fixtures)
| The end                                | -                                                                                        | [end](slides/end/PITCHME.md)                                       | [link](https://gitpitch.com/cypress-io/testing-workshop-cypress?p=slides/end)

## For speakers 🎙

During a testing workshop in Boston, [Gleb Bahmutov](https://github.com/bahmutov) covered this material in 3 hours (with a 25 minute lunch break). Everyone worked or coded for the most part, except for CI and the Cypress Dashboard sections, where the usage was shown via slides and actual sites.

During the workshop, keep the `todomvc` app running in one shell, while each section `01-basic`, `02-...`, `03-...` etc. has its own Cypress and specs subfolders `cypress/integration/...`. Usually a spec has several tests with placeholder comments. The workshop attendees are expected to make the tests pass using the knowledge from the slides and hints (and [Cypress documentation](https://docs.cypress.io/)). Note that most folders have a prepared `spec.js` file and an `answer.js` file. The `answer.js` file is ignored by Cypress using a setting in `cypress.json`.

The only exception is the folder `00-start`. This is a folder for students to see how Cypress scaffolds example specs when you open Cypress for the very first time. In this folder students should execute...

```
cd 00-start
npm run cy:open
```

...and see the list of created example specs.

The slides can be shown directly via the [presentation link][presentation] above. The Markdown files in [slides](slides) folder also has a little bit of speaker notes.

## Additional information 🗃

- https://www.cypress.io/
- https://docs.cypress.io/
- https://docs.cypress.io/api/api/table-of-contents.html

[ci-badge]: https://circleci.com/gh/cypress-io/testing-workshop-cypress.svg?style=svg
[ci-url]: https://circleci.com/gh/cypress-io/testing-workshop-cypress
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
