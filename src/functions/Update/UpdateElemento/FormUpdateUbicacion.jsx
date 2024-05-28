import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import swal from 'sweetalert';

export const FormUpdateUbicacion = ({ onClose, category, onRegisterSuccess }) => {

    const [nombre, setNombre] = useState('');
    const [nombreBodega, setNombreBodega] = useState('');
    const [bodegas, setBodegas] = useState([]);  // Estado para almacenar las bodegas

    useEffect(() => {
        if (category) {
          setNombre(category.nombre);
          setNombreBodega(category.fk_bodega);
        }
    }, [category]);

    useEffect(() => {
        // Obtener la lista de bodegas desde la API
        const fetchBodegas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/bodega/listar');
                setBodegas(response.data);  // Actualizar el estado con las bodegas obtenidas
            } catch (error) {
                console.error('Error fetching bodegas:', error);
            }
        };

        fetchBodegas();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:3000/ubicacion/actualizar/${category.codigo}`, {
            Nombre_ubicacion: nombre,
            fk_bodega: nombreBodega,  // Asegúrate de enviar el ID de la bodega y no el nombre
          });
          swal("Actualizado", "La ubicación ha sido actualizada con éxito", "success");
          onClose();
          onRegisterSuccess();
        } catch (error) {
          console.log(error);
          swal("Error", "Hubo un problema al actualizar la categoría", "error");
        }
    };

    return (
        <div>
            <div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className='flex justify-center items-center'></div>
                        <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                            <Input
                                type='text'
                                label='Nombre Ubicación'
                                className="w-[100%]"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                            <select
                                name="fk_bodega"
                                value={nombreBodega}
                                onChange={(e) => setNombreBodega(e.target.value)}
                                className="w-[100%] h-[55px] bg-[#e4e4e7] pl-3 rounded-[12px]"
                            >
                                <option value="">Selecciona una bodega</option>
                                {bodegas.map(bodega => (
                                    <option key={bodega.codigo_Bodega} value={bodega.codigo_Bodega}>
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
};



