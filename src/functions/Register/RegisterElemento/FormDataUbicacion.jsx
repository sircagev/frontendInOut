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
    const [errors, setErrors] = useState({
        Nombre_ubicacion: "",
        fk_bodega: ""
    });

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const response = await axiosClient.get('bodega/listar');
                setBodegas(response.data);
            } catch (error) {
                console.log(error);
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

    const handleSelectChange = (selected) => {
        setValues({
            ...values,
            warehouse_id: selected.value,
        });
    };

    const validateForm = () => {
        let formErrors = {};

        if (!values.name.trim()) {
            formErrors.Nombre_ubicacion = 'El nombre no debe estar vacío.';
        }


        if (!values.warehouse_id || !values.warehouse_id.trim()) {
            formErrors.fk_bodega = 'Debe seleccionar una bodega.';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleForm = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

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
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleForm}>
                    <div className='flex justify-center items-center'></div>
                    <div className="relative mb-2 justify-center items-center h-[70px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='name'
                            value={values.name}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errors.Nombre_ubicacion && (
                            <div className="flex items-center text-red-500 text-xs mt-1 ml-3">
                                <FaExclamationCircle className="mr-1" />
                                {errors.Nombre_ubicacion}
                            </div>
                        )}
                    </div>
                    <div className="relative mb-4 justify-center items-center" data-twe-input-wrapper-init>
                        <Select
                            label="Seleccione una bodega"
                            name='warehouse_id'
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
                        {errors.fk_bodega && (
                            <div className="flex items-center text-red-500 text-xs mt-1 ml-3">
                                <FaExclamationCircle className="mr-1" />
                                {errors.fk_bodega}
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <ButtonCerrar onClose={onClose}/>
                        <ButtonRegistrar/>
                    </div>
                </form>
            </div>
        </div>
    );
};
