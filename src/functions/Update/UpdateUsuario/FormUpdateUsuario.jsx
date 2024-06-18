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

        // Convert all values to strings
        const strValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, String(value)])
        );

        if (!strValues.nombre.trim() || /\d/.test(strValues.nombre)) {
            newErrorMessages.nombre = !strValues.nombre.trim()
                ? 'El nombre del usuario no puede estar vacío.'
                : 'El nombre del usuario no puede contener números.';
            hasError = true;
        }

        if (!strValues.apellido.trim() || /\d/.test(strValues.apellido)) {
            newErrorMessages.apellido = !strValues.apellido.trim()
                ? 'El apellido del usuario no puede estar vacío.'
                : 'El apellido del usuario no puede contener números.';
            hasError = true;
        }

        if (!strValues.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(strValues.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

        if (!strValues.rol.trim()) {
            newErrorMessages.rol = 'El campo de rol es requerido.';
            hasError = true;
        }

        if (!strValues.numero.trim()) {
            newErrorMessages.numero = 'El campo de teléfono es requerido.';
            hasError = true;
        }

        if (!strValues.ficha.trim()) {
            newErrorMessages.ficha = 'El campo de ficha es requerido.';
            hasError = true;
        }

        if (!strValues.identificacion.trim()) {
            newErrorMessages.identificacion = 'El campo de identificación es requerido.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);
        return !hasError;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

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
                text: "Usuario actualizada con éxito.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });
            onClose();
            onRegisterSuccess();
        } catch (error) {
            console.log(error);
            swal("Error", "Hubo un problema al actualizar el usuario", "error");
        }
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
                                    <option value="Usuario">Usuario</option>
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
                                    label='Identifiación'
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
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}