import React from 'react';
import Nav  from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar  from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor,faUserNurse,faUser,faCircleInfo,faHospital,faPrescriptionBottleMedical} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

function MyNavbar() {
   
  return (
      <>
        <header>
        <Navbar collapseOnSelect className='shadow mb-2 font-monospace fw-bolder fs-4' expand="lg" bg="light" variant="light">
            <Nav className='ps-4'>
            <Link to="/" className='nav-link text-warning'><FontAwesomeIcon className='fa-lg text-warning' icon={faHospital}/>Electronic Health Records </Link>
            </Nav>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id=" responsive-navbar-nav">
                <Nav className="mx-auto">
                    <Link to="/patient" className='nav-link me-4'> <FontAwesomeIcon icon={faUserNurse} /> Patient</Link>
                    <Link to="/doctor" className='nav-link'  > <FontAwesomeIcon icon={faUserDoctor} /> Doctor</Link>             
                    <Link to="/phamacist" className='nav-link'  > <FontAwesomeIcon icon={faPrescriptionBottleMedical} /> Phamacist</Link>             
                </Nav>
                <Nav>
                    <Link to="/admin" className='nav-link text-danger'> <FontAwesomeIcon icon={faUser} /> Admin</Link>             
                    <Link to="/about" className='nav-link text-info me-4'> <FontAwesomeIcon icon={faCircleInfo} /> About</Link>             
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        </header>
    </>
  )
}

export default MyNavbar