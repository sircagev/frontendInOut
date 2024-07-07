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


export const RegisterMovmentOutgoing = ({ onClose }) => {

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
        console.log(outgoingData)
    }, [outgoingData])

    return (
        <div>
            <form action="">
                <Checkbox

                    isSelected={checkUser}
                    onChange={() => {
                        setCheckUser(!checkUser)
                        if (!checkUser) {
                            setOutgoing(precData => ({
                                ...precData,
                                user_application: parseInt(value)
                            }));
                        }
                    }}
                    color='success'>
                    Ahi otro usuario involucrado
                </Checkbox>
                {checkUser &&
                    <Autocomplete
                        aria-label='autocomplete-users'
                        label="Seleccionar el usuario"
                        placeholder="Busca un usuario"
                        isRequired
                        className='w-[75%] h-[60px]'
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
                <Autocomplete
                    isClearable
                    aria-label='autocomplete-elements'
                    label="Seleccionar el elemento"
                    placeholder="Busca un elemento"
                    isRequired
                    className='w-[75%] h-[60px]'
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
                <Input
                    isRequired
                    type="number"
                    label="Cantidad"
                    placeholder='Ingresa una cantidad'
                    variant=""
                    labelPlacement="outside"
                    className='w-[20%]'
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
                <Textarea
                    isRequired
                    type="text"
                    label="Observaciones"
                    placeholder=''
                    variant=""
                    labelPlacement="outside"
                    className='w-[20%]'
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
                <Button onClick={(e) => handleSubmit(e)} color='success' className='text-white font-bold'>Registrar</Button>
                <Button onClick={() => {
                    onClose();
                }} color='danger' className='text-white font-bold'>Cancelar</Button>
            </form>
        </div>
    )
}