## Part 10: Configuration

Cypress options can be set via:
- `cypress.json`
- `cypress.env.json`
- command line arguments
- environment variables
- in code

+++

## Question

> Where is the configuration documentation?

Note:
You should find docs at [https://on.cypress.io/configuration](https://on.cypress.io/configuration)

+++

## `cypress.json`

Open `cypress.json` and check which options are set in this project.

```json
{
  "viewportWidth": 400,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000"
}
```

+++

## `cypress.json` IntelliSense

![`cypress.json` IntelliSense in VSCode](/slides/10-configuration/img/cypress.json-intellisense.png)

You can have IntelliSense in `cypress.json` in a modern editor, like VSCode.

+++

## VSCode

In the user settings, global or workspace set

```json
{
  "json.schemas": [
    {
      "fileMatch": ["cypress.json"],
      "url": "https://raw.githubusercontent.com/cypress-io/cypress/develop/cli/schema/cypress.schema.json"
    }
  ]
}
```

Read: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)

+++

## VSCode (alternative)

Add `$schema` property to `cypress.json`

```json
{
  "viewportWidth": 600,
  "viewportHeight": 800,
  "ignoreTestFiles": "answer.js",
  "baseUrl": "http://localhost:3000",
  "$schema": "https://raw.githubusercontent.com/cypress-io/cypress/develop/cli/schema/cypress.schema.json"
}
```

Read: [https://glebbahmutov.com/blog/json-schema-for-the-win/](https://glebbahmutov.com/blog/json-schema-for-the-win/)
