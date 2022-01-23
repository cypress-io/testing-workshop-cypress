/// <reference types="cypress" />
//
// note, we are not resetting the server before each test
// and we want to confirm that IF the application has items already
// (for example add them manually using the browser localhost:3000)
// then these tests fail!
//
// see https://on.cypress.io/intercept

/* eslint-disable no-unused-vars */

import spok from 'cy-spok'

it('starts with zero items (waits)', () => {
  cy.visit('/')
  // wait 1 second
  // then check the number of items
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (check body.loaded)', () => {
  cy.request('POST', '/reset', { todos: [] })
  // the application sets "loaded" class on the body
  // in the test we can check for this class
  // then check the number of items
  cy.intercept('GET', '/todos').as('todos')
  cy.visit('/')

  cy.wait('@todos').its('response.body').should('have.length', 0)
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  // spy on route `GET /todos`
  // THEN visit the page
  cy.intercept('GET', '/todos', []).as('todos')
  cy.visit('/')
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0)
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('starts with multiple items (stubbed response with fixture)', () => {
  // start Cypress network server
  // stub `GET /todos` with []
  // save the stub as an alias

  cy.intercept('GET', '/todos', { fixture: 'three-items' }).as('todos')
  // THEN visit the page
  cy.visit('/')

  // wait for the route alias
  // grab its response body
  // and make sure the body is an empty list
  cy.wait('@todos').its('response.body').should('have.length', 3)
  cy.get('li.todo').should('have.length', 3)
})

it('posts new item to the server', () => {
  cy.request('POST', '/reset', {
    todos: []
  })
  // spy on "POST /todos", save as alias
  cy.intercept('POST', '/todos').as('new-item')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')

  // wait on XHR call using the alias, grab its request or response body
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
  // KEY: we can check the contents of the data with .should('contain'), { part of an object }) , have.contain also works
  cy.wait('@new-item').its('request.body').should('contain', {
    title: 'test api',
    completed: false
  })
  cy.get('@new-item').its('response.body').should('contain', {
    title: 'test api',
    completed: false
  })
})

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail with 404 to GET /todos
  // after delay of 2 seconds
  // KEY: cy.intercept can stub with an array, or a fixture, or a custom object with body, statusCode, delayMs
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    {
      body: 'test does not allow it',
      statusCode: 404,
      delayMs: 2000
    }
  )

  // KEY: we can observe the expected console errors
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: (win) => {
      // spy
      cy.spy(win.console, 'error').as('console-error')
    }
  })
  // observe external effect from the app - console.error(...)
  // cy.get('@console-error')
  //   .should(...)
  cy.get('@console-error')
    .should('have.been.calledWithExactly', 'test does not allow it')
    .and('have.been.calledWithExactly', 'could not load todos')
    .and('have.been.calledWithExactly', 'Request failed with status code 404')
})

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    {
      body: [],
      delayMs: 2000
    }
  ).as('loading')
  cy.visit('/')
  // and respond with an empty list
  // shows Loading element
  cy.get('.loading').should('be.visible')
  // wait for the network call to complete
  cy.wait('@loading')
  // now the Loading element should go away
  cy.get('.loading').should('not.be.visible')
})

it('handles todos with blank title', () => {
  // return a list of todos with one todo object
  cy.intercept('GET', '/todos', [
    {
      id: '123',
      title: '  ',
      completed: false
    }
  ])

  cy.visit('/')

  // having blank spaces or null
  // confirm the todo item is shown correctly
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ')
})

// a test that confirms a specific network call is NOT made
// until the application adds a new item.
it('does not make POST /todos request on load', () => {
  // KEY: within cy.intercept a cy.spy() creates a "pass-through" function
  // that can function as a network interceptor that does nothing
  cy.intercept('POST', '/todos', cy.spy().as('post'))
  cy.visit('/')
  // in order to confirm the network call was not made
  // we need to wait for something to happen, like the application
  // loading or some time passing
  cy.wait(1000)
  cy.get('@post').should('not.have.been.called')
  // add a new item through the page UI
  cy.get('.new-todo').type('a new item{enter}')
  // now the network call should have been made
  // confirm the network call was made with the correct data
  cy.get('@post')
    .should('have.been.calledOnce')
    .its('args.0.0.body')
    .should('deep.include', {
      title: 'a new item',
      completed: false
    })
})

it('does not make POST /todos request on load - no stubbing', () => {
  cy.intercept('POST', '/todos').as('post')
  cy.visit('/')
  // in order to confirm the network call was not made
  // we need to wait for something to happen, like the application
  // loading or some time passing
  cy.wait(1000)
  // cy.get('@post').should('not.have.been.called')
  // add a new item through the page UI
  cy.get('.new-todo').type('a new item{enter}')
  // now the network call should have been made
  // confirm the network call was made with the correct data
  cy.get('@post').its('request.body').should('deep.include', {
    title: 'a new item',
    completed: false
  })
})

describe('spying on load', () => {
  // use "beforeEach" callback to cleanly create a random
  // number of todos for each test
  beforeEach(() => {
    // reset the data on the server
    cy.request('POST', '/reset', { todos: [] })
    // create a random number of todos using cy.request
    // tip: use can use Lodash methods to draw a random number
    // look at the POST /todos calls the application sends
    Cypress._.times(Cypress._.random(10), (k) => {
      cy.request('POST', '/todos', {
        title: `todo #${k}`,
        completed: false,
        id: `id-${k}`
      })
    })
  })

  it('shows the items loaded from the server', () => {
    // spy on the route `GET /todos` to know how many items to expect
    cy.intercept('GET', '/todos', (req) => {
      // make sure the request is NOT cached by the browser
      // because we want to see the list of items in the response
      // KEY: cy.intercept can work around cached requests
      delete req.headers['if-none-match']
    }).as('getTodos')
    cy.visit('/')

    // wait for the network call to happen
    // confirm the response is 200, read the number of items
    // and compare to the number of displayed todos
    cy.wait('@getTodos')
      .its('response')
      .then((response) => {
        expect(response.statusCode).to.eq(200)
        cy.get('.todo').should('have.length', response.body.length)
      })
  })
})

describe('waits for network idle', () => {
  // we want to wait for the app to finish all network calls
  // before proceeding with the test commands

  beforeEach(() => {
    // before each test, stub the network call to load zero items
    cy.intercept('GET', '/todos', []).as('todos')
  })

  it('waits for the network to be idle for 2 seconds', () => {
    // keep track of the timestamp of the network call
    // intercept all calls (or maybe a specific pattern)
    // and in the callback save the current timestamp
    let lastNetworkAt
    cy.intercept('/?delay=*', () => {
      lastNetworkAt = Date.now()
    }).as('delay')
    // load the page, but delay loading of the data by some random number
    // using /?delay=<number> query param
    const delayMs = Cypress._.random(100, 1500)

    cy.visit(`/?delay=${delayMs}`).then(() => {
      cy.log(`**lastNetworkAt** ${lastNetworkAt}`)
      // start waiting after the cy.visit command finishes

      // wait for network to be idle for 2 seconds
      // using a .should(cb) assertion that looks at the current timestamp
      // vs the timestamp of the last network call
      // see assertion examples at
      // https://glebbahmutov.com/cypress-examples/commands/assertions.html
      // TIP: cy.wrap('message').should(cb) works really well
      const started = Date.now()
      cy.log(`**started** ${started}`)

      let finished

      cy.wrap('network idle for 2 sec')
        .should(() => {
          const elapsed = Date.now() - started

          console.log(`elapsed: ${elapsed}`)
          // KEY: retry ability works off of errors as well as assertions
          // Any error thrown inside the `.should(cb)` causes it to retry. You can throw the error yourself or use `expect(...)...`
          // The `expect` statement IF it fails throws an error, just like you, only with a better error message
          if (elapsed < 2000) {
            throw new Error('Network is busy')
          }
          finished = Date.now()
          console.log(`finished: ${finished}`)
        })
        .then(() => {
          const waited = finished - started
          cy.log(`**finished after** ${waited} ms`)
        })
    })
    // by now everything should have been loaded
    // we can check the page and use a very short timeout
    // because the page is ready to be tested
    cy.get('.todo-list li', { timeout: 10 }).should('have.length', 0)
  })
})

// read the blog post "Visit Non-HTML Page"
// https://glebbahmutov.com/blog/visit-non-html-page/
describe(
  'visit non-html page',
  { viewportWidth: 400, viewportHeight: 100 },
  () => {
    beforeEach(() => {
      cy.fixture('two-items').as('todos')
    })
    beforeEach(function () {
      // by using "function () {}" callback we can access
      // the alias created in the previous hook using "this.<name>"
      cy.task('resetData', { todos: this.todos })
    })

    /*
      Skipping because this will cause an error:
        cy.visit() failed trying to load:
          http://localhost:3000/todos/1
        The content-type of the response we received from your web server was:
          > application/json
        This was considered a failure because responses must have content-type: 'text/html'
    */
    it.skip('tries to visit JSON resource', () => {
      cy.visit('/todos/1')
    })

    // how do we "convince" Cypress that the received response should be treated as HTML text?
    // By intercepting and overwriting the response content type header!
    it('visits the todo JSON response', function () {
      cy.intercept('GET', '/todos/*', (req) => {
        req.continue((res) => {
          if (res.headers['content-type'].includes('application/json')) {
            res.headers['content-type'] = 'text/html'
            const text = `<body><pre>${JSON.stringify(
              res.body,
              null,
              2
            )}</pre></body>`
            res.send(text)
          }
        })
      }).as('todo')
      cy.visit('/todos/1')
      // make sure you intercept has worked
      cy.wait('@todo')
      // check the text shown in the browser
      cy.contains(this.todos[0].title)
      // confirm the item ID is in the URL
      // 1. less than ideal, since we use position arguments
      cy.location('pathname')
        .should('include', '/todos/')
        // we have a string, which we can split by '/'
        .invoke('split', '/')
        // and get the 3rd item in the array ["", "todos", "1"]
        .its(2)
        // and verify this is the same as the item ID
        .should('eq', '1')
      // 2. alternative: use regex exec with a capture group
      // https://javascript.info/regexp-groups

      cy.location('pathname')
        .should('match', /\/todos\/\d+/)
        // use named capture group to get the ID from the string
        // group name is id, can be any variable, we are looking for anything ending with /1
        // this way, if the resources move from /todos/1 to /api/todos/1, things still will work
        .then((s) => /\/todos\/(?<idalalal>\d+)/.exec(s))
        .its('groups.idalalal')
        .should('equal', '1')
      // 3. use regular expression match with a capture group
      cy.location('pathname')
        .should('include', 'todos')
        // use named capture group to get the ID from the string
        .invoke('match', /\/todos\/(?<id>\d+)/)
        .its('groups.id')
        .should('equal', '1')
    })
  }
)

describe('Refactor network code example', () => {
  beforeEach(() => {
    cy.intercept('GET', '/todos', []).as('todos')
    cy.visit('/')
  })

  it('validates and processes the intercept object', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .then((intercept) => {
        // get the field from the intercept object
        const { statusCode, body } = intercept.response
        // confirm the status code is 201
        expect(statusCode).to.eq(201)
        // confirm some properties of the response data
        expect(body.title).to.equal(title)
        expect(body.completed).to.equal(completed)
        // return the field from the body object
        return body.id
      })
      .then(cy.log)
  })

  it('extracts the response property first', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .then((response) => {
        const { statusCode, body } = response
        // confirm the status code is 201
        expect(statusCode).to.eq(201)
        // confirm some properties of the response data
        expect(body.title).to.equal(title)
        expect(body.completed).to.equal(completed)
        // return the field from the body object
        return body.id
      })
      .then(cy.log)
  })

  it('checks the status code', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .then((response) => {
        const { body } = response
        // confirm the status code is 201
        expect(response).to.have.property('statusCode', 201)
        // confirm some properties of the response data
        expect(body.title).to.equal(title)
        expect(body.completed).to.equal(completed)
        // return the field from the body object
        return body.id
      })
      .then(cy.log)
  })

  // KEY: If Cypress .then command returns undefined and has no other Cypress commands,
  // then its original subject value gets passed to the next command automatically.
  it('checks the status code in its own then', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      // we can use should as well as then (no need for retry mechanism with should here though)
      .should((response) => {
        // confirm the status code is 201
        expect(response).to.have.property('statusCode', 201)
        // we cannot use a cy command because then the result would be returned
        // cy.wrap(response).should('have.property', 'statusCode', 201)
      })
      .its('body')
      .should((body) => {
        // confirm some properties of the response data
        expect(body.title).to.equal(title)
        expect(body.completed).to.equal(completed)
        // return the field from the body object
        return body.id
      })
      .then(cy.log)
  })

  it('checks the body object', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .then((response) => {
        // confirm the status code is 201
        expect(response).to.have.property('statusCode', 201)
      })
      .its('body')
      .then((body) => {
        // confirm some properties of the response data
        expect(body).to.deep.include({
          title,
          completed
        })
      })
      .its('id')
      .then(cy.log)
  })

  it('checks the body object using should', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .then((response) => {
        // confirm the status code is 201
        expect(response).to.have.property('statusCode', 201)
      })
      .its('body')
      .should('deep.include', { title, completed })
      .its('id')
      .then(cy.log)
  })

  it('checks the body object using cy-spok', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .should(
        spok({
          statusCode: 201
        })
      )
      .its('body')
      .should(
        spok({
          title,
          completed
        })
      )
      .its('id')
      .then(cy.log)
  })

  it('checks the response using cy-spok', () => {
    cy.intercept('POST', '/todos').as('postTodo')
    const title = 'new todo'
    const completed = false
    cy.get('.new-todo').type(title + '{enter}')
    cy.wait('@postTodo')
      .its('response')
      .should(
        spok({
          statusCode: 201,
          body: {
            title,
            completed,
            id: spok.string
          }
        })
      )
      .its('body.id')
      .then(cy.log)
  })
})
