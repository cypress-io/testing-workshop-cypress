# testing-workshop-cypress

https://testeverything.app/

Example code and tests taken from https://github.com/cypress-io/cypress-example-recipes

## Application

Vue.js + Vuex + REST server application we are going to test is in folder `todomvc`. This application and its full testing was described in [this blog post](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

## Slides

[https://gitpitch.com/bahmutov/testing-workshop-cypress][presentation] with the starting file in [PITCHME.md](PITCHME.md) presented using [GitPitch](https://gitpitch.com/). The pitch file includes files from the [slides](slides) folder. Students should open the [presentation slides][presentation] and follow along.

[presentation]: https://gitpitch.com/bahmutov/testing-workshop-cypress

## Content

| topics                                 | folder                                           | slides                                                        |
| -------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| introduction, TodoMVC application      | [todomvc](todomvc)                               | [intro.md](slides/intro.md)                                   |
| loading page                           | [00-start](00-start)                             | [00-start.md](slides/00-start.md)                             |
| `cypress open` vs `cypress run`        | [01-basic](01-basic)                             | [01-basic.md](slides/01-basic.md)                             |
| adding items test, `cypress.json` file | [02-adding-items](02-adding-items)               | [02-adding-items.md](slides/02-adding-items.md)               |
| selector playground                    | [03-selector-playground](03-selector-playground) | [03-selector-playground.md](slides/03-selector-playground.md) |
| reset database using `cy.request`      | [04-reset-state](04-reset-state)                 | [04-reset-state.md](slides/04-reset-state.md)                 |
| spy and stub XHR requests, fixtures    | [05-xhr](05-xhr)                                 | [05-xhr.md](slides/05-xhr.md)                                 |
| access application code and data       | [06-app-data-store](06-app-data-store)           | [06-app-data-store.md](slides/06-app-data-store.md)           |
| setting up E2E tests on CI             | [07-ci](07-ci)                                   | [07-ci.md](slides/07-ci.md)                                   |
| setting up Cypress dashboard           | [07-ci](07-ci)                                   | [08-dashboard.md](slides/08-dashboard.md)                     |
| the end                                | -                                                | [end.md](slides/end.md)                                       |

## For speakers

During a testing workshop in Boston I have covered this material in 3 hours (with 25 minute lunch break). Everyone worked or coded for the most part, except for CI and the Cypress dashboard sections, which I simply showed via slides and actual sites.

During the workshop, keep `todomvc` app running in one shell, while each section `00-start`, `01-basic`, etc. has its own Cypress and specs. Usually a spec has several tests with placeholder comments. The workshop attendees are expected to make the tests pass using the knowledge from slides and hints (and Cypress documentation).
