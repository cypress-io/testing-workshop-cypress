/// <reference types="cypress" />
it("sets list of todos on the server", () => {
  cy.server();
  // load fixture "two-items.json" from the fixtures folder
  cy.fixture("two-items").then(list => {
    // then use it in the POST request
    cy.request("POST", "/reset", { todos: list });
  });
});

context("closure variable", () => {
  // store loaded list in this closure variable
  let list;

  beforeEach(async () => {
    list = await cy.fixture("two-items");
    // then store the loaded items in variable "list"
  });

  it("has two items", () => {
    if (list) {
      expect(list).to.have.length(2);
    }
  });

  it("sets list from context", () => {
    // post items to the server
    expect(list).to.have.length(2);
    cy.request("POST", "/reset", { todos: list });
  });
});

context("this.list", () => {
  // it is important to use "function () {}"
  // as a callback to "beforeEach", so we have
  // "this" pointing at the test context
  beforeEach(function() {
    cy.fixture("two-items").then(l => (this.list = l));
    // then assign value to "this.list"
  });

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it("sets list from context", function() {
    // POST the items to the server using "/reset"
    cy.request("POST", "/reset", { todos: this.list });
  });

  it("has valid list with 2 items", function() {
    // check that "this.list" has 2 items
    expect(this.list).to.have.length(2);
  });
});

context("@list", () => {
  // again, it is important to use "function () {}"
  // as a callback to "beforeEach" to set the right "this"
  beforeEach(function() {
    // use shortcut "as('list')" will save the value into "this.list"
    // cy.fixture(<filename>).as(<alias name>)
    cy.fixture("two-items").as("list");
  });

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it("sets list from context", function() {
    // use "this.list" like before to send the list to the server
    expect(this.list).to.have.length(2);
    cy.request("POST", "/reset", { todos: this.list });
  });
});

// show that immediately using "this.list" does not work
it.skip("does not work", function() {
  // load fixture and set it as "list"
  // then try checking "this.list" immediately
  cy.fixture("two-items").as("list");
  // we are using "this.list" BEFORE it was set in
  // the above asynchronous call
  expect(this.list).to.have.length(2);
  cy.request("POST", "/reset", { todos: this.list });
});

it("works if we change the order", function() {
  cy.fixture("two-items")
    .as("list")
    .then(() => {
      // by now the fixture has been saved into "this.list"
      // check that "this.list" has 2 items
      // use it to post to the server
      expect(this.list).to.have.length(2);
      cy.request("POST", "/reset", { todos: this.list });
    });
});

it("reads items loaded from fixture", () => {
  cy.fixture("two-items").then(todos => {
    // post items
    // read file 'todomvc/data.json',
    // should be equal to the loaded fixture
    // note: JSON is parsed automatically!
  });
});

it("saves todo", () => {
  // reset data on the server
  // visit the page
  // type new todo via GUI
  // read file - it should have the item you have entered
  // hint: to demonstrate retries,
  // write should(cb) assertion
  // and add a delay to the application
});
