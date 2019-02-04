## Part 8: Reporters

- Mocha's [built-in reporters](https://mochajs.org/#reporters) come with Cypress
- [https://on.cypress.io](https://on.cypress.io)

+++

## Todo: try a different reporter

There are `json`, `list`, `markdown`, etc, see [https://mochajs.org/#reporters](https://mochajs.org/#reporters)

```json
{
  "reporter": "list"
}
```

and run `npm test`.

Note:
Each reporter changes the `STDOUT` output.

+++

## Todo: use built-in `junit` reporter

Bonus: direct output to a different file

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "cypress/results/output.xml"
  }
}
```

+++

## Question

Are all test results in the saved output file?

![Run numbers](/slides/09-reporters/img/test-run.png)

![Report numbers](/slides/09-reporters/img/junit-output.png)


+++

## Todo: report per spec

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "cypress/results/output-[hash].xml",
    "toConsole": true
  }
}
```

Note:
Option `reporterOptions.toConsole = true` mirrors JUnit reports to `STDOUT`.
Filename with `[hash]` will save individual report per spec. Remember to clean the output folder before running the tests.
