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

const fs = require('fs')
const path = require('path')
const debug = require('debug')('testing-workshop-cypress')
const snapshotsPlugin = require('cypress-plugin-snapshots/plugin')
const separateTaskFile = require('./separate-task-file')
const separateTaskFile2 = require('./separate-task-file-2')
const separateTaskFile3 = require('./separate-task-file-3')
// const injectDevServer = require('@cypress/react/plugins/react-scripts')

// you keep things tidy by combining tasks from other files
const combinedTasks = Object.assign({}, separateTaskFile2, separateTaskFile3)

const getDbFilename = () =>
  path.join(__dirname, '..', '..', 'todomvc', 'data.json')

const findRecord = (title) => {
  const dbFilename = getDbFilename()
  const contents = JSON.parse(fs.readFileSync(dbFilename))
  const todos = contents.todos
  return todos.find((record) => record.title === title)
}

const hasRecordAsync = (title, ms) => {
  const delay = 50
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find record with title "${title}"`))
    }
    const found = findRecord(title)
    if (found) {
      return resolve(found)
    }
    setTimeout(() => {
      hasRecordAsync(title, ms - delay).then(resolve, reject)
    }, 50)
  })
}

/**
 * Default object representing our "database" file in "todomvc/data.json"
 */
const DEFAULT_DATA = {
  todos: []
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // "cy.task" can be used from specs to "jump" into Node environment
  // and doing anything you might want. For example, checking "data.json" file!

  on('task', {
    // saves given or default empty data object into todomvc/data.json file
    // if the server is watching this file, next reload should show the updated values
    resetData(dataToSet = DEFAULT_DATA) {
      const dbFilename = getDbFilename()
      debug('reset data file %s with %o', dbFilename, dataToSet)
      if (!dataToSet) {
        console.error('Cannot save empty object in %s', dbFilename)
        throw new Error('Cannot save empty object in resetData')
      }
      const str = JSON.stringify(dataToSet, null, 2) + '\n'
      fs.writeFileSync(dbFilename, str, 'utf8')

      return null
    },

    hasSavedRecord(title, ms = 3000) {
      debug('inside task')
      console.log(
        'looking for title "%s" in the database (time limit %dms)',
        title,
        ms
      )
      return hasRecordAsync(title, ms)
    },

    // KEY: where do we add tasks?
    // option 1: you can keep adding tasks here, comma separated
    helloWorld: (name) => `Hello ${name}`,
    // KEY: if you have multiple arguments, use destructuring
    helloMultipleArgs: ({ name, lastName }) => `Hello ${name} ${lastName}`
  })

  // option 2: on('task', {..} can be called multiple times, new tasks can go here
  on('task', {
    helloSeparateTaskBlock: (name) => `Hello ${name}`
  })

  // option 3: you can also use "cy.task" to call tasks from other files
  on('task', separateTaskFile)

  // option 4: (my favorite) you keep things tidy by combining tasks from other files
  on('task', combinedTasks)

  // code coverage tasks
  // @see https://on.cypress.io/code-coverage
  // on('task', require('@cypress/code-coverage/task'))
  // use .babelrc file if want to instrument unit tests
  // on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))

  // `config` is the resolved Cypress config
  // see https://on.cypress.io/configuration-api
  config.fixturesFolder = 'cypress/fixtures'
  config.modifyObstructiveCode = false

  // KEY: combine configs
  const allConfigs = Object.assign(
    {},
    config,
    // injectDevServer(on, config), // init for @cypress/react
    snapshotsPlugin.initPlugin(on, config), // init for cypress-plugin-snapshots
    {
      fixturesFolder: 'cypress/fixtures',
      modifyObstructiveCode: false
    }
  )

  return allConfigs
}
