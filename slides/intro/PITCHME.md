# Gleb Bahmutov, PhD

- VP of Engineering, Cypress
- gleb (at) cypress.io
- [@bahmutov](https://twitter.com/bahmutov)

+++

## What we are going to cover

As long as ⏳ permits

- example TodoMVC
  * web app, data store, REST calls
- basic page load test
- selector playground
- resetting state
- XHR spying and stubbing, fixtures
- maybe CI and Cypress dashboard

+++

## Time 🕰

- total workshop duration 3 hours
- short breaks after 1 hour and 2 hours

+++

Please: if you have experience with Cypress.io, help others during the workshop 🙏

+++

## Requirements

You will need:

- `git` to clone this repo
- Node v6+ to install dependencies

```text
git clone <repo url>
cd testing-workshop-cypress
npm install
```

+++

## Repo organization

- `/todomvc` is a web application we are going to test
- all tests are in `cypress/integration` folder
  - there are subfolders for exercises
    - `01-basic`
    - `02-adding-items`
    - `03-selector-playground`
    - `04-reset-state`
    - etc
- keep application `todomvc` running!

Note:
We are going to keep the app running, while switching from spec to spec for each part.

+++

## `todomvc`

Let us look at the application.

- `cd todomvc`
- `npm start`
- `open localhost:3000`

**important** keep application running through the entire workshop!

+++

It is a regular TodoMVC application.

![TodoMVC](/slides/intro/img/todomvc.png)

+++

If you have Vue DevTools plugin

![With Vue DevTools](/slides/intro/img/vue-devtools.png)

+++

Look at XHR when using the app

![Network](/slides/intro/img/network.png)

+++

Look at `todomvc/index.html`

![DOM](/slides/intro/img/DOM.png)

+++

Look at `todomvc/app.js`

![Application](/slides/intro/img/app.png)

+++

## Questions

- what happens when you add a new Todo item?
- how does it get to the server?
- where does the server save it?
- what happens on start up?

Note:
The students should open DevTools and look at XHR requests that go between the web application and the server. Also the students should find `todomvc/data.json` file with saved items.

+++

![App organization](/slides/intro/img/vue-vuex-rest.png)

Note:
This app has been coded and described in this blog post [https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)
