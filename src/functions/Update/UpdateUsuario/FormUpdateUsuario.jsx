import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';

export const FormUpdateUsuario = ({ onClose, category, onRegisterSuccess }) => {
    const [values, setValues] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        numero: '',
        contraseña: '',
        ficha: '',
        identificacion: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        numero: '',
        contraseña: '',
        ficha: '',
        identificacion: ''
    });

    useEffect(() => {
        if (category) {
            setValues({
                nombre: category.nombre,
                apellido: category.apellido,
                email: category.email,
                rol: category.rol,
                numero: category.numero,
                contraseña: category.contraseña,
                ficha: category.ficha,
                identificacion: category.identificacion,
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

        let hasError = validateForm(); // Validar el formulario antes de enviar

        if (hasError) return;

        try {
            await axiosClient.put(`usuario/actualizar/${category.codigo}`, {
                nombre_usuario: values.nombre,
                apellido_usuario: values.apellido,
                email_usuario: values.email,
                rol: values.rol,
                numero: values.numero,
                contraseña_usuario: values.contraseña,
                Id_ficha: values.ficha,
                identificacion: values.identificacion
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
            const message = error.response.data.message
            
            swal("Error", message , "error");
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            nombre: '',
            apellido: '',
            email: '',
            rol: '',
            numero: '',
            contraseña: '',
            ficha: '',
            identificacion: ''
        };

        if (!values.nombre.trim()) {
            newErrorMessages.nombre = 'El nombre es requerido.';
            hasError = true;
        }

        if (!values.apellido.trim()) {
            newErrorMessages.apellido = 'El apellido es requerido.';
            hasError = true;
        }

        if (!values.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

        if (!values.rol.trim()) {
            newErrorMessages.rol = 'El rol es requerido.';
            hasError = true;
        }

        if (!values.numero.trim()) {
            newErrorMessages.numero = 'El número de teléfono es requerido.';
            hasError = true;
        }

        if (!values.ficha.trim()) {
            newErrorMessages.ficha = 'El número de ficha es requerido.';
            hasError = true;
        }

        if (!values.identificacion.trim()) {
            newErrorMessages.identificacion = 'La identificación es requerida.';
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
                        <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <div>
                                <Input
                                    type='text'
                                    label='Nombre Usuario'
                                    name='nombre'
                                    value={values.nombre}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.nombre && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.nombre}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Input
                                    type='text'
                                    label='Apellido Usuario'
                                    name='apellido'
                                    value={values.apellido}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.apellido && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.apellido}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
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
                                <select id="rol" name="rol" value={values.rol} onChange={handleInputChange} className="w-[310px] h-[58px] rounded-xl pl-3 text-sm ">
                                    <option value="">Seleccione un Rol</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="Encargado">Encargado</option>
                                    <option value="aprendiz">Aprendiz</option>
                                </select>
                                {errorMessages.rol && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.rol}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <div>
                                <Input
                                    type='text'
                                    label='Teléfono'
                                    name='numero'
                                    value={values.numero}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.numero && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.numero}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Input
                                    type='number'
                                    label='Ficha'
                                    name='ficha'
                                    value={values.ficha}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                    onKeyPress={allowOnlyNumbers}
                                    inputMode="numeric"
                                />
                                {errorMessages.ficha && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.ficha}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <div className='w-full flex flex-col'>
                                <Input
                                    type='number'
                                    label='Identificación'
                                    name='identificacion'
                                    value={values.identificacion}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                    onKeyPress={allowOnlyNumbers}
                                    inputMode="numeric"
                                />
                                {errorMessages.identificacion && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.identificacion}
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
