# Gleb Bahmutov, PhD

## VP of Engineering, Cypress

## contact

- gleb (at) cypress.io
- [@bahmutov](https://twitter.com/bahmutov)

---

## What we are going to cover

As long as ⏳ permits

- example TodoMVC
  - web app, data store, REST calls
- basic page load test
- Cypress commands
- selector playground
- resetting state
- XHR spying and stubbing

---

## Repo organization

- `/todomvc` is a web application we are going to test
- `00-start`, `01-...` individual steps

---

## `todomvc`

Let us look at the application.

- `cd todomvc`
- `npm install`
- `npm start`
- `open localhost:3000`

+++

It is a regular TodoMVC application.

![TodoMVC](todomvc/img/todomvc.png)

+++

If you have Vue DevTools plugin

![With Vue DevTools](todomvc/img/vue-devtools.png)

+++

Look at XHR when using the app

![Network](todomvc/img/network.png)

+++

Look at `index.html`

![DOM](todomvc/img/DOM.png)

+++

Look at `app.js`

![Application](todomvc/img/app.png)

+++

## Questions

- what happens when you add a new Todo item?
- how does it get to the server?
- where does the server save it?
- what happens on start up?

+++

![App organization](todomvc/img/app.png)
