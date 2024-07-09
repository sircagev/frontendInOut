import React, { useEffect, useState, useMemo } from "react";
import { capitalize } from "../../../utils/columnsData";
import swal from "sweetalert";
import axiosClient from "../../config/axiosClient";
import {
    Autocomplete,
    AutocompleteItem,
    Checkbox,
    Input,
    Button,
    Textarea
} from '@nextui-org/react';
import { ListarUsuarios } from "../../../functions/Listar";
import { ListarElementos } from "../../../functions/Listar";


export const RegisterMovmentOutgoing = ({ onClose, listarMovements }) => {

    const [errors, setErrors] = useState({
        user_application: '',
        element_id: '',
        quantity: '',
        expiration: '',
        warehouse: '',
        location: '',
    })

    const [checkUser, setCheckUser] = useState(false);

    const objectOutgoing = {
        user_application: null,
        details: [{
            element_id: null,
            quantity: null,
            remarks: null
        }]
    }

    const [outgoingData, setOutgoing] = useState(objectOutgoing);

    const [dataUsers, setDataUsers] = useState([]);
    const [dataElements, setDataElements] = useState([]);

    const list = async () => {
        try {
            const users = await ListarUsuarios();
            const elements = await ListarElementos();

            setDataUsers(users)
            setDataElements(elements);

        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = validateForm();

        if (res) return;

        try {
            const register = await axiosClient.post('movimientos/register-outgoing', outgoingData);

            console.log(register)

            const status = register.status >= 200 && register.status <= 210 ? true : false

            swal({
                title: "Registro exitoso",
                text: "La categoría se ha registrado correctamente.",
                icon: `${status ? 'success' : "warning"}`,
                buttons: false,
                timer: 2000,
            });

            listarMovements();
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
            expiration: '',
            warehouse: '',
            location: '',
        };

        if (checkUser && !outgoingData.user_application) {
            newErrorMessages.user_application = 'Debes seleccionar un usuario';
            hasError = true;
        }

        if (!outgoingData.details[0].element_id) {
            newErrorMessages.element_id = 'Debes seleccionar un Elemento';
            hasError = true;
        }

        if (!outgoingData.details[0].quantity) {
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
        console.log(outgoingData)
    }, [outgoingData])

    useEffect(() => {
        const handleErrors = () => {
            let newErrorMessages = { ...errors };

            if (checkUser && outgoingData.user_application) {
                newErrorMessages.user_application = '';
            }

            if (outgoingData.details[0].element_id) {
                newErrorMessages.element_id = '';
            }

            if (outgoingData.details[0].quantity) {
                newErrorMessages.quantity = '';
            }
            setErrors(newErrorMessages);
        };

        handleErrors();
    }, [outgoingData, checkUser]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='flex gap-3 mb-2 w-full'>
                        <div className='w-1/4 flex justify-center items-center'>
                            <Checkbox
                                onChange={() => {
                                    setCheckUser(!checkUser)
                                    if (checkUser) {
                                        setOutgoing(precData => ({
                                            ...precData,
                                            user_application: null
                                        }))
                                    }
                                }}
                                color='success'>
                                Usuario externo
                            </Checkbox>
                        </div>
                        <div className='w-3/4'>
                            {checkUser &&
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
                                        setOutgoing(precData => ({
                                            ...precData,
                                            user_application: parseInt(value)
                                        }));
                                    }}
                                >
                                    {dataUsers.map((user) => (
                                        <AutocompleteItem
                                            key={user.codigo}
                                            value={user.codigo}
                                        >
                                            {user.identification + ' - ' + capitalize(user.nombre)}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>}
                        </div>
                    </div>
                    <div className='w-full flex gap-3'>
                        <div className='w-3/4'>
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
                                    setOutgoing(prevData => ({
                                        ...prevData,
                                        details: [{
                                            ...prevData.details[0],
                                            element_id: parseInt(item)
                                        }]
                                    }));
                                }}
                            >
                                {dataElements.map((item) => (
                                    <AutocompleteItem
                                        key={item.codigo}
                                        value={item.codigo}
                                    >
                                        {item.codigo + ' - ' + item.name}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className='w-1/4'>
                            <Input
                                isRequired
                                type="number"
                                label="Cantidad"
                                placeholder='Ingresa una cantidad'
                                isInvalid={errors.quantity ? true : false}
                                errorMessage={errors.quantity}
                                color={errors.quantity && 'danger'}
                                min={0}
                                onChange={(e) => {
                                    const nuevaCantidad = parseInt(e.target.value);
                                    if (!isNaN(nuevaCantidad)) { // Verificar si el nuevo valor es un número
                                        setOutgoing(precData => ({
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
                    <div className="w-full">
                        <Textarea
                            isRequired
                            type="text"
                            label="Observaciones"
                            placeholder=''
                            labelPlacement="outside"
                            min={0}
                            onChange={(e) => {
                                setOutgoing(precData => ({
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
                        <Button color='success' className='text-white font-bold' type="submit">Registrar</Button>
                        <Button onClick={onClose} color='danger' className='text-white font-bold'>Cancelar</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}