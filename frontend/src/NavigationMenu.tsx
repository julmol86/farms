import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useTranslation } from 'react-i18next'

const NavigationMenu = () => {
  const { t } = useTranslation()
  return (
    <Navbar bg="success" expand="lg" /* variant="dark" */>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* class me-auto : content to the right, without: to the left */}
            <Nav className="me-auto">

              <Nav.Link className = "navBarLevel" href="/">{t('navbar.main')}</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/stats">{t('navbar.stats')}</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/aggregatestats">{t('navbar.aggregatestats')}</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/about">{t('navbar.about')}</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/contacts">{t('navbar.contact')}</Nav.Link>
            </Nav>

          </Navbar.Collapse>

      </Navbar>

  )
}

export default NavigationMenu
