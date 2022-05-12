import React,{useContext} from 'react';
import Card from 'react-bootstrap/Card';
import PatientDetailsCard from './PatientDetailsCard';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import { useMoralis,useNewMoralisObject } from "react-moralis";
import {Navigate} from 'react-router-dom';
import { DoctorContext } from '../Context/DoctorContext';
import { useForm } from 'react-hook-form';



function DoctorConsultForm() {
  const {patientConsultb,currentDocWalletId} = useContext(DoctorContext);
  const { isAuthenticated } = useMoralis();
  const { register, handleSubmit, formState:{errors},reset } = useForm();
  const { save } = useNewMoralisObject("consultation");
  const { save:saveUpdate } = useNewMoralisObject("book_appointments");


  
    
 
  if (!isAuthenticated){
    return <Navigate replace to="/doctor" />
  }
  const submitConsult = (data) => {
    const dataUpdate = {
      time:patientConsultb.time,
      date:patientConsultb.date,
      patientwalletid:patientConsultb.patientwalletid,
      doctorspeciality:patientConsultb.doctorspeciality,
      objectId:patientConsultb.id,
      status:"consulted"
    }
    save(data, {
      onSuccess: (consultation) => {
                  saveUpdate(dataUpdate, {
                    onSuccess: (book_appointment) => {
                      alert("UpdateConsultation ");
                    },
                    onError: (error) => {
                      alert("UpdateConsultation,failed : " + error.message);
                    }
                  });
        alert("consultation sent successfully");
        reset();
      },
      onError: (error) => {
        alert("consultation,failed : " + error.message);
      },
    });
  }
  return (
    <div>
        <Card className="w-75 mx-auto px-3 shadow-lg">
          <div className='mt-1'><Link className="btn btn-warning btn-sm" to="/doctor">Go Back</Link></div>
            <PatientDetailsCard patientid={patientConsultb.patientwalletid} />
            <Card.Body>
              <form onSubmit={handleSubmit(submitConsult)} >
                <input type="hidden" name="patientWalletid" value={patientConsultb.patientwalletid} {...register("patientWalletId")} />
                <input type="hidden" name="doctorWalletid" value={currentDocWalletId} {...register("doctorWalletId")} />
                <div className='fs-4 fw-bolder'>Consultation</div>
                <textarea className='form-control mb-2' name="consultation_msg" {...register("consultation_msg",{required:true})}  cols="30" rows="3"></textarea>
                {errors.consultation_msg && <span className='text-danger'>consultation_msg is required</span>} 
                <Row>
                  <Col lg={6} md={6} sm={12}>
                      <FloatingLabel controlId="floatingTextarea" label="Medicine Names" className="mb-3">
                        <Form.Control as="textarea" name="medicine_name" {...register("medicine_name",{required:true})}  />
                        {errors.medicine_name && <span className='text-danger'>medicine_name is required</span>} 

                      </FloatingLabel>
                  </Col>
                  <Col lg={6} md={6} sm={12}>
                      <FloatingLabel controlId="floatingTextarea" label="Dosage" className="mb-3">
                        <Form.Control as="textarea" name="dosage" {...register("dosage",{required:true})} />
                        {errors.dosage && <span className='text-danger'>dosage is required</span>} 

                      </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={12}>
                      <FloatingLabel controlId="floatingTextarea" label="Frequency" className="mb-3">
                        <Form.Control as="textarea" name="frequency" {...register("frequency",{required:true})} />
                        {errors.frequency && <span className='text-danger'>frequency is required</span>} 

                      </FloatingLabel>
                  </Col>
                  <Col lg={6} md={6} sm={12}>
                      <FloatingLabel controlId="floatingTextarea" label="No of Days" className="mb-3">
                        <Form.Control as="textarea" name="no_of_days" {...register("no_of_days",{required:true})} />
                        {errors.no_of_days && <span className='text-danger'>no_of_days is required</span>} 

                      </FloatingLabel>
                  </Col>
                </Row>
                <Row className="pt-2">                   
                  <Col lg={12} md={12} sm={12} >
                    <FloatingLabel controlId="floatingTextarea" label="Remarks" className="mb-3">
                      <Form.Control as="textarea" name="remark" {...register("remark",{required:true})}  />
                        {errors.remark && <span className='text-danger'>remark is required</span>} 
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="pt-2">
                    <Col className="lg-4 md-3 sm-12 text-center">
                      <Button variant="info" type="submit"> Save Consult</Button>
                    </Col>
                </Row>
              </form>
            </Card.Body> 
        </Card>
    </div>
  )
}

export default DoctorConsultForm    