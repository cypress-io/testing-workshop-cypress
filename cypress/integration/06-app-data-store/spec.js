/// <reference types="cypress" />
// application should be running at port 3000
// and the "localhost:3000" is set as "baseUrl" in "cypress.json"

beforeEach(() => {
  cy.request("POST", "/reset", {
    todos: []
  });
});
beforeEach(() => {
  cy.visit("/");
});

beforeEach(function stubRandomId() {
  let count = 1;
  cy.window()
    .its("Math")
    .then(Math => {
      cy.stub(Math, "random", () => {
        return `0.${count++}`;
      }).as("random"); // save reference to the spy
    });
});
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get(".new-todo").type(`${text}{enter}`);
};

it("adds items to store", () => {
  addItem("something");
  addItem("something else");
  // get application's window
  // then get app, $store, state, todos
  // it should have 2 items
  cy.window()
    .its("app.$store.state.todos")
    .should("have.length", 2);
});

it("creates an item with id 1", () => {
  cy.server();
  cy.route("POST", "/todos").as("new-item");

  // STEPS
  // get the application's "window" object using cy.window
  // with your function that always returns "0.1"

  addItem("something");
  // confirm the item sent to the server has the right values
  cy.wait("@new-item")
    .its("request.body")
    .should("deep.equal", {
      id: "1",
      title: "something",
      completed: false
    });
});

// stub function Math.random using cy.stub
it("creates an item with id using a stub", () => {
  // get the application's "window.Math" object using cy.window
  // replace Math.random with cy.stub and store the stub under an alias
  // create a todo using addItem("foo")
  addItem("foo");
  // and then confirm that the stub was called once
  cy.get("@random").should("have.been.calledOnce");
});

it("puts the todo items into the data store", () => {
  // application uses data store to store its items
  // you can get the data store using "window.app.$store.state.todos"
  // add a couple of items
  addItem("my new foo");
  addItem("my new foo 2");
  // get the data store
  cy.window()
    .its("app.$store.state.todos")
    .should("deep.equal", [
      { title: "my new foo", completed: false, id: "1" },
      { title: "my new foo 2", completed: false, id: "2" }
    ]);
  // check its contents
});
