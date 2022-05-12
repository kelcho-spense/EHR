import React from 'react';
import { useContext} from 'react';
import { Figure,Image } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import "./styles/home.css";

function Homepage() {
  

// const { userName,userPass } = useContext(LoginContext); //receiving values from login context(global state)

  return (
    <>
      <Figure>
          <Figure.Image className='homeimg'  alt="171x180" src={require('./images/home.jpg')}/>
          <Figure.Caption className="position-absolute top-50 start-50 translate-middle">
            <div className="h6 text-light">
            Welcome to EHR System Homepage
            </div>
            <div className="display-4 fw-bold text-light">We are here for your Care</div>  
            <div className="display-4 fw-bold text-light">
              <blockquote className="blockquote">
                <p>Your time is limited,so dont waste it living someone else's life. <br />
                   Don't be trapped by dogma - which is living with the results of other people's thinking.
                </p>
              </blockquote>
              <figcaption className="blockquote-footer">
                 <cite title="Source Title">Steve Jobs</cite>
              </figcaption>
            </div> 
              <Link class="btn btn-outline-success text-light fw-bold fs-4"  to='/patient'>
                Make an appointment
              </Link>
          </Figure.Caption>          
      </Figure>
    
    </>
  )
}

export default Homepage