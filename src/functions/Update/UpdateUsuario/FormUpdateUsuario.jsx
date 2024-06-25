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
            const status = error.response.status;
            const message = error.response.data.message
            
            swal("Error", message , "error");
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
                            </div>
                            <div>
                                <select id="rol" name="rol" value={values.rol} onChange={handleInputChange} className="w-[310px] h-[58px] rounded-xl pl-3 text-sm ">
                                    <option value="">Seleccione un Rol</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="Encargado">Encargado</option>
                                    <option value="Usuario">Usuario</option>
                                </select>
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
    )
}
