import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Sidebars = () => {
    const [isHover, setHover] = useState(false)


    return (
        <div className={`flex flex-col items-center h-full overflow-hidden text-gray-400 bg-gray-900 rounded-s transition-all ${isHover ? 'w-44 duration-700 ' : ' w-16 duration-500'}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <a className={`flex items-center ${isHover ? 'w-full px-3' : 'justify-center'} mt-3 h-12`} href="#">
                <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                {isHover && <span className="ml-2 text-sm font-bold">SENA</span>}
            </a>
            <div className={`w-full ${isHover && 'px-2'}`}>
                <div className={`flex flex-col items-center mt-3 border-t border-gray-700 ${isHover && 'w-full'}`}>
                    <Link to="/usuarios" className={`flex items-center ${isHover ? 'w-full px-3' : 'justify-center w-12'} h-12 mt-2 hover:bg-gray-700 hover:text-gray-300 rounded`} href="#">
                        <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {isHover && <span className="ml-2 text-sm font-medium">Usuarios</span>}
                    </Link>
                    <Link to="/elementos" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                        <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        {isHover && <span className="ml-2 text-sm font-medium">Elementos</span>}
                    </Link>
                </div>
                <div className={`flex flex-col items-center mt-3 border-t border-gray-700 ${isHover && 'w-full'}`}>
                    <Link to="/movimientos" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                        <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {isHover && <span className="ml-2 text-sm font-medium">Movimientos</span>}
                    </Link>
                    <Link to="/reportes" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                        <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        {isHover && <span className="ml-2 text-sm font-medium">Reportes</span>}
                    </Link>
                    <Link to="/bodegas" className={`relative flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                        <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {isHover && <span className="ml-2 text-sm font-medium">Bodegas</span>}

                    </Link>
                </div>
            </div>
        </div>

    )
}

export default Sidebars;
