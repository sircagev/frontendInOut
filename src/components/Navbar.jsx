import React from 'react'
import logo from '../assets/logoInout.png'
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ setLogIn }) => {

   const navigate = useNavigate();

   const handleLogout = () => {
      // Eliminar el token del localStorage
      localStorage.removeItem('token');

      setLogIn(false)
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
   };

   return (
      <div className='w-full flex items-center justify-between h-[100px] bg-[#D9DADF text-white'>
         <div className='flex items-center gap-4'>
            <img src={logo} className='w-[60px] h-auto ml-10' alt="" />
            <h1 className='text-black font-bold text-lg'>Inventario de bodegas</h1>
         </div>
         <div className='flex items-center gap-4 mr-10'>
            <div className='text-black flex items-center gap-2'>
               <FaUserCircle className='text-[38px] cursor-pointer' />
               <h1 className='cursor-pointer font-bold text-[16px]'>Dorelia</h1>
            </div>
            <FaBell className='cursor-pointer text-black text-[25px]' />
            <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout}/>
         </div>
      </div>
   )
}
