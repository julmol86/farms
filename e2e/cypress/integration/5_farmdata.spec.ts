describe('Farmdata page', () => {
  const metricvalue = Math.floor(Math.random() * 500) + 1 + '.99'

  before(() => {
    cy.visit('http://localhost:3000/farmdata')
  })

  after(() => {
    cy.get('[data-testid=header-signout]').click({ force: true })
  })

  it('sign in as existing user', () => {
    cy.contains('Kirjaudu sisään AgroStat-tilillesi')
    cy.get('[data-testid=signin-login]').type('user_1')
    cy.get('[data-testid=signin-password]').type('password_1')
    cy.get('[data-testid=signin-button]').click()

    cy.contains('Kirjautuminen onnistui')
    cy.contains('Olet kirjautunut sisään, user_1')
  })

  it('add new farmdata', () => {
    cy.contains('Lisää uusi arvo')
    cy.get('[data-testid=farmdata-metrictype]').select('Sademäärä')
    cy.get('[data-testid=farmdata-metricvalue]').type(metricvalue)
    cy.get('[data-testid=farmdata-button]').click()

    cy.get('[data-testid=farmdata-table]').contains(metricvalue)
  })
})
