import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import swal from 'sweetalert';

export const FormUpdateCategoria = ({ onClose, category, onRegisterSuccess }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (category) {
      setNombre(category.nombre);
    }
  }, [category]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/categoria/actualizar/${category.codigo}`, {
        Nombre_Categoria: nombre,
      });
      swal("Actualizado", "La categoría ha sido actualizada con éxito", "success");
      onClose();
      onRegisterSuccess();
    } catch (error) {
      console.log(error)
      swal("Error", "Hubo un problema al actualizar la categoría", "error");
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
                label='Nombre Categoría'
                className="w-[100%]"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-3 mb-3'>
              <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                Cancelar
              </Button>
              <Button className='font-bold text-white' color="success" type='submit'>
                Actualizar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

