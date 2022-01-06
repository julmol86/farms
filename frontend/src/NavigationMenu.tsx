import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { Link } from 'react-router-dom'

const NavigationMenu = () => {
    
    return(
    <Navbar bg="success" expand="lg" /* variant="dark" */>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* class me-auto : content to the right, without: to the left */}
            <Nav className="me-auto">
              
              <Nav.Link className = "navBarLevel" href="/">Main page</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/about">About us</Nav.Link>
              <Nav.Link className = "navBarLevel" href="/contacts">Contacts</Nav.Link>
            </Nav>
            
          </Navbar.Collapse>
        
      </Navbar>
      
      )
}
    
   
export default NavigationMenu;