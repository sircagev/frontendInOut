import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { ListarTipo, ListarMedidas, ListarCategorias, ListarEmpaques, Listarubicacion } from '../../Listar';

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
    try {
      await axiosClient.put(`elemento/actualizar/${category.codigo}`, {
        Nombre_elemento: nombre,
        fk_tipoElemento: tipo,
        fk_unidadMedida: medida,
        fk_categoria: categoria,
        fk_tipoEmpaque: empaque,
        fk_detalleUbicacion: ubicacion
      });
      swal("Actualizado", "El elemento ha sido actualizado con éxito", "success");
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
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <Input
            type='text'
            label='Nombre Ubicación'
            className="w-[100%]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <select
              className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
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
        </div>
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <select
              className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
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
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <select
              className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
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
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <select
              className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
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
        <div className="relative mb-3 justify-center items-center" data-twe-input-wrapper-init>
          <select
              className="w-[100%] h-[54px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
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
  );
};

