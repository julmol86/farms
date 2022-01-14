import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NavigationMenu = () => {
  const { t } = useTranslation()
  return (
    <Navbar bg="success" expand="lg" /* variant="dark" */>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* class me-auto : content to the right, without: to the left */}
            <Nav className="me-auto">

              <Nav.Link>
                <Link className = "navBarLevel" to="/">{t('navbar.main')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link className = "navBarLevel" to="/stats">{t('navbar.stats')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link className = "navBarLevel" to="/aggregatestats">{t('navbar.aggregatestats')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link className = "navBarLevel" to="/about">{t('navbar.about')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link className = "navBarLevel" to="/contacts">{t('navbar.contact')}</Link>
              </Nav.Link>
            </Nav>

          </Navbar.Collapse>

      </Navbar>

  )
}

export default NavigationMenu
