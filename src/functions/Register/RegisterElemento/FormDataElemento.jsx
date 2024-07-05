import React, { useState, useEffect } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import * as listarFunciones from '../../Listar'; // Importa todas las funciones de listar.js
import { ButtonGeneral } from '../../../components/Buttons/Button';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';

export const FormDataElemento = ({ listar, onClose }) => {
  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    ubicacion: '',
    tipo: '',
    medida: '',
    categoria: '',
    empaque: '',
  });

  const [values, setValues] = useState({
    name: "",
    elementType_id: "",
    measurementUnit_id: "",
    category_id: "",
    packageType_id: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === 'name' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

    setValues({
      ...values,
      [name]: formattedValue,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utiliza las funciones de listar para obtener los datos necesarios
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
        setErrorMessages(prevErrors => ({ ...prevErrors, ubicacion: 'Error al cargar los datos. Inténtelo de nuevo.' }));
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleForm = async (event) => {
    event.preventDefault();

    let hasError = false;
    let newErrorMessages = {
      elemento: '',
      ubicacion: '',
      tipo: '',
      medida: '',
      categoria: '',
      empaque: ''
    };

    if (!values.name.trim() || /\d/.test(values.name)) {
      if (!values.name.trim()) {
        newErrorMessages.elemento = 'El nombre del elemento no puede estar vacío.';
      } else {
        newErrorMessages.elemento = 'El nombre de la ubicación no puede contener números.';
      }
      hasError = true;
    }

    if (!values.elementType_id) {
      newErrorMessages.tipo = 'Debe seleccionar un tipo de elemento.';
      hasError = true;
    }

    if (!values.measurementUnit_id) {
      newErrorMessages.medida = 'Debe seleccionar una unidad de medida.';
      hasError = true;
    }

    if (!values.category_id) {
      newErrorMessages.categoria = 'Debe seleccionar una categoría.';
      hasError = true;
    }

    if (!values.packageType_id) {
      newErrorMessages.empaque = 'Debe seleccionar un tipo de empaque.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (hasError) return;

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
              {errorMessages.elemento && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.elemento}
                </div>
              )}
            </div>
            <div>
              <select
                name="elementType_id"
                requiredvalue
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 pr-5 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="" selected disabled>Seleccione un tipo de elemento</option>
                {UseTipo.map(tipo => (
                  <option
                    value={tipo.elementType_id}
                    key={tipo.name}
                  >
                    {tipo.name}
                  </option>
                ))}
              </select>
              {errorMessages.tipo && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.tipo}
                </div>
              )}
            </div>
          </div>
          <div className='w-auto flex gap-3 mb-2'>
            <div>
              <select
                name="measurementUnit_id"
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option selected disabled>Seleccione un tipo de medida</option>
                {UseMedidas.map(medida => (
                  <option
                    value={medida.measurementUnit_id}
                    key={medida.name}
                  >
                    {medida.name}
                  </option>
                ))}
              </select>
              {errorMessages.medida && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.medida}
                </div>
              )}
            </div>
            <div>
              <select
                name='category_id'
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option disabled selected>Seleccione una categoría</option>
                {UseCategorias.map(categoria => (
                  <option
                    value={categoria.category_id}
                    key={categoria.name}
                  >
                    {categoria.name}
                  </option>
                ))}
              </select>
              {errorMessages.categoria && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.categoria}
                </div>
              )}
            </div>
          </div>
          <div className='w-auto flex gap-3 mb-2'>
            <div>
              <select
                name='packageType_id'
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option disabled selected>Seleccione un empaque</option>
                {UseEmpaques.map(empaque => (
                  <option
                    value={empaque.packageType_id}
                    key={empaque.name}
                  >
                    {empaque.name}
                  </option>
                ))}
              </select>
              {errorMessages.empaque && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.empaque}
                </div>
              )}
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
}


