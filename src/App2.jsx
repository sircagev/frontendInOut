import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Elementos } from "./view/Elementos";
import { Categorias } from "./view/Categorias";
import { Categoria } from "./view/Categoria";
import { Empaque } from "./view/Empaque";
import { Empaques } from "./view/Empaques";
import { Medida } from "./view/Medida";
import { Ubicacion } from "./view/Ubicacion";
import Usuario from "./view/Usuario";
import ReporteU from "./view/ReporteUsuario";
import ReporteE from "./view/ReporteElemento";
import ReporteB from "./view/ReporteBodega";
import ReporteM from "./view/ReporteMovimiento";
import { Movimientos } from "./view/Movimientos";
import { Movimientos2 } from "./view/Movimientos2";
import Login from "./view/Login";
import Bodega from "./view/Bodegas"
import Reporte from "./view/Reportes"
import { DashboardTemplate } from './view/DashboardTemplate';
import { ProtectedRoutes, ProtectedRoutesLogin } from './components/auth/ProtectedRoutes';

function App2() {

    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay un token en el localStorage al cargar la aplicación
        const token = localStorage.getItem('token');
        console.log(token)
        if (token) {
            // Si hay un token, el usuario está autenticado
            setLoggedIn(true);
        }
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<ProtectedRoutesLogin>
                <Login setLoggedIn={setLoggedIn} />
            </ProtectedRoutesLogin>} />
            <Route element={<ProtectedRoutes setLoggedIn={setLoggedIn} />} >
                <Route path="/home" element={<h1>Home</h1>} />
                <Route path="/elementos" element={<Elementos />} />
                <Route path="/elementos/categorias" element={<Categorias />} />
                <Route path="/elementos/empaques" element={<Empaque />} />
                <Route path="/elementos/medidas" element={<Medida />} />
                <Route path="/usuarios" element={<Usuario />} />
                <Route path="/reportes/usuarios" element={<ReporteU />} />
                <Route path="/reportes/elementos" element={<ReporteE />} />
                <Route path="/reportes/bodegas" element={<ReporteB />} />
                <Route path="/reportes/movimientos" element={<ReporteM />} />
                <Route path="/bodegas" element={<Bodega />} />
                <Route path="/reportes" element={<Reporte />} />
                <Route path="/bodegas/ubicacion" element={<Ubicacion />} />
                <Route path="/movimientos" element={<Movimientos2 />} />
            </Route>
        </Routes>
    );
}

export default App2;