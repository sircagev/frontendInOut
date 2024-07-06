import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';

export const FormUpdateUsuario = ({ onClose, category, onRegisterSuccess }) => {
    const [values, setValues] = useState({
        user_name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_name: '', // Cambiado de role_id a role_name
        position_id: '',
        course_id: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        user_name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_name: '',
        position_id: '',
        course_id: ''
    });

    const roles = [
        { value: 1, label: 'administrador' },
        { value: 2, label: 'encargado' },
        { value: 3, label: 'general' }
    ];
    
    const positions = [
        { value: 1, label: 'aprendiz' },
        { value: 2, label: 'instructor' },
        { value: 3, label: 'operario' },
        { value: 4, label: 'coordinador' }
    ];

    useEffect(() => {
        if (category) {

            let dataName = category.nombre.split(" ");
            const name = dataName

            setValues({
                user_name: category.nombre || '',
                lastname: category.lastname || '',
                phone: category.phone || '',
                email: category.correo || '',
                identification: category.identification || '',
                role_name: category.role_name || '', // Cambiado de role_id a role_name
                position_id: category.position_id || '',
                course_id: category.course_id || '',
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = validateForm();

        if (hasError) return;

        try {
            await axiosClient.put(`usuario/actualizar/${category.codigo}`, {
                user_name: values.user_name,
                lastname: values.lastname,
                phone: values.phone,
                email: values.email,
                identification: values.identification,
                role_name: values.role_name, // Cambiado de role_id a role_name
                position_id: values.position_id,
                course_id: values.course_id
            });

            swal({
                title: "Actualizado",
                text: "Usuario actualizado con éxito.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });

            onClose();
            onRegisterSuccess();
        } catch (error) {
            const status = error.response.status;
            const message = error.response.data.message;
            swal("Error", message, "error");
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            user_name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
            role_name: '',
            position_id: '',
            course_id: ''
        };

        if (!values.user_name.trim()) {
            newErrorMessages.user_name = 'El nombre es requerido.';
            hasError = true;
        }

        if (!values.lastname.trim()) {
            newErrorMessages.lastname = 'El apellido es requerido.';
            hasError = true;
        }

        if (!values.phone.trim()) {
            newErrorMessages.phone = 'El número de Teléfono es requerido.';
            hasError = true;
        }

        if (!values.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

        if (!values.identification.trim()) {
            newErrorMessages.identification = 'El número de Identificación es requerido.';
            hasError = true;
        }

        if (!values.role_name.trim()) { // Cambiado de role_id a role_name
            newErrorMessages.role_name = 'El Rol es requerido.';
            hasError = true;
        }

        if (!values.position_id.trim()) {
            newErrorMessages.position_id = 'El cargo es requerido.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);

        return hasError;
    };


    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                        <div className="w-auto flex gap-3 mb-2">
                            <div>
                                <Input
                                    type='text'
                                    label='Nombre Usuario'
                                    name='user_name'
                                    value={values.user_name}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.user_name && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.user_name}
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
                                    type='text'
                                    label='Identificación'
                                    name='identification'
                                    value={values.identification}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.identification && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.identification}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Select
                                    label='Cargo'
                                    name='position_id'
                                    value={values.position_id}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                >
                                    {positions.map((position) => (
                                        <SelectItem key={position.value} value={position.value}>{position.label}</SelectItem>
                                    ))}
                                </Select>
                                {errorMessages.position_id && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.position_id}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2">
                            <div>
                                <Input
                                    type='text'
                                    label='Id Ficha'
                                    name='course_id'
                                    value={values.course_id}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.course_id && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.course_id}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Select
                                    label='Rol'
                                    name='role_name' // Cambiado de role_id a role_name
                                    value={values.role_name}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                >
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                    ))}
                                </Select>
                                {errorMessages.role_name && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.role_name}
                                    </div>
                                )}
                            </div>
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
        </div>
    );
};
