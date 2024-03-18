import React from "react"
import { Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { Elemento } from "./view/Elemento"
import { Categorias } from "./view/Categorias"
import { Empaque } from "./view/Empaque"
import { Medida } from "./view/Medida"

function App() {
  

  return (
    <>
      
        <div className='w-full flex bg-[#F4F4F5]'>
          <Sidebar/>
          <div className='w-full'>
            <Navbar/>
            <div className='w-full'>
              <Routes>
                <Route path='/' element={<Elemento/>}></Route>
                <Route path='/categorias' element={<Categorias/>}></Route>
                <Route path='/empaque' element={<Empaque/>}></Route>
                <Route path='/medida' element={<Medida/>}></Route>
              </Routes>
            </div>
          </div>
        </div>
    </>
  )
}

export default App
