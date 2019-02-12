// Describes the TodoMVC model instance.
// Ideally it would come from the application,
// but in our example app does not have types,
// so we write method signatures ourselves.
// From out app actions we only use a couple of methods.
interface TodoModel {
  todos: unknown[]
  addTodo(...todos: string[])
  toggle(item: unknown)
  inform()
}
// During tests there we set "window.model" property
// now cy.window() returns Window instance with
// the "model" property that has TodoModel interface
interface Window {
  model: TodoModel
}
