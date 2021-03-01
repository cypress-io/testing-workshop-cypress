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
    }
  })

  // code coverage tasks
  // @see https://on.cypress.io/code-coverage
  // on('task', require('@cypress/code-coverage/task'))
  // use .babelrc file if want to instrument unit tests
  // on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))

  // `config` is the resolved Cypress config
  // see https://on.cypress.io/configuration-api
  config.fixturesFolder = 'cypress/fixtures'
  config.modifyObstructiveCode = false
  return Promise.resolve(config)
}

// init for cypress-plugin-snapshots
// const snapshotsPlugin = require('cypress-plugin-snapshots/plugin')
// module.exports = (on, config) => {
//   snapshotsPlugin.initPlugin(on, config)
//   return config
// }
