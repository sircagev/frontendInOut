import React from 'react'
import { Tables } from '../components/Table'
import { Modals } from '../components/Modals'


export const Elemento = () => {
  
  return (
    <div className='w-90% flex flex-col justify-center items-center gap-5  overflow-auto'>
      <div className='mt-[50px]'>
        <div>
          <Modals/>
        </div>
        <Tables/>
        </div>
    </div>
 )
}
