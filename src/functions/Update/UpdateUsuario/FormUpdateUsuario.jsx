import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';

export const FormUpdateUsuario = ({ onClose, category, onRegisterSuccess }) => {

    const [dataRoles, setDataRoles] = useState([]);
    const [dataPositions, setDataPositions] = useState([]);

    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_id: '', // Cambiado de role_id a role_name
        position_id: '',
        course_id: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_id: '',
        position_id: '',
        course_id: ''
    });

    const listData = async () => {
        try {
            const roles = await axiosClient.get('roles/list');
            const positions = await axiosClient.get('positions/list');

            console.log(roles);

            setDataRoles(roles.data.data);
            setDataPositions(positions.data.data);

        } catch (error) {
            swal({
                title: "Error",
                text: "sdfjks.",
                icon: "warning",
                buttons: false,
                timer: 2000,
            });
        }
    }

    useEffect(() => {

        listData();

        if (category) {

            let dataName = category.nombre.split(" ");
            const name = dataName[0]
            const lastname = dataName[1]

            setValues({
                name: name || '',
                lastname: lastname || '',
                phone: category.phone || '',
                email: category.correo || '',
                identification: category.identification || '',
                role_id: category.role_id || '', // Cambiado de role_id a role_name
                position_id: category.position_id || '',
                course_id: category.course_id || '',
            });
        }
    }, [category]);

    useEffect(() => {
        console.log(values)
    })

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
                name: values.name,
                lastname: values.lastname,
                phone: values.phone,
                email: values.email,
                identification: values.identification,
                role_id: values.role_id, // Cambiado de role_id a role_name
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
            name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
            role_id: '',
            position_id: '',
            course_id: ''
        };

        if (!values.name.trim()) {
            newErrorMessages.name = 'El nombre es requerido.';
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

        if (!values.role_id.trim()) { // Cambiado de role_id a role_name
            newErrorMessages.role_id = 'El Rol es requerido.';
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
                                <select
                                    className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                                    value={values.position_id}
                                    name='position_id'
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>Seleccione un cargo</option>
                                    {dataPositions.map((position) => (
                                        <option key={position.position_id} value={position.position_id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                                {/* <Select
                                    label='Cargo'
                                    name='position_id'
                                    value={values.position_id}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                >
                                    {dataPositions.map((position) => (
                                        <SelectItem key={position.position_id} value={position.position_id}>{position.name}</SelectItem>
                                    ))}
                                </Select> */}
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
                                <select
                                    className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                                    value={values.role_id}
                                    name='role_id'
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>Seleccione un rol</option>
                                    {dataRoles.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {/* <Select
                                    label='Rol'
                                    name='role_name' // Cambiado de role_id a role_name
                                    value={values.role_name}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                >
                                    {dataRoles.map((role) => (
                                        <SelectItem key={role.role_id} value={role.role_id}>{role.name}</SelectItem>
                                    ))}
                                </Select> */}
                                {errorMessages.role_id && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.role_id}
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
