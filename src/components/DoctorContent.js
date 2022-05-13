import React,{useEffect, useState,useContext} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Card  from 'react-bootstrap/Card';
import Button  from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Label from "react-bootstrap/FormLabel";
import Spinner from "react-bootstrap/Spinner";
import FormControl from "react-bootstrap/FormControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor,faHome,faUserPen,faReceipt } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {useMoralis,useNewMoralisObject,useMoralisQuery } from 'react-moralis';
import { DoctorContext } from '../Context/DoctorContext';


function DoctorContent() {
    const [panel,setPanel] =useState("dashboard");
    const { logout, isAuthenticating } = useMoralis();
  return (    
      <Row className='font-monospace'>
            <Col lg={2} md={4} sm={12}  >
                <Nav className="flex-column bg-light">
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("dashboard")}} ><FontAwesomeIcon icon={faHome}/> Dashboard</Nav.Link>
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("consult")}} ><FontAwesomeIcon icon={faUserDoctor}/> Consult</Nav.Link>
                    <hr />
                </Nav> 
                <Nav className='position-absolute bottom-0 start-0 mb-2 bg-light'>
                     <Button variant='light fs-4'
                      onClick={() => logout()} disabled={isAuthenticating}
                     > <FontAwesomeIcon icon={faUserDoctor} /> Logout</Button> 
                </Nav> 

            </Col>
            <Col lg={10} md={8} sm={12}>
            {
                panel === "dashboard" ? <Dashboard />  : panel === "consult" ? <Consult /> : null
            }
            </Col>
      </Row>  
  )
}

function Dashboard() {
    const {currentDocWalletId} = useContext(DoctorContext);
    const [doctor,setDoctor] = useState([]);
    const [appointments,setAppointments] =useState([]);
    const [loading,setloading] =useState(false);
    const { register, handleSubmit,resetField, formState:{errors} } = useForm();
    const {enableWeb3} = useMoralis();
    return (
    <>
        <div>            
            <span className='fs-4 fw-bolder'> Doctor Dashboard</span> <hr/>
            <FetchCurrentDoctor  currentDocWalletId={currentDocWalletId} /> 
            <hr/>
            <span className='fs-4 fw-bolder'> Appointments</span>             
            <FetchDoctorAppointments />
        </div>
    </>
    );
}

