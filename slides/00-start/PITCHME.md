## ☀️ Vytvorenie projektu v Cypress

### 📚 Naučíš sa

- Štruktúra Cypress projektu
- Napísanie prvého testu
- Nastavenie intelligent code completion
- Cypress dokumentácia

+++

## Todo: vytvor nový Cypress projekt


- `cd 00-start`
- `npm install cypress -D`
(tento krok prosím vynechaj)
- `npm run cy:open`


+++

## Otvorenie Cypress GUI

```
npx cypress open
$(npm bin)/cypress open
./node_modules/.bin/cypress open
```

+++

Nastavenie skriptov v `package.json`

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

+++

![First time you open Cypress](/slides/00-start/img/cypress-scaffold.png)

+++

- "cypress.json" - Cypress settings
- "cypress/integration" - test súbory
- "cypress/fixtures" - mock dáta
- "cypress/plugins" - Cypress pluginy
- "cypress/support" - commandy, utility, defaultné akcie

Note:
This section shows how Cypress scaffolds its files and folders. Then the students can ignore this folder. This is only done once to show the scaffolding.

+++

Pozri sa na vytvorené súbory

Spusti si tie, ktoré Ťa zaujali

+++
## Prvý test

Vytvor si nový súbor

- `cypress/integration/test.js`

+++

Do súboru vpíš tento kód

```javascript
it('loads', () => {
  cy.visit('localhost:3000')
})
```

+++

- uisti sa, že TodoMVC aplikácia beží. ak nie, otvor si nový terminál a napíš `npm start`
- klikni na "test.js" v Cypress GUI

+++

## Questions

- what does Cypress do?
- what happens when the server is down?
  - stop the application server running in folder `todomvc`
  - reload the tests

+++

## Switch browser

![Switch browser](/slides/00-start/img/switch-browser.png)

+++

```javascript
/// <reference types="cypress" />
it('loads', () => {
  cy.visit('localhost:3000')
})
```

- why do we need `reference types ...` line?

Note:
By having "reference" line we tell editors that support it (VSCode, WebStorm) to use TypeScript definitions included in Cypress to provide intelligent code completion. Hovering over any `cy` command brings helpful tooltips.

+++

## IntelliSense

![IntelliSense in VSCode](/slides/00-start/img/cy-get-intellisense.jpeg)

+++

Every Cypress command and every assertion

![Should IntelliSense](/slides/00-start/img/should-intellisense.jpeg)

+++

Using `ts-check`

```javascript
/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  cy.visit('localhost:3000')
})
```

- what happens if you add `ts-check` line and misspell `cy.visit`?

Note:
The check works really well in VSCode editor. I am not sure how well other editors support Cypress type checks right out of the box.

+++

## Docs

Your best friend is [https://docs.cypress.io/](https://docs.cypress.io/)

![Doc search](/todomvc/img/docs-search.png)

+++

## Find at docs.cypress.io

- Cypress main features and how it works docs
- core concepts
- command API
  - how many commands are there?

+++

## 💡 Pro tip

```
https://on.cypress.io/<command>
```

goes right to the documentation for that command.

+++

## Find at docs.cypress.io

- examples
  - recipes
  - tutorial videos
  - example applications
  - blogs
  - FAQ
- Cypress changelog and roadmap

Note:
Students should know where to find information later on. Main resources is the api page [https://on.cypress.io/api](https://on.cypress.io/api)

+++

@snap[west]
![VSCode icons](/slides/00-start/img/vscode-icons.png)
@snapend

@snap[east]
Bonus: extension [vscode-icons](https://github.com/vscode-icons/vscode-icons)
@snapend
