import React,{useEffect,useState} from 'react';
import Table from 'react-bootstrap/Table';
import { useMoralis, useMoralisQuery } from 'react-moralis';
function PatientConsultationReport({currentPatientWalletId}) {
    const { isWeb3Enabled, enableWeb3 } = useMoralis();
    const [consultation,setConsultation] = useState([]);

    const {
        fetch,
        isLoading,
        error,
     } = useMoralisQuery("consultation",(query) => query.equalTo("patientWalletId",currentPatientWalletId),[currentPatientWalletId] );  
    
    
     useEffect(() => {
        ;(async() => {
           if(isWeb3Enabled){
            await getConsultation();
           }
        })()
     }, [getConsultation,isWeb3Enabled])

     const getConsultation = async () => {
        try {
            await enableWeb3(); 
            const consultations = await fetch(); 
            setConsultation(consultations.map( (consult) => consult.attributes));  
        } catch (error) {
            console.log(error);
        }
     }
    
return (
    <div className=' font-monoscope'>
        <div className='text-center fw-bolder fs-4'>Patient Consultation Report</div> <hr />
       
        <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date Created</th>
                        <th>Consultation-Msg</th>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Days Taken</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
        {  consultation.length > 0  ? (
                consultation.map((consult,index) => (
                <tr key={index}>
                    <td>{consult.createdAt.toLocaleDateString()}</td>
                    <td>{consult.consultation_msg}</td>
                    <td>{consult.medicine_name}</td>
                    <td>{consult.dosage}</td>
                    <td>{consult.frequency}</td>
                    <td>{consult.no_of_days}</td>
                    <td>{consult.remark}</td>
                </tr>
                ))
            ) : ( <tr><td colSpan='7'>🙄🙄No Consultation Found🙄🙄</td></tr> )
        }     
        
                </tbody>
        </Table>
    </div>
  )
}

export default PatientConsultationReport