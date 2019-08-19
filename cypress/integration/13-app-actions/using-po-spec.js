import { TodoPage, todoPage } from "./todo-page-object";

// import todo page object from "todo-page-object.js"
describe("TodoMVC with Page Object", () => {
  beforeEach(() => {
    // visit the page
    todoPage.visit();
  });

  it("creates 3 todos", () => {
    // create default todos
    todoPage.createTodos();
    // and check that there are 3 of them
    const todos = todoPage.todos();
    todos.should("have.length", 3);
  });

  context("toggles items", () => {
    beforeEach(() => {
      // what should you do before each test?
      todoPage.createTodos();
    });

    it("completes second item", () => {
      // toggle 1 item
      todoPage.toggle(1);
      // check class names for all 3 items
      todoPage.todos(0).should("not.have.class", "completed");
      todoPage.todos(1).should("have.class", "completed");
      todoPage.todos(2).should("not.have.class", "completed");
    });
  });
});
