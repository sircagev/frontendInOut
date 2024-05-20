import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormDataMedida = ({onRegisterSuccess, onClose}) => {
    
    const [errorMessage, setErrorMessage] = useState('');

    const [values, setValues] = useState(
        {
            Nombre_Medida: "",
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

        if (!values.Nombre_Medida.trim() || /\d/.test(values.Nombre_Medida.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; 
        } else {
            setErrorMessage('');
        }

        try {
            const response = await axios.post('http://localhost:3000/medida/registrar', values);
            if (response.status === 200) {
                
                setValues({ Nombre_Medida: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La medida se ha registrado correctamente.",
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
                            label='Nombre_Medida'
                            name='Nombre_Medida'
                            value={values.Nombre_Medida}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessage && (
                            <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                <FaExclamationCircle className="mr-1" />
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