import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormDataUbicacion = ({ onRegisterSuccess, onClose }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [bodegas, setBodegas] = useState([]);
    const [values, setValues] = useState({
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

    const handleForm = async (event) => {
        event.preventDefault();
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
                    <div className="relative mb-2 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='Nombre_ubicacion'
                            value={values.Nombre_ubicacion}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessage && (
                            <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                <FaExclamationCircle className="mr-1" />
                                {errorMessage}
                            </div>
                        )}
                    </div>
                    <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <select
                            name="fk_bodega"
                            value={values.fk_bodega}
                            onChange={handleInputChange}
                            className="w-[100%] h-[55px] bg-[#e4e4e7] pl-3 rounded-[12px]"
                        >
                            <option value="">Selecciona una bodega</option>
                            {bodegas.map(bodega => (
                                <option key={bodega.codigo_Bodega} value={bodega.codigo_Bodega}>
                                    {bodega.Nombre_bodega}
                                </option>
                            ))}
                        </select>
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
