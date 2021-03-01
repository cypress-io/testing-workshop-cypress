import {
  enterTodo,
  getTodoItems,
  makeTodo,
  resetDatabase,
  stubMathRandom,
  visit
} from '../../support/utils'

// testing TodoMVC server API
// because json-server can fail sometimes, let the tests retry
// https://on.cypress.io/test-retries
describe('via API', { retries: 2 }, () => {
  beforeEach(resetDatabase)

  // used to create predictable ids
  let counter = 1
  beforeEach(() => {
    counter = 1
  })

  const addTodo = (title) =>
    // the way to print newly created id in the command log
    cy
      .request('POST', '/todos', {
        title,
        completed: false,
        id: String(counter++)
      })
      .its('body.id')
      .then(cy.log)

  /**
   * Fetches TODO items, returns just the body of the XHR request.
   */
  const fetchTodos = () =>
    cy
      .request('/todos')
      .its('body')
      .then((list) => {
        cy.log(JSON.stringify(list, null, 2))
        cy.wrap(list, { log: false })
      })

  const deleteTodo = (id) => cy.request('DELETE', `/todos/${id}`)

  it('adds 2 todos', () => {
    addTodo('first todo')
    addTodo('second todo')
    fetchTodos().should('have.length', 2)
  })

  it('adds todo deep', () => {
    addTodo('first todo')
    addTodo('second todo')
    fetchTodos().should('deep.equal', [
      {
        title: 'first todo',
        completed: false,
        id: '1'
      },
      {
        title: 'second todo',
        completed: false,
        id: '2'
      }
    ])
  })

  it('adds and deletes a todo', () => {
    addTodo('first todo') // id "1"
    addTodo('second todo') // id "2"
    deleteTodo('2')
    fetchTodos().should('deep.equal', [
      {
        title: 'first todo',
        completed: false,
        id: '1'
      }
    ])
  })
})

describe('stub network', () => {
  it('initial todos', () => {
    cy.server()
    cy.route('/todos', [
      {
        title: 'mock first',
        completed: false,
        id: '1'
      },
      {
        title: 'mock second',
        completed: true,
        id: '2'
      }
    ])

    visit(true)
    getTodoItems()
      .should('have.length', 2)
      .contains('li', 'mock second')
      .find('.toggle')
      .should('be.checked')
  })
})

describe('API', { retries: 2 }, () => {
  beforeEach(resetDatabase)
  beforeEach(() => visit(true))
  beforeEach(stubMathRandom)

  it('receives empty list of items', () => {
    cy.request('todos').its('body').should('deep.equal', [])
  })

  it('adds two items', () => {
    const first = makeTodo()
    const second = makeTodo()

    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy.request('todos')
      .its('body')
      .should('have.length', 2)
      .and('deep.equal', [first, second])
  })

  it('adds two items and deletes one', () => {
    const first = makeTodo()
    const second = makeTodo()
    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy.request('DELETE', `todos/${first.id}`)
    cy.request('todos')
      .its('body')
      .should('have.length', 1)
      .and('deep.equal', [second])
  })

  it('does not delete non-existent item', () => {
    cy.request({
      method: 'DELETE',
      url: 'todos/aaa111bbb',
      failOnStatusCode: false
    })
      .its('status')
      .should('equal', 404)
  })

  it('is adding todo item', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/todos'
    }).as('postTodo')

    // go through the UI
    enterTodo('first item') // id "1"

    // thanks to stubbed random id generator
    // we can "predict" what the TODO object is going to look like
    cy.wait('@postTodo').its('request.body').should('deep.equal', {
      title: 'first item',
      completed: false,
      id: '1'
    })
  })

  it('is deleting a todo item', () => {
    cy.server()
    cy.route({
      method: 'DELETE',
      url: '/todos/1'
    }).as('deleteTodo')

    // go through the UI
    enterTodo('first item') // id "1"
    getTodoItems().first().find('.destroy').click({ force: true })

    cy.wait('@deleteTodo')
  })
})
