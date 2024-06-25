import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ListarTipo, ListarMedidas, ListarCategorias, ListarEmpaques, Listarubicacion } from '../../Listar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateElemento = ({ onClose, category, onRegisterSuccess }) => {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [medida, setMedida] = useState('')
  const [categoria, setCategoria] = useState('')
  const [empaque, setEmpaque] = useState('')
  const [ubicacion, setUbicacion] = useState('')

  const [tipos, setTipos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empaques, SetEmpaques] = useState([]);
  const [ubicaciones, SetUbicaciones] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    ubicacion: '',
    tipo: '',
    medida: '',
    categoria: '',
    empaque: ''
  })

  useEffect(() => {
    if (category) {
      setNombre(category.nombre)
      setTipo(category.tipo)
      setMedida(category.medida)
      setCategoria(category.categoria)
      setEmpaque(category.empaque)
      setUbicacion(category.ubicacion)
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposData, MedidasData, CategoriasData, EmpaquesData, UbicacionesData] = await Promise.all([
          ListarTipo(),
          ListarMedidas(),
          ListarCategorias(),
          ListarEmpaques(),
          Listarubicacion()
        ]);

        setTipos(tiposData);
        setMedidas(MedidasData);
        setCategorias(CategoriasData);
        SetEmpaques(EmpaquesData);
        SetUbicaciones(UbicacionesData);
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
      setErrorMessages({...errorMessages, nombre: errorMessage });
      return;
    }

    if (!tipo) {
      setErrorMessages({...errorMessages, tipo: 'Debe seleccionar un tipo de elemento' });
      return;
    } 
    
    try {
      await axiosClient.put(`elemento/actualizar/${category.codigo}`, {
        Nombre_elemento: nombre,
        fk_tipoElemento: tipo,
        fk_unidadMedida: medida,
        fk_categoria: categoria,
        fk_tipoEmpaque: empaque,
        fk_detalleUbicacion: ubicacion,
        Vencimiento: vencimiento
      });
      swal({
        title: "Actualizado",
        text: "Elemento actualizado con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      onClose();
      onRegisterSuccess();
    } catch (error) {
      console.log(error)
      swal("Error", "Hubo un problema al actualizar el elemento", "error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center items-center gap-3 mb-4'>
          <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
            <div>
              <Input
                type='text'
                label='Nombre Ubicación'
                className="w-[310px]"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errorMessages.nombre && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <FaExclamationCircle className="mr-2" />
                  {errorMessages.nombre}
                </div>
              )}
            </div>
            <div>
              <select
                className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled>Seleccione un Tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.codigo_Tipo} value={tipo.nombre_tipoElemento}>
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
          <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
            <div>
              <select
                className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={medida}
                onChange={(e) => setMedida(e.target.value)}
              >
                <option value="" disabled>Seleccione una medida</option>
                {medidas.map((medida) => (
                  <option key={medida.codigo_medida} value={medida.Nombre_Medida}>
                    {medida.Nombre_Medida}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="" disabled>Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.codigo_Categoria} value={categoria.Nombre_Categoria}>
                    {categoria.Nombre_Categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
            <div>
              <select
                className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={empaque}
                onChange={(e) => setEmpaque(e.target.value)}
              >
                <option value="" disabled>Seleccione un Emapaque</option>
                {empaques.map((empaque) => (
                  <option key={empaque.codigo_Empaque} value={empaque.Nombre_Empaque}>
                    {empaque.Nombre_Empaque}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              >
                <option value="" disabled>Seleccione una ubicación</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.codigo_Detalle} value={ubicacion.Nombre_ubicacion}>
                    {ubicacion.Nombre_ubicacion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose}/>
          <ButtonRegistrar/>
        </div>
      </form>
    </div>
  );
};

