describe('Aggregate statistics page', () => {
  before(() => {
    cy.visit('http://localhost:3000/aggregatestats')
  })

  it('month', () => {
    cy.get('[data-testid=aggregate-table]').contains('-18.1')

    cy.get('[data-testid=aggregate-month]').select('Elokuu')
    cy.get('[data-testid=aggregate-table]').contains('-18.1').should('not.exist')
    cy.get('[data-testid=aggregate-table]').contains('14.6')
  })

  it('date range', () => {
    cy.get('[data-testid=aggregate-month]').select('-- Ei valittu --')
    cy.get('[data-testid=aggregate-startdate]').type('2019-01-02')
    cy.get('[data-testid=aggregate-enddate]').type('2019-01-06')

    cy.get('[data-testid=aggregate-table]').contains('14.6').should('not.exist')
    cy.get('[data-testid=aggregate-table]').contains('-2.6')
  })

  it('metric type', () => {
    cy.get('[data-testid=aggregate-metrictype]').select('Sademäärä')
    cy.get('[data-testid=aggregate-table]').contains('-2.6').should('not.exist')
    cy.get('[data-testid=aggregate-table]').contains('8.9')
  })
})
