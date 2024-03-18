import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosArrowUp } from "react-icons/io";

export const LiSideBar = ({ state, label, to, icon: Icono, subitems }) => {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!state) {
            setIsOpen(false);
        }
    }, [state]);

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={`m-[5px_0] transition-all relative ${state ? "p-[0_5%]" : "p-[4px]"}`} key={label}>
            <div className='flex items-center w-full'>
                <NavLink to={to} className={({ isActive }) => `flex items-center justify-between no-underline p-[calc(5px-2px)_0] h-[60px] w-full text-white  ${isActive ? "font-bold content-['']  bg-[#2B5716] rounded-lg left-0" : ""} `}>
                    <div className={`w-full flex items-center ${state ? "" : "justify-center"}`}>
                        <div className="p-[5px] flex w-[45px] justify-center"><Icono className="text-[25px]" /></div>
                        <span className={state ? "delay-300 ease-in-out opacity-100 flex" : "opacity-0 hidden"}>
                            {label}
                        </span>
                    </div>
                    <div className={`p-[2px] flex w-[40px] transition-all ${subitems && state ? "" : "hidden"} ${isOpen ? "rotate-[180deg] translate-x-[-10px]" : ""}`} onClick={subitems ? handleToggle : null}>
                        <IoIosArrowUp className="text-[18px]" />
                    </div>
                </NavLink>

            </div>
            {subitems && isOpen && state && (
                <div className=''>
                    {subitems.map(({ icon: Icono, label, to }) => (
                        <NavLink to={to} className={({ isActive }) => `flex items-center justify-end no-underline p-[calc(5px-2px)_0] h-[60px] w-full text-white ${isActive ? "font-bold content-['']  bg-[rgba(43,87,22,.5)] rounded-lg left-0" : ""} `}>
                            <div className="p-[2px] flex"><Icono className="text-[25px]" /></div>
                            <span className={state ? "delay-300 ease-in-out opacity-100 flex w-[70%] pl-[10px]" : "opacity-0 hidden"}>
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}
