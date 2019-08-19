// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/* eslint-disable no-console */
/* global Promise */
const fs = require("fs");
const path = require("path");
const debug = require("debug")("testing-workshop-cypress");
const browserify = require("@cypress/browserify-preprocessor");
const snapshotsPlugin = require("cypress-plugin-snapshots/plugin");

const findRecord = title => {
  const dbFilename = path.join(__dirname, "..", "..", "todomvc", "data.json");
  const contents = JSON.parse(fs.readFileSync(dbFilename));
  const todos = contents.todos;
  return todos.find(record => record.title === title);
};

const hasRecordAsync = (title, ms) => {
  const delay = 50;
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find record with title "${title}"`));
    }
    const found = findRecord(title);
    if (found) {
      return resolve(found);
    }
    setTimeout(() => {
      hasRecordAsync(title, ms - delay).then(resolve, reject);
    }, 50);
  });
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // "cy.task" can be used from specs to "jump" into Node environment
  // and doing anything you might want. For example, checking "data.json" file!
  on("task", {
    hasSavedRecord(title, ms = 3000) {
      debug("inside task");
      console.log(
        'looking for title "%s" in the database (time limit %dms)',
        title,
        ms
      );
      return hasRecordAsync(title, ms);
    }
  });

  // code coverage tasks
  // on('task', require('cypress-istanbul/task'))
  // use .babelrc file if want to instrument unit tests
  // on("file:preprocessor", require("cypress-istanbul/use-babelrc"));

  // `config` is the resolved Cypress config
  // see https://on.cypress.io/configuration-api
  config.fixturesFolder = "cypress/fixtures";
  config.modifyObstructiveCode = false;
  snapshotsPlugin.initPlugin(on, config);
  const browserifyOptions = browserify.defaultOptions;
  on("file:preprocessor", browserify(browserifyOptions));
  return Promise.resolve(config);
};
