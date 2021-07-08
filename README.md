# testing-workshop-cypress

## Requirements

- Any computer: Mac, Windows, Linux
- [Node 12.0.0+ (LTS)](https://nodejs.org/), check [GH workflow file](.github/workflows/min-node-version.yml)
- [git](https://git-scm.com)

## Setup

In order to get the code and install dependencies

```bash
git clone --depth 1 git@github.com:mark43/testing-workshop-cypress.git
cd testing-workshop-cypress
npm i && npm run dev
```

Note for Windows users: if `npm start` throws an error, it is probably due to `cd todomvc; ...` first command in the `npm start `script. In this case change the working folder to "todomvc" and run `npm start` from there.

You should be able to access the app at [http://localhost:3000](http://localhost:3000)
