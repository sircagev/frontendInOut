import React, { useState } from 'react';
import logo from './../assets/logo.jpg'
import { LiSideBar } from './moleculas/LiSideBar';
import { ImUsers } from "react-icons/im";
import { FaTools, FaPencilRuler } from "react-icons/fa";
import { IoIosArrowForward } from 'react-icons/io';
import { TbCategoryPlus } from "react-icons/tb";
import { FaBoxesPacking, FaArrowRightArrowLeft } from "react-icons/fa6";
import { AiOutlineFileText } from 'react-icons/ai';

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
      subitems: [
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
        }
      ]
    }
  ];

  return (
    <div>
      <span className={`fixed top-[70px] left-[42px] w-[32px] h-[32px] rounded-[50%] bg-yellow-500 shadow-[0_0_4px_rgb(0,0,0)_0_0_7px_rgb(250,250,250)] flex items-center justify-center cursor-pointer transition-all z-[2] ${state ? "translate-x-[162px] rotate-180" : ""}`} onClick={() => setState(!state)}> 
        <IoIosArrowForward />
      </span>
      <div className={`text-black bg-[#7AA612] fixed pt-[20px] z-[1] h-full delay-100 ease-in-out overflow-y-auto overflow-x-hidden ${state ? "w-[220px]" : "w-[65px]"}`}>
        <div className='flex justify-center items-center pb-[60px]'>
          <div className={`flex justify-center items-center w-[30px] cursor-pointer delay-300 ease-linear ${state ? "scale-75" : "scale-150"} rotate-[360deg]`}>
            <img className="w-full animation-flotar rounded-full" src={logo} />
          </div>
          <h2 className={`font-bold ${state ? "block" : "hidden"}`}>InOut</h2>
        </div>
        {LinksArray.map(({ icon, label, to, subitems }) => (
          <LiSideBar icon={icon} label={label} to={to} state={state} subitems={subitems} />
        ))
        }
      </div>
    </div>
  )
}
