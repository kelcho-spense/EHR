import React from 'react';
import { useContext} from 'react';
import { LoginContext } from '../Context/LoginContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Navigate } from 'react-router-dom';

import { signInWithGoogle } from '../firebase-config';
function AdminLogin() {
    const { setisLoggedIn } = useContext(LoginContext);
    const validate = () => {
        {
            signInWithGoogle().then(result => {
               const name = result.user.displayName;
               const email = result.user.email;
               return <Navigate replace to="/admin" />
               
              //  console.log(result);
              //  setisLoggedIn(true);
              })
              .catch(error => {
                alert(error.message);
              })
        }
        
    }
  return (
    <Container>
        <Card>
            <Card.Body>
                <Button onClick={validate}>Admin Login</Button>
            </Card.Body>
        </Card>
    </Container>
  )
}

export default AdminLogin