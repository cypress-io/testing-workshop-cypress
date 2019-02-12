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

  context('toggles items', () => {
    beforeEach(() => {
      todoPage.createTodos()
    })

    it('completes second item', () => {
      todoPage.toggle(1)
      todoPage.todos(0).should('not.have.class', 'completed')
      todoPage.todos(1).should('have.class', 'completed')
      todoPage.todos(2).should('not.have.class', 'completed')
    })
  })
})
