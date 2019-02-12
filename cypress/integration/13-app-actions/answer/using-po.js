import { todoPage } from '../todo-page-object'

describe('TodoMVC with Page Object', () => {
  beforeEach(() => {
    todoPage.reset().visit()
  })

  it('creates 3 todos', () => {
    todoPage
      .createTodos()
      .todos()
      .should('have.length', 3)
  })
})
