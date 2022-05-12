import React,{ useState, useEffect, useContext,useRef} from 'react';
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import PhamacistContent from './PhamacistContent';
import { DoctorContext } from '../Context/DoctorContext';
import { moralis,useMoralis,useMoralisQuery } from "react-moralis";
import { useForm } from 'react-hook-form';


function Phamacist() {
    const [walletvalid, setwalletvalid] = useState(false);
    const [showDoctorContent, setDoctorContent] = useState(false);
    const { authenticate,enableWeb3, isAuthenticated, user,signup,login } = useMoralis();
    const [loginTrue,setloginTrue] = useState(false);
    const [phamacistWalletIds,setphamacistWalletIds] = useState([]);
    const [walletId,setwalletId] = useState('');
    const {currentPhamWalletId,setCurrentPhamWalletId} = useContext(DoctorContext);
    const { register, handleSubmit,reset, formState:{errors} } = useForm();
    const { register:register2, handleSubmit:handleSubmit2,resetField:resetField2, formState:{errors:errors2},reset:reset2 } = useForm();
    const {fetch,isLoading } = useMoralisQuery("phamacist",(query) => query.equalTo("ethAddress",walletId),[walletId],{ autoFetch: false });  
 
    useEffect(() => {
      ;(async() => {
       await fetching();
      })()
    },[walletId]);
    const fetching = async () => {
        await enableWeb3(); 
        const walletids = await fetch();  
        const pp = walletids.map( (phamwalletid) => phamwalletid.attributes.ethAddress);  
        if (pp.length > 0) {
          const ff= pp.includes(walletId);
          if( ff == true){
            alert("valid Wallet Address");
            setwalletvalid(true);
            } else {
              setwalletvalid(false);
            }
        }
      }
    const validWallet = async (data) => {   
    setwalletId(data.walletid)
    fetching();      
    }
    const loginAction = async (data) => {
      try {
        login(data.luser, data.lpass);
        setCurrentPhamWalletId(walletId);
        reset2();
      } catch (response) {
        alert(response.error);
      }
        
    }  
    const signupAction = async (data) => {
     await  signup(data.suser, data.spass);
        setCurrentPhamWalletId(walletId);
        reset();       
    } 
  return (
    <div className='font-monoscope mx-3'  >
    { walletvalid ? (     
        isAuthenticated ? ( <PhamacistContent/>):(              
              <Row>
              <Col md={6} sm={12} lg={6}>
                <img className='img-fluid' src={require('./images/adminlogin.svg')} alt='......'/>
              </Col>
              <Col md={6} sm={12} lg={6}>
                <form onSubmit={handleSubmit2(loginAction)} className="text-info" >
                  <span className='d-flex justify-content-center text-info mx-auto mb-3 fw-bolder fs-4'>Phamacist Login Portal</span>
                  <hr />
                  <FloatingLabel controlId="luser" label="Enter Username" className="mb-3">
                    <Form.Control type="text" name="luser" {...register2("luser",{required:true})}  placeholder="Enter Username" required/>
                     {errors2.luser && <span className='text-danger'>Username is required</span>}
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" name="lpass" {...register2("lpass",{required:true})}   placeholder="Enter Password" required/>
                     {errors2.lpass && <span className='text-danger'>Password is required</span>}
                  </FloatingLabel> 
                  <div className='d-flex justify-content-center mx-auto mt-3'>
                    <Button  variant="outline-info w-25"  type="submit">Login</Button>
                  </div>                
                </form>
                  <hr />
                  <span className='d-flex justify-content-center text-danger mx-auto mb-3 fw-bold fs-6'><em>Only Signup once</em></span>
                  <hr />
                <form onSubmit={handleSubmit(signupAction)} className="text-warning">                  
                  <span className='d-flex justify-content-center mx-auto text-warning mb-3 fw-bolder fs-4'>Phamacist Signup Portal</span>
                  <hr className='fs-bolder' />                 
                  <FloatingLabel controlId="suser" label="Enter Username" className="mb-3">
                    <Form.Control type="text" name="suser" {...register("suser",{required:true})}  placeholder="Enter Username" required/>
                     {errors.suser && <span className='text-danger'>Username is required</span>}
                  </FloatingLabel>
                  <FloatingLabel controlId="spass" label="Password">
                    <Form.Control type="password" name="spass" {...register("spass",{required:true})}   placeholder="Enter Password" required/>
                    {errors.spass && <span className='text-danger'>Password is required</span>}
                  </FloatingLabel> 
                  <div className='d-flex justify-content-center mx-auto my-3'>
                    <Button  variant="outline-warning w-25"  type="submit">SignUp</Button>
                  </div>
                </form>
              </Col>
              </Row>
            )
    ):( isAuthenticated ? (<PhamacistContent/>):(
        <Row className="justify-items-center align-items-center">
            <Col md={6} sm={12} lg={6}>
            <span className='d-flex justify-content-center mx-auto mb-3 fw-bolder fs-4'>Phamacist Verify Portal</span>
              <hr />
              <form onSubmit={handleSubmit(validWallet)}>          
                <FloatingLabel controlId="floatingInput"label="Enter Your Valid Wallet Address"  className="mb-3">
                  <Form.Control type="text"  placeholder="Enter Your Valid Wallet Address" 
                    name="walletid"  {...register("walletid",{required:true})}/>
                    {errors.walletid && <span className='text-danger'>walletid is required</span>}
                </FloatingLabel> 
                  <div className='d-flex justify-content-center mx-auto mt-3'>
                    <Button  variant="outline-info w-25"   type="submit">Validate</Button>
                  </div>
                </form>           
            </Col>
            <Col md={6} sm={12} lg={6}>
              <img className='img-fluid' src={require('./images/phamacist.svg')} alt='......'/>
            </Col>
        </Row>
    )
      )
    } 
        
  </div>
  )
}

export default Phamacist