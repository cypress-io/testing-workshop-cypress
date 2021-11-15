/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('ANTI-PATTERN: reset state through the UI', () => {
  beforeEach(() => {
    cy.visit('/')
    // we need to wait for the items to be loaded
    cy.wait(1000)

    // how do you remove all items?
    // what happens if there are NO items?
    // Try removing all items and re-running the test
    cy.get('li.todo')
      // by default, cy.get retries until it finds at least 1 item
      // we can "trick" it to give us the items or not items
      // by adding our own assertion to pass even if
      // the number of items is zero
      .should('have.length.gte', 0)
      .then(($todos) => {
        // if there are no todos, we have nothing to clean up
        // the test thus has to use IF/ELSE statement
        // implementing its own logic
        // https://on.cypress.io/conditional-testing
        if (!$todos.length) {
          // nothing to clean up
          return
        }

        cy.wrap($todos)
          .find('.destroy')
          // there might be multiple items to click
          // and the destroy button is not visible
          // until the user hovers over it, thus
          // we need to force it to be clickable
          .click({ multiple: true, force: true })
      })
  })

  it('adds two items starting with zero', () => {
    // this test does not clean up after itself
    // leaving two items for the other test
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })

  it('adds and removes an item', () => {
    // this test adds an item then cleans up after itself
    // leaving no items for other test to clean up
    addItem('only item')
    cy.contains('.todo', 'only item').find('.destroy').click({ force: true })
  })
})

describe('reset data using XHR call', () => {
  // you can use separate "beforeEach" hooks or a single one
  beforeEach(() => {
    cy.request('POST', '/reset', {
      todos: []
    })
  })
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    const emptyTodos = {
      todos: []
    }
    const str = JSON.stringify(emptyTodos, null, 2) + '\n'
    // file path is relative to the project's root folder
    // where cypress.json is located
    cy.writeFile('todomvc/data.json', str, 'utf8')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    cy.task('resetData')
    cy.visit('/')
    cy.get('li.todo').should('have.length', 0)
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('set initial data', () => {
  it('sets data to complex object right away', () => {
    cy.task('resetData', {
      todos: [
        {
          id: '123456abc',
          completed: true,
          title: 'reset data before test'
        }
      ]
    })

    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 1)
  })

  it('sets data using fixture', () => {
    cy.fixture('two-items').then((todos) => {
      // "todos" is an array
      cy.task('resetData', { todos })
    })

    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('create todos using API', () => {
  it('creates a random number of items', () => {
    // reset the data on the server
    cy.request('POST', '/reset', { todos: [] })
    // pick a random number of todos to create between 1 and 10
    const numTodos = Math.floor(Math.random() * 10) + 1
    cy.log(`Creating **${numTodos}** todos`)
    // form the todos array with random titles
    const todos = Array.from({ length: numTodos }).map((o, k) => ({
      title: `todo ${k}`,
      completed: false,
      id: `id-${k}`
    }))
    // tip: you can use console.table to print an array of objects
    console.table(todos)
    // call cy.request to post each TODO item
    todos.forEach((todo) => {
      cy.request('POST', '/todos', todo)
    })
    // visit the page and check the displayed number of todos
    cy.visit('/')
    cy.get('.todo').should('have.length', numTodos)
  })

  it('creates a random number of items (Lodash)', () => {
    // reset the data on the server
    cy.request('POST', '/reset', { todos: [] })
    // create a random number of todos using cy.request
    // tip: use can use Lodash methods to draw a random number
    const numTodos = Cypress._.random(1, 10)
    // look at the POST /todos calls the application sends
    Cypress._.times(numTodos, (k) => {
      cy.request('POST', '/todos', {
        title: `todo ${k}`,
        completed: false,
        id: `id-${k}`
      })
    })
    // visit the page and check the displayed number of todos
    cy.visit('/')
    cy.get('.todo').should('have.length', numTodos)
  })
})

describe('conditional reset data using XHR call', () => {
  function validate() {
    return cy
      .request('/todos')
      .its('body.length')
      .then((n) => n === 0)
  }

  function reset() {
    cy.request('POST', '/reset', {
      todos: []
    })
  }

  /**
   * A little utility function to run the "Set" commands
   * only if the "Validate" command chain yields false
   * @param {Function} validateFn
   * @param {Function} setFn
   * @returns Cypress.Chainable<any>
   */
  function validateAndSet(validateFn, setFn) {
    return validateFn().then((valid) => {
      if (!valid) {
        cy.log('**need to set**')
        return setFn()
      } else {
        return cy.log('**validated**')
      }
    })
  }

  beforeEach(() => {
    validateAndSet(validate, reset)
  })

  it('adds two items', () => {
    cy.visit('/')
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })

  it('starts with zero items', () => {
    cy.visit('/')
    cy.get('body').should('have.class', 'loaded')
    cy.get('li.todo').should('have.length', 0)
  })

  it('starts with zero items', () => {
    cy.visit('/')
    cy.get('body').should('have.class', 'loaded')
    cy.get('li.todo').should('have.length', 0)
  })
})
