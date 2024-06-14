import React, { useState, useEffect } from 'react'
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';


export const FormDataUsuario = ({ onRegisterSuccess, onClose }) => {

    const [values, setValues] = useState(
        {
            Nombre_Medida: "",
        }
    )

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosClient.post('usuario/registrar', values);
            if (response.status === 200) {

                setValues({
                    nombre_usuario: '',
                    apellido_usuario: '',
                    email_usuario: '',
                    rol: '',
                    numero: '',
                    contraseña_usuario: '',
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
                            <Input
                                type='text'
                                label='Nombre Usuario'
                                name='nombre_usuario'
                                value={values.nombre_usuario}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            <Input
                                type='text'
                                label='Apellido Usuario'
                                name='apellido_usuario'
                                value={values.apellido_usuario}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <Input
                                type='text'
                                label='Email'
                                name='email_usuario'
                                value={values.email_usuario}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            <Input
                                type='text'
                                label='Rol'
                                name='rol'
                                value={values.rol}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <Input
                                type='number'
                                label='Teléfono'
                                name='numero'
                                value={values.numero}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            <Input
                                type='password'
                                label='Contraseña'
                                name='contraseña_usuario'
                                value={values.contraseña_usuario}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                        </div>
                        <div class="w-auto flex gap-3 mb-2" data-twe-input-wrapper-init>
                            <Input
                                type='number'
                                label='Ficha'
                                name='Id_ficha'
                                value={values.Id_ficha}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
                            <Input
                                type='number'
                                label='Identifiación'
                                name='identifiacion'
                                value={values.identificacion}
                                onChange={handleInputChange}
                                className="w-[310px]"
                            />
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
