/// <reference types="cypress" />
// @ts-check

export const TODO_ITEM_ONE = 'buy some cheese'
export const TODO_ITEM_TWO = 'feed the cat'
export const TODO_ITEM_THREE = 'book a doctors appointment'

/**
 * App action to creates default todo items.
 *
 * @example
 *  import { addDefaultTodos } from './utils'
 *  beforeEach(addDefaultTodos)
 */
export const addDefaultTodos = () => {
  addTodos(TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE)
  allItems().as('todos')
}

// bypass the UI and call app's actions directly from the test
// app.$store.dispatch('setNewTodo', <desired text>)
// app.$store.dispatch('addTodo')
// using https://on.cypress.io/invoke
const storeDispatch = (args) =>
  cy
    .window()
    .its('app.$store')
    .invoke('dispatch', ...args)

export const addTodos = (...todos) =>
  todos.map((todo) => {
    storeDispatch(['setNewTodo', todo])
    return storeDispatch(['addTodo', todo])
  })

export const toggle = (todo) => storeDispatch(['clearNewTodo', todo])

const ALL_ITEMS = '.todo-list li'

/**
 * Returns all todo items on the page.
 *
 * @example
 ```
    import {allItems} from './utils'
    allItems().should('not.exist')
 ```
 */
export const allItems = () => cy.get(ALL_ITEMS)
