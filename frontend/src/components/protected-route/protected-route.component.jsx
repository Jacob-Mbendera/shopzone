import React, { useContext } from 'react';
import { Store } from '../../context/store.context';
import { Navigate } from 'react-router-dom';

 const ProtectedRoute = ({children})=> {

    const { state } = useContext(Store);
    const  { userInfo }= state;

    return userInfo ? children : <Navigate to="/signin" /> 
}

export default ProtectedRoute;