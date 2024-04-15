import React from 'react'
import { TableElementos } from '../components/tables/Elemento/TableElementos';

export const Elementos = () => {
  return (
    <div className='w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto'>
      <TableElementos />
    </div>
  )
}
