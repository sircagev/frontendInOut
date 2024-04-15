import React from 'react'
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table'


export const Categoria = () => {
    
  return (
    <div className='w-90% flex flex-col justify-center items-center mt-[70px]'>
      <TableGeneral endpoint="http://localhost:3000/categoria/listar"/>
    </div>
  )
}