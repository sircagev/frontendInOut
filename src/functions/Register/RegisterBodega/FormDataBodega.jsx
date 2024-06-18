import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormDataBodega = ({ onRegisterSuccess, onClose }) => {

    const [errorMessages, setErrorMessages] = useState({
        Nombre_bodega: '',
        ubicacion: '',
    });

    const [values, setValues] = useState({
        Nombre_bodega: "",
        ubicacion: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();

        let hasError = false;
        let newErrorMessages = {
            Nombre_bodega: '',
            ubicacion: '',
        };

        if (!values.Nombre_bodega.trim()) {
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
            const response = await axios.post('http://localhost:3000/bodega/registrar', values);
            if (response.status === 200) {

                setValues({
                    Nombre_bodega: '',
                    ubicacion: ''
                });
                swal({
                    title: "Registro exitoso",
                    text: "La bodega se ha registrado correctamente.",
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
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    )
}

