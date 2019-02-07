/// <reference types="cypress" />
beforeEach(function resetData () {
  cy.request('POST', '/reset', {
    todos: []
  })
})

beforeEach(function visitSite () {
  cy.visit('/')
})

it('shows UL', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.contains('ul', 'todo A')
    // confirm that the above element
    //  1. is visible
    .should('be.visible')
    // 2. has class "todo-list"
    .and('have.class', 'todo-list')
    // 3. css property "list-style-type" is equal "none"
    .and('have.css', 'list-style-type', 'none')
})

it('shows UL - TDD', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.contains('ul', 'todo A').then($ul => {
    // use TDD assertions
    // $ul is visible
    // $ul has class "todo-list"
    // $ul css has "list-style-type" = "none"
    assert.isTrue($ul.is(':visible'), 'ul is visible')
    assert.include($ul[0].className, 'todo-list')
    assert.isTrue($ul.hasClass('todo-list'))
    assert.equal($ul.css('list-style-type'), 'none')
  })
})

it('every item starts with todo', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('.todo label').should($labels => {
    // confirm that there are 4 labels
    // and that each one starts with "todo-"
    expect($labels).to.have.length(4)

    $labels.each((k, el) => {
      expect(el.textContent).to.match(/^todo /)
    })
  })
})
