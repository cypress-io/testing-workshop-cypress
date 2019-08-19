/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
import { resetData, visitSite } from "../../support/hooks";

Cypress.Commands.add("createTodo", todo => {
  const cmd = Cypress.log({
    name: "create todo",
    message: todo,
    consoleProps() {
      return {
        "Create Todo": todo
      };
    }
  });
  cy.get(".new-todo", { log: false })
    .type(`${todo}{enter}`, { log: false })
    .then($el => {
      cmd
        .set({ $el })
        .snapshot()
        .end();
    });
});

beforeEach(resetData);
beforeEach(visitSite);

it("enters 10 todos", () => {
  cy.createTodo("todo 0");
  cy.createTodo("todo 1");
  cy.createTodo("todo 2");
  cy.createTodo("todo 3");
  cy.createTodo("todo 4");
  cy.createTodo("todo 5");
  cy.createTodo("todo 6");
  cy.createTodo("todo 7");
  cy.createTodo("todo 8");
  cy.createTodo("todo 9");
  cy.get(".todo").should("have.length", 10);
});

// it('creates a todo')

it("passes when object gets new property", () => {
  const o = {};
  setTimeout(() => {
    o.foo = "bar";
  }, 1000);
  // TODO write "get" that returns the given property
  // from an object.
  const get = name =>
    function getProp(from) {
      console.log("getting", from);
      return from[name];
    };
  // cy.wrap(o).pipe(get('foo'))
  // add assertions
  cy.wrap(o)
    .pipe(get("foo"))
    .should("not.be.undefined")
    .and("equal", "bar");
});

it("creates todos", () => {
  cy.get(".new-todo")
    .type("todo 0{enter}")
    .type("todo 1{enter}")
    .type("todo 2{enter}");
  cy.get(".todo").should("have.length", 3);
  cy.window()
    .its("app.todos")
    .toMatchSnapshot();
});
