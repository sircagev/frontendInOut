import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ListarTipo, ListarMedidas, ListarCategorias, ListarEmpaques, Listarubicacion } from '../../Listar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateElemento = ({ onClose, category, Listar }) => {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [medida, setMedida] = useState('')
  const [categoria, setCategoria] = useState('')
  const [empaque, setEmpaque] = useState('')

  const [tipos, setTipos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empaques, SetEmpaques] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    tipo: '',
    medida: '',
    categoria: '',
    empaque: ''
  })

  useEffect(() => {
    if (category) {
      setNombre(category.name)
      setTipo(category.elementType_id)
      setMedida(category.measurementUnit_id)
      setCategoria(category.category_id)
      setEmpaque(category.packageType_id)
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposData, MedidasData, CategoriasData, EmpaquesData] = await Promise.all([
          ListarTipo(),
          ListarMedidas(),
          ListarCategorias(),
          ListarEmpaques()
        ]);

        setTipos(tiposData);
        setMedidas(MedidasData);
        setCategorias(CategoriasData);
        SetEmpaques(EmpaquesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || /\d/.test(nombre)) {
      let errorMessage = !nombre ? 'El nombre es requerido' : 'El nombre no debe contener números';
      setErrorMessages({ ...errorMessages, nombre: errorMessage });
      return;
    }

    if (!tipo) {
      setErrorMessages({ ...errorMessages, tipo: 'Debe seleccionar un tipo de elemento' });
      return;
    }

    try {
      await axiosClient.put(`elemento/actualizar/${category.codigo}`, {
        name: nombre,
        id_type: tipo,
        id_unit: medida,
        id_category: categoria,
        id_package: empaque
      });
      swal({
        title: "Actualizado",
        text: "Elemento actualizado con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      onClose();
      Listar(); // Actualiza la lista de elementos
    } catch (error) {
      console.log(error)
      swal("Error", "Hubo un problema al actualizar el elemento", "error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center items-center gap-3 mb-4'>
          <div className='w-full'>
            <Input
              type='text'
              label='Nombre Ubicación'
              className="w-[100%]"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errorMessages.nombre && (
              <div className="flex text-red-500 text-xs mt-1 ml-2 items-center">
                <FaExclamationCircle className="mr-2" />
                {errorMessages.nombre}
              </div>
            )}
          </div>
          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="" disabled>Seleccione un Tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.elementType_id} value={tipo.name}>
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




          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
          >
            <option value="" disabled>Seleccione una medida</option>
            {medidas.map((medida) => (
              <option key={medida.measurementUnit_id} value={medida.name}>
                {medida.name}
              </option>
            ))}
          </select>


          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="" disabled>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.category_id} value={categoria.name}>
                {categoria.name}
              </option>
            ))}
          </select>




          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={empaque}
            onChange={(e) => setEmpaque(e.target.value)}
          >
            <option value="" disabled>Seleccione un Emapaque</option>
            {empaques.map((empaque) => (
              <option key={empaque.packageType_id} value={empaque.name}>
                {empaque.name}
              </option>
            ))}
          </select>


        </div>
        <div className='flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose} />
          <ButtonRegistrar />
        </div>
      </form>
    </div>
  );
};
