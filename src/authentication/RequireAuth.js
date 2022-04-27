import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const RequireAuth = ({ children }) => {
    const auth = useAuth();
    
    if (!auth.user && !auth.loadingData){
        return (
            <Navigate to='/signin'/>
        )
    }

    if (auth.loadingData){
        return (
            <div className='loadingScreenContainer'>
                <h1>Cargando...</h1>
            </div>
        )
    }

    return children;
}

export default RequireAuth;