import React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";


function PatientDetailsCard({patientid}) {
  return (
    <Card className='shadow-lg mx-2 my-2 font-monospace '>
    <Card.Body>

      <Row className='justify-content-center align-items-center'>
        <Col lg={4} md={4} sm={12} >
          <Card.Img className='dimg' width={60} height={60}  src={`https://avatars.dicebear.com/api/pixel-art/${patientid}.svg`} alt="nopic" />
        </Col>
        <Col lg={8} md={8} sm={12}>
           <div className='mb-2 fs-6 fw-bold'>Patient Id :<span className='text-info'>{patientid}</span></div>           
        </Col>        
      </Row>       
    </Card.Body>
  </Card>
  );
}

export default PatientDetailsCard