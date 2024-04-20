   import React, { useState, useEffect } from 'react';
   import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
   import { Sidebar } from "./components/Sidebar";
   import { Navbar } from "./components/Navbar";
   import { Elementos } from "./view/Elementos";
   import { Categorias } from "./view/Categorias";
   import { Categoria } from "./view/Categoria";
   import { Empaque } from "./view/Empaque";
   import { Empaques } from "./view/Empaques";
   import { Medida } from "./view/Medida";
   import { Ubicacion } from "./view/Ubicacion";
   import { MenuHamburguer } from "./components/MenuHamburguer";
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

   function App() {
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [loggedIn, setLoggedIn] = useState(false);

      const navigate = useNavigate();


useEffect(() => {
         // Verificar si hay un token en el localStorage al cargar la aplicación
         const token = localStorage.getItem('token');
         if (token) {
            // Si hay un token, el usuario está autenticado
            setLoggedIn(true);
            navigate('/')
         }
      }, []);

      return (
         <Routes>
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />

            <Route
               path="/*"
               element={
                  loggedIn ? (
                     <main className={`grid grid-cols-[1fr] ${sidebarOpen ? "tablet:grid-cols-[220px_1fr]" : "tablet:grid-cols-[65px_1fr]"}`}>
                        <section className="hidden tablet:initial bg-gray-100">
                           <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
                        </section>
                        <section className="flex flex-col w-full h-screen">
                           <Navbar setLogIn={setLoggedIn} />
                           <div className="flex-1 overflow-y-auto bg-gray-100">
                              <Routes>
                                 <Route path="/" element={<div>Hola</div>} />
                                 <Route path="/elementos" element={<Elementos />} />
                                 <Route path="/elementos/categorias" element={<Categoria />} />
                                 <Route path="/elementos/empaques" element={<Empaques />} />
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
                              </Routes>
                           </div>
                        </section>
                     </main>
                  ) : (
                     <Navigate to="/login" />
                  )
               }
            />
         </Routes>
      );
   }

   export default App;