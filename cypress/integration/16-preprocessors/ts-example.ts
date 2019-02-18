describe('TypeScript spec', () => {
  it('transpiles', () => {
    // note types
    const x: number = 42
    expect(x).to.equal(42)
    // BDD assertion
    cy.wrap(x).should('equal', 42)
  })
})
