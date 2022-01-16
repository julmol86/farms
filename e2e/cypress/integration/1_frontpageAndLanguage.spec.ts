describe('Frontpage and language', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it('visit frontpage, check map is there', () => {
    cy.get('[data-testid=maps-container]').should('be.visible')
  })

  it('make sure default language is fi', () => {
    cy.get('[data-testid=header-lang]').should('have.text', 'en')
  })

  it('visit Statistics, change language', () => {
    cy.get('[data-testid=navbar-stats]').click()

    // checking language is fi on the page
    cy.contains('Kirjaudu sisään')
    cy.contains('Kartta')
    cy.contains('Valitse ferma')
    cy.contains('Ferman nimi')

    // changing language to en
    cy.get('[data-testid=header-lang]').click()

    // checking texts are translated to en
    cy.contains('Sign in')
    cy.contains('Map')
    cy.contains('Choose Farm')
    cy.contains('Farm name')
  })
})
