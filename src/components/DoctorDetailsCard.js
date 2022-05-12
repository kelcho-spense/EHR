import React,{useState} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen,faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase-config';
import { deleteDoc,doc } from 'firebase/firestore';

function DoctorDetailsCard({doctorid,doc,doj,speciality,email,phone,city,state}) {
  const [show, setShow] = useState('');   
  const [updatedocinfo,setupdatedocinfo] = useState('');

  const handleShow = (doctor) =>{
    setShow(true);
    setupdatedocinfo(doctor);
  } 
  //delete doctor from db
  const deleteDoctor = async (id) => {
    console.log("Are you sure you want to delete this doctor?");
   const doctorDocRef = doc(db,'doctors',id);
   await deleteDoc(doctorDocRef);         //firestore delete method
 }

  return (
    <Card className='shadow-lg mx-4 my-3 font-monospace'>
      <Card.Body>
        <Row >
          <Col lg={2} md={2} sm={12} >
            <Card.Img className='dimg'  src='https://via.placeholder.com/150' alt="nopic" />
          </Col>
          <Col lg={5} md={3} sm={12}>
            <div  className=' mb-2 fs-3 fw-bold'>DoctorWalletId :<span className='fs-4 text-info'>{doctorid}</span></div >
            <div className=' mb-2 fs-3 fw-bold'>Doctor Name :<span className='fs-4 text-info'>{DoctorDetailsCard.firstName} {DoctorDetailsCard.lastName}</span></div>
            <div  className=' mb-2 fs-3 fw-bold'>Date of Joining :<span className='fs-4 text-info'>{doj}</span></div >
            <div  className=' mb-2 fs-3 fw-bold'>Speciality :<span className='fs-4 text-info'>{speciality}</span></div>
            <div className='d-flex justify-content-start'>
              <Button className='btn btn-warning me-3' onClick={() => {handleShow(doc)}} ><FontAwesomeIcon icon={faUserPen}/> Edit User</Button>
            </div>
          </Col>
          <Col lg={5} md={3} sm={12}>
            <div className='mb-2 fs-3 fw-bold'>Email :<span className='fs-4 text-info'>{email}</span></div>
            <div className='mb-2 fs-3 fw-bold'>Phone :<span className='fs-4 text-info'>{phone}</span></div>
            <div className='mb-2 fs-3 fw-bold'>City :<span className='fs-4 text-info'>{city}</span></div>
            <div className='mb-2 fs-3 fw-bold'>State :<span className='fs-4 text-info'>{state}</span></div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default DoctorDetailsCard