import React from 'react';
import { useRef,useContext,useState} from 'react';
import { LoginContext } from '../Context/LoginContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import { signup, login} from '../firebase-config';
function Login() {
    const { setcurrentAdmin } = useContext(LoginContext);
    const [ loading, setLoading ] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();

    async function handleLogin() {
        setLoading(true);
        try {
          await login(emailRef.current.value, passwordRef.current.value);
          console.log('login successful');
          setcurrentAdmin(true);
        } catch {
          alert("Error! Wrong Login Credentials");
        }
        setLoading(false);
    }
    async function handleSignup() {
        setLoading(true);
        try {
          await signup(emailRef.current.value, passwordRef.current.value);
          console.log('signup successful');
        } catch {
          alert("Error!:makesure your password is above 6 characters");
        }
        setLoading(false);
      }
    return (
    <div>
        <Container >
          <Row>
            <Col md={6} sm={12} lg={6}>
              <img className='img-fluid' src={require('./images/adminlogin.svg')} alt='......'/>
            </Col>
            <Col md={6} sm={12} lg={6}>
                <span className='d-flex justify-content-center mx-auto mb-3 fw-bolder fs-4'>Admin Portal</span>
                <hr />
                <FloatingLabel controlId="floatingInput" label="Enter Username" className="mb-3">
                  <Form.Control type="text"  ref={emailRef} placeholder="Enter Username" required/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control type="password"  ref={passwordRef} placeholder="Enter Password" required/>
                </FloatingLabel> 
                <div className='d-flex justify-content-center mx-auto mt-3'>
                  <Button disabled={ loading } onClick={handleLogin} variant="outline-info w-25"  type="button">Login</Button>
                </div>
            </Col>
          </Row>        
        </Container>
    </div>
  )
}

export default Login