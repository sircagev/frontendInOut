import React, { useState } from 'react';
import logo from './../assets/sena.png'
import { LiSideBar } from './moleculas/LiSideBar';
import { ImUsers } from "react-icons/im";
import { FaTools, FaPencilRuler } from "react-icons/fa";
import { IoIosArrowForward } from 'react-icons/io';
import { TbCategoryPlus } from "react-icons/tb";
import { FaBoxesPacking, FaArrowRightArrowLeft } from "react-icons/fa6";
import { AiOutlineFileText } from 'react-icons/ai';
import { IoLogOutSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ state, setState }) => {


  const LinksArray = [
    {
      icon: ImUsers,
      label: "Usuarios",
      to: "/usuarios"
    },
    {
      icon: FaTools,
      label: "Elementos",
      to: "/elementos",
      subitems: [
        {
          icon: TbCategoryPlus,
          label: "Categorías",
          to: "/elementos/categorias",
        },
        {
          icon: FaBoxesPacking,
          label: "Empaques",
          to: "/elementos/empaques",
        },
        {
          icon: FaPencilRuler,
          label: "Medidas",
          to: "/elementos/medidas",
        }
      ]
    },
    {
      icon: FaArrowRightArrowLeft,
      label: "Movimientos",
      to: "/movimientos"
    },
    {
      icon: AiOutlineFileText,
      label: "Reportes",
      to: "/reportes",
     /* subitems: [
        {
          icon: ImUsers,
          label: "Usuarios",
          to: "/reportes/usuarios",
        },
        {
          icon: FaArrowRightArrowLeft,
          label: "Movimientos",
          to: "/reportes/movimientos",
        },
        {
          icon: FaTools,
          label: "Elementos",
          to: "/reportes/elementos",
        },
        {
          icon: FaBoxesPacking,
          label: "Bodegas",
          to: "/reportes/bodegas",
        },
      ]*/
    },
    {
      icon: AiOutlineFileText,
      label: "Bodegas",
      to: "/bodegas",
      subitems: [
        {
          icon: ImUsers,
          label: "Ubicacion",
          to: "/bodegas/Ubicacion",
        },
      ]
    },
  ];


  return (
    <div>
      <span className={`fixed top-[70px] left-[42px] w-[32px] h-[32px] rounded-[50%] bg-[#000] shadow-[0_0_4px_rgb(0,0,0)_0_0_7px_rgb(250,250,250)] flex items-center justify-center cursor-pointer transition-all z-[2] ${state ? "translate-x-[162px] rotate-180" : ""}`} onClick={() => setState(!state)}> 
        <IoIosArrowForward className='text-white' />
      </span>
      <div className={`text-black bg-[#00670c] fixed pt-[20px] z-[1] h-full delay-100 ease-in-out overflow-y-auto overflow-x-hidden transition-all duration-700 ${state ? "w-[220px]" : "w-[65px]"}`}>
        <div className='flex justify-center items-center pb-[60px]'>
          <div className={`flex justify-center items-center w-[30px] cursor-pointer delay-300 ease-linear ${state ? "scale-150" : "scale-150"} rotate-[360deg]`}>
            <img className="w-[150px] h-auto animation-flotar rounded-full" src={logo} />
          </div>
        </div>
        {LinksArray.map(({ icon, label, to, subitems, onClick }, index) => (
          <LiSideBar icon={icon} label={label} to={to} state={state} subitems={subitems} onClick={onClick} llave={index}/>
        ))}
      </div>
    </div>
  )
}
