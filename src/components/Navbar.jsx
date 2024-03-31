import React from 'react'
import logo from '../assets/logoInout.png'
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";


export const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between h-[100px] bg-[#D9DADF text-white'>
      <div className='flex items-center gap-4'>
        <img src={logo} className='w-[60px] h-auto ml-10' alt="" />
        <h1 className='text-black font-bold text-lg'>Inventario de bodegas</h1>
      </div>
      <div className='flex items-center gap-4 mr-10'>
        <div className='text-black flex items-center gap-2'>
            <FaUserCircle  className='text-[38px] cursor-pointer' />
            <h1 className='cursor-pointer font-bold text-[16px]'>Dorelia</h1>
        </div>
        <FaBell className='cursor-pointer text-black text-[25px]'/>
        <MdKeyboardArrowDown className='cursor-pointer text-black text-[30px] font-bold' />
      </div>
    </div>
  )
}
