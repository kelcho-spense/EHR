import React,{useState,useEffect} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Label from "react-bootstrap/FormLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from 'react-hook-form';
import { useNewMoralisObject } from "react-moralis";


function AddDoctorPanel() {
    const { register, handleSubmit, formState:{errors},reset } = useForm();
    const [loading,setloading] =useState(false);
    const { save } = useNewMoralisObject("doctors"); 
//save doctor to moralisdb
   const createDoctor = async (data) => {
    setloading(true);
      save(data, {
        onSuccess: (doctor) => {
          setloading(false);
          alert("New Doctor created with objectId: " + doctor.id);
          reset();
        },
        onError: (error) => {
          alert("Failed to create doctor, with error code: " + error.message);
        },
      });
   }
   
     return(
     
       <Card className='shadow-lg'>
         <Card.Body>
         <form onSubmit={handleSubmit(createDoctor)}>
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
           <Row className="mb-2">
             <Col className="sm-12 lg-12 md-12">
               <Form.Floating>
                 <Form.Control id="speciality" name="speciality"
                  type="text" placeholder="Speciality"  {...register("speciality",{ required:true})}  />
                 <Label htmlFor="speciality">Speciality</Label>
                  {errors.speciality && <span className='text-danger'>speciality is required</span>}
               </Form.Floating>
             </Col>
           </Row>
           <Row className="mb-2 w-25 text-center mx-auto">
             <Button type="submit" variant='secondary'>
                 {loading ? <Spinner as="span" variant="warning" animation="border" size="sm" role="status" aria-hidden="true" />: 'Save Data' }
             
                </Button>         
           </Row>
         </form>
         </Card.Body>
       </Card>
     );
}

export default AddDoctorPanel