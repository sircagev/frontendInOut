import React, { useEffect, useState } from 'react';
import { ButtonGeneral } from '../components/Buttons/Button'
import Modal1 from '../components/Modal1'
import { FormDataReserva } from '../functions/Register/RegisterReserva/FormDataReserva';


export const Reservas = () => {

    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-[90%] ml-[5%] mr-[5%] mt-10'>
        <ButtonGeneral
            label={"Reservar"}
            color={"primary"}
            onClick={() => setIsOpen(true)}
        />
        <Modal1 
            title={"Reservar Elementos"}
            isOpen={isOpen}
            size={"base"}
            onClose={()=> setIsOpen(false)}
            form={<FormDataReserva onClose={()=> setIsOpen(false)}/>}
        />
    </div>
  )
}
