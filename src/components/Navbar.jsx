import React, { useState, useEffect } from 'react';
import logo from '../assets/in.png'
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';



export const Navbar = ({ setLogIn }) => {
   const [userName, setUserName] = useState('');
   const [role, setRole] = useState('');

   const navigate = useNavigate();

   const handleLogout = () => {
      // Eliminar información del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');

      // Cambiar el estado de login y redirigir
      setLogIn(false);
      navigate('/login');
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
     
      <div className='w-full flex items-center justify-between h-[100px] bg-[#D9DADF text-white'>
         <div className='flex items-center gap-4'>
            <img src={logo} className='w-[80px] h-auto ml-10' alt="" />
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
            <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout}/>
         </div>
      </div>
   )
}
