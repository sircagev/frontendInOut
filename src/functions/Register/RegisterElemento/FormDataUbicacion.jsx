import React, { useState, useEffect } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';


export const FormDataUbicacion = ({ listar, onClose }) => {
    const [bodegas, setBodegas] = useState([]);
    const [values, setValues] = useState({
        name: "",
        warehouse_id: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const response = await axiosClient.get('bodega/listar');
                setBodegas(response.data);
            } catch (error) {
                swal({
                    title: "Error",
                    text: error.response.data.message,
                    icon: `warning`,
                    buttons: true,
                    timer: 2000,
                });
            }
        };

        fetchBodegas();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();

        let hasError = false;

        let errorObject = {
            name: '',
            warehouse_id: ''
        }

        if (!values.name) {
            errorObject.name = 'El nombre es obligatorio';
            hasError = true;
        }

        if (!values.warehouse_id) {
            errorObject.warehouse_id = 'Debe seleccionar una bodega';
            hasError = true;
        }

        if (hasError) {
            setErrors(errorObject);
            return;
        }

        try {
            const response = await axiosClient.post('ubicacion/registrar', values);
            if (response.status === 200) {
                setValues({ name: '', warehouse_id: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La ubicación se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
                onClose();
                listar();
            }
        } catch (error) {
            if (error.response && error.response.data.message.includes('Duplicate entry')) {
                setErrors({ name: 'El nombre de la categoría ya existe.' });
            } else {
                setErrors({ name: 'Ocurrió un error al registrar la categoría. Inténtalo de nuevo.' });
            }
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleForm}>
                    <div className='flex justify-center items-center'></div>
                    <div className="relative justify-center items-center h-[70px] mb-2" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='name'
                            color={errors.name ? 'danger' : ''}
                            errorMessage={errors.name}
                            isInvalid={errors.name}
                            value={values.name}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                    </div>
                    <div className="relative mb-4 justify-center items-center" data-twe-input-wrapper-init>
                        <Select
                            label="Seleccione una bodega"
                            name='warehouse_id'
                            color={errors.warehouse_id ? 'danger' : ''}
                            errorMessage={errors.warehouse_id}
                            isInvalid={errors.warehouse_id}
                            value={values.warehouse_id}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        >
                            <SelectItem key="" value="">
                                Seleccione una bodega
                            </SelectItem>
                            {bodegas.map((bodega) => (
                                <SelectItem key={bodega.warehouse_id} value={bodega.name}>
                                    {bodega.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <ButtonCerrar onClose={onClose} />
                        <ButtonRegistrar label={"Registrar"} />
                    </div>
                </form>
            </div>
        </div>
    );
};
