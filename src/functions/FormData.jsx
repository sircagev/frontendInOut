import React, { useState, useEffect } from 'react'
import axios from 'axios';
import axiosClient from '../components/config/axiosClient';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormData = ( {onRegisterSuccess, onClose} ) => {

    const [errorMessage, setErrorMessage] = useState('');

    const [values, setValues] = useState(
        {
            Nombre_Categoria: "",
        }
    )

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

        if (!values.Nombre_Categoria.trim() || /\d/.test(values.Nombre_Categoria.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; 
        } else {
            setErrorMessage('');
        }

        try {
            const response = await axiosClient.post('categoria/registrar', values);
            if (response.status === 200) {
                
                setValues({ Nombre_Categoria: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La categoría se ha registrado correctamente.",
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
            <div>
                <form onSubmit={handleForm}>
                    <div className='flex justify-center items-center'></div>
                    <div class="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Nombre Categoría'
                            name='Nombre_Categoria'
                            value={values.Nombre_Categoria}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessage && (
                            <div className="flex items-center gap-2 text-red-500 text-xs mt-2 ml-3">
                                <FaExclamationCircle className="" />
                                {errorMessage}
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className='font-bold text-white' color="success" type='submit'>
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
