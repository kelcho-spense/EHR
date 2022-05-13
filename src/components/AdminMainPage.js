import React from 'react';
import { useContext,useEffect,useState} from 'react';
import { LoginContext } from '../Context/LoginContext';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Label from "react-bootstrap/FormLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './styles/AdminContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen,faUserDoctor,faUserNurse,faUsersGear, faFileInvoiceDollar, faCreditCard, faBedPulse,faPrescriptionBottleMedical,faHouse, faCircleExclamation, faFileCircleCheck, faFileLines} from '@fortawesome/free-solid-svg-icons';
import AddDoctorPanel from './AddDoctorPanel';
import ViewAllDoctorsPanel from './ViewAllDoctorsPanel';
import { useForm } from 'react-hook-form';
import {useNewMoralisObject, useMoralisQuery} from 'react-moralis';
import { logout } from '../firebase-config';




function AdminMainPage() {
  const { setcurrentAdmin } = useContext(LoginContext);
  const [ loading, setLoading ] = useState(false); //receiving values from login context(global state)
  const [ panel, setPanel ] = useState("dashboard");
  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      setcurrentAdmin(false);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }
  return (
    <>    
      <Row className='font-monospace'>
        <Col lg={3} md={4} sm={12} className="leftSide" >
            <Nav className="flex-column">
              <Nav.Link className='btn btn-outline-secondary  text-dark my-2 fs-4' onClick={()=>{setPanel("dashboard")}} ><FontAwesomeIcon icon={faHouse}/> Dashboard</Nav.Link>
              <Nav.Link className='btn btn-outline-secondary  text-dark my-2 fs-4' onClick={()=>{setPanel("doctor")}} ><FontAwesomeIcon icon={faUserDoctor}/> Doctor</Nav.Link>
              <Nav.Link className='btn btn-outline-secondary  text-dark my-2 fs-4' onClick={()=>{setPanel("phamacist")}} ><FontAwesomeIcon icon={faPrescriptionBottleMedical}/> Phamacist</Nav.Link>
              <Nav.Link className='btn btn-outline-secondary  text-dark my-2 fs-4' onClick={()=>{setPanel("appointments")}} >Appointments</Nav.Link>
              <hr />
            </Nav> 
            <Nav className='position-absolute bottom-0 start-0 mb-2 bg-light'>
                     <Nav.Link className='text-dark fs-4' 
                     onClick={handleLogout} 
                     ><FontAwesomeIcon icon={faUserDoctor}/> Logout</Nav.Link>
            </Nav>           
        </Col>
        <Col lg={9} md={8} sm={12}>
          {
            panel === "dashboard" ? <AdminDashBoard /> : panel === "doctor" ? <AdminDoctorMainPanel /> : panel === "appointments" ? <AllAppointments /> : panel === "phamacist" ? <AdminPhamacistMainPanel /> : null
          }
        </Col>
      </Row>
    </>
  )
}
function AdminDashBoard() {  
  
  const { fetch:fetchconsultation } = useMoralisQuery("consultation");
  const { fetch:fetchapprovedmed } = useMoralisQuery("consultation",(query) =>query.equalTo("medicineApproval", "approved"),[],{autoFetch:false});
  const { fetch:fetchpendingapprovedmed } = useMoralisQuery("consultation",(query) =>query.equalTo("medicineApproval", "notapproved"),[],{autoFetch:false});
  const {fetch:fetchdoctors} = useMoralisQuery("doctors");
  const {fetch:fetchphamacist} = useMoralisQuery("phamacist");
  const {fetch:fetchappointments} = useMoralisQuery("book_appointments");
  const {fetch:fetchpeddingappointments} = useMoralisQuery("book_appointments",(query) =>query.equalTo("status", "pedding"),[],{autoFetch:false});
  const {fetch:fetchconsultedappointments} = useMoralisQuery("book_appointments",(query) =>query.equalTo("status", "consulted"),[],{autoFetch:false});
  const [consultation,setConsultation] = useState(0);
  const [approvedmed,setApprovedMed] = useState(0);
  const [pendingApprovedmed,setPendingApprovedMed] = useState(0);
  const [doctors,setDoctors] = useState(0);
  const [phamacist,setPhamacist] = useState(0);
  const [appointments,setAppointments] = useState(0);
  const [peddingAppointments,setPeddingAppointments] = useState(0);
  const [consultedAppointments,setConsultedAppointments] = useState(0);
  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () => {
    const consults = await fetchconsultation();
    const docs = await fetchdoctors();
    const phams = await fetchphamacist();
    const apoints = await fetchappointments();
    const pendingapoints = await fetchpeddingappointments();
    const approvedmed = await fetchapprovedmed();
    const pendingapprovedmed = await fetchpendingapprovedmed();
    const consultedapoints = await fetchconsultedappointments();
   if(typeof consults !== 'undefined' && consults.length > 0){
      setConsultation(consults.length);
   } 
   if(typeof docs !== 'undefined' && docs.length > 0){
    setDoctors(docs.length);
   }
   if(typeof phams !== 'undefined' && phams.length > 0){
    setPhamacist(phams.length);
  }
  if(typeof apoints !== 'undefined' && apoints.length > 0){
    setAppointments(apoints.length);
  }
  if(typeof pendingapoints !== 'undefined' && pendingapoints.length > 0){
    setPeddingAppointments(pendingapoints.length);
  } 
  if(typeof consultedapoints !== 'undefined' && consultedapoints.length > 0){
    setConsultedAppointments(consultedapoints.length);
  }
  if(typeof approvedmed !== 'undefined' && approvedmed.length > 0){
    setApprovedMed(approvedmed.length);
  } 
  if(typeof pendingapprovedmed !== 'undefined' && pendingapprovedmed.length > 0){
    setPendingApprovedMed(pendingapprovedmed.length);
  } 
  
  
}
   
  return (
    <Container>
      <Row className='g-3 mb-3'>
        <Col lg={4} md={4} sm={12}>
         <PersonelCard title={"Total Consultation"} bgcolor="bg-warning text-light shadow" number={consultation} icon={faBedPulse}/>
        </Col>
        <Col lg={4} md={4} sm={12}>
            <PersonelCard title={"Total Doctors"} bgcolor="bg-primary text-light shadow" number={doctors} icon={faUserDoctor} />
        </Col>
        <Col lg={4} md={4} sm={12}>
            <PersonelCard title={"Total Phamacist"} bgcolor="bg-info text-light shadow" number={phamacist} icon={faUserNurse}/>
        </Col>       
      </Row>
      <Row className='g-3 mb-3'>        
        <Col lg={6} md={6} sm={12}>
          <PersonelCard title={"Patient Pending Appointments"} bgcolor="bg-danger text-light shadow" number={peddingAppointments} icon={faUsersGear} />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <PersonelCard title={"Consulted Pending Appointments"} bgcolor="bg-success text-light shadow" number={consultedAppointments} icon={faUsersGear} />
        </Col>
      </Row>
      <Row className='g-3'>
        <Col lg={4} md={4} sm={12}>
            <PaymentCard cardTitle={"Total Appointments"} bgcolor="bg-dark text-light shadow-lg" amount={appointments} icon={faFileLines} />
        </Col>
        <Col lg={4} md={4} sm={12}>
            <PaymentCard cardTitle={"Approved Medicine"} bgcolor="bg-light text-dark shadow-lg" amount={approvedmed} icon={faFileCircleCheck} />
        </Col>
        <Col lg={4} md={4} sm={12}>
            <PaymentCard cardTitle={"Pedding Approved Medicine"} bgcolor="bg-light text-dark shadow-lg" amount={pendingApprovedmed} icon={faCircleExclamation} />
        </Col>
      </Row>
    </Container>    
  );
}
function AllAppointments() {
  const[appointments,setAppointments] = useState([]);
  const {fetch,isLoading} = useMoralisQuery("book_appointments");
useEffect (() => {
  const getDoctors = async () => {
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
                  <th scope="col">Patient Ethaddress</th>
                  <th scope="col">Doctor-Speciality</th>
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
                                        <td>{appointment.patientwalletid}</td>
                                        <td>{appointment.doctorspeciality}</td>
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
function AdminDoctorMainPanel() {
  const [doctorPanel,setDoctorPanel] = useState(true);
  return (
    <Container>
      <Navbar>
        <Nav className="me-auto ">
          <Button className='me-2' onClick={()=>{setDoctorPanel(true)}} variant='info' size='sm'>View Doctors</Button>
          <Button className='me-2' onClick={()=>{setDoctorPanel(false)}} variant='warning' size='sm'>Add Doctor</Button>
        </Nav>      
      </Navbar>
      <hr />
        {
          doctorPanel ? <ViewAllDoctorsPanel /> : <AddDoctorPanel/>
        }
    </Container>
  );
}
function AdminPhamacistMainPanel() {
  const [phamacistPanel,setPhamacistPanel]=useState(true);
  return (
    <Container>
    <Navbar>
      <Nav className="me-auto ">
        <Button className='me-2' onClick={()=>{setPhamacistPanel(true)}} variant='info' size='sm'>View Phamacists</Button>
        <Button className='me-2' onClick={()=>{setPhamacistPanel(false)}} variant='warning' size='sm'>Add Phamacist</Button>
      </Nav>
      <Nav className="ms-auto">
        <Button className='' variant='secondary' size='sm'>Refresh</Button>
      </Nav>
      
    </Navbar>
    <hr />
      {
        phamacistPanel ? <ViewAllPhamacists /> : <AddPhamacistPanel/>
      }
    </Container>
  );
}
function ViewAllPhamacists() {
  const [phamacists,setPhamacists] = useState([]);  
  const [phamacist,setPhamacist] = useState([]);  
  const [loading,setloading] =useState(false);
  const [show, setShow] = useState(false);
  const [updatedocinfo, setupdatedocinfo] = useState(false);  
  const { register, handleSubmit,resetField, formState:{errors},reset } = useForm();
  const [showupdate, setShowupdate] = useState(false); 

  const {fetch,isLoading} = useMoralisQuery("phamacist");
  const { save } = useNewMoralisObject("phamacist"); 
    //update modal show 
  const handleShow = (phamacist) =>{
      setShow(true);
      setupdatedocinfo(phamacist);
  }
    //update modal close
  const handleClose = () =>{
    resetField('firstname'); resetField('lastname'); resetField('email'); resetField('phone');
    resetField('doj'); resetField('doctorid'); resetField('state'); resetField('city');
    setShow(false);
  }; 
   //update phamacistdetails
  const handleUpdateModalShow = (data) => {
  setShow(true);
      setupdatedocinfo(data);
    } 
   // edit phamacist
   const updateDoctor = async (data)  => {
    save(data, {
        onSuccess: (doctor) => {
            reset();
            alert("Doctor updated with objectId: " + doctor.id);
            fetchAllPhamacists();
        },
    });
    }    
   //call fetch all docs info when page loads
  useEffect(() => {
    fetchAllPhamacists();
  }, [fetchAllPhamacists]); 

  const fetchAllPhamacists = async () => {
    const data = await fetch();
    setPhamacists(data.map(doctor => ({...doctor.attributes,id:doctor.id})));
  }

  return(
    <>
    <Modal  size="lg" show={show} onHide={handleClose} >        
      <Modal.Body>
        <Card className='shadow-lg'>
          <Card.Body>
          <form onSubmit={handleSubmit(updateDoctor)} > 
            <Row className="mb-2">
              <Col lg={6} md={6} sm={12}>
              <Form.Control type="hidden" name="docid" value={updatedocinfo.id}  {...register("id",{required:true})} />
                <Form.Floating>                 
                  <Form.Control  id="FirstName" type="text" name="firstname"
                    placeholder="FirstName"  {...register("firstname",{ required:true})}  />
                  <Label htmlFor="FirstName">First Name: {updatedocinfo.firstname}</Label>
                  {errors.firstname && <span className='text-danger'>firstname is required</span>}
                </Form.Floating>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <Form.Floating>
                    <Form.Control  id="LastName" type="text" name='lastname'
                      placeholder="LastName"  {...register("lastname",{ required:true})}  />
                    <Label htmlFor="LastName">Last Name: {updatedocinfo.lastname}</Label>
                    {errors.lastname && <span className='text-danger'>lastname is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={6} md={6} sm={12}>
                <Form.Floating>
                  <Form.Control  id="email" type="email" name="email" 
                    placeholder="Email"  {...register("email",{ required:true})}  />
                  <Label htmlFor="email">Email: {updatedocinfo.email}</Label>
                  {errors.email && <span className='text-danger'>email is required</span>}
                </Form.Floating>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <Form.Floating>
                    <Form.Control  id="phone" type="text" name="phone" 
                      placeholder="Phone"  {...register("phone",{ required:true})}  />
                    <Label htmlFor="phone">Phone: {updatedocinfo.phone}</Label>
                    {errors.phone && <span className='text-danger'>phone is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">              
              <Col sm={12} md={12} lg={12}>
                <Form.Floating>
                  <Form.Control  id="ethAddress" type="text" name='ethAddress' 
                    placeholder="ethAddress"  {...register("ethAddress",{ required:true})}  />
                  <Label htmlFor="ethAddress">Phamacist ethAddress: {updatedocinfo.ethAddress}</Label>
                    {errors.ethAddress && <span className='text-danger'>Phamacist ethAddress is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={6} md={6} sm={12}>
                <Form.Floating>
                  <Form.Control  id="Town" type="text" name="town" 
                    placeholder="Town"  {...register("town",{ required:true})}  />
                  <Label htmlFor="Town">Town: {updatedocinfo.town}</Label>
                    {errors.town && <span className='text-danger'>Town is required</span>}
                </Form.Floating>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <Form.Floating>
                  <Form.Control id="County" type="text" name ="county" 
                    placeholder="County"  {...register("county",{ required:true})}  />
                  <Label htmlFor="County">County: {updatedocinfo.county}</Label>
                    {errors.county && <span className='text-danger'>County is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="col-lg-6 col-md-6 col-sm-12"><Button type="submit" variant='secondary'> Save Data</Button></Col>
              <Col className="col-lg-6 col-md-6 col-sm-12 ms-auto"><Button variant="secondary" onClick={handleClose } >Close</Button></Col>
            </Row>
          </form>
          </Card.Body>
        </Card>
      </Modal.Body>         
    </Modal>
    <Container>
    {  
              phamacists.length > 0 ?  (
                isLoading ? (<Spinner animation="border" size="lg" variant="info" />) : (
                  phamacists.map((pham) => {
                        return (
                            <Card className='shadow-lg mx-4 my-1 font-monospace' key={pham.id}>
                              <Card.Body>
                                <Row className='justify-items-center align-items-center'>
                                    <Col lg={2} md={2} sm={12} >
                                        <Card.Img className='dimg img-fluid'  
                                        src={`https://avatars.dicebear.com/api/pixel-art/${pham.firstname}.svg`} alt="nopic" />
                                    </Col>
                                    <Col lg={10} md={10} sm={12} >
                                        <div  className='text-center mb-2 fs-3 fw-bold'>WalletId :<span className='fs-4 text-info'>{pham.ethAddress}</span></div >
                                    </Col>
                                </Row>
                                <Row>
                                  <Col lg={6} md={12} sm={12}>
                                      <div className=' mb-1 fs-6 fw-bold'>Phamcist Name :<span className=' text-info'>{pham.firstname} {pham.lastname}</span></div>
                                      <div  className=' mb-1 fs-6 fw-bold'>Date of Joining :<span className=' text-info'>{pham.createdAt.toLocaleDateString()}</span></div >
                                      <div className='mb-1 fs-6 fw-bold'>Email :<span className=' text-info'>{pham.email}</span></div>
                                  </Col>
                                  <Col lg={6} md={12} sm={12}>                                   
                                      <div className='mb-1 fs-6 fw-bold'>Phone :<span className=' text-info'>{pham.phone}</span></div>
                                      <div className='mb-1 fs-6 fw-bold'>City :<span className=' text-info'>{pham.town}</span></div>
                                      <div className='mb-1 fs-6 fw-bold'>County :<span className=' text-info'>{pham.county}</span></div>
                                      <div className='d-flex justify-content-start'>
                                      <Button size='sm' onClick={() => { handleUpdateModalShow(pham)}} className='btn btn-warning text-light me-3'><FontAwesomeIcon icon={faUserPen}/> Edit Doc</Button>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card> ); 
                 })
              )
            ) : (<h1>🤯🤯No Data Available</h1>)
          
          } 
    </Container>
    </>
  );
}
function AddPhamacistPanel() {
  const { register, handleSubmit, formState:{errors},reset } = useForm();
  const { save,isLoading } = useNewMoralisObject("phamacist"); 

  //save phamacist to moralisdb
   const createPhamacist = async (data) => {
      save(data, {
        onSuccess: (phamacist) => {
          alert("New Phamacist created with objectId: " + phamacist.id);
          reset();
        },
        onError: (error) => {
          alert("Failed to create Phamacist, with error code: " + error.message);
        },
      });
   }

  return(
        <Card className='shadow-lg'>
          <Card.Body>
          <form onSubmit={handleSubmit(createPhamacist)}>
            <Row className="mb-2">
              <Col className="sm-12 md-6">
                <Form.Floating>
                  <Form.Control  id="FirstName" type="text" name="firstname"
                    placeholder="FirstName"  {...register("firstname",{ required:true})}  />
                  <Label htmlFor="FirstName">First Name</Label>
                  {errors.firstname && <span className='text-danger'>firstname is required</span>}
                </Form.Floating>
              </Col>
              <Col className="sm-12 md-6">
                <Form.Floating>
                    <Form.Control  id="LastName" type="text" name='lastname'
                      placeholder="LastName"  {...register("lastname",{ required:true})}  />
                    <Label htmlFor="LastName">Last Name</Label>
                    {errors.lastname && <span className='text-danger'>lastname is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="sm-12 md-6">
                <Form.Floating>
                  <Form.Control  id="email" type="email" name="email"
                    placeholder="Email"  {...register("email",{ required:true})}  />
                  <Label htmlFor="email">Email</Label>
                  {errors.email && <span className='text-danger'>email is required</span>}
                </Form.Floating>
              </Col>
              <Col className="sm-12 md-6">
                <Form.Floating>
                    <Form.Control  id="phone" type="text" name="phone"
                      placeholder="Phone Number"  {...register("phone",{ required:true})}  />
                    <Label htmlFor="phone">Phone Number</Label>
                    {errors.phone && <span className='text-danger'>phone is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">             
              <Col className="sm-12 md-12">
                <Form.Floating>
                  <Form.Control  id="DoctorId" type="text" name='ethAddress'
                    placeholder="Doctor Id"  {...register("ethAddress",{ required:true})}  />
                  <Label htmlFor="DoctorId">Doctor ethAddress</Label>
                    {errors.ethAddress && <span className='text-danger'>doctor ethAddress is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="sm-12 md-6">
                <Form.Floating>
                  <Form.Control  id="County" type="text" name="county"
                    placeholder="County"  {...register("county",{ required:true})}  />
                  <Label htmlFor="County">county</Label>
                    {errors.County && <span className='text-danger'>County is required</span>}
                </Form.Floating>
              </Col>
              <Col className="sm-12 md-6">
                <Form.Floating>
                  <Form.Control id="Town" type="text" name ="town"
                    placeholder="Town"  {...register("town",{ required:true})}  />
                  <Label htmlFor="Town">Town</Label>
                    {errors.town && <span className='text-danger'>Town is required</span>}
                </Form.Floating>
              </Col>
            </Row>
            
            <Row className="mb-2 w-25 text-center mx-auto">
              <Button type="submit" variant='secondary'>
                  {isLoading ? <Spinner as="span" variant="warning" animation="border" size="sm" role="status" aria-hidden="true" />: 'Save Data' }
              
                  </Button>         
            </Row>
          </form>
          </Card.Body>
        </Card>
  )  
}
function PersonelCard({title,number,icon,bgcolor}) {
  return (
    <>
    <Card className={bgcolor}>
       <Card.Body>
       <FontAwesomeIcon icon={icon} className="fa-2xl"/>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle>{number}</Card.Subtitle>
       </Card.Body>
    </Card>
    </>
  );
}
function PaymentCard({cardTitle,amount,icon,bgcolor}) {
  return (
    <>
    <Card className={bgcolor}>
       <Card.Body>
       <FontAwesomeIcon icon={icon}  className="fa-2xl"/>
          <Card.Title>{cardTitle}</Card.Title>
          <Card.Subtitle>{amount}</Card.Subtitle>
       </Card.Body>
    </Card>
    </>
  );
}






export default AdminMainPage