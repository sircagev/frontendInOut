import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { Elemento } from "./view/Elemento"
import { Categorias } from "./view/Categorias"
import { Empaque } from "./view/Empaque"
import { Medida } from "./view/Medida"
import { Bodegas } from "./view/Bodegas"
import { Ubicacion } from "./view/Ubicacion" 
import { MenuHamburguer } from "./components/MenuHamburguer"
import Usuario from "./view/Usuario"



function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className={`grid grid-cols-[1fr] ${sidebarOpen ? "tablet:grid-cols-[220px_1fr]" : "tablet:grid-cols-[65px_1fr]"}`}>
      <section className="hidden tablet:initial">
        <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
      </section>
      <section className="flex flex-col w-full h-screen">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<div>Hola</div>} />
            <Route path="/elementos" element={<Elemento />} />
            <Route path="/elementos/categorias" element={<Categorias />} />
            <Route path="/elementos/empaques" element={<Empaque />} />
            <Route path="/elementos/medidas" element={<Medida />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/bodegas" element={<Bodegas />} />
            <Route path="/bodegas/ubicacion" element={<Ubicacion />} />
          </Routes>
        </div>
      </section>
    </main>
  )
}

export default App
