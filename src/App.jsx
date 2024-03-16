import React from "react"
import { Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { Elemento } from "./view/Elemento"

function App() {
  

  return (
    <>
      
        <div className='w-full flex'>
          <Sidebar/>
          <div className='w-full'>
            <Navbar/>
            <div className='w-full'>
              <Routes>
                <Route path='/' element={<Elemento/>}></Route>
              </Routes>
            </div>
          </div>
        </div>
    </>
  )
}

export default App
