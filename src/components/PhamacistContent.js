import React,{useEffect, useState,useContext} from 'react';
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container  from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from 'react-router-dom';
import {useMoralis,useMoralisQuery,useNewMoralisObject} from 'react-moralis';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faClipboardList,faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { DoctorContext } from '../Context/DoctorContext';

function PhamacistContent() {
  const [panel,setPanel] =useState("Approved");
  const { logout, isAuthenticating } = useMoralis();
  const {currentPhamWalletId} = useContext(DoctorContext);
  const [phamacistData,setPhamcistData]=useState([]);
  const {fetch,isLoading} =useMoralisQuery("phamacist",(query) =>query.equalTo("ethAddress", currentPhamWalletId),[currentPhamWalletId],{autoFetch:false});
  useEffect(() => {
    fetchPhamprofile();
  }, [])
  
  const fetchPhamprofile = async () => {
    const phamacist = await fetch();
    setPhamcistData(phamacist.map((phamacist) =>({...phamacist.attributes,id:phamacist.id})));
  }
  return (
    <Row className='font-monospace'>
            <Col lg={3} md={4} sm={12}  >
               
                    {
                        phamacistData.length > 0 ? (
                          phamacistData.map((Data) => {
                            return (
                              <Nav variant="pills" key={Data.id} className="flex-column bg-dark text-light fw-bold text-center justify-items-center">
                                <Nav.Item>                      
                                <Image height={100} width={100}  className='dimg' src={`https://avatars.dicebear.com/api/pixel-art/${Data.firstname}.svg`} />
                                </Nav.Item>
                                <Nav.Item>EthAddress:{Data.ethAddress.slice(0,7) + '...'}</Nav.Item>
                                <Nav.Item>FirsName:{Data.firstname}</Nav.Item>
                                <Nav.Item>FirsLast:{Data.lastname}</Nav.Item>
                                <Nav.Item>Phone:{Data.phone}</Nav.Item>
                              </Nav>
                            )
                          })
                        
                            ) : (
                              <Nav variant="pills" className="flex-column bg-dark text-light fw-bold">
                                 <Nav.Item>Error:No profile..logout</Nav.Item>
                              </Nav>
                            )

                    }                    
                
                <Nav className="flex-column bg-light">
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("Approved")}} ><FontAwesomeIcon icon={faClipboardCheck}/> Approved</Nav.Link>
                    <Nav.Link className=' text-dark fs-4' onClick={()=>{setPanel("PeddingApprovals")}} ><FontAwesomeIcon icon={faClipboardList}/> Pedding Approvals</Nav.Link>
                    <hr />
                </Nav> 
                <Nav className='position-absolute bottom-0 start-0 mb-2 bg-light'>
                     <Button variant='light fs-4'
                      onClick={() => logout()} disabled={isAuthenticating}
                     > <FontAwesomeIcon icon={faUserMinus} /> Logout</Button> 
                </Nav> 
               

            </Col>
            <Col lg={9} md={8} sm={12}>
            {
                panel ===  "Approved" ? <Approved />  : panel === "PeddingApprovals" ? <PeddingApprovals /> : null
            }
            </Col>
      </Row>
  )
}
function Approved() {
    const {enableWeb3} = useMoralis();
    const[consultationData,setConsultationData] = useState([]);
    const {save} = useNewMoralisObject("consultation");
  const {fetch,isLoading} = useMoralisQuery("consultation",(query) =>query.equalTo("medicineApproval", "approved"),[],{autoFetch:false});
  useEffect (() => {
    fetchapproved();
  },[]);
  const fetchapproved = async () => {
    await enableWeb3();
    const consultations = await fetch();    
    setConsultationData(consultations.map((consultation) =>({...consultation.attributes,id:consultation.id})));
  }
  const handleddisApprove = async (data) => {
    const approvedData = {
      objectId:data.id,
      consultation_msg:data.consultation_msg,
      medicine_name:data.medicine_name,
      dosage:data.dosage,
      frequency:data.frequency,
      no_of_days:data.no_of_days,
      patientWalletId:data.patientWalletId,
      remarks:data.remarks,
      medicineApproval:"notapproved",
      phamacistEthAddress:"0x0000000000000000000000000000000000000000",
      };
  save(approvedData, {
      onSuccess: (consultation) => {            
        fetchapproved();
        alert("Medicine DisApproved: " + consultation.id);
      },
      onError: (error) => {
        alert("Failed to DisApproved medicine: " + error.message);
      },
    });
}
    return(
        <Container>
        <div className='fs-4 text-Warning fw-bolder d-flex justify-content-center'>Approved List</div> <hr />
        <table className="table table-hover">            
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">consultation_msg</th>
                    <th scope="col">Medicine</th>
                    <th scope="col">Dosage</th>
                    <th scope="col">Frequency</th>            
                    <th scope="col">Days</th>
                    <th scope="col">Patient_ethAdress</th>
                    <th scope="col">Approval Status</th>
                </tr>
                </thead>
                <tbody>
                    { consultationData.length > 0 ? (
                        isLoading ? (<Spinner animation="border" variant="warning" />):
                            (
                                consultationData.map((data,index)=> {
                                        return( 
                                                <tr className='text-info fs-5' key={index}>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{data.consultation_msg}</td>
                                                    <td>{data.medicine_name}</td>
                                                    <td>{data.dosage}</td>
                                                    <td>{data.frequency}</td>
                                                    <td>{data.no_of_days}</td>
                                                    <td>{data.patientWalletId.slice(0,7) + '...'}</td>
                                                    <td>
                                                         <Button variant='success' size='sm' onClick={()=>{handleddisApprove(data)}}>DisApprove</Button>
                                                    </td>
                                                </tr>
                                            )
                                })
                            )
                        ) : <tr><td colSpan={5}><span className='text-danger fs-4 fw-bolder'>No Pedding Approvals</span></td></tr>
                    }                 
                    
                </tbody>
        </table>
        </Container>
    )
}
function PeddingApprovals() {
    const {enableWeb3} = useMoralis();
    const[consultationData,setConsultationData] = useState([]);
    const {save} = useNewMoralisObject("consultation");
    const {fetch,isLoading} = useMoralisQuery("consultation",(query) =>query.equalTo("medicineApproval", "notapproved"),[],{autoFetch:false});
  useEffect (() => {
    fetchnotapproved();
  },[]);
  const fetchnotapproved = async () => {
    await enableWeb3();
    const consultations = await fetch();    
    setConsultationData(consultations.map((consultation) =>({...consultation.attributes,id:consultation.id})));
  }
  const handleApprove = async (data) => {
      const approvedData = {
        objectId:data.id,
        consultation_msg:data.consultation_msg,
        medicine_name:data.medicine_name,
        dosage:data.dosage,
        frequency:data.frequency,
        no_of_days:data.no_of_days,
        patientWalletId:data.patientWalletId,
        remarks:data.remarks,
        medicineApproval:"approved",
        phamacistEthAddress:"0x0000000000000000000000000000000000000000",
        };
    save(approvedData, {
        onSuccess: (consultation) => {            
            fetchnotapproved();
          alert("Medicine Approved: " + consultation.id);
        },
        onError: (error) => {
          alert("Failed to Approve medicine: " + error.message);
        },
      });
  }
    return(
        <Container>
            <div className='fs-4 text-primary fw-bolder d-flex justify-content-center'>Pedding Approvals</div> <hr />
            <table className="table table-hover">            
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Consultation_Msg</th>
                        <th scope="col">Medicine</th>
                        <th scope="col">Dosage</th>
                        <th scope="col">Frequency</th>            
                        <th scope="col">Days</th>
                        <th scope="col">Patient_ethAdress</th>
                        <th scope="col">Approval Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        { consultationData.length > 0 ? (
                            isLoading ? (<Spinner animation="border" variant="warning" />):
                                (
                                    consultationData.map((data,index)=> {
                                            return(
                                                    <tr className='text-info fs-5' key={index}>
                                                        <th scope="row">{index+1}</th>
                                                        <td>{data.consultation_msg}</td>
                                                        <td>{data.medicine_name}</td>
                                                        <td>{data.dosage}</td>
                                                        <td>{data.frequency}</td>
                                                        <td>{data.no_of_days}</td>
                                                        <td>{data.patientWalletId.slice(0,7) + '...'}</td>
                                                        <td><Button variant='danger' size="sm" onClick={()=>{handleApprove(data)}}>Approve</Button></td>
                                                    </tr>
                                                )
                                    })
                                )
                            ) : <tr><td colSpan={5}><span className='text-danger fs-4 fw-bolder'>No Pedding Approvals</span></td></tr>
                        }                 
                        
                    </tbody>
            </table>
        </Container>
    )
}

export default PhamacistContent