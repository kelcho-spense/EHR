import React,{useEffect, useState,useContext} from 'react';
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container  from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {useMoralis,useMoralisQuery,useNewMoralisObject} from 'react-moralis';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor,faHome, faBookBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { DoctorContext } from '../Context/DoctorContext';


function PatientAppointment() {
  const [panel,setPanel] =useState("dashboard");
  return (
      <Row className='font-monospace'>
            <Col lg={3} md={4} sm={12}  >
                <Nav className="flex-column bg-light">
                    <Link className='nav-link text-dark fs-4' to="/patient"><FontAwesomeIcon icon={faHome}/> Go back</Link>
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("dashboard")}} ></Nav.Link>
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("dashboard")}} ><FontAwesomeIcon icon={faBookBookmark}/> Book Apointment</Nav.Link>
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("ViewAppointments")}} ><FontAwesomeIcon icon={faUserDoctor}/> Pedding Appointments</Nav.Link>
                    <hr />
                </Nav> 
               

            </Col>
            <Col lg={9} md={8} sm={12}>
            {
                panel === "dashboard" ? <Dashboard />  : panel === "ViewAppointments" ? <ViewAppointments /> : null
            }
            </Col>
      </Row>
  )
}
function Dashboard() {
  const { register, handleSubmit, formState:{errors},reset } = useForm();
  const { isAuthenticated,Moralis,user,isWeb3Enabled,authenticate,enableWeb3 } = useMoralis();
  const { save } = useNewMoralisObject("book_appointments");
  const {currentPatientWalletId} = useContext(DoctorContext);
  
  const bookAppointment = async (data) => {
    save(data, {
      onSuccess: (book_appointment) => {
          reset();
        alert("Book Appointment successfull: " + book_appointment.id);
      },
      onError: (error) => {
        alert("Failed to create new object, with error code: " + error.message);
      },
    });

  }
    return(
        <Container className='font-monospace fw-bold fs-4 text-info'>
        <Card className='shadow'>
            <Card.Body className='text-center'>
                <Card.Title className='fs-3 fw-bolder text-center'> Book Appointment</Card.Title>                
              <form onSubmit={handleSubmit(bookAppointment)}>
                <Row className='mb-2'>
                    <Col lg={12} md={12} sm={12}>
                        <FloatingLabel name="patientwalletid" controlId="Patient Id" label="Patient Id">
                            <Form.Control type="text" placeholder="Patient Id" value={currentPatientWalletId} 
                            {...register("patientwalletid")} />
                        </FloatingLabel>
                   {errors.patientwalletid && <span className='text-danger'>patientwalletid is required</span>}

                    </Col>
                </Row>
                <Row className='mb-2'>
                  <Col lg={12} md={12} sm={12}>
                         
                        <Form.Select name='doctorspeciality'  {...register("doctorspeciality",{required:true})}>
                          <option>Choose Speciality</option>
                          <option value="Dematologist">Dematologist</option>
                          <option value="FamilyPhysicians">Family Physicians</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="EmergencyMedicineSpecialist">Emergency Medicine Specialist</option>
                        </Form.Select>                    
                  </Col>
                </Row>               
                <Row className='mb-2'>
                  <Col lg={12} md={12} sm={12}>
                     <FloatingLabel controlId="Date" label="Date">
                        <Form.Control type="date" name="date" placeholder="Date" 
                        {...register("date",{required:true})}/>
                      </FloatingLabel>
                      {errors.date && <span className='text-danger'>date is required</span>}

                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col lg={12} md={12} sm={12}>
                     <FloatingLabel controlId="Time" label="Time">
                        <Form.Control type="time" name="time" placeholder="Time"
                        {...register("time",{required:true})} />
                      </FloatingLabel>
                      {errors.time && <span className='text-danger'>time is required</span>}
                  </Col>
                </Row>
                
                <Row className="mt-3 w-25 text-center mx-auto">
                    <Button type='submit' variant='info fw-bold fs-5 text-light'>Save Data</Button>
                </Row>
              </form>
            </Card.Body>
             
        </Card>
        </Container>
    )
}
function ViewAppointments() {
    const {enableWeb3} = useMoralis();
    const[appointments,setAppointments] = useState([]);
    const {currentPatientWalletId} = useContext(DoctorContext);
  const {fetch,isLoading} = useMoralisQuery("book_appointments",(query) =>query.equalTo("status", "pedding")
  .equalTo("patientwalletid",currentPatientWalletId),[currentPatientWalletId],{autoFetch:false});
  useEffect (() => {
    const getDoctors = async () => {   
      await enableWeb3();
        const rawDoc = await fetch();    
        setAppointments(rawDoc.map((doc) =>({...doc.attributes,id:doc.id})));
      }
      getDoctors();
  },[]);
    return(
        <Container>
            <div className='fs-4 text-primary fw-bolder d-flex justify-content-center'>Pedding Appointments</div> <hr />
            <table className="table table-hover">            
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Your ethAddress</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>            
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        { appointments.length > 0 ? (
                            isLoading ? (<Spinner animation="border" variant="warning" />):( appointments.map((appointment,index)=> {
                                return(
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{appointment.patientwalletid}</td>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.status}</td>
                                        </tr>
                                        )
                            }))
                            ) : <tr><td colSpan={5}><span className='text-danger fs-4 fw-bolder'>No Appointments</span></td></tr>
                        }                 
                        
                    </tbody>
            </table>
        </Container>
    )
}


export default PatientAppointment