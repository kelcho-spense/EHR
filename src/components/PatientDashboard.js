import React,{ useState, useEffect, useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Table, Button, ConnectButton } from 'web3uikit';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { DoctorContext } from '../Context/DoctorContext';
import PatientConsultationReport from './PatientConsultationReport';

 
function PatientDashboard() {
    const [username,setUsername] = useState('');
    const {currentPatientWalletId,setcurrentPatientWalletId} = useContext(DoctorContext);
    const [consultation,setConsultation] = useState([]);
    const { isAuthenticated,Moralis,user,isWeb3Enabled,authenticate,enableWeb3 } = useMoralis();
    const { register, handleSubmit, formState:{errors},reset } = useForm();
    const [showtable,setShowTable] = useState(false);
    const [showform,setShowForm] = useState(false);
    const [isLoadings,setIsloadings] = useState('');
    const [consultationData,setConsultationData] = useState([]);
    const [dataz,setdataz] = useState('');
    const {fetch,isLoading} = useMoralisQuery("consultation",(query) =>query.equalTo("ethAddress", currentPatientWalletId),[currentPatientWalletId],{ autoFetch: false });


//calls to check the current users details
useEffect(() => {
  ;(async() => {
    if (isAuthenticated) {
    const currentUserData =  Moralis.User.current();
     const currentUsername = currentUserData.get("firstname") ;
     const PatientWalletId = currentUserData.get("ethAddress");
        setUsername(currentUsername);
        setcurrentPatientWalletId(PatientWalletId);
        if (currentUsername == 'fn' ) {
            setShowForm(true);
        } else {
            setShowTable(true);
        }
    }
    
  })()
}, [isAuthenticated])

//register a new member
 const regPatientProfile = async (data) => {
    user.set("firstname",data.firstname);
    user.set("lastname",data.lastname);
    user.set("mobile",data.mobile);
    user.set("city",data.city);
    user.set("state",data.state);
    if(user.save()){
        setShowForm(false);
        setShowTable(true);
        reset();
        alert("Patient Profile Updated Successfully");
    }
       
       
 }
  return (
    <Container>
        <Card className="shadow">
            <Card.Body className="body">
           
            { isAuthenticated && (
                <>
                <div className='d-flex justify-content-end align-items-center'><Link className='btn btn-info text-light fs-5' to="/patient/appointment">Book Appointment</Link></div>
                <div className='m-2  image-fluid text-center mx-auto'>
                 <Image height={100} width={100}  className='dimg' src={`https://avatars.dicebear.com/api/pixel-art/${username}.svg`} />
                 </div>
                {showform ? (
                    <form onSubmit={handleSubmit(regPatientProfile)}>
                        <div className='d-flex flex-column mt-2 align-items-center w-50 text-center mx-auto'>                                                   
                            <Row className='mb-2'>
                                <Col lg={6} md={6} sm={12} className='mb-2'>
                                    <FloatingLabel  controlId="First Name" label="First Name">
                                        <Form.Control type="text"  name='firstname'
                                    {...register("firstname",{required:true})} />
                                    </FloatingLabel>
                                    {errors.firstname && <span className='text-danger'>firstname is required</span>} 
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                <FloatingLabel controlId="Last Name" label="Last Name">
                                        <Form.Control type="text"   name='lastname'
                                {...register("lastname",{required:true})} />
                                    </FloatingLabel>
                                    {errors.lastname && <span className='text-danger'>lastname is required</span>} 
                                </Col>
                            </Row>                       
                            <Row className='mb-2'>
                                <Col lg={12} md={12} sm={12}>
                                    <FloatingLabel controlId="Mobile" label="Mobile">
                                        <Form.Control type="text"   name='mobile'
                                    {...register("mobile",{required:true})}/> 
                                    </FloatingLabel>
                                    {errors.mobile && <span className='text-danger'>mobile is required</span>}                                
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg={6} md={6} sm={12} className='mb-2'>
                                    <FloatingLabel  controlId="City" label="City">
                                        <Form.Control type="text"  name='city'
                                    {...register("city",{required:true})}/>
                                    </FloatingLabel>
                                    {errors.city && <span className='text-danger'>city is required</span>}
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mb-2'>
                                    <FloatingLabel  controlId="State" label="State">
                                        <Form.Control type="text"  name='state'
                                        {...register("state",{required:true})}/>
                                    </FloatingLabel>
                                    {errors.state && <span className='text-danger'>state is required</span>}
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <Button text ="Save Patient-Profile" type='submit' theme="outline" />
                            </Row>
                        </div>
                    </form>
                ):(
                    <div className='alert alert-warning w-50 text-center mx-auto'> Welcome {username}</div>
                )}
                </>
            )}
            <div className="d-flex flex-column align-items-center w-50 mx-auto">
                  <ConnectButton />
            </div>

            </Card.Body>
        </Card>
        {isAuthenticated && (
            showtable ? (
                <Card className="shadow">
                <Card.Body className='ps-2' >
                    
                <PatientConsultationReport currentPatientWalletId={currentPatientWalletId} />
                </Card.Body>
            </Card>
            ):null
            
        )}
        
       
    </Container>
  )
}

export default PatientDashboard