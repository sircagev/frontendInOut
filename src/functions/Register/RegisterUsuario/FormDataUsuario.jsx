import React, { useState, useEffect } from 'react'
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';


export const FormDataUsuario = ({ onRegisterSuccess, onClose }) => {

    const [values, setValues] = useState(
        {
            nombre_usuario: "",
            apellido_usuario: "",
            email_usuario: "",
            rol: "",
            numero: "",
            Id_ficha: "",
            identificacion: ""
        }
    )

    const [errorMessages, setErrorMessages] = useState({
        nombre_usuario: '',
        apellido_usuario: '',
        email_usuario: '',
        rol: '',
        numero: '',
        Id_ficha: '',
        identificacion: ''
    });

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

    const handleForm = async (event) => {
        event.preventDefault();

        let hasError = false;
        let newErrorMessages = {
            nombre_usuario: '',
            apellido_usuario: '',
            email_usuario: '',
            rol: '',
            numero: '',
            Id_ficha: '',
            identificacion: ''
        };

        if (!values.nombre_usuario.trim()) {
            newErrorMessages.nombre_usuario = 'El nombre de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.nombre_usuario)) {
            newErrorMessages.nombre_usuario = 'El nombre de usuario no puede contener números.';
            hasError = true;
        }

        if (!values.apellido_usuario.trim()) {
            newErrorMessages.apellido_usuario = 'El apellido de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.apellido_usuario)) {
            newErrorMessages.apellido_usuario = 'El apellido de usuario no puede contener números.';
            hasError = true;
        }

        if (!values.email_usuario.trim()) {
            newErrorMessages.email_usuario = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(values.email_usuario)) {
            newErrorMessages.email_usuario = 'El correo electrónico no es válido.';
            hasError = true;
        }

        if (!values.rol.trim()) {
            newErrorMessages.rol = 'El campo de rol es requerido.';
            hasError = true;
        }

        if (!values.numero.trim()) {
            newErrorMessages.numero = 'El campo de teléfono es requerido.';
            hasError = true;
        }

        if (!values.Id_ficha.trim()) {
            newErrorMessages.Id_ficha = 'El campo de ficha es requerido.';
            hasError = true;
        }

        if (!values.identificacion.trim()) {
            newErrorMessages.identificacion = 'El campo de identificación es requerido.';
            hasError = true;
        }



        setErrorMessages(newErrorMessages);

        if (hasError) return

        try {
            const response = await axiosClient.post('usuario/registrar', values);
            if (response.status === 200) {

                setValues({
                    nombre_usuario: '',
                    apellido_usuario: '',
                    email_usuario: '',
                    rol: '',
                    numero: '',
                    Id_ficha: '',
                    identificacion: ''
                });
                swal({
                    title: "Registro exitoso",
                    text: "El Usuario se ha registrado correctamente.",
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
                    <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <div>
                                <Input
                                    type='text'
                                    label='Nombre Usuario'
                                    name='nombre_usuario'
                                    value={values.nombre_usuario}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.nombre_usuario && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.nombre_usuario}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Input
                                    type='text'
                                    label='Apellido Usuario'
                                    name='apellido_usuario'
                                    value={values.apellido_usuario}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.apellido_usuario && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.apellido_usuario}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <div>
                                <Input
                                    type='text'
                                    label='Email'
                                    name='email_usuario'
                                    value={values.email_usuario}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.email_usuario && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.email_usuario}
                                    </div>
                                )}
                            </div>
                            <div>
                                {/* <Select
                                    label="Selecciona un rol"
                                    name="rol"
                                    value={values.rol}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                >
                                    <SelectItem value="">Seleccione un Rol</SelectItem>
                                    <SelectItem value="administrador">Administrador</SelectItem>
                                    <SelectItem value="Encargado">Encargado</SelectItem>
                                    <SelectItem value="Usuario">Usuario</SelectItem>
                                </Select> */}
                                <Input
                                    type='text'
                                    label='Rol'
                                    name='rol'
                                    value={values.rol}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.rol && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.rol}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
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
                                    name='Id_ficha'
                                    value={values.Id_ficha}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                    onKeyPress={allowOnlyNumbers}
                                    inputMode="numeric"
                                />
                                {errorMessages.Id_ficha && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.Id_ficha}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
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
                        <Button className='font-bold text-white' color="success" type='submit'>
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
