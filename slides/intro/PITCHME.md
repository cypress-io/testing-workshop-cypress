# Filip Hric

- QA Lead & Slido test automation maker, Cypress ambassador
- filip (at) slido.com
- [@filip_hric](https://twitter.com/filip_hric)

+++

# Skôr než začneme

- choďte prosím na slido.com
- zadajte kód #zero2hero
- pýtajte sa!

Note: [https://wall.sli.do/event/qihp8bzn](https://wall.sli.do/event/qihp8bzn)

+++

## What we are going to cover 1/3

- example TodoMVC
  * web app, data store, REST calls
- basic page load test
- selector playground
- resetting state
- XHR spying and stubbing, fixtures

+++

## What we are going to cover 2/3

- CI and Cypress dashboard
- test reporters
- configuration and environment variables
- retry-ability
- debugging
- visual testing

+++
## What we are going to cover 3/3

As long as ⏳ permits

- page objects vs app actions
- fixtures and backend
- preprocessors
- component testing
- plugins
- code coverage

+++

Ak máte so Cypressom predošlé skúsenosti, pomáhajte ostatným počas workshopu 🙏

+++

## Technické požiadavky

Čo budete potrebovať:

- `git` pre naklonovanie repozitára
- Node verziu 6 alebo vyššie pre nainštalovanie dependencii

```text
git clone https://github.com/filiphric/cypress-workshop.git
cd cypress-workshop
npm install
```

+++

## Ako je usporiadaný repozitár

- `/todomvc` je webová aplikácia, ktorú budeme testovať
- všetky testy sú v `cypress/integration` folderi
  - jednotlivé cvičenia sú v subfoldroch:
    - `01-basic`
    - `02-adding-items`
    - atď.
- aplikáciu `todomvc` maj prosím počas celého workshopu zapnutú

+++

## `todomvc`

Pozrime sa na aplikáciu

- `cd todomvc`
- `npm start`
- `open localhost:3000`

**dôležité** majte aplikáciu zapnutú počas celého trvania workshopu

+++

![TodoMVC](/slides/intro/img/todomvc.png)

+++

![Network](/slides/intro/img/network.png)

+++

## Otázky v Slido!

eventkód: *#zero2hero*

Note:
The students should open DevTools and look at XHR requests that go between the web application and the server. Also the students should find `todomvc/data.json` file with saved items.