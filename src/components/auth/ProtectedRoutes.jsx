import React from 'react'
import { Navigate } from 'react-router-dom';
import { DashboardTemplate } from '../../view/DashboardTemplate';

export const ProtectedRoutes = ({ children, setLoggedIn }) => {

    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <DashboardTemplate setLoggedIn={setLoggedIn}>
            {children}
        </DashboardTemplate>

    )
}

export const ProtectedRoutesLogin = ({children}) => {
    const token = localStorage.getItem('token');

    if (token) {
        return <Navigate to="/home"/>
    }

    return children

}