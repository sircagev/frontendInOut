import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormUpdateBodega = ({ onClose, category, onRegisterSuccess }) => {
    const [errorMessages, setErrorMessages] = useState({
        Nombre_bodega: '',
        ubicacion: '',
    });

    const [values, setValues] = useState({
        Nombre_bodega: '',
        ubicacion: '',
    });

    useEffect(() => {
        if (category) {
            setValues({
                Nombre_bodega: category.nombre,
                ubicacion: category.ubicacion,
            });
        }
    }, [category]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = false;
        let newErrorMessages = {
            Nombre_bodega: '',
            ubicacion: '',
        };

        if (!values.Nombre_bodega.trim() || /\d/.test(values.Nombre_bodega.trim())) {
            if (!values.Nombre_bodega.trim()) {
                newErrorMessages.Nombre_bodega = 'El nombre de la bodega no puede estar vacío.';
            } else {
                newErrorMessages.Nombre_bodega = 'El nombre de la bodega no puede contener números.';
            }
            hasError = true;
        }

        if (!values.ubicacion.trim()) {
            newErrorMessages.ubicacion = 'La ubicación no puede estar vacía.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);

        if (hasError) return;

        try {
            const response = await axios.put(`http://localhost:3000/bodega/actualizar/${category.codigo}`, {
                Nombre_bodega: values.Nombre_bodega,
                ubicacion: values.ubicacion,
            });
            if (response.status === 200) {
                swal({
                    title:"Actualizado",
                    text: "Bodega actualizada con éxito",
                    icon: "success",
                    button: false,
                    timer: 1500,
                });
                onClose();
                onRegisterSuccess();
            }
        } catch (error) {
            console.log(error);
            swal("Error", "Hubo un problema al actualizar la bodega", "error");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='w-[100%] flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-[100%]'>
                        <Input
                            type='text'
                            label='Nombre Bodega'
                            name='Nombre_bodega'
                            value={values.Nombre_bodega}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessages.Nombre_bodega && (
                            <div className="flex items-center text-red-500 text-xs mt-1">
                                <FaExclamationCircle className="mr-2" />
                                {errorMessages.Nombre_bodega}
                            </div>
                        )}
                    </div>
                    <div className='w-[100%]'>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='ubicacion'
                            value={values.ubicacion}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessages.ubicacion && (
                            <div className="flex items-center text-red-500 text-xs mt-1">
                                <FaExclamationCircle className="mr-2" />
                                {errorMessages.ubicacion}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className='font-bold text-white' color="primary" type='submit'>
                        Actualizar
                    </Button>
                </div>
            </form>
        </div>
    );
};
