import React,{useEffect , useState} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Label from "react-bootstrap/FormLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faUserPen,faUserXmark} from '@fortawesome/free-solid-svg-icons';
import {useNewMoralisObject, useMoralisQuery,useMoralis } from 'react-moralis';


function ViewAllDoctorsPanel() {
  //moralis hooks
    const {fetch,isLoading} = useMoralisQuery("doctors"); 
    const { save } = useNewMoralisObject("doctors"); 
    const { signup, user } = useMoralis();

    const { register, handleSubmit,resetField, formState:{errors},reset } = useForm();
    const [showupdate, setShowupdate] = useState(false);   
    const [showsignup, setShowsignup] = useState(false);   
    const [updatedocinfo,setupdatedocinfo] = useState([]);    
    const [doctors,setDoctors] = useState([]);
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    
 // update modal show 
 const handleUpdateModalShow = (doctor) =>{
  setShowupdate(true);
    setupdatedocinfo(doctor);
  } 
  // signup modal show 
 const handleSignupModalShow = (doctor) =>{
  setShowsignup(true);
  setupdatedocinfo(doctor);
} 
  //update modal close
  const handleClosesignup = () =>{
    setShowsignup(false);
  };
  //update modal close
  const handleCloseupdate = () =>{
    reset();
    setShowupdate(false);
  };
  //signupdoctor
  const SignUpDoctor = (e) =>{
    e.preventDefault();
    const username ='doctor';
    console.log(updatedocinfo.walletid,email,password);
    signup(username,password,email,{ethAddress:updatedocinfo.walletid});
     alert(`Doctor with id:${updatedocinfo.walletid} Signed Up Successfully`);
  }
  
    // edit doctors
    const updateDoctor = async (data)  => {
        save(data, {
            onSuccess: (doctor) => {
                alert("Doctor updated with objectId: " + doctor.id);
            },
        });
      } 
    //call fetch all docs info when page loads
    useEffect(() => {
        ;(async() => {
        const data = await fetch();
        setDoctors(data.map(doctor => ({...doctor.attributes,id:doctor.id})));
        })()
     }, [fetch,updateDoctor]);  
    return(
             
        <>
       
        {/* edit doc data */}
         <Modal  size="lg" show={showupdate} onHide={handleCloseupdate} >        
            <Modal.Body>
              <Card className='shadow-lg'>
            <Card.Body>
            <form  onSubmit={handleSubmit(updateDoctor)} > 
              <Row className="mb-2">
                <Col className="sm-12 md-6">
                <Form.Control type="hidden" name="id" value={updatedocinfo.id}  {...register("id",{required:true})} />
                  <Form.Floating>                 
                    <Form.Control  id="FirstName" type="text" name="firstname"
                      placeholder="FirstName"  {...register("firstname",{ required:true})}  />
                    <Label htmlFor="FirstName">First Name: {updatedocinfo.firstname}</Label>
                    {errors.firstname && <span className='text-danger'>firstname is required</span>}
                  </Form.Floating>
                </Col>
                <Col className="sm-12 md-6">
                  <Form.Floating>
                      <Form.Control  id="LastName" type="text" name='lastname'
                        placeholder="LastName"  {...register("lastname",{ required:true})}  />
                      <Label htmlFor="LastName">Last Name: {updatedocinfo.lastname}</Label>
                      {errors.lastname && <span className='text-danger'>lastname is required</span>}
                  </Form.Floating>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="sm-12 md-6">
                  <Form.Floating>
                    <Form.Control  id="email" type="email" name="email" 
                      placeholder="Email"  {...register("email",{ required:true})}  />
                    <Label htmlFor="email">Email: {updatedocinfo.email}</Label>
                    {errors.email && <span className='text-danger'>email is required</span>}
                  </Form.Floating>
                </Col>
                <Col className="sm-12 md-6">
                  <Form.Floating>
                      <Form.Control  id="phone" type="text" name="phone" 
                        placeholder="Phone Number"  {...register("phone",{ required:true})}  />
                      <Label htmlFor="phone">Phone Number: {updatedocinfo.phone}</Label>
                      {errors.phone && <span className='text-danger'>phone is required</span>}
                  </Form.Floating>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="sm-12 md-12">
                  <Form.Floating>
                    <Form.Control  id="DoctorethAddress" type="text" name='ethAddress' 
                      placeholder="Doctor ethAddress"  {...register("ethAddress",{ required:true})}  />
                    <Label htmlFor="DoctorethAddress">Doctor ethAddress: {updatedocinfo.ethAddress}</Label>
                      {errors.ethAddress && <span className='text-danger'>doctor ethAddress is required</span>}
                  </Form.Floating>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="sm-12 md-6">
                  <Form.Floating>
                    <Form.Control  id="county" type="text" name="county" 
                      placeholder="county"  {...register("county",{ required:true})}  />
                    <Label htmlFor="county">County: {updatedocinfo.county}</Label>
                      {errors.county && <span className='text-danger'>county is required</span>}
                  </Form.Floating>
                </Col>
                <Col className="sm-12 md-6">
                  <Form.Floating>
                    <Form.Control id="town" type="text" name ="town" 
                      placeholder="town"  {...register("town",{ required:true})}  />
                    <Label htmlFor="town">Town: {updatedocinfo.town}</Label>
                      {errors.town && <span className='text-danger'>town is required</span>}
                  </Form.Floating>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="sm-12 lg-12 md-12">
                  <Form.Floating>
                    <Form.Control id="speciality" name="speciality" 
                      type="text" placeholder="Speciality"  {...register("speciality",{ required:true})}  />
                    <Label htmlFor="speciality">Speciality: {updatedocinfo.speciality}</Label>
                      {errors.speciality && <span className='text-danger'>speciality is required</span>}
                  </Form.Floating>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="col-lg-6 col-md-6 col-sm-12"><Button type="submit" variant='secondary'> Save Data</Button></Col>
                <Col className="col-lg-6 col-md-6 col-sm-12 ms-auto"><Button variant="secondary" onClick={handleCloseupdate } >Close</Button></Col>
              </Row>
            </form>
            </Card.Body>
              </Card>
            </Modal.Body>         
          </Modal>          
          
          <Container>
          {  
              doctors.length > 0 ?  (
                isLoading ? (<Spinner animation="border" size="lg" variant="info" />) : (
                    doctors.map((doctor) => {
                        return (
                            <Card className='shadow-lg mx-4 my-3 font-monospace' key={doctor.id}>
                            <Card.Body>
                                
                                <Row className='justify-items-center align-items-center'>
                                <Col lg={2} md={2} sm={12} >
                                    <Card.Img className='dimg img-fluid'  src={`https://avatars.dicebear.com/api/pixel-art/${doctor.firstname}.svg`} alt="nopic" />
                                </Col>
                                <Col lg={10} md={10} sm={12} >
                                    <div  className=' mb-2 fs-3 fw-bold'>WalletId :<span className='fs-4 text-info'>{doctor.ethAddress}</span></div >

                                </Col>
                                
                                </Row>
                                <Row>
                                <Col lg={6} md={12} sm={12}>
                                    <div className=' mb-2 fs-5 fw-bold'>Doctor Name :<span className=' text-info'>{doctor.firstname} {doctor.lastname}</span></div>
                                    <div  className=' mb-2 fs-5 fw-bold'>Date of Joining :<span className=' text-info'>{doctor.createdAt.toLocaleDateString()}</span></div >
                                    <div  className=' mb-2 fs-5 fw-bold'>Speciality :<span className=' text-info'>{doctor.speciality}</span></div>
                                    
                                    <div className='mb-2 fs-5 fw-bold'>Email :<span className=' text-info'>{doctor.email}</span></div>
                                </Col>
                                <Col lg={6} md={12} sm={12}>                                   
                                    <div className='mb-2 fs-5 fw-bold'>Phone :<span className=' text-info'>{doctor.phone}</span></div>
                                    <div className='mb-2 fs-5 fw-bold'>City :<span className=' text-info'>{doctor.town}</span></div>
                                    <div className='mb-2 fs-5 fw-bold'>County :<span className=' text-info'>{doctor.county}</span></div>
                                    <div className='d-flex justify-content-start'>
                                    <Button onClick={() => { handleUpdateModalShow(doctor)}} className='btn btn-warning text-light me-3'><FontAwesomeIcon icon={faUserPen}/> Edit Doc</Button>
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
          <Modal  size="lg" show={showsignup} onHide={handleClosesignup} >        
            <Modal.Body>
              <Card className='shadow-lg'>
            <Card.Body>
            <form id='sign' > 
              <Row className="mb-2">
                <Col className="sm-12 md-6"> 
                 <Form.Floating>                 
                  <Form.Control  id="sEmail" type="text" value={email}
                      placeholder="sEmail" onChange={(e) => setEmail(e.target.value)} />
                    <Label htmlFor="sEmail">Email: {updatedocinfo.email}</Label>
                  </Form.Floating>
                </Col>
                <Col className="sm-12 md-6">
                  <Form.Floating>
                      <Form.Control  type="password" value={password} 
                        placeholder="sPassword" onChange={(e) => setPassword(e.target.value)}   />
                      <Label htmlFor="sPassword">Password: </Label>
                  </Form.Floating>
                </Col>
              </Row>             
              <Row className="mb-2">
                <Col className="col-lg-6 col-md-6 col-sm-12"><Button type="submit" onClick={SignUpDoctor } variant='secondary'> Signup Doc</Button></Col>
                <Col className="col-lg-6 col-md-6 col-sm-12 ms-auto"><Button variant="secondary" onClick={handleClosesignup } >Close</Button></Col>
              </Row>
            </form>
            </Card.Body>
              </Card>
            </Modal.Body>         
        </Modal>
        </>
      );
}

export default ViewAllDoctorsPanel