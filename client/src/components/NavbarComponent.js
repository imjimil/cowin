import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import { NavLink } from 'react-router-dom'

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const mobileToggle = () => {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     setIsOpen(!isOpen);
    };
  };

  return (
      <Navbar color="primary" dark expand="md" sticky="top">
        <NavbarBrand href="/" className="font-weight-bold"><span className="fa fa-medkit"></span> Cowin Info Checker</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink to="/slots" className="nav-link" onClick={() => mobileToggle()}>Check Available Slots</NavLink>
            </NavItem>
            <NavItem>
              <a href="https://github.com/imjimil/cowin" className="nav-link" rel="noopener noreferrer" target="blank">GitHub Repo</a>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
  );
}

export default Header;