import React from 'react'
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table'
import { ListarEmpaques } from '../functions/Listar'
import { columnsEmpaques } from '../functions/columnsData'

export const Empaques = () => {
    
  return (
    <div className='w-90% flex flex-col justify-center items-center mt-[80px]'>
      <TableGeneral funcionListar={ListarEmpaques} columns={columnsEmpaques} title={"Lista de Empaques"}/>
    </div>
  )
}