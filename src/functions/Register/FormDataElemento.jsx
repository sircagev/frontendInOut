import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import * as listarFunciones from '../Listar'; // Importa todas las funciones de listar.js

export const FormDataElemento = ({ onRegisterSuccess, onClose }) => {

  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseUbicacion, SetUbicacion] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [values, setValues] = useState({
    Nombre_elemento: "",
    fk_tipoElemento: "",
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
        setErrorMessage('Error al cargar los datos. Inténtelo de nuevo.');
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleForm = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/elemento/registrar', values);
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
        <div className='w-[100%] flex flex-col justify-center items-center gap-3 mb-3'>
          <Input
            type='text'
            label='Nombre Elemento'
            name='Nombre_elemento'
            value={values.Nombre_elemento}
            onChange={handleInputChange}
            className="w-[90%] h-12 "
          />
          <select name="fk_tipoElemento" required onChange={handleInputChange} label='Tipo' class="bg-[#F4F4F5] border border-gray-300 w-[90%] h-12 text-[#72727aff] pr-5 border-none text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          <select name="fk_unidadMedida" required onChange={handleInputChange} label='Tipo' class="bg-[#F4F4F5] border border-gray-300 w-[90%] h-12 text-gray-900 border-none text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          <select name='fk_categoria' required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[90%] h-12 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          <select name='fk_tipoEmpaque' required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[90%] h-12 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          <select name='fk_detalleUbicacion' required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[90%] h-12 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option disabled selected>Selecciones una Ubicación</option>
            {UseUbicacion.map(ubicacion => (
              <option
                value={ubicacion.codigo_Detalle}
                key={ubicacion.fk_detalleUbicacion}
              >
                {ubicacion.Nombre_ubicacion}
              </option>
            ))}
          </select>
        </div>
        <div className='w[90%] ml-[5%] mr-[5%] flex justify-end gap-3 mb-3'>
          <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
            Cancelar
          </Button>
          <Button className='font-bold text-white' color="success" type='submit'>
            Registrar
          </Button>
        </div>
      </form>
    </div>
  )
}
