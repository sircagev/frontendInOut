import React, { useState, useEffect } from 'react'
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import * as listarFunciones from '../../Listar'; // Importa todas las funciones de listar.js
import { ButtonGeneral } from '../../../components/Buttons/Button';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';


export const FormDataElemento = ({ onRegisterSuccess, onClose }) => {

  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseUbicacion, SetUbicacion] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    ubicacion: '',
    tipo: '',
    medida: '',
    categoria: '',
    empaque: ''
  });

  const [values, setValues] = useState({
    Nombre_elemento: "",
    fk_tipoElemento: "",
    stock: 0,
    fk_unidadMedida: "",
    fk_categoria: "",
    fk_tipoEmpaque: "",
    fk_detalleUbicacion: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setValues({
      ...values,
      [name]: formattedValue,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utiliza las funciones de listar para obtener los datos necesarios
        const [tipoData, categoriasData, ubicacionData, empaquesData, medidasData] = await Promise.all([
          listarFunciones.ListarTipo(),
          listarFunciones.ListarCategorias(),
          listarFunciones.ListarUbicacionesYBodegas(), // Esta función fue modificada para incluir el nombre de la bodega
          listarFunciones.ListarEmpaques(),
          listarFunciones.ListarMedidas()
        ]);
        SetTipo(tipoData);
        setCategorias(categoriasData);
        SetUbicacion(ubicacionData);
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
      ubicacion: '',
      tipo: '',
      medida: '',
      categoria: '',
      empaque: ''
    };

    if (!values.Nombre_elemento.trim() || /\d/.test(values.Nombre_elemento)) {
      if (!values.Nombre_elemento.trim()) {
        newErrorMessages.elemento = 'El nombre del elemento no puede estar vacío.';
      } else {
        newErrorMessages.elemento = 'El nombre de la ubicación no puede contener números.';
      }
      hasError = true;
    }

    if (!values.fk_tipoElemento) {
      newErrorMessages.tipo = 'Debe seleccionar un tipo de elemento.';
      hasError = true;
    }

    if (!values.fk_unidadMedida) {
      newErrorMessages.medida = 'Debe seleccionar una unidad de medida.';
      hasError = true;
    }

    if (!values.fk_categoria) {
      newErrorMessages.categoria = 'Debe seleccionar una categoría.';
      hasError = true;
    }

    if (!values.fk_tipoEmpaque) {
      newErrorMessages.empaque = 'Debe seleccionar un tipo de empaque.';
      hasError = true;
    }

    if (!values.fk_detalleUbicacion) {
      newErrorMessages.ubicacion = 'Debe seleccionar una ubicación.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (hasError) return;

    try {
      const response = await axiosClient.post('elemento/registrar', values);
      if (response.status === 200) {

        setValues({
          Nombre_elemento: "",
          fk_tipoElemento: "",
          fk_unidadMedida: "",
          fk_categoria: "",
          fk_tipoEmpaque: "",
          fk_detalleUbicacion: ""
        });
        swal({
          title: "Registro exitoso",
          text: "El Elemento se ha registrado correctamente.",
          icon: "success",
          buttons: false,
          timer: 2000,
        });

        onClose();
        onRegisterSuccess();
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
                name='Nombre_elemento'
                value={values.Nombre_elemento}
                onChange={handleInputChange}
                className="w-[310px]"
              />
              {errorMessages.ubicacion && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.elemento}
                </div>
              )}
            </div>
            <div>
              <select
                name="fk_tipoElemento"
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 pr-5 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option selected disabled>Seleccione un tipo de elemento</option>
                {UseTipo.map(tipo => (
                  <option
                    value={tipo.codigo_Tipo}
                    key={tipo.fk_tipoElemento}
                  >
                    {tipo.nombre_tipoElemento}
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
                name="fk_unidadMedida"
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option selected disabled>Seleccione un tipo de medida</option>
                {UseMedidas.map(medida => (
                  <option
                    value={medida.codigo_medida}
                    key={medida.fk_unidadMedida}
                  >
                    {medida.Nombre_Medida}
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
                name='fk_categoria'
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option disabled selected>Seleccione una categoría</option>
                {UseCategorias.map(categoria => (
                  <option
                    value={categoria.codigo_Categoria}
                    key={categoria.fk_categoria}
                  >
                    {categoria.Nombre_Categoria}
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
                name='fk_tipoEmpaque'
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option disabled selected>Seleccione un empaque</option>
                {UseEmpaques.map(empaque => (
                  <option
                    value={empaque.codigo_Empaque}
                    key={empaque.fk_tipoEmpaque}
                  >
                    {empaque.Nombre_Empaque}
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
            <div>
              <select
                name='fk_detalleUbicacion'
                required
                onChange={handleInputChange}
                className="bg-[#F4F4F5] border border-gray-300 w-[310px] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option disabled selected>Seleccione una Ubicación</option>
                {UseUbicacion.map(ubicacion => (
                  <option
                    value={ubicacion.codigo_Detalle}
                    key={ubicacion.fk_detalleUbicacion}
                  >
                    {ubicacion.Nombre_ubicacion}
                  </option>
                ))}
              </select>
              {errorMessages.ubicacion && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.ubicacion}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='w-full flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose}/>
          <ButtonRegistrar/>
        </div>
      </form>
    </div>
  )
}

