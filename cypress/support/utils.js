/**
 * Sets the database to the empty list of todos
 */
export const resetDatabase = () => {
  console.log('resetDatabase')
  cy.request({
    method: 'POST',
    url: '/reset',
    body: {
      todos: []
    }
  })
}

/**
 *
 * @param {string} fixtureName The fixture with todos to load and send to the server
 */
export const resetDatabaseTo = (fixtureName) => {
  cy.log(`**resetDatabaseTo** ${fixtureName}`)
  cy.fixture(fixtureName).then((todos) => {
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos
      }
    })
  })
}

export const visit = (skipWaiting) => {
  console.log('visit this =', this)

  if (typeof skipWaiting !== 'boolean') {
    skipWaiting = false
  }

  const waitForInitialLoad = !skipWaiting
  console.log('visit will wait for initial todos', waitForInitialLoad)
  if (waitForInitialLoad) {
    cy.server()
    cy.route('/todos').as('initialTodos')
  }
  cy.visit('/')
  console.log('cy.visit /')
  if (waitForInitialLoad) {
    console.log('waiting for initial todos')
    cy.wait('@initialTodos')
  }
}

export const getTodoApp = () => cy.get('.todoapp')

export const getTodoItems = () => getTodoApp().find('.todo-list').find('li')

export const newId = () => Math.random().toString().substr(2, 10)

// if we expose "newId" factory method from the application
// we can easily stub it. But this is a realistic example of
// stubbing "test window" random number generator
// and "application window" random number generator that is
// running inside the test iframe
export const stubMathRandom = () => {
  // first two digits are disregarded, so our "random" sequence of ids
  // should be '1', '2', '3', ...
  let counter = 101
  cy.stub(Math, 'random').callsFake(() => counter++)
  cy.window().then((win) => {
    // inside test iframe
    cy.stub(win.Math, 'random').callsFake(() => counter++)
  })
}

export const makeTodo = (text = 'todo') => {
  const id = newId()
  const title = `${text} ${id}`
  return {
    id,
    title,
    completed: false
  }
}

export const getNewTodoInput = () => getTodoApp().find('.new-todo')

/**
 * Adds new todo to the app.
 *
 * @param text {string} Text to enter
 * @example
 *  enterTodo('my todo')
 */
export const enterTodo = (text = 'example todo') => {
  getNewTodoInput().type(`${text}{enter}`)

  // we need to make sure the store and the vue component
  // get updated and the DOM is updated.
  // quick check - the new text appears at the last position
  // I am going to use combined selector to always grab
  // the element and not use stale reference from previous chain call
  const lastItem = '.todoapp .todo-list li:last'
  cy.get(lastItem).should('contain', text)
}

/**
 * Removes the given todo by text
 * @param {string} text The todo to find and remove
 */
export const removeTodo = (text) => {
  cy.contains('.todoapp .todo-list li', text)
    .find('.destroy')
    .click({ force: true })
}

// a couple of aliases for 12-custom-commands answers
export const resetData = resetDatabase
export const visitSite = () => visit(true)
