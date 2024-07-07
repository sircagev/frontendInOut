import React, { useState } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { FaExclamationCircle } from 'react-icons/fa';
import swal from 'sweetalert';

export const FormDataUsuario = ({ onRegisterSuccess, onClose }) => {
    const [values, setValues] = useState({
        user_id: "",
        name: "",
        lastname: "",
        phone: "",
        email: "",
        identification: "",
        role_id: "",
        position_id: "",
        course_id: ""
    });

    const [errorMessages, setErrorMessages] = useState({
        user_id: '',
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_id: '',
        position_id: '',
        course_id: ''
    });

    const roles = [
        { value: 1, label: 'Administrador' },
        { value: 2, label: 'Encargado' },
        { value: 3, label: 'Usuario' }
    ];

    const positions = [
        { value: 1, label: 'Aprendiz' },
        { value: 2, label: 'Instructor' },
        { value: 3, label: 'Operario' },
        { value: 4, label: 'Coordinador' }
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        let newValue = value;

        const maxLength = {
            lastname: 15,
            phone: 11,
            email: 50,
            identification: 11,
            role_id: 15,
            position_id: 15,
            course_id: 10
        };

        if (maxLength[name] && value.length > maxLength[name]) {
            newValue = value.slice(0, maxLength[name]);
        }

        if (name === 'role_id' || name === 'position_id' || name === 'course_id') {
            newValue = parseInt(newValue, 10);
        }

        setValues({
            ...values,
            [name]: newValue,
        });
    };

    const allowOnlyNumbers = (event) => {
        const isValidKey = /^\d$/.test(event.key);
        if (!isValidKey) {
            event.preventDefault();
        }
    };

    const handleForm = async (event) => {
        event.preventDefault();

        let hasError = false;
        let newErrorMessages = {
            user_id: '',
            name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
            role_id: '',
            position_id: '',
            course_id: ''
        };

        if (!values.user_id.trim()) {
            newErrorMessages.user_id = 'El campo de ID es requerido.';
            hasError = true;
        }

        if (!values.name.trim()) {
            newErrorMessages.name = 'El nombre de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.name)) {
            newErrorMessages.name = 'El nombre de usuario no puede contener números.';
            hasError = true;
        }

        if (!values.lastname.trim()) {
            newErrorMessages.lastname = 'El apellido de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.lastname)) {
            newErrorMessages.lastname = 'El apellido de usuario no puede contener números.';
            hasError = true;
        }

        if (!values.phone.trim()) {
            newErrorMessages.phone = 'El campo de teléfono es requerido.';
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
            newErrorMessages.identification = 'El campo de identificación es requerido.';
            hasError = true;
        }

        if (!values.role_id.toString().trim()) {
            newErrorMessages.role_id = 'El campo de Rol es requerido.';
            hasError = true;
        }

        if (!values.position_id.toString().trim()) {
            newErrorMessages.position_id = 'El campo de Cargo es requerido.';
            hasError = true;
        }

        // Validar course_id basado en position_id
        if (values.position_id === 2 || values.position_id === 3 || values.position_id === 4) {
            // Posiciones donde course_id no debe ser ingresado
            if (values.course_id.toString().trim()) {
                newErrorMessages.course_id = 'El campo de Id ficha no debe ser ingresado para este cargo.';
                hasError = true;
            }
        }

        setErrorMessages(newErrorMessages);

        if (hasError) {
            return;
        }

        try {
            const response = await axiosClient.post('usuario/registrar', values);
            if (response.status === 200) {
                swal({
                    title: "Registro exitoso",
                    text: "El Usuario se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });

                setValues({
                    user_id: "",
                    name: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    identification: "",
                    role_id: "",
                    position_id: "",
                    course_id: ""
                });

                // Llamar a onRegisterSuccess después de limpiar el formulario
                onRegisterSuccess();
            } else {
                throw new Error('Error al registrar el usuario');
            }
        } catch (error) {
            console.error("Error al registrar el usuario:", error);

            // Mostrar mensaje de error genérico
            swal({
                title: "Registro exitoso",
                text: "El Usuario se ha registrado correctamente.",
                icon: "success",
                buttons: {
                    confirm: "OK",
                },
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleForm}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-auto flex gap-3 mb-2'>
                        <div>
                            <Input
                                type='number'
                                label='Id Usuario'
                                name='user_id'
                                value={values.user_id}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            {errorMessages.user_id && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.user_id}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='text'
                                label='Nombre Usuario'
                                name='name'
                                value={values.name}
                                onChange={handleInputChange}
                                className="w-[310px]"
                                maxLength={15}
                            />
                            {errorMessages.name && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.name}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-auto flex gap-3 mb-2'>
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
                        <div>
                            <Input
                                type='number'
                                label='Telefono'
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

                    <div className='w-auto flex gap-3 mb-2'>
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
                                type='number'
                                label='Identificacion'
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
                    </div>

                    <div className='w-auto flex gap-3 mb-2'>
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

                        <div>
                            <Select
                                label='Rol'
                                name='role_id'
                                value={values.role_id}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            >
                                {roles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                ))}
                            </Select>
                            {errorMessages.role_id && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.role_id}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-auto flex gap-3 mb-2'>
                        <div>
                            <Input
                                type='number'
                                label='Id ficha'
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
                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className='font-bold text-white' color="primary" type='submit'>
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    );
};
