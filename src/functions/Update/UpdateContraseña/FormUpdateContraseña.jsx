import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';
import Swal from 'sweetalert2';

export const FormUpdateContraseña = ({ onClose, category, Listar }) => {
    const [values, setValues] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = validateForm();

        if (hasError) return;

        try {
            const dataToUpdate = {
                password: values.password,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            const response = await axiosClient.put(`usuario/contrasena/${category.codigo}`, dataToUpdate);

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: response.data.message,
                timer: 2000,
                onClose: () => {
                    Listar();
                    onClose();
                }
            });

        } catch (error) {
            console.error("Error al Actualizar Contraseña", error);
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        };

        // Validación de ejemplo para la longitud de la contraseña
        if (values.newPassword.length < 8) {
            newErrorMessages.newPassword = 'La contraseña debe tener al menos 8 caracteres.';
            hasError = true;
        }

        // Verificar si las contraseñas coinciden
        if (values.newPassword !== values.confirmPassword) {
            newErrorMessages.confirmPassword = 'Las contraseñas no coinciden.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);

        return hasError;
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <Input
                        type='password'
                        label='Contraseña Actual'
                        name='password'
                        value={values.password}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                    {errorMessages.password && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                            <FaExclamationCircle className="mr-2" />
                            {errorMessages.password}
                        </div>
                    )}

                    <Input
                        type='password'
                        label='Nueva Contraseña'
                        name='newPassword'
                        value={values.newPassword}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                    {errorMessages.newPassword && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                            <FaExclamationCircle className="mr-2" />
                            {errorMessages.newPassword}
                        </div>
                    )}

                    <Input
                        type='password'
                        label='Confirmar Nueva Contraseña'
                        name='confirmPassword'
                        value={values.confirmPassword}
                        onChange={handleInputChange}
                        className="full"
                    />
                    {errorMessages.confirmPassword && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                            <FaExclamationCircle className="mr-2" />
                            {errorMessages.confirmPassword}
                        </div>
                    )}
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
