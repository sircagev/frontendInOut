import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';

export const FormUpdatePerfil = ({ onClose, category, onRegisterSuccess }) => {
    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        course_id: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        course_id: ''
    });

    useEffect(() => {
        if (category) {
            setValues({
                name: category.name,
                lastname: category.lastname,
                phone: category.phone,
                email: category.email,
                identification: category.identification,
                course_id: category.course_id,
            });
        }
    }, [category]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const allowOnlyNumbers = (event) => {
        const isValidKey = /^\d$/.test(event.key);
        if (!isValidKey) {
            event.preventDefault();
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
            course_id: ''
        };

        const strValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, String(value)])
        );

        if (!strValues.name.trim() || /\d/.test(strValues.name)) {
            newErrorMessages.name = !strValues.name.trim()
                ? 'El nombre del usuario no puede estar vacío.'
                : 'El nombre del usuario no puede contener números.';
            hasError = true;
        }

        if (!strValues.lastname.trim() || /\d/.test(strValues.lastname)) {
            newErrorMessages.lastname = !strValues.lastname.trim()
                ? 'El apellido del usuario no puede estar vacío.'
                : 'El apellido del usuario no puede contener números.';
            hasError = true;
        }
        if (!strValues.phone.trim()) {
            newErrorMessages.phone = 'El campo de teléfono es requerido.';
            hasError = true;
        }

        if (!strValues.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(strValues.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

       

        if (!strValues.identification.trim()) {
            newErrorMessages.identification = 'El campo de Identificación es requerido.';
            hasError = true;
        }

        if (!strValues.course_id.trim()) {
            newErrorMessages.course_id = 'El campo de Id-Ficha es requerido.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);
        return !hasError;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
    
        try {
            const response = await axiosClient.put(`/perfil/${category.codigo}`, {
                name: values.name,
                lastname: values.lastname,
                phone: values.phone,
                email: values.email,
                identification: values.identification,
                course_id: values.course_id
            });
    
            swal({
                title: "Actualizado",
                text: "Perfil actualizado con éxito.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });
    
            onClose(); // Cierra el modal o formulario después de la actualización
            onRegisterSuccess(); // Actualiza cualquier estado necesario en tu componente principal
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            swal("Error", "Hubo un problema al actualizar el usuario", "error");
        }
    };
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className="w-auto flex gap-3 mb-2">
                        <div>
                            <Input
                                type='text'
                                label='Nombre Usuario'
                                name='name'
                                value={values.name}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            {errorMessages.name && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.name}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='text'
                                label='Apellido Usuario'
                                name='lastname'
                                value={values.lastname}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            {errorMessages.lastname && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.lastname}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-auto flex gap-3 mb-2">
                        <div>
                            <Input
                                type='text'
                                label='Email'
                                name='email'
                                value={values.email}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            {errorMessages.email && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.email}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='text'
                                label='Teléfono'
                                name='phone'
                                value={values.phone}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            {errorMessages.phone && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.phone}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-auto flex gap-3 mb-2">
                        <div>
                            <Input
                                type='number'
                                label='Identifiación'
                                name='identification'
                                value={values.identification}
                                onChange={handleInputChange}
                                className="w-[310px]"
                                onKeyPress={allowOnlyNumbers}
                                inputMode="numeric"
                            />
                            {errorMessages.identification && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.identification}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='number'
                                label='Ficha'
                                name='course_id'
                                value={values.course_id}
                                onChange={handleInputChange}
                                className="w-[310px]"
                                onKeyPress={allowOnlyNumbers}
                                inputMode="numeric"
                            />
                            {errorMessages.course_id && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.course_id}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <ButtonCerrar onClose={onClose}/>
                    <Button className='font-bold text-white' color="success" type='submit'>
                        Actualizar
                    </Button>
                </div>
            </form>
        </div>
    );
};
