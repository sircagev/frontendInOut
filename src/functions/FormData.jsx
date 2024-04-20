import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ListarCategorias } from '../functions/Listar';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormData = ( {onClose} ) => {

    const [errorMessage, setErrorMessage] = useState('');

    const [values, setValues] = useState(
        {
            Nombre_Categoria: "",
        }
    )

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Convertir la primera letra en mayúscula y el resto en minúscula
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();

        // Verificar si el campo de nombre de categoría está vacío o contiene números
        if (!values.Nombre_Categoria.trim() || /\d/.test(values.Nombre_Categoria.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; // Salir de la función sin enviar el formulario
        } else {
            setErrorMessage('');
        }

        try {
            // Si no hay ningún mensaje de error, enviar el formulario
            const response = await axios.post('http://localhost:3000/categoria/registrar', values);
            if (response.status === 200) {
                ListarCategorias();
                setValues({ Nombre_Categoria: '' }); // Resetear el formulario después de enviarlo
                swal({
                    title: "Registro exitoso",
                    text: "La categoría se ha registrado correctamente.",
                    icon: "success",
                    buttons: false, // Ocultar el botón "Aceptar"
                    timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
                });
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
