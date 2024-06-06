import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormDataUbicacion = ({ onRegisterSuccess, onClose }) => {
    const [bodegas, setBodegas] = useState([]);
    const [values, setValues] = useState({
        Nombre_ubicacion: "",
        fk_bodega: ""
    });
    const [errors, setErrors] = useState({
        Nombre_ubicacion: "",
        fk_bodega: ""
    });

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/bodega/listar');
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
            fk_bodega: selected.value,
        });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!values.Nombre_ubicacion.trim() || /\d/.test(values.Nombre_ubicacion.trim())) {
            formErrors.Nombre_ubicacion = 'El nombre no debe estar vacío ni tener números.';
        }

        if (!values.fk_bodega.trim()) {
            formErrors.fk_bodega = 'Debe seleccionar una bodega.';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleForm = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:3000/ubicacion/registrar', values);
            if (response.status === 200) {
                setValues({ Nombre_ubicacion: '', fk_bodega: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La ubicación se ha registrado correctamente.",
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
                    <div className='flex justify-center items-center'></div>
                    <div className="relative mb-2 justify-center items-center h-[70px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='Nombre_ubicacion'
                            value={values.Nombre_ubicacion}
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
                    <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Select
                            label="Seleccione una bodega"
                            name='fk_bodega'
                            value={values.fk_bodega}
                            onChange={handleSelectChange}
                            className="w-[100%]"
                        >
                            {bodegas.map((bodega) => (
                                <SelectItem key={bodega.codigo_Bodega} value={bodega.codigo_Bodega}>
                                    {bodega.Nombre_bodega}
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
    );
};
