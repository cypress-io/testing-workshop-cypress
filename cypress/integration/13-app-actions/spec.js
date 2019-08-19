import { addDefaultTodos, allItems, toggle } from "./utils";

describe("TodoMVC with window object", () => {
  beforeEach(() => {
    // visit the page
    cy.visit("/");
  });

  it("creates 3 todos", () => {
    // create default todos
    addDefaultTodos();
    // and check that there are 3 of them
    const todos = allItems();
    todos.should("have.length", 3);
  });

  it("completes second item", () => {
    addDefaultTodos();

    // toggle 1 item
    toggle(1);

    console.log(allItems());

    allItems()
      .eq(0)
      .should("not.have.class", "completed");
    allItems()
      .eq(1)
      .should("have.class", "completed");
    allItems()
      .eq(2)
      .should("not.have.class", "completed");
  });
});
