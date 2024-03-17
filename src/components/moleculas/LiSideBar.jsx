import React from 'react'
import { NavLink } from 'react-router-dom'

export const LiSideBar = ({ state, label, to, icon }) => {
    return (
        <div className={`m-[5px_0] transition-all relative ${state ? "p-[0_5%]" : "p-[4px]"}`} key={label}>
            <NavLink to={to} className={ ({ isActive }) =>`flex items-center no-underline p-[calc(5px-2px)_0] h-[60px] ${isActive ? "font-bold text-black content-[''] h-full bg-yellow-400 rounded-lg left-0" : "text-white"} `}>
                <div className="p-[2px] flex">{icon}</div>
                <span className={state ? "delay-300 ease-in-out opacity-100" : "opacity-0"}>
                    {label}
                </span>
            </NavLink>
        </div>
    )
}
