import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { DashboardTemplate } from '../../view/DashboardTemplate';

export const ProtectedRoutes = ({ children, setLoggedIn, setUser }) => {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const code = localStorage.getItem('codigo')

    //Ejecutar funciones

    if (!token) {
        return <Navigate to="/login" />
    } else {
        setUser({ role: role, codigo: code })
    }

    return (
        <DashboardTemplate setLoggedIn={setLoggedIn}>
            {children}
        </DashboardTemplate>
    )
}

export const ProtectedRoutesLogin = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        return <Navigate to="/home" />
    }

    return children

}