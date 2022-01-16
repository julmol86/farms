describe('Statistics page', () => {
  before(() => {
    cy.visit('http://localhost:3000/stats')
  })

  it('farm', () => {
    cy.get('[data-testid=statistics-table]').contains('Friman Metsola collective')

    cy.get('[data-testid=statistics-farm]').select('PartialTech Research Farm')
    cy.get('[data-testid=statistics-table]').contains('Friman Metsola collective').should('not.exist')
    cy.get('[data-testid=statistics-table]').contains('PartialTech Research Farm')
  })

  it('metric', () => {
    cy.get('[data-testid=statistics-table]').contains('Sademäärä')

    cy.get('[data-testid=statistics-metrictype]').select('pH')
    cy.get('[data-testid=statistics-table]').contains('Sademäärä').should('not.exist')
    cy.get('[data-testid=statistics-table]').contains('pH')
  })

  it('month', () => {
    cy.get('[data-testid=statistics-table]').contains('1.1.2019 klo 0.00.00')
    cy.get('[data-testid=statistics-chart]').should('not.exist')

    cy.get('[data-testid=statistics-month]').select('Joulukuu')
    cy.get('[data-testid=statistics-table]').contains('1.1.2019 klo 0.00.00').should('not.exist')
    cy.get('[data-testid=statistics-table]').contains('1.12.2019 klo 5.17.33')
    cy.get('[data-testid=statistics-chart]').should('be.visible')
  })

  it('date range', () => {
    cy.get('[data-testid=statistics-table]').contains('1.12.2019 klo 5.17.33')

    cy.get('[data-testid=statistics-month]').select('-- Ei valittu --')
    cy.get('[data-testid=statistics-table]').contains('1.12.2019 klo 5.17.33').should('not.exist')
    cy.get('[data-testid=statistics-table]').contains('1.1.2019 klo 0.00.00')
    cy.get('[data-testid=statistics-chart]').should('not.exist')

    cy.get('[data-testid=statistics-startdate]').type('2019-01-02')
    cy.get('[data-testid=statistics-enddate]').type('2019-01-06')
    cy.get('[data-testid=statistics-table]').contains('1.1.2019 klo 0.00.00').should('not.exist')
    cy.get('[data-testid=statistics-table]').contains('2.1.2019 klo 7.38.33')
    cy.get('[data-testid=statistics-table]').contains('5.1.2019 klo 12.15.52')
    cy.get('[data-testid=statistics-table]').contains('6.1.2019 klo 18.11.29').should('not.exist')
    cy.get('[data-testid=statistics-chart]').should('be.visible')
  })
})
