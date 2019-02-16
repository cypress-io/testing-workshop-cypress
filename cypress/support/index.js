// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// optionally, load Cypress Halloween color theme
// https://www.cypress.io/blog/2018/10/11/halloween-theme/
// require('cypress-dark/src/halloween')

// require('cypress-pipe')
// require('cypress-plugin-snapshots/commands')

Cypress.on('uncaught:exception', (e, runnable) => {
  console.log('error', e)
  console.log('runnable', runnable)
  return !e.message.startsWith('Random problem')
})
