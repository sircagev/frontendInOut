import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateUbicacion = ({ onClose, category, onRegisterSuccess }) => {

  const [bodegas, setBodegas] = useState([]);
  const [nombre, setNombre] = useState('')
  const [nombreBodega, setNombreBodega] = useState('')

  const [errors, setErrors] = useState({
    nombre: '',
    nombreBodega: '',
  });

  const BodegasListar = async () => {
    try {
      const response = await axiosClient.get('bodega/listar');
      setBodegas(response.data);
    } catch (error) {
      console.error("Error fetching bodegas:", error);
      swal("Error", "Hubo un problema al cargar las bodegas", "error");
    }
  };

  useEffect(() => {
    if (category) {
      setNombre(category.name)
      setNombreBodega(category.warehouse_id)
    }
    BodegasListar();
  }, [category]);

  const validateForm = () => {
    let formErrors = {};
    if (!nombre.trim()) {
      formErrors.nombre = 'El nombre no debe estar vacío.';
    }
  
    if (!nombreBodega) {
      formErrors.nombreBodega = 'Debe seleccionar una bodega.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosClient.put(`ubicacion/actualizar/${category.codigo}`, {
        name: nombre,
        id_warehouse: nombreBodega,
      });
      swal({
        title: "Actualizado",
        text: "Ubicación actualizada con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000, 
      });
      onClose();
      onRegisterSuccess();
    } catch (error) {
      console.log(error);
      swal("Error", "Hubo un problema al actualizar la ubicación", "error");
    }
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center'></div>
            <div className="relative mb-2 justify-center items-center h-[70px]" data-twe-input-wrapper-init>
              <Input
                type='text'
                label='Nombre Ubicación'
                className="w-[100%]"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errors.nombre && (
                <div className="flex items-center text-red-500 text-xs mt-1 ml-3">
                  <FaExclamationCircle className="mr-1" />
                  {errors.nombre}
                </div>
              )}
            </div>
            <div className="relative mb-2 justify-center items-center h-[75px]" data-twe-input-wrapper-init>
              <select
                className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={nombreBodega}
                onChange={(e) => setNombreBodega(e.target.value)}
              >
                <option value="" disabled>Seleccione una bodega</option>
                {bodegas.map((bodega) => (
                  <option key={bodega.warehouse_id} value={bodega.warehouse_id}>
                    {bodega.name}
                  </option>
                ))}
              </select>
              {errors.nombreBodega && (
                <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                  <FaExclamationCircle className="mr-1" />
                  {errors.nombreBodega}
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
};