function Consult() {
    const [loading,setloading] =useState(false);
    const [unConsultedPatients,setUnConsultedPatients] =useState([]);
    const [visitConsult,setVisitConsult]= useState(false);
    const {doctorSpeciality,setPatientConsultb} = useContext(DoctorContext);

    const { fetch,isLoading } = useMoralisQuery("book_appointments",(query) => query.equalTo("status", "pedding"),[],{ autoFetch: false });

    useEffect (() => {    
      ;(async () => {        
        const results = await fetch(); 
        if(results){
          setUnConsultedPatients(results.map((doc) =>({...doc.attributes,id:doc.id})));    
          setloading(true);
        }
      })();
      },[]);
    
    return (
        <div className='font-monospace text-center'>
           <span className='fs-4 fw-bolder'> Patient Consultation</span> 
           <div className='d-flex flex-row flex-lg-wrap flex-md-wrap flex-sm-wrap'>
               {
                 unConsultedPatients.length > 0 ? 
                 ( isLoading ? (<Spinner animation="border" size="lg" variant="info" />):(
                    unConsultedPatients.map((patient,index) => {
                      return (
                      <Card key={index} className="m-4 w-25 ">
                          <Card.Body>
                              <p><b>Patient:</b>{patient.patientwalletid}</p>
                              <p><b>Date:</b>{patient.date}</p>
                              <p><b>Time:</b>{patient.time}</p>
                              <p><b>Doctor Speciality:</b>{patient.doctorspeciality}</p>
                              <Link to="/doctor/consult" onClick={()=>{setPatientConsultb(patient)}} className="btn btn-outline-warning">Consult</Link>
                          </Card.Body>
                      </Card>
                      );
                    })
                  )
                ) : (<span className='text-light fs-5 badge mx-2 rounded-pill bg-info'>No pedding consultation available!</span>)
               }
              </div>
        </div>
    );
}
const FetchDoctorAppointments = () => {
  const {enableWeb3} = useMoralis();
  const[appointments,setAppointments] = useState([]);
const {fetch,isLoading} = useMoralisQuery("book_appointments",(query) =>query.equalTo("status", "pedding"),[],{autoFetch:false});
useEffect (() => {
  const getDoctors = async () => {   
    await enableWeb3();
      const rawDoc = await fetch();    
      setAppointments(rawDoc.map((doc) =>({...doc.attributes,id:doc.id})));
    }
    getDoctors();
},[]);

  return(
    <>
      <table className="table table-hover">            
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>            
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                    { appointments.length > 0 ? (
                      isLoading ?(<Spinner animation="border" variant="warning" />): ( appointments.map((appointment,index)=> {
                            return(
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td>Wallet Id:{appointment.patientwalletid}  </td>
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
    </>
  )
}
function FetchCurrentDoctor({currentDocWalletId}) {
  const { register, handleSubmit,resetField, formState:{errors},reset } = useForm();
  const [show, setShow] = useState('');
  const {enableWeb3} = useMoralis();
  const {fetch,isLoading} = useMoralisQuery("doctors",(query) =>query.equalTo("ethAddress", currentDocWalletId),[currentDocWalletId],{ autoFetch: false });
  const [docCardData,setDocCardData]= useState([]);
  const [updatedocinfo,setupdatedocinfo] = useState([]); 
  const {save:saveDoctorUpdate }= useNewMoralisObject("doctors"); 

  const {setDoctorSpeciality} = useContext(DoctorContext);

  //update modal close
  const handleClose = () =>{
    reset();
   setShow(false);
  }; 
  //update doctormodal submit
  const updateDoctor = async (data) => {
    await enableWeb3();
    saveDoctorUpdate(data, {
      onSuccess: (doctor) => {
          alert("Doctor updated with objectId: " + doctor.id);
          setShow(false);
          fetchCurrentDoc();
          reset();
      },
  });

  }
     //update modal show 
     const handleShow = (doctor) =>{
      setShow(true);
      setupdatedocinfo(doctor);
    }
  //fetch the current doctor
  useEffect (() => {
         
        fetchCurrentDoc();
        
    },[]);
    const fetchCurrentDoc = async () => {
      await enableWeb3();
      const rawDoc = await fetch();    
      setDocCardData(rawDoc.map((doc) =>({...doc.attributes,id:doc.id})));
    }
   
    return (
      <> 
      {/* doctor update modal */}
        <Modal  size="lg" show={show} onHide={handleClose} >        
        <Modal.Body>
          <Card className='shadow-lg'>
        <Card.Body>
        <form onSubmit={handleSubmit(updateDoctor)}> 
          <Row className="mb-2">
            <Col  sm={12} md={6} lg={6}>
            <Form.Control type="hidden" name="docid" value={updatedocinfo.id}  {...register("id",{required:true})} />
              <Form.Floating>                 
                <Form.Control  id="FirstName" type="text" name="firstname"
                  placeholder="FirstName"  {...register("firstname",{ required:true})}  />
                <Label htmlFor="FirstName">First Name: {updatedocinfo.firstname}</Label>
                {errors.firstname && <span className='text-danger'>firstname is required</span>}
              </Form.Floating>
            </Col>
            <Col  sm={12} md={6} lg={6}>
              <Form.Floating>
                  <Form.Control  id="LastName" type="text" name='lastname'
                    placeholder="LastName"  {...register("lastname",{ required:true})}  />
                  <Label htmlFor="LastName">Last Name: {updatedocinfo.lastname}</Label>
                  {errors.lastname && <span className='text-danger'>lastname is required</span>}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col  sm={12} md={6} lg={6}>
              <Form.Floating>
                <Form.Control  id="email" type="email" name="email" 
                  placeholder="Email"  {...register("email",{ required:true})}  />
                <Label htmlFor="email">Email: {updatedocinfo.email}</Label>
                {errors.email && <span className='text-danger'>email is required</span>}
              </Form.Floating>
            </Col>
            <Col  sm={12} md={6} lg={6}>
              <Form.Floating>
                  <Form.Control  id="phone" type="text" name="phone" 
                    placeholder="Phone Number"  {...register("phone",{ required:true})}  />
                  <Label htmlFor="phone">Phone Number: {updatedocinfo.phone}</Label>
                  {errors.phone && <span className='text-danger'>phone is required</span>}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mb-2">
            
            <Col  sm={12} md={12} lg={12}>
              <Form.Floating>
                <Form.Control  id="DoctorId" type="text" name="ethAddress" 
                  placeholder="Doctor ethAddress"  {...register("ethAddress",{ required:true})}  />
                <Label htmlFor="DoctorId">Doctor ethAddress: {updatedocinfo.ethAddress}</Label>
                  {errors.ethAddress && <span className='text-danger'>doctor ethAddress id is required</span>}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col  sm={12} md={6} lg={6}>
              <Form.Floating>
                <Form.Control  id="County" type="text" name="county" 
                  placeholder="County"  {...register("county",{ required:true})}  />
                <Label htmlFor="County">County: {updatedocinfo.county}</Label>
                  {errors.county && <span className='text-danger'>County is required</span>}
              </Form.Floating>
            </Col>
            <Col  sm={12} md={6} lg={6}>
              <Form.Floating>
                <Form.Control id="Town" type="text" name ="town" 
                  placeholder="Town"  {...register("town",{ required:true})}  />
                <Label htmlFor="Town">Town: {updatedocinfo.town}</Label>
                  {errors.town && <span className='text-danger'>Town is required</span>}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col  sm={12} md={12} lg={12}>
              <Form.Floating>
                <Form.Control id="speciality" name="speciality" 
                  type="text" placeholder="Speciality"  {...register("speciality",{ required:true})}  />
                <Label htmlFor="speciality">Speciality: {updatedocinfo.speciality}</Label>
                  {errors.speciality && <span className='text-danger'>speciality is required</span>}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col className="mb-2" sm={12} md={6} lg={6}><Button type="submit" variant='secondary'> Save Data</Button></Col>
            <Col className=" ms-auto" sm={12} md={6} lg={6}><Button variant="secondary" onClick={handleClose } >Close</Button></Col>
          </Row>
        </form>
        </Card.Body>
          </Card>
        </Modal.Body>         
        </Modal>
          { 
            docCardData.length > 0 ? ( 
                isLoading ? ( <Spinner animation="border" variant="warning" />): (   
                  docCardData.map((doc,index) => (
                    <Card key={index} className='shadow-lg mx-4 my-3 font-monospace'>
                        <Card.Body> 
                        <Row >
                            <Col lg={2} md={2} sm={12} >
                                  <Card.Img className='dimg' height={100} width={100}  src={`https://avatars.dicebear.com/api/pixel-art/${doc.firstname}.svg`} alt="nopic" />
                            </Col>
                            <Col lg={10} md={10} sm={12} className='text-center' >
                                <div  className=' mb-2 fs-5'>Doctor ethAddress :<span className=' text-info'>{doc.ethAddress}</span></div >
                            </Col>   
                        </Row>
                        <Row >
                            <Col lg={6} md={6} sm={12}>
                                <div className=' mb-2  fw-bold'>Doctor Name :<span className=' text-info'>{doc.firstname} {doc.lastname}</span></div>
                                <div  className=' mb-2  fw-bold'>Date of Joining :<span className=' text-info'>{doc.createdAt.toLocaleDateString('en-us')}</span></div >
                                <div  className=' mb-2  fw-bold'>Speciality :<span className=' text-info'>{doc.speciality}</span></div>
                                <div className='d-flex justify-content-start'>
                                    <Button className='btn btn-warning me-3 btn-sm' onClick={()=>{handleShow(doc)}} ><FontAwesomeIcon icon={faUserPen}/> Edit User</Button>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <div className='mb-2  fw-bold'>Email :<span className=' text-info'>{doc.email}</span></div>
                                <div className='mb-2  fw-bold'>Phone :<span className=' text-info'>{doc.town}</span></div>
                                <div className='mb-2  fw-bold'>State :<span className=' text-info'>{doc.county}</span></div>
                            </Col>
                        </Row>
                        </Card.Body>
                    </Card>
                  ))
                ) 
            ):(<div>...waiting...</div>)
          }
          </> 
    )
  }


export default DoctorContent