import React, { useState } from 'react';
import { ButtonGeneral } from '../components/Buttons/Button';
import Modal1 from '../components/Modal1';
import { FormDataReserva } from '../functions/Register/RegisterReserva/FormDataReserva';
import { ButtonCerrar } from '../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../components/Buttons/ButtonRegistrar';
import { Input, Textarea } from '@nextui-org/react';
import NextUITable from "../components/NextUITable";

export const Reservas = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-96 mt-32 px-4'>
      <div className='min-w-[330px] lg:w-[300px] bg-white rounded-xl p-4'>
        <form action="" className='flex flex-col gap-4 mb-1'>
          <h1 className='text-xl font-bold'>Reservar Elementos</h1>
          <Input type="text" label="Elemento" fullWidth />
          <Input type="number" label="Cantidad" fullWidth />
          <Textarea
            label="Descripción"
            placeholder="Enter your description"
            className="max-w-xs mb-2"
            fullWidth
          />
          <div className='w-full flex justify-end gap-3 mb-3'>
            <ButtonRegistrar label={"Reservar"} />
          </div>
        </form>
      </div>
      <div className='w-full lg:w-auto'>
        Hola
      </div>
    </div>
  )
}
