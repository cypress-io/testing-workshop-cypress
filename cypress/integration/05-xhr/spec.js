/// <reference types="cypress" />
// note, we are not resetting the server before each test
// and we want to confirm that IF the application has items already
// (for example add them manually using the browser localhost:3000)
// then these tests fail!

it("starts with zero items (waits)", () => {
  cy.visit("/");
  // wait 1 second
  cy.wait(1000);
  // then check the number of items
  cy.get("li.todo").should("have.length", 0);
});

it("starts with zero items", () => {
  // start Cypress network proxy with cy.server()
  cy.server();
  // spy on route `GET /todos`
  //  with cy.route(...).as(<alias name>)
  cy.route("GET", "/todos").as("todos");
  // THEN visit the page
  cy.visit("/");
  // wait for `GET /todos` route
  cy.wait("@todos")
    // grab its response body
    .its("response.body")
    // and make sure the body is an empty list
    .should("have.length", 0);
  //  using "@<alias name>" string
  // then check the DOM
  cy.get("li.todo").should("have.length", 0);
});

it("starts with zero items (stubbed response)", () => {
  // start Cypress network server
  cy.server();
  // stub `GET /todos` with []
  cy.route("GET", "/todos", []).as("todos");
  // save the stub as an alias

  // THEN visit the page
  cy.visit("/");

  // wait for the route alias
  cy.wait("@todos")
    // grab its response body
    .its("response.body")
    // and make sure the body is an empty list
    .should("have.length", 0);
});

it("starts with zero items (fixture)", () => {
  // start Cypress network server
  cy.server();
  // stub `GET /todos` with fixture "empty-list"
  cy.route("GET", "/todos", "fixture:empty-list").as("todos");
  // visit the page
  cy.visit("/");

  cy.wait("@todos")
    // grab its response body
    .its("response.body")
    // and make sure the body is an empty list
    .should("have.length", 0);

  // then check the DOM
  cy.get("li.todo").should("have.length", 0);
});

it("loads several items from a fixture", () => {
  // start Cypress network server
  cy.server();
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  cy.route("GET", "/todos", "fx:two-items").as("todos");
  // THEN visit the page
  cy.visit("/");
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
  cy.get("li.todo").should("have.length", 2);
  cy.get("li.todo.completed").should("have.length", 1);
  cy.contains(".todo", "first item from fixture")
    .should("not.have.class", "completed")
    .find(".toggle")
    .should("not.be.checked");
  cy.contains(".todo.completed", "second item from fixture")
    .find(".toggle")
    .should("be.checked");
});

it("posts new item to the server", () => {
  // start Cypress network server
  cy.server();
  // spy on "POST /todos", save as alias
  cy.route("POST", "/todos").as("new-item");
  cy.visit("/");
  cy.get(".new-todo").type("test api{enter}");

  // wait on XHR call using the alias, grab its request or response body
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
  cy.wait("@new-item")
    .its("request.body")
    .should("have.contains", {
      title: "test api",
      completed: false
    });
});

it("posts new item to the server response", () => {
  // start Cypress network server
  cy.server();
  // spy on "POST /todos", save as alias
  cy.route("POST", "/todos").as("new-item");
  cy.visit("/");
  cy.get(".new-todo").type("test api{enter}");

  // wait on XHR call using the alias, grab its request or response body
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
  cy.wait("@new-item")
    .its("response.body")
    .should("have.contains", {
      title: "test api",
      completed: false
    });
});

it("handles 404 when loading todos", () => {
  // when the app tries to load items
  // set it up to fail with 404 to GET /todos
  // after delay of 2 seconds
  cy.server();
  cy.route({
    url: "/todos",
    response: "test does not allow it",
    status: 404,
    delay: 2000
  });
  // cy.route({
  //   url,
  //   response,
  //   status,
  //   delay
  // })
  cy.visit("/", {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: win => {
      // spy
      cy.spy(win.console, "error").as("console-error");
    }
  });
  // observe external effect from the app - console.error(...)
  // cy.get('@console-error')
  //   .should(...)
  cy.get("@console-error").should(
    "have.been.calledWithExactly",
    "test does not allow it"
  );
});

it("shows loading element", () => {
  cy.server();
  cy.route({
    url: "/todos",
    delay: 2000,
    response: []
  }).as("loading");
  cy.visit("/");
  // delay XHR to "/todos" by a few seconds
  // and respond with an empty list
  // shows Loading element
  // wait for the network call to complete
  // now the Loading element should go away
  cy.get(".loading").should("be.visible");
  cy.wait("@loading");
  cy.get(".loading").should("not.be.visible");
});
