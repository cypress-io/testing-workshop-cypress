// little reusable functions for our tests
// like "resetData" and "visitSite"
const resetData = () => {
  cy.request("POST", "/reset", {
    todos: []
  });
};

const visitSite = () => {
  cy.visit("/");
};

export { resetData, visitSite };
