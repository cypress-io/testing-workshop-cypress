/// <reference types="cypress" />

import { resetDatabase, resetDatabaseTo } from '../../support/utils'
import twoItems from '../../fixtures/two-items.json'

// this spec shows several "gotchas" our users experience
// when using cy.intercept method
// read https://glebbahmutov.com/blog/cypress-intercept-problems/

describe('intercept', () => {
  context('late registration', () => {
    // this test is skipped on purpose.
    // It registers the intercept AFTER the ajax call is already in progress
    it.skip('is registered too late', () => {
      cy.visit('/')
      cy.intercept('/todos').as('todos')
      cy.wait('@todos')
    })

    it('is registered before the call', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
    })
  })

  context('wait followed by get', () => {
    it('is taken by the wait (fixed in Cypress v6.2.0)', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      // verify the loaded todos
      cy.get('@todos').should('not.be.null').and('include', {
        responseWaited: true
        // can verify other known properties
      })
    })

    it('using deprecated cy.route', () => {
      cy.server()
      cy.route('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('@todos').should('not.be.null')
    })

    it('should use wait value', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').should('include.all.keys', ['request', 'response'])
    })

    it('verifies the waited interception via .then(cb)', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').then((interception) => {
        expect(interception).to.be.an('object')
        expect(interception.request.url).to.match(/\/todos$/)
      })
    })
  })

  context('dynamic alias', () => {
    it('sets the alias after inspecting the request', () => {
      cy.intercept('*', (req) => {
        if (req.method === 'GET' && req.url.endsWith('/todos')) {
          req.alias = 'todos'
        }
      })

      cy.visit('/')
      cy.wait('@todos')
    })

    it('creates random alias', () => {
      let alias = ''
      cy.intercept('GET', '/todos', (req) => {
        alias = 'get-todos-' + Cypress._.random(1e6)
        req.alias = alias
      })

      cy.visit('/?delay=2400')

      // first, wait for the alias string to become define
      cy.wrap('the alias string')
        .should(() => {
          expect(alias, 'alias string').to.not.be.empty
        })
        .then(() => {
          cy.wait(`@${alias}`)
        })
    })
  })

  context('cached data', () => {
    // this test might pass or not when the DevTools is open
    // depending on the Network "Disable cache" setting
    it.skip('does not have response', () => {
      cy.intercept('/todos').as('todos')
      cy.visit('/')
      cy.wait('@todos').its('response').should('deep.include', {
        statusCode: 304,
        statusMessage: 'Not Modified',
        body: ''
      })
    })

    it('always gets the new data', () => {
      cy.intercept('/todos', (req) => {
        delete req.headers['if-none-match']
      }).as('todos')
      cy.visit('/')
      cy.wait('@todos')
        .its('response')
        .should('deep.include', {
          statusCode: 200,
          statusMessage: 'OK'
        })
        .and('have.property', 'body') // yields the "response.body"
        .then((body) => {
          // since we do not know the number of items
          // just check if it is an array
          expect(body).to.be.an('array')
        })
    })
  })

  context('multiple intercepts', () => {
    describe('using just spies', () => {
      beforeEach(resetDatabase)

      beforeEach(() => {
        cy.intercept('/todos').as('todos') // spy
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post').its('request.body').should('deep.include', {
          title: 'Write a test',
          completed: false
        })
      })
    })

    describe('using stub and spy', () => {
      beforeEach(() => {
        cy.intercept('GET', '/todos', []).as('todos') // stub
        cy.visit('/')
        cy.wait('@todos')
      })

      it('enters 1 todo', () => {
        cy.intercept('POST', '/todos').as('post') // spy
        cy.get('.new-todo').type('Write a test{enter}')
        cy.wait('@post').its('request.body').should('deep.include', {
          title: 'Write a test',
          completed: false
        })
      })
    })
  })

  context('common headers', () => {
    // let's say that every intercept needs the same headers in the response
    const headers = {
      'access-control-allow-origin': Cypress.config('baseUrl'),
      'Access-Control-Allow-Credentials': 'true'
    }

    const mergeResponse = (options = {}) => {
      return Object.assign({}, { headers }, options)
    }

    it('stubs several requests and has the headers', () => {
      // the initial list of todo items
      cy.intercept(
        'GET',
        '/todos',
        mergeResponse({ fixture: 'two-items.json' })
      ).as('todos')
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
      cy.wait('@todos').its('response.headers').should('include', headers) // our headers are present on the response

      // let's stub posting a new item
      cy.intercept('POST', '/todos', mergeResponse({ body: {} })).as('newTodo')
      cy.get('.new-todo').type('new item{enter}')
      cy.wait('@newTodo').its('response.headers').should('include', headers) // our headers are present on the response
    })
  })

  context('no overwriting interceptors', () => {
    describe('overwrite does not work', () => {
      beforeEach(() => {
        cy.intercept('GET', '/todos', []) // start with zero todos
        cy.visit('/')
      })

      it('adds a todo', () => {
        cy.get('.new-todo').type('write test{enter}')
        cy.get('.todo').should('have.length', 1)
      })

      it('completes todo', () => {
        cy.get('.new-todo').type('write test{enter}')
        cy.get('.todo').should('have.length', 1).first().find('.toggle').click()
        cy.contains('.todo', 'write test').should('have.class', 'completed')
      })

      it.skip('shows the initial todos', () => {
        // hmm overwrite the intercept?
        cy.intercept('GET', '/todos', { fixture: 'two-items.json' })
        cy.visit('/')
        cy.get('.todo').should('have.length', 2)
      })
    })

    describe('separate tests and hooks', () => {
      context('start with zero todos', () => {
        beforeEach(() => {
          cy.intercept('GET', '/todos', [])
          cy.visit('/')
        })

        it('adds a todo', () => {
          cy.get('.new-todo').type('write test{enter}')
          cy.get('.todo').should('have.length', 1)
        })

        it('completes todo', () => {
          cy.get('.new-todo').type('write test{enter}')
          cy.get('.todo')
            .should('have.length', 1)
            .first()
            .find('.toggle')
            .click()
          cy.contains('.todo', 'write test').should('have.class', 'completed')
        })
      })

      context('start with two items', () => {
        it('shows the initial todos', () => {
          // hmm overwrite the intercept?
          cy.intercept('GET', '/todos', { fixture: 'two-items.json' })
          cy.visit('/')
          cy.get('.todo').should('have.length', 2)
        })
      })
    })
  })

  context('no Cypress commands inside the interceptor', () => {
    beforeEach(resetDatabase)

    it.skip('tries to use cy.writeFile', () => {
      cy.visit('/')
      cy.intercept('POST', '/todos', (req) => {
        console.log('POST /todo', req)
        cy.writeFile('posted.json', JSON.stringify(req.body, null, 2))
      })

      cy.get('.new-todo').type('an example{enter}')
    })

    it('saves it later', () => {
      let body

      cy.visit('/')
      cy.intercept('POST', '/todos', (req) => {
        console.log('POST /todo', req)
        body = req.body
      }).as('post')

      cy.get('.new-todo')
        .type('an example{enter}')
        .wait('@post')
        .then(() => {
          // this callback executes AFTER the "cy.wait" command above
          // thus by now the "body" variable has been set and we can
          // write the contents to the file
          cy.writeFile('posted.json', JSON.stringify(body, null, 2))
        })
    })
  })

  context('return different data for 2nd request', () => {
    it.skip('returns list with more items on page reload (does not work)', () => {
      // we start with 2 items in the list
      cy.intercept('GET', '/todos', twoItems)
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)

      // now we add the third item
      const item = {
        title: 'Third item',
        completed: false,
        id: 101
      }
      // the server replies with the posted item
      cy.intercept('POST', '/todos', item).as('post')
      cy.get('.new-todo').type(item.title + '{enter}')
      cy.wait('@post')

      // when the page reloads we expect the server to send 3 items
      const threeItems = Cypress._.cloneDeep(twoItems).concat(item)
      cy.intercept('GET', '/todos', threeItems)
      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })

    it('returns list with more items on page reload', () => {
      const item = {
        title: 'Third item',
        completed: false,
        id: 101
      }
      // we start with 2 items in the list
      // when the page reloads we expect the server to send 3 items
      const threeItems = Cypress._.cloneDeep(twoItems).concat(item)
      const replies = [twoItems, threeItems]

      // return a different response from the same intercept
      cy.intercept('GET', '/todos', (req) => req.reply(replies.shift()))
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)

      // the server replies with the posted item
      cy.intercept('POST', '/todos', item).as('post')
      cy.get('.new-todo').type(item.title + '{enter}')
      cy.wait('@post')

      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })
  })

  context('overwrite interceptors', () => {
    beforeEach(function resetIntercepts() {
      Cypress.config('intercepts', {})
    })

    Cypress.Commands.add('http', (alias, method, url, response) => {
      const key = `${alias}-${method}-${url}`
      cy.log(`HTTP ${key}`)
      const intercepts = Cypress.config('intercepts')

      if (key in intercepts) {
        intercepts[key] = response
      } else {
        intercepts[key] = response
        cy.intercept(method, url, (req) => {
          return req.reply(intercepts[key])
        }).as(alias)
      }
    })

    beforeEach(() => {
      cy.http('todos', 'GET', '/todos', [])
    })

    it('adds a todo', () => {
      cy.visit('/')
      cy.get('.new-todo').type('write test{enter}')
      cy.get('.todo').should('have.length', 1)
    })

    it('completes todo', () => {
      cy.visit('/')
      cy.get('.new-todo').type('write test{enter}')
      cy.get('.todo').should('have.length', 1).first().find('.toggle').click()
      cy.contains('.todo', 'write test').should('have.class', 'completed')
    })

    it('shows the initial todos', () => {
      // overwrite the previous response with the new one
      cy.http('todos', 'GET', '/todos', { fixture: 'two-items.json' })
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
    })

    it('adds a todo to the initial ones', () => {
      // the application starts with two items
      cy.http('todos', 'GET', '/todos', { fixture: 'two-items.json' })
      cy.visit('/')
      cy.get('.todo').should('have.length', 2)
      cy.get('.new-todo').type('third item{enter}')

      // now the server should return 3 items
      cy.http('todos', 'GET', '/todos', { fixture: 'three-items.json' })
      cy.reload()
      cy.get('.todo').should('have.length', 3)
    })
  })

  context('single use intercept', () => {
    beforeEach(() => {
      // let's reset the server to always have 2 todos
      resetDatabaseTo('two-items.json')
    })

    it.skip('stubs the first load (does not work)', () => {
      // this test wants to have no todos at first
      cy.intercept('GET', '/todos', []).as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('.todo-list li').should('have.length', 0)

      cy.log('adding an item')
      cy.get('.new-todo').type('new todo{enter}')
      cy.contains('li.todo', 'new todo').should('be.visible')

      // reload and expect to see the new todo again
      cy.reload()
      cy.contains('li.todo', 'new todo').should('be.visible')
    })

    /**
     * Intercept the first matching request and send the response object.
     * Do nothing on the second and other requests.
     * @param {string} method HTTP method to intercept
     * @param {string} url URL to intercept
     * @param {any} response Response to send back on the first request
     */
    const interceptOnce = (method, url, response) => {
      // I am using "count" to show how easy you can implement
      // different responses for different interceptors
      let count = 0
      return cy.intercept(method, url, (req) => {
        count += 1
        if (count < 2) {
          req.reply(response)
        } else {
          // do nothing
        }
      })
    }

    it('stubs the first load and does nothing after that', () => {
      // this test wants to have no todos at first
      interceptOnce('GET', '/todos', []).as('todos')
      cy.visit('/')
      cy.wait('@todos')
      cy.get('.todo-list li').should('have.length', 0)

      cy.log('adding an item')
      cy.get('.new-todo').type('new todo{enter}')
      cy.contains('li.todo', 'new todo').should('be.visible')

      // reload and expect to see the new todo again
      cy.reload()
      cy.contains('li.todo', 'new todo').should('be.visible')
      // since we reset the database with 2 todos, plus entered a new todo
      // thus the total number of items should be 3
      cy.get('.todo-list li').should('have.length', 3)

      // Tip: you can still spy on "todos" intercept
      // for example let's validate the server response has the new item
      // at index 2 and it has the title and completed properties
      cy.get('@todos')
        .its('response.body')
        .should('have.length', 3)
        .its('2')
        .should('include', {
          title: 'new todo',
          completed: false
        })
    })
  })

  context('network idle', () => {
    beforeEach(() => {
      // let's reset the server to always have 2 todos
      resetDatabaseTo('two-items.json')
    })

    it('waits for network to be idle for 1 second', () => {
      let lastNetworkAt
      cy.intercept('*', () => {
        lastNetworkAt = +new Date()
      })
      // load the page, but delay loading of the data
      cy.visit('/?delay=800')

      // wait for network to be idle for 1 second
      const started = +new Date()
      cy.wrap('network idle for 1 sec').should(() => {
        const t = lastNetworkAt || started
        const elapsed = +new Date() - t
        if (elapsed < 1000) {
          throw new Error('Network is busy')
        }
      })
      // by now everything should have been loaded
      // we can check by using very short timeout
      cy.get('.todo-list li', { timeout: 10 }).should('have.length', 2)
    })
  })
})
