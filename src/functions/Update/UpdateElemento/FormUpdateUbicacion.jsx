import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormUpdateUbicacion = ({ onClose, category, onRegisterSuccess }) => {
  const [bodegas, setBodegas] = useState([]);
  const [values, setValues] = useState({
    nombre: '',
    nombreBodega: '',
  });
  const [errors, setErrors] = useState({
    nombre: '',
    nombreBodega: '',
  });

  useEffect(() => {
    if (category) {
      setValues({
        nombre: category.nombre,
        nombreBodega: category.nombreBodega,
      });
    }
  }, [category]);

  useEffect(() => {
    BodegasListar();
  }, []);

  const BodegasListar = async () => {
    try {
      const response = await axiosCliente.get('bodega/listar');
      setBodegas(response.data);
    } catch (error) {
      console.error("Error fetching bodegas:", error);
      swal("Error", "Hubo un problema al cargar las bodegas", "error");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!values.nombre.trim() || /\d/.test(values.nombre.trim())) {
      formErrors.nombre = 'El nombre no debe estar vacío ni tener números.';
    }

    if (!values.nombreBodega.trim()) {
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
        Nombre_ubicacion: values.nombre,
        fk_bodega: values.nombreBodega,
      });
      swal("Actualizado", "La bodega ha sido actualizada con éxito", "success");
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
                name='nombre'
                className="w-[100%]"
                value={values.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && (
                <div className="flex items-center text-red-500 text-xs mt-1 ml-3">
                  <FaExclamationCircle className="mr-1" />
                  {errors.nombre}
                </div>
              )}
            </div>
            <div className="relative mb-2 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
              <select
                className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                name='nombreBodega'
                value={values.nombreBodega}
                onChange={handleInputChange}
              >
                <option value="" disabled>Seleccione una bodega</option>
                {bodegas.map((bodega) => (
                  <option key={bodega.codigo_Bodega} value={bodega.Nombre_bodega}>
                    {bodega.Nombre_bodega}
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





