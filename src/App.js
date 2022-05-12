import React,{ useState } from 'react';
// import './App.css';
import { LoginContext } from './Context/LoginContext';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import Doctor from "./components/Doctor";
import Patient from "./components/Patient";
import Homepage from './components/Homepage';
import PatientAppointment from './components/PatientAppointment';
import Login from './components/Login';
import Admin from './components/Admin';
import Phamacist from './components/Phamacist';
import About from './components/About';
import MyNavbar from './components/MyNavbar';
import DoctorConsultForm from './components/DoctorConsultForm';
import { DoctorContext } from './Context/DoctorContext';


function App() {
  const [ doctorWalletIds,setDoctorWalletIds ] = useState([]);
  const [ currentAdmin,setcurrentAdmin ] = useState('');
  const [ currentDocWalletId,setCurrentDocWalletId ] = useState('');
  const [doctorContextData,setDoctorContextData] = useState([]);
  const [doctorSpeciality,setDoctorSpeciality] = useState('');
  const [patientConsultb,setPatientConsultb] = useState([]);
  const [currentPatientWalletId,setcurrentPatientWalletId] = useState('');
const [currentPhamWalletId,setCurrentPhamWalletId] = useState('');

  return (
    <LoginContext.Provider value={{ currentAdmin,setcurrentAdmin,doctorWalletIds,setDoctorWalletIds,currentDocWalletId,setCurrentDocWalletId}}> 
    <DoctorContext.Provider value={{currentPhamWalletId,setCurrentPhamWalletId,currentPatientWalletId,setcurrentPatientWalletId,currentDocWalletId,setCurrentDocWalletId,doctorSpeciality,setDoctorSpeciality,patientConsultb,setPatientConsultb}}>  
      <Router>
          <MyNavbar/>
        <Routes>
          <Route path="/" element={<Homepage />} />
   
          <Route path="/doctor" element={<Doctor />}/>
          <Route path='/doctor/consult' element={<DoctorConsultForm />}/>   
          <Route path='/patient/appointment' element={<PatientAppointment />}/>  
          <Route path="/admin" element={<Admin />} />      
          <Route path="/patient" element={<Patient />} />
          <Route path="/phamacist" element={<Phamacist />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
      </DoctorContext.Provider>   
    </LoginContext.Provider>
  );
}

export default App;
