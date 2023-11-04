// SettlementInput.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Settlement Input Validation Test', () => {
  it('AccountNumber should be number', () => {
    cy.visit('http://localhost:3000/login')
    cy.get(':nth-child(3) > .relative > .rounded-md').type('choku')
    cy.get(':nth-child(5) > .relative > .rounded-md').type('choku')
    cy.get('.pl-1 > .justify-center').click()
    cy.get('.h-11 > .w-full > :nth-child(2) > .flex').click()
    cy.visit('http://localhost:3000/settlement/edit')
    cy.get('.flex-row > :nth-child(2) > .flex > .rounded-md').type(
      '{selectall}{del}あいうえお'
    )
    cy.get('.text-alert').should(
      'contain',
      '口座番号は半角数字のみ使用できます。'
    )
  })
})
