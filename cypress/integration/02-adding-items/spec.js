/// <reference types="cypress" />

const addTodo = text => {
  const input = cy.get("input.new-todo");
  input.type(`${text}{enter}`);
};

beforeEach(() => {
  cy.visit("/");
});

it("loads", () => {
  // application should be running at port 3000
  cy.contains("h1", "todos");
});

it("starts with zero items", () => {
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get
  cy.get("li.todo").should("have.length", 0);
});

it("adds two items", () => {
  // repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
  addTodo("test");
  addTodo("test2");
  cy.get("li.todo").should("have.length", 2);
});

it("can add many items", () => {
  const N = 5;
  for (let k = 0; k < N; k += 1) {
    // add an item
    // probably want to have a reusable function to add an item!
    addTodo(`adding todo #${k}`);
  }
  // check number of items
  cy.get("li.todo").should("have.length", 7);
});

it("can mark items as completed", () => {
  // add a few items
  // mark items as completed
  // select completed items and confirm their number
  addTodo(`mark this todo done 1`);
  addTodo(`mark this todo done 2`);
  cy.get("li.todo")
    .contains("mark this todo done 1")
    .parent()
    .find("input.toggle")
    .check();
  cy.get("li.todo")
    .contains("mark this todo done 2")
    .parent()
    .find("input.toggle")
    .check();
  cy.get("li.todo.completed").should("have.length", 2);
});

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
