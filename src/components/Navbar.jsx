import React, { useState, useEffect } from 'react';
import logo from '../assets/in.png';
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export const Navbar = ({ setLogIn }) => {
   const [userName, setUserName] = useState('');
   const [role, setRole] = useState('');
   const [isSubMenuVisible, setSubMenuVisible] = useState(false);

   const navigate = useNavigate();
 

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

   const toggleSubMenu = () => {
      setSubMenuVisible(!isSubMenuVisible);
   };

   useEffect(() => {
      // Obtener información del localStorage al montar el componente
      const storedUserName = localStorage.getItem('userName');
      const storedRole = localStorage.getItem('role');

      if (storedUserName) {
         setUserName(storedUserName);
      }

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
            <div className='text-black flex items-center gap-2 relative'>
               <FaUserCircle className='text-[38px] cursor-pointer' onClick={toggleSubMenu} />
               <div className='flex flex-col gap-1 mt-3'>
                  <h1 className='cursor-pointer font-bold text-[16px]'>{userName}</h1>
                  <p className='flex text-xs'>{role}</p>
               </div>

               {isSubMenuVisible && (
                   <div className='absolute top-[55px] right-4 bg-white shadow-md rounded-md p-2'>
                   <button 
            className='text-black hover:text-blue-500 text-sm font-medium focus:outline-none'
            onClick={() => console.log('Actualizar perfil')}
                >
            Editar perfil
         </button>
      </div>
   )}
               
            </div>
            <FaBell className='cursor-pointer text-black text-[25px]' />
            <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout} />
         </div>
      </div>
   );
};
