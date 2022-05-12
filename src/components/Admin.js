import React from 'react';
import { useContext,useState } from 'react';
import { LoginContext } from '../Context/LoginContext';
import AdminMainPage from './AdminMainPage';
import Login from './Login';
function Admin() { 
  const { currentAdmin } = useContext(LoginContext);

  return (
    
    <div>
        { currentAdmin ? <AdminMainPage /> : <Login /> }          
    </div>
  );
}

export default Admin