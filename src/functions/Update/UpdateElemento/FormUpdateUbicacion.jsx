import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import { Listarbodegas } from '../../Listar';
import swal from 'sweetalert';


export const FormUpdateUbicacion = ({ onClose, category, onRegisterSuccess }) => {
    const [nombre, setNombre] = useState('')
    const [nombreBodega, setNombreBodega] = useState('')
    const [bodegas, setBodegas] = useState([])

    useEffect(() => {
        if (category) {
          setNombre(category.nombre);
          setNombreBodega(category.nombreBodega);
        }
      }, [category]);

      useEffect(() => {
        BodegasListar();
      }, []);

      const BodegasListar = async () => {
        try {
          const response = await axios.get('http://localhost:3000/bodega/listar');
          setBodegas(response.data);
        } catch (error) {
          console.error("Error fetching bodegas:", error);
          swal("Error", "Hubo un problema al cargar las bodegas", "error");
        }
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:3000/ubicacion/actualizar/${category.codigo}`, {
            Nombre_ubicacion: nombre,
            fk_bodega: nombreBodega
          });
          swal("Actualizado", "El Empaque ha sido actualizado con éxito", "success");
          onClose();
          onRegisterSuccess();
        } catch (error) {
          console.log(error)
          swal("Error", "Hubo un problema el empaque", "error");
        }
      };

      return (
        <div>
          <div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className='flex justify-center items-center'></div>
                <div className="relative mb-2 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                <Input
                    type='text'
                    label='Nombre Ubicación'
                    className="w-[100%]"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="relative mb-2 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                <select
              className="w-[100%] h-[51px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
              value={nombreBodega}
              onChange={(e) => setNombreBodega(e.target.value)}
            >
              <option value="" disabled>Seleccione una bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega.codigo_Bodega} value={bodega.Nombre_bodega}>
                  {bodega.Nombre_bodega}
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
          </div>
        </div>
      );
}




