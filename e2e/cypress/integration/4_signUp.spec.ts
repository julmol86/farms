describe('Sign Up and Sign In pages', () => {
  const randomNumber = Math.floor(Math.random() * 10000) + 5
  const farmName = 'farm_' + randomNumber
  const login = 'user_' + randomNumber
  const password = 'password_' + randomNumber

  before(() => {
    cy.visit('http://localhost:3000/signup')
  })

  it('create new farm', () => {
    cy.get('[data-testid=header-signin]').should('be.visible')
    cy.get('[data-testid=header-signup]').should('be.visible')
    cy.get('[data-testid=header-signout]').should('not.exist')

    cy.get('[data-testid=signup-name]').type(farmName)
    cy.get('[data-testid=signup-login]').type(login)
    cy.get('[data-testid=signup-password]').type(password)
    cy.get('[data-testid=signup-button]').click()
  })

  it('sign in with new user', () => {
    cy.get('[data-testid=signin-login]').type(login)
    cy.get('[data-testid=signin-password]').type(password)
    cy.get('[data-testid=signin-button]').click()

    cy.contains('Kirjautuminen onnistui')
    cy.contains(`Olet kirjautunut sisään, ${login}`)

    cy.get('[data-testid=header-signin]').should('not.exist')
    cy.get('[data-testid=header-signup]').should('not.exist')
    cy.get('[data-testid=header-signout]').should('be.visible')

    cy.get('[data-testid=header-signout]').click({ force: true })
    cy.contains('Uloskirjautuminen onnistui')
    cy.contains('Kirjaudu sisään AgroStat-tilillesi')
    cy.get('[data-testid=header-signin]').should('be.visible')
    cy.get('[data-testid=header-signup]').should('be.visible')
    cy.get('[data-testid=header-signout]').should('not.exist')
  })
})
