import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

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
                <NavLink to={to} className={({ isActive }) => `flex items-center justify-between no-underline p-[calc(5px-2px)_0] h-[60px] w-full ${isActive ? "font-bold text-black content-['']  bg-yellow-400 rounded-lg left-0" : "text-white "} `}>
                    <div className={`w-full flex items-center ${state ? "" : "justify-center"}`}>
                        <div className="p-[2px] flex"><Icono className="text-[25px]" /></div>
                        <span className={state ? "delay-300 ease-in-out opacity-100 flex" : "opacity-0 hidden"}>
                            {label}

                        </span>
                    </div>
                    <div className={`p-[2px] flex ${subitems && state ? "" : "hidden"}`} onClick={subitems ? handleToggle : null}>
                        <Icono className="text-[25px]" />
                    </div>
                </NavLink>

            </div>
            {subitems && isOpen && state && (
                <div className=''>
                    {subitems.map(({ icon: Icono, label, to }) => (
                        <NavLink to={to} className={({ isActive }) => `flex items-center justify-center no-underline p-[calc(5px-2px)_0] h-[60px] w-full ${isActive ? "font-bold text-black content-['']  bg-white rounded-lg left-0" : "text-white "} `}>
                            <div className="p-[2px] flex"><Icono className="text-[25px]" /></div>
                            <span className={state ? "delay-300 ease-in-out opacity-100 flex" : "opacity-0 hidden"}>
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}
