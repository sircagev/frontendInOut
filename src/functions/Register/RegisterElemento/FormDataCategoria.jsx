import React, { useState, useEffect } from 'react'
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonGeneral } from '../../../components/Buttons/Button';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';



export const FormDataCategoria = ( {listar, onClose} ) => {

    const [errorMessage, setErrorMessage] = useState('');

    const [values, setValues] = useState(
        {
            name: "",
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

        if (!values.name.trim() || /\d/.test(values.name.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; 
        } else {
            setErrorMessage('');
        }

        try {
            const response = await axiosClient.post('categoria/registrar', values);
            if (response.status === 200) {
                
                setValues({ name: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La categoría se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000, 
                });
                
                onClose(); 
                listar();
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
                    <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Nombre Categoría'
                            name='name'
                            value={values.name}
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
                        <ButtonCerrar onClose={onClose}/>    
                        <ButtonRegistrar/>
                    </div>
                </form>
            </div>
        </div>
    )
}
