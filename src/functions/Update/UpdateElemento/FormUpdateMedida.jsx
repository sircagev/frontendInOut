import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';


export const FormUpdateMedida = ({ onClose, category, Listar }) => {

  const [nombre, setNombre] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (category) {
      setNombre(category.name);
    }
  }, [category]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre.trim() || /\d/.test(nombre.trim())) {
      setErrorMessage('No debe estar vacío ni tener números.');
      return;
    } else {
      setErrorMessage('');
    }

    try {
      await axiosClient.put(`medida/actualizar/${category.codigo}`, {
        name: nombre,
      });
      swal({
        title: "Actualizado",
        text: "Medida actualizada con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000, 
    });
      onClose();
      Listar();
    } catch (error) {
      console.log(error)
      swal("Error", "Hubo un problema al actualizar la medida", "error");
    }
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center'></div>
            <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
              <Input
                type='text'
                label='Nombre Medida'
                className="w-[100%]"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2 ml-3">
                  <FaExclamationCircle className="" />
                  {errorMessage}
                </div>
              )}
            </div>
            <div className='flex justify-end gap-3 mb-3'>
              <ButtonCerrar onClose={onClose}/>
              <ButtonRegistrar/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}