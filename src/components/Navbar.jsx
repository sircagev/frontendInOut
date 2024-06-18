import React, { useState, useEffect } from 'react';
import logo from '../assets/in.png';
import { IoMdLogOut } from "react-icons/io";
import swal from 'sweetalert';
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosClient from "../components/config/axiosClient";

export const Navbar = ({ setLogIn }) => {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [elementosConBajoStock, setElementosConBajoStock] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseStock = await axiosClient.get("/reporte/stockminmodal");
        setElementosConBajoStock(responseStock.data);
        const responsePrestamos = await axiosClient.get("/reporte/prestamosactivosmodal");
        setPrestamosActivos(responsePrestamos.data);
      } catch (error) {
        console.error(
          "Error al obtener la información de los elementos con bajo Stock o préstamos activos:",
          error
        );
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60); 
     return () => clearInterval(intervalId); 
  }, []);

   const handleLogout = () => {
      swal({
         title: "¿Estás seguro?",
         text: "¿Estás seguro de que deseas cerrar la sesión?",
         icon: "warning",
         buttons: ["No", "Sí"],
         dangerMode: true,
      }).then((willLogout) => {
         if (willLogout) {
            // Eliminar información del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');

            // Cambiar el estado de login y redirigir
            setLogIn(false);
            navigate('/login');
         }
      });
   };

  const handleViewStockClick = () => {
    setShowModal(false);
    navigate("/reportes/stockmin");
  };

  const handleViewPrestamosClick = () => {
    setShowModal(false);
    navigate("/reportes/prestamosactivos");
  };

      if (storedRole) {
         setRole(storedRole);
      }
   }, []);

   return (
      <div className='w-full flex items-center justify-between h-[100px] bg-[#fff] text-white'>
         <div className='flex items-center gap-4'>
            <img src={logo} className='w-[80px] h-auto ml-10' alt="Logo" />
            <h1 className='text-black font-bold text-lg'>Inventario de bodegas</h1>
         </div>
         <div className='flex items-center gap-4 mr-10'>
            <div className='text-black flex items-center gap-2'>
               <FaUserCircle className='text-[38px] cursor-pointer' />
               <div className='flex flex-col gap-1 mt-3'>
                  <h1 className='cursor-pointer font-bold text-[16px]'>{userName}</h1>
                  <p className='flex text-xs'>{role}</p>
               </div>
            </div>
            <FaBell className='cursor-pointer text-black text-[25px]' />
            <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout} />
         </div>
      </div>
   );

};
