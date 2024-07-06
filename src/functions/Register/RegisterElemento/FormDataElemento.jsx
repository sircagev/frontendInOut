import React, { useState, useEffect } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import * as listarFunciones from '../../Listar'; // Importa todas las funciones de listar.js
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';

export const FormDataElemento = ({ listar, onClose }) => {
  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);

  const [values, setValues] = useState({
    name: "",
    elementType_id: "",
    measurementUnit_id: "",
    category_id: "",
    packageType_id: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoData, categoriasData, empaquesData, medidasData] = await Promise.all([
          listarFunciones.ListarTipo(),
          listarFunciones.ListarCategorias(),
          listarFunciones.ListarEmpaques(),
          listarFunciones.ListarMedidas()
        ]);
        SetTipo(tipoData);
        setCategorias(categoriasData);
        SetEmpaques(empaquesData);
        SetMedidas(medidasData);
      } catch (error) {
        setErrorMessages(prevErrors => ({
          ...prevErrors,
          ubicacion: 'Error al cargar los datos. Inténtelo de nuevo.'
        }));
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === 'name' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

    setValues({
      ...values,
      [name]: formattedValue,
    });
  };

  const handleForm = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosClient.post('elemento/registrar', values);
      if (response.status === 200) {
        setValues({
          name: "",
          elementType_id: "",
          measurementUnit_id: "",
          category_id: "",
          packageType_id: ""
        });
        swal({
          title: "Registro exitoso",
          text: "El Elemento se ha registrado correctamente.",
          icon: "success",
          buttons: false,
          timer: 2000,
        });

        onClose();
        listar();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleForm}>
        <div className='flex flex-col justify-center items-center gap-3 mb-4'>
          <div className='w-auto flex gap-3 mb-2'>
            <div>
              <Input
                type='text'
                label='Nombre Elemento'
                name='name'
                value={values.name}
                onChange={handleInputChange}
                className="w-[310px]"
              />
            </div>
            <div>
              {<select
                name="elementType_id"
                required
                value={values.elementType_id}
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 pr-5 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="" disabled>Seleccione un tipo de elemento</option>
                {UseTipo.length > 0 ? (
                  UseTipo.map(tipo => (
                    <option
                      value={tipo.elementType_id}
                      key={tipo.name}
                    >
                      {tipo.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay tipos disponibles</option>
                )}
              </select>}
            </div>
          </div>
          <div className='w-auto flex gap-3 mb-2'>
            <div>
              <select
                name="measurementUnit_id"
                required
                value={values.measurementUnit_id}
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="" disabled>Seleccione un tipo de medida</option>
                {UseMedidas.length > 0 ? (
                  UseMedidas.map(medida => (
                    <option
                      value={medida.measurementUnit_id}
                      key={medida.name}
                    >
                      {medida.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay tipos de medida disponibles</option>
                )}
              </select>
            </div>
            <div>
              <select
                name='category_id'
                required
                value={values.category_id}
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="" disabled>Seleccione una categoría</option>
                {UseCategorias.length > 0 ? (
                  UseCategorias.map(categoria => (
                    <option
                      value={categoria.category_id}
                      key={categoria.name}
                    >
                      {categoria.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías disponibles</option>
                )}
              </select>
            </div>
          </div>
          <div className='w-auto flex gap-3 mb-2'>
            <div>
              <select
                name='packageType_id'
                required
                value={values.packageType_id}
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="" disabled>Seleccione un empaque</option>
                {UseEmpaques.length > 0 ? (
                  UseEmpaques.map(empaque => (
                    <option
                      value={empaque.packageType_id}
                      key={empaque.name}
                    >
                      {empaque.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay empaques disponibles</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className='w-full flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose} />
          <ButtonRegistrar />
        </div>
      </form>
    </div>
  );
};

export default FormDataElemento;



