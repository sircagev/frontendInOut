import React, { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import logo from './../assets/logo.png'
import { LiSideBar } from './moleculas/LiSideBar';
import { Accordion, AccordionItem } from '@nextui-org/react'

export const Sidebar = ({ state, setState }) => {

  const LinksArray = [
    {
      icon: <IoIosArrowForward />,
      label: "Usuarios",
      to: "/usuarios"
    },
    {
      icon: <IoIosArrowForward />,
      label: "Elementos",
      to: "/elementos",
      subitems: [
        {
          icon: <IoIosArrowForward />,
          label: "Elementos",
          to: "/elementos",
        }
      ]
    }
  ];

  return (
    <div>
      <span className={`fixed top-[70px] left-[42px] w-[32px] h-[32px] rounded-[50%] bg-yellow-500 shadow-[0_0_4px_rgb(0,0,0)_0_0_7px_rgb(250,250,250)] flex items-center justify-center cursor-pointer transition-all z-[2] ${state ? "translate-x-[162px] rotate-180" : ""}`} onClick={() => setState(!state)}>
        <IoIosArrowForward />
      </span>
      <div className={`text-white bg-red-500 fixed pt-[20px] z-[1] h-full delay-100 ease-in-out overflow-y-auto overflow-x-hidden ${state ? "w-[220px]" : "w-[65px]"}`}>
        <div className='flex justify-center items-center pb-[60px]'>
          <div className={`flex justify-center items-center w-[30px] cursor-pointer delay-300 ease-linear ${state ? "scale-75" : "scale-150"} rotate-[360deg]`}>
            <img className="w-full animation-flotar" src={logo} />
          </div>
          <h2 className={`font-bold ${state ? "block" : "hidden"}`}>InOut</h2>
        </div>
            {LinksArray.map(({ icon, label, to }) => (
              <LiSideBar icon={icon} label={label} to={to} state={state}/> 
            ))
            }
      </div>
    </div>
  )
}
