import React, { useState, useMemo, useEffect } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Checkbox,
    Input,
    Button
} from '@nextui-org/react';
import { EyeIcon } from '../../icons/EyeIcon';
import { ListarUsuarios } from '../../../functions/Listar';
import { ListarElementos } from '../../../functions/Listar';
import { Listarbodegas } from '../../../functions/Listar';
import { ListarUbicacionesYBodegas } from '../../../functions/Listar';
import { capitalize } from '../../../utils/columnsData';
import swal from 'sweetalert';
import axiosClient from '../../config/axiosClient';

export const RegisterMovement = ({ onClose }) => {

    const [checkUser, setCheckUser] = useState(false);
    const [warehouse, setWarehouse] = useState(null);

    const [dataUsers, setDataUsers] = useState([]);
    const [dataElements, setDataElements] = useState([]);
    const [dataWarehouses, setDataWarehouses] = useState([]);
    const [dataLocations, setDataLocations] = useState([]);

    const objectRegister = {
        user_application: null,
        details: [{
            element_id: '',
            expiration: null,
            quantity: 0,
            warehouseLocation_id: null,
            remarks: null
        }]
    }

    //Guardar la información que se envia para un nuevo registro
    const [newRegister, setNewRegister] = useState(objectRegister);

    const filteredItems = useMemo(() => {
        return dataLocations.filter(item => item.id_warehouse == warehouse);
    }, [dataLocations, warehouse]);

    const isConsumable = useMemo(() => {
        const codigo = newRegister.details[0].element_id ? newRegister.details[0].element_id : null
        const itemEncontrado = dataElements.find(item => item.codigo === codigo);
        if (itemEncontrado && itemEncontrado.id_type === 1) {
            console.log('esconsumible')
            return true
        }
        console.log('No consumible')
        return false
    }, [newRegister])

    const list = async () => {
        try {
            const users = await ListarUsuarios();
            const elements = await ListarElementos();
            const warehouses = await Listarbodegas();
            const locations = await ListarUbicacionesYBodegas();
            setDataUsers(users)
            setDataElements(elements);
            setDataWarehouses(warehouses);
            setDataLocations(locations);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const register = await axiosClient.post('movimientos/register-incoming', newRegister);

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
            /* console.log(error)
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });*/
        }
    }

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
        console.log(newRegister)
    }, [newRegister])

    return (
        <div>
            <form action="" >
                <Checkbox
                    icon={<EyeIcon />}
                    isSelected={checkUser}
                    onChange={() => {
                        setCheckUser(!checkUser)
                        if (!checkUser) {
                            setNewRegister(objectRegister)
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
                            setNewRegister(precData => ({
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
                        setNewRegister(prevData => ({
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

                {isConsumable && <Input
                    isRequired
                    type="date"
                    label="Fecha de expiración"
                    variant=""
                    labelPlacement="outside"
                    className='w-[20%]'
                    min={0}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value) { // Verificar si el nuevo valor es un número
                            setNewRegister(precData => ({
                                ...precData,
                                details: [{
                                    ...precData.details[0],
                                    expiration: value
                                }]
                            }));
                        }
                    }}
                />}

                <Autocomplete
                    aria-label='autocomplete-warehouese'
                    label="Seleccionar la bodega"
                    placeholder="Busca una bodega"
                    isRequired
                    className='w-[75%] h-[60px]'
                    onSelectionChange={(value) => {
                        const item = value;
                        setWarehouse(item)
                    }}
                >
                    {dataWarehouses.map((item) => (
                        <AutocompleteItem
                            key={item.warehouse_id}
                            value={item.warehouse_id}
                        >
                            {item.warehouse_id + ' - ' + item.name}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>

                <Autocomplete
                    aria-label='autocomplete-warehouese'
                    label="Seleccionar la bodega"
                    placeholder="Busca una bodega"
                    isRequired
                    className='w-[75%] h-[60px]'
                    onSelectionChange={(value) => {
                        const item = value;
                        setNewRegister(prevData => ({
                            ...prevData,
                            details: [{
                                ...prevData.details[0],
                                warehouseLocation_id: parseInt(item)
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

                <Button onClick={(e) => handleSubmit(e)} color='success' className='text-white font-bold'>Registrar</Button>
                <Button onClick={() => {
                    onClose();
                }} color='danger' className='text-white font-bold'>Cancelar</Button>
            </form>
        </div>
    )
}
