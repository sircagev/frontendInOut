import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import {
    Autocomplete,
    AutocompleteItem,
    Checkbox,
    Input
} from '@nextui-org/react';
import { EyeIcon } from '../../icons/EyeIcon';
import { ListarUsuarios } from '../../../functions/Listar';
import { ListarElementos } from '../../../functions/Listar';
import { Listarbodegas } from '../../../functions/Listar';
import { ListarUbicacionesYBodegas } from '../../../functions/Listar';
import { useEffect } from 'react';

export const RegisterMovement = () => {

    const { user } = useAuth();
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

    const filteredItems = React.useMemo(() => {
        console.log(dataLocations)
        return dataLocations.filter(item => item.id_warehouse == warehouse);
    }, [dataLocations, warehouse]);

    //Guardar la información que se envia para un nuevo registro
    const [newRegister, setNewRegister] = useState(objectRegister);

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
            console.log(warehouses);
            console.log(locations)
        } catch (error) {
            console.log(error);
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
            <Checkbox
                icon={<EyeIcon />}
                isSelected={checkUser}
                onChange={() => {
                    setCheckUser(!checkUser)
                    if (checkUser == false) {
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

                        console.log(newRegister)
                    }}
                >
                    {dataUsers.map((user) => (
                        <AutocompleteItem
                            key={user.user_id}
                            value={user.user_id}
                        >
                            {user.user_name + ' ' + user.lastname}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>}
            <Autocomplete
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

                    console.log(newRegister)
                }}
            >
                {dataElements.map((item) => (
                    <AutocompleteItem
                        key={item.element_id}
                        value={item.element_id}
                    >
                        {item.name}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
            <Input
                isRequired
                type="number"
                label="Cantidad"
                placeholder='Ingresa una cantidad'
                variant="underlined"
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
            <Autocomplete
                aria-label='autocomplete-warehouese'
                label="Seleccionar la bodega"
                placeholder="Busca una bodega"
                isRequired
                className='w-[75%] h-[60px]'
                onSelectionChange={(value) => {
                    const item = value;
                    setWarehouse(value)
                }}
            >
                {dataWarehouses.map((item) => (
                    <AutocompleteItem
                        key={item.warehouse_id}
                        value={item.warehouse_id}
                    >
                        {item.name}
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
                    setNewRegister(...prevData => ({
                        ...prevData,
                        details: [{
                            ...prevData.details[0],
                            warehouseLocation_id: parseInt(item)
                        }]
                    }))
                }}
            >
                {filteredItems.map((item) => (
                    <AutocompleteItem
                        key={item.codigo}
                        value={item.codigo}
                    >
                        {item.name}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
            {

            }
        </div>
    )
}
