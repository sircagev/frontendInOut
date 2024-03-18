import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { Elemento } from "./view/Elemento"
import { Categorias } from "./view/Categorias"
import { Empaque } from "./view/Empaque"
import { Medida } from "./view/Medida"
import { MenuHamburguer } from "./components/MenuHamburguer"
import Usuario from "./view/Usuario"



function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <main className={`grid grid-cols-[1fr] ${sidebarOpen ? "tablet:grid-cols-[220px_1fr]" : "tablet:grid-cols-[65px_1fr]"}`}>
        <section className="hidden tablet:initial">
          <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
        </section>
        <section className="grid gridColumnI w-full tablet:gridColumnII">
        <Navbar />
          <Routes>
            <Route path='/' element='Hola'/>
            <Route path='/elementos' element={<Elemento />}/>
            <Route path='/usuarios' element={<Usuario />}/>
          </Routes>
        </section>
      </main>
    </>
  )
}

export default App
