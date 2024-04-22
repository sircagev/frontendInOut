import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export const DashboardTemplate = ({ setLoggedIn, children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <main className={`grid grid-cols-[1fr] ${sidebarOpen ? "tablet:grid-cols-[220px_1fr]" : "tablet:grid-cols-[65px_1fr]"}`}>
            <section className="hidden tablet:initial bg-gray-100">
                <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
            </section>
            <section className="flex flex-col w-full h-screen">
                <Navbar setLogIn={setLoggedIn} />
                <div className="flex-1 overflow-y-auto bg-gray-100">
                        <Outlet/>
                </div>
            </section>
        </main>
    )
}
