import React, { useState, useMemo, useEffect } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Input,
    Button,
    Textarea
} from '@nextui-org/react';
import { ListarUsuarios, ListarElementos } from '../../../functions/Listar';
import { capitalize } from '../../../utils/columnsData';
import axiosClient from '../../config/axiosClient';

export const RegisterLoans = ({ onClose, listarMovimientos }) => {

    const [errors, setErrors] = useState({
        user_application: '',
        element_id: '',
        quantity: '',
        estimated_return: '',
    });

    const objectRegister = {
        user_application: null,
        estimated_return: null,
        details: [{
            element_id: '',
            quantity: 0,
            remarks: null
        }]
    }

    //Guardar la información que se envia para un nuevo registro
    const [newRegister, setNewRegister] = useState(objectRegister);
    const [usersData, setUsersData] = useState([]);
    const [elementsData, setElementsData] = useState([]);

    const list = async () => {
        try {
            const users = await ListarUsuarios();
            const elements = await ListarElementos();

            setUsersData(users);
            setElementsData(elements);

            console.log(users);
            console.log(elements);

        } catch (error) {
            console.log(error);
        }
    }

    const filteredItems = useMemo(() => {
        if (elementsData.length > 0) {
            const info = elementsData.filter(item => item.code_elementType == 2);
            console.log(info)
            return info;
        };

        return [];
    }, [elementsData]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let res = validateForm();
        if (res) return;

        try {
            const register = await axiosClient.post('movimientos/register-loan', newRegister);

            const status = register.status >= 200 && register.status <= 210 ? true : false

            swal({
                title: "Registro exitoso",
                text: "La categoría se ha registrado correctamente.",
                icon: `${status ? 'success' : "warning"}`,
                buttons: false,
                timer: 2000,
            });
            listarMovimientos();
            onClose();
        } catch (error) {
            console.log(error)
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            user_application: '',
            element_id: '',
            quantity: '',
            estimated_return: '',
        };

        if (!newRegister.user_application) {
            newErrorMessages.user_application = 'Debes seleccionar un usuario';
            hasError = true;
        }

        if (!newRegister.estimated_return) {
            newErrorMessages.estimated_return = 'Debes seleccionar una fecha estimada de devolución';
            hasError = true;
        }

        if (!newRegister.details[0].element_id) {
            newErrorMessages.element_id = 'Debes seleccionar un Elemento';
            hasError = true;
        }

        if (!newRegister.details[0].quantity) {
            newErrorMessages.quantity = 'Debes colocar una cantidad';
            hasError = true;
        }

        setErrors(newErrorMessages);

        return hasError;
    };

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
        console.log(newRegister)
    }, [newRegister]);

    useEffect(() => {
        const handleErrors = () => {
            let newErrorMessages = { ...errors };

            if (newRegister.user_application) {
                newErrorMessages.user_application = '';
            }

            if (newRegister.details[0].element_id) {
                newErrorMessages.element_id = '';
            }

            if (newRegister.details[0].quantity) {
                newErrorMessages.quantity = '';
            }

            if (newRegister.estimated_return) {
                newErrorMessages.estimated_return = '';
            }

            setErrors(newErrorMessages);
        };

        handleErrors();
    }, [newRegister]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-full flex gap-3 mb-2'>
                        <Autocomplete
                            aria-label='autocomplete-users'
                            label="Seleccionar el usuario"
                            placeholder="Busca un usuario"
                            isRequired
                            isInvalid={errors.user_application ? true : false}
                            errorMessage={errors.user_application}
                            className='h-[60px]'
                            onSelectionChange={(value) => {
                                const element = value;
                                setNewRegister(precData => ({
                                    ...precData,
                                    user_application: parseInt(value)
                                }));
                            }}
                        >
                            {usersData.map((user) => (
                                <AutocompleteItem
                                    key={user.codigo}
                                    value={user.codigo}
                                >
                                    {user.identification + ' - ' + capitalize(user.nombre)}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div className='w-full flex gap-3'>
                        <div className='w-[70%]'>
                            <Autocomplete
                                isClearable
                                aria-label='autocomplete-elements'
                                label="Seleccionar el elemento"
                                placeholder="Busca un elemento"
                                isRequired
                                isInvalid={errors.element_id ? true : false}
                                errorMessage={errors.element_id}
                                className='h-[60px]'
                                onSelectionChange={(value) => {
                                    const item = value;
                                    setNewRegister(prevData => ({
                                        ...prevData,
                                        details: [{
                                            ...prevData.details[0],
                                            element_id: parseInt(item)
                                        }]
                                    }));
                                }}
                            >
                                {filteredItems.map((item) => (
                                    <AutocompleteItem
                                        key={item.codigo}
                                        value={item.codigo}
                                    >
                                        {item.codigo + ' - ' + item.name}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className='w-[30%]'>
                            <Input
                                isRequired
                                type="number"
                                label="Cantidad"
                                placeholder='Ingresa una cantidad'
                                isInvalid={errors.quantity}
                                errorMessage={errors.quantity}
                                color={errors.quantity && 'danger'}
                                min={0}
                                onChange={(e) => {
                                    const nuevaCantidad = parseInt(e.target.value);
                                    if (!isNaN(nuevaCantidad)) { // Verificar si el nuevo valor es un número
                                        setNewRegister(precData => ({
                                            ...precData,
                                            details: [{
                                                ...precData.details[0],
                                                quantity: nuevaCantidad
                                            }]
                                        }));
                                    } else {
                                        // Aquí puedes manejar el caso cuando el usuario ingresa un valor no válido
                                        console.log('Por favor ingrese un número válido para la cantidad.');
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <Input
                            isRequired
                            type="date"
                            label="Fecha de devolución"
                            isInvalid={errors.estimated_return}
                            errorMessage={errors.estimated_return}
                            color={errors.estimated_return && 'danger'}
                            min={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value) { // Verificar si el nuevo valor es un número
                                    setNewRegister(precData => ({
                                        ...precData,
                                        estimated_return: value
                                    }));
                                }
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <Textarea
                            isRequired
                            type="text"
                            label="Observaciones"
                            placeholder=''
                            labelPlacement="outside"
                            min={0}
                            onChange={(e) => {
                                setNewRegister(precData => ({
                                    ...precData,
                                    details: [{
                                        ...precData.details[0],
                                        remarks: e.target.value
                                    }]
                                }));
                            }}
                        />
                    </div>
                    <div className='flex justify-end gap-3 mt-2'>
                        <Button color='success' className='text-white font-bold' type='submit'>Registrar</Button>
                        <Button onClick={onClose} color='danger' className='text-white font-bold'>Cancelar</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
