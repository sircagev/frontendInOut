import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Elementos } from "./view/Elementos"
import { Elemento } from "./view/Elemento";
import { Categorias } from "./view/Categorias";
import { Categoria } from "./view/Categoria";
import { Empaque } from "./view/Empaque";
import { Empaques } from "./view/Empaques";
import { Medida } from "./view/Medida";
import { Medidas } from "./view/Medidas";
import { Ubicacion } from "./view/Ubicacion";
import { Ubicaciones } from "./view/Ubicaciones";
import Usuario from "./view/Usuario";
import ReporteU from "./view/ReporteSolicitudUsuario";
import ReporteE from "./view/ReportePrestamosActivos";
import ReporteB from "./view/ReporteStockMin";
import { Usuarios } from './view/Usuarios';
import ReporteM from "./view/ReporteMovimiento";
import { Movimientos } from "./view/Movimientos";
import { Movimientos2 } from "./view/Movimientos2";
import Login from "./view/Login";
import Bodegas from "./view/Bodegas";
import Reporte from "./view/Reportes";
import Home from "./view/Home";
import { ProtectedRoutes, ProtectedRoutesLogin } from './components/auth/ProtectedRoutes';
import { PageNotFound } from './view/PageNotFound';
import { Prestamos } from './view/Prestamos'


function App2() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({role: ""})

    return (
    
      <div className="h-screen">
            <Routes >
                <Route index element={<Navigate to="/login"/>}/>
                <Route path='/*' element={<PageNotFound/>}/>
                <Route path="/login" element={<ProtectedRoutesLogin>
                    <Login setLoggedIn={setLoggedIn} />
                </ProtectedRoutesLogin>} />
                <Route element={<ProtectedRoutes setLoggedIn={setLoggedIn} setUser={setUser}/>} >
                    <Route path="/home" element={<Home user={user}/>} />
                    <Route path="/elementos" element={<Elemento user={user} />} />
                    <Route path="/elementos/categorias" element={<Categoria user={user} />} />
                    <Route path="/elementos/empaques" element={<Empaques user={user} />} />
                    <Route path="/elementos/medidas" element={<Medidas user={user}/>} />
                    /*<Route path="/usuarios" element={<Usuario  userLogin={user}/>} />*/
                    <Route path="/reportes/solicitudusuario" element={<ReporteU />} />
                    <Route path="/reportes/prestamosactivos" element={<ReporteE />} />
                    <Route path="/reportes/stockmin" element={<ReporteB />} />
                    <Route path="/usuarios" element={<Usuarios  userLogin={user}/>} />
                    <Route path="/reportes/movimientos" element={<ReporteM />} />
                    <Route path="/bodegas" element={<Bodegas user={user} />} />
                    <Route path="/reportes" element={<Reporte />} />
                    <Route path="/bodegas/ubicacion" element={<Ubicaciones user={user}/>} />
                    <Route path="/movimientos" element={<Movimientos2 user={user}/>} />
                    <Route path="/movimientos/prestamos" element={<Prestamos user={user}/>} />
                </Route>
            </Routes>
        </div>

    );
}

export default App2;