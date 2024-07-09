import React, { useState, useMemo, useEffect } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Checkbox,
    Input,
    Button,
} from '@nextui-org/react';
import { EyeIcon } from '../../icons/EyeIcon';
import { ListarUsuarios } from '../../../functions/Listar';
import { ListarElementos } from '../../../functions/Listar';
import { Listarbodegas } from '../../../functions/Listar';
import { Listarubicacion } from '../../../functions/Listar';
import { capitalize } from '../../../utils/columnsData';
import swal from 'sweetalert';
import axiosClient from '../../config/axiosClient';

export const RegisterMovement = ({ onClose }) => {

    const [errors, setErrors] = useState({
        user_application: '',
        element_id: '',
        quantity: '',
        expiration: '',
        warehouse: '',
        location: '',
    });

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
        if (dataLocations.length > 0) {
            const info = dataLocations.filter(item => item.code_warehouse == warehouse);
            console.log(info)
            return info;
        };

        return [];
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
            const locations = await Listarubicacion();
            
            setDataUsers(users);
            setDataElements(elements);
            setDataWarehouses(warehouses);
            setDataLocations(locations);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let res = validateForm();

        if (res) return;

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

        if (checkUser && !newRegister.user_application) {
            newErrorMessages.user_application = 'Debes seleccionar un usuario';
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

        if (isConsumable && !newRegister.details[0].expiration) {
            newErrorMessages.expiration = 'Debes colocar una fecha de expiracion';
            hasError = true;
        }

        if (!warehouse) {
            newErrorMessages.warehouse = 'Debes elegir una bodega';
            hasError = true;
        }

        if (!newRegister.details[0].warehouseLocation_id) {
            newErrorMessages.location = 'Debes elegir una ubicacion en Bodega';
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
    }, [newRegister])

    useEffect(() => {
        const handleErrors = () => {
            let newErrorMessages = { ...errors };

            if (checkUser && newRegister.user_application) {
                newErrorMessages.user_application = '';
            }

            if (newRegister.details[0].element_id) {
                newErrorMessages.element_id = '';
            }

            if (newRegister.details[0].quantity) {
                newErrorMessages.quantity = '';
            }

            if (isConsumable && newRegister.details[0].expiration) {
                newErrorMessages.expiration = '';
            }

            if (warehouse) {
                newErrorMessages.warehouse = '';
            }

            if (newRegister.details[0].warehouseLocation_id) {
                newErrorMessages.location = '';
            }

            setErrors(newErrorMessages);
        };

        handleErrors();
    }, [newRegister, checkUser, isConsumable, warehouse]);

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='flex gap-3 mb-2 w-full'>
                        <div className='w-1/4 flex justify-center items-center'>
                            <Checkbox
                                icon={<EyeIcon />}
                                /* isSelected={checkUser} */
                                onChange={() => {
                                    setCheckUser(!checkUser)
                                    if (checkUser) {
                                        setNewRegister(precData => ({
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
                        </div>
                        <div className='w-1/4'>
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
                    <div className='w-3/5'>
                        {isConsumable && <Input
                            isRequired
                            type="date"
                            label="Fecha de expiración"
                            isInvalid={errors.expiration}
                            errorMessage={errors.expiration}
                            color={errors.expiration && 'danger'}
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
                    </div>
                    <div className='w-full flex gap-3'>
                        <div className='w-1/2'>
                            <Autocomplete
                                aria-label='autocomplete-warehouese'
                                label="Seleccionar la bodega"
                                placeholder="Busca una bodega"
                                isRequired
                                className='h-[60px]'
                                isInvalid={errors.warehouse}
                                errorMessage={errors.warehouse}
                                color={errors.warehouse && 'danger'}
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
                        </div>
                        <div className='w-1/2'>
                            <Autocomplete
                                aria-label='autocomplete-location'
                                label="Seleccionar la Ubicacion en Bodega"
                                placeholder="Busca una ubicacion"
                                isRequired
                                className='h-[60px]'
                                isInvalid={errors.location}
                                errorMessage={errors.location}
                                color={errors.location && 'danger'}
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
                            </Autocomplete></div>
                    </div>
                    <div className='flex justify-end gap-3 mt-2'>
                        <Button /* onClick={handleSubmit} */ color='success' className='text-white font-bold' type='submit'>Registrar</Button>
                        <Button onClick={onClose} color='danger' className='text-white font-bold'>Cancelar</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
