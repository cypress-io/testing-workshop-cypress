# End-to-end testing with [Cypress.io](https://cypress.io)

+++

# Gleb Bahmutov, PhD

## VP of Engineering, Cypress

## contact

- gleb (at) cypress.io
- [@bahmutov](https://twitter.com/bahmutov)

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
