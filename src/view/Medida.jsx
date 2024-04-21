import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaExclamationCircle } from 'react-icons/fa';
import { FaSearch } from "react-icons/fa";


export const Medida = () => {

    const [UseMedidas, setMedidas] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [selectedMedida, setSelectedMedida] = useState(null);
    const [editedNombreMedida, setEditedNombreMedida] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = UseMedidas.slice(startIndex, startIndex + itemsPerPage)

    // Función para obtener el valor de una clave específica de un objeto
    const getKeyValue = (item, key) => {
        return item[key];
    };

    const [codigoMedida, setCodigoMedida] = useState('');

    const ListarMedidas = async () => {
        try {
            let response;
            console.log(codigoMedida)
            if (codigoMedida.trim() !== '') {
                // Realizar una solicitud específica para obtener la categoría por su código
                response = await axios.get(`http://localhost:3000/medida/buscar/${codigoMedida}`);
                console.log(response.data);
                setMedidas(response.data.medida ? response.data.medida : []);
                setPage(1)
            } else {
                // Obtener todos las categorías si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/medida/listar');
                setMedidas(response.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [values, setValues] = useState(
        {
            Nombre_Medida: "",
        }
    )

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Convertir la primera letra en mayúscula y el resto en minúscula
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();
        // Verificar si Nombre_Medida tiene un valor válido y no es numérico
        if (!values.Nombre_Medida.trim() || /\d/.test(values.Nombre_Medida.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/medida/registrar', values);
            if (response.status === 200) {
                ListarMedidas();
                setValues({ Nombre_Medida: '' }); // Resetear el formulario después de enviarlo
                onClose()

                swal({
                    title: "Registro exitoso",
                    text: "La medida se ha registrado correctamente.",
                    icon: "success",
                    buttons: false, // Ocultar el botón "Aceptar"
                    timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearForm = () => {
        setValues({ Nombre_Medida: '' });
        setErrorMessage('');
    };


    const DesactivarMedida = async (codigo_medida, estado) => {
        let mensaje;

        if (estado === 'activo') {
            mensaje = "¿Desea desactivar la medida?";
        } else if (estado === 'inactivo') {
            mensaje = "¿Desea reactivar la medida?";
        }

        swal({
            title: "¿Está seguro?",
            text: mensaje,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDesactivar) => {
            if (willDesactivar) {
                try {
                    await axios.put(`http://localhost:3000/medida/desactivar/${codigo_medida}`);
                    const medidaVisible = UseMedidas.find(medida => medida.codigo_medida === codigo_medida);
                    if (medidaVisible) {
                        ListarMedidas(); // Actualizar la lista completa de empaques
                    }
                    swal("¡Se ha actualizado el estado correctamente!", {
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                swal("La medida está segura.");
            }
        });
    };



    const handleInfo = (codigo_medida) => {
        const medida = UseMedidas.find((medida) => medida.codigo_medida === codigo_medida);
        if (medida) {
            setSelectedMedida(medida);
            setEditedNombreMedida(medida.Nombre_Medida);
            onOpenInfo();
        } else {
            console.log('El empaque no se encontró');
        }
    };

    const handleEditMedida = async () => {
        try {
            // Verificar si editedNombreMedida tiene un valor válido
            if (!editedNombreMedida.trim() || /^\d+$/.test(editedNombreMedida.trim())) {
                swal({
                    title: "Datos incompletos o inválidos",
                    text: "Ingrese un nombre, no puede tener números.",
                    icon: "warning",
                    buttons: false, // Ocultar el botón "Aceptar"
                    timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
                });
                return;
            }

            // Realizar la solicitud PUT para actualizar la medida
            await axios.put(`http://localhost:3000/medida/actualizar/${selectedMedida.codigo_medida}`, {
                Nombre_Medida: editedNombreMedida,
                // Otros campos que desees actualizar
            });

            // Actualizar la lista de medidas
            ListarMedidas();

            // Cerrar el modal de información
            onCloseInfo();

            swal({
                title: "Actualización exitosa",
                text: "La medida se ha actualizado correctamente.",
                icon: "success",
                buttons: false, // Ocultar el botón "Aceptar"
                timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
            });
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        ListarMedidas()
    }, [codigoMedida])

    return (
        <div className='w-[full] flex flex-col justify-center items-center mt-[50px]'>
            <div className='w-full flex flex-col justify-center items-center'>
            <div className='flex gap-4 w-[90%]'>
                    <Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Medida</Button>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Medida'
                            onChange={(e) => {
                                setCodigoMedida(e.target.value)
                            }}
                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                        >
                            <FaSearch className='w-[20px] h-auto ' />
                        </button>
                    </div>
                    <select
                        className='w-[55px] h-[40px] pl-2 border-1 rounded-lg border-[#c3c3c6] text-[14px] font-semibold outline-none'
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                        value={itemsPerPage}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <Modal isOpen={isOpen} onClose={() => { onClose(); clearForm(); }} className='my-auto'>
                    <ModalContent>
                        {(onCloseModal) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Registrar Nueva Medida</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleForm}>
                                        <div class="relative mb-4 h-[65px]" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Nombre Medida'
                                                name='Nombre_Medida'
                                                value={values.Nombre_Medida}
                                                onChange={handleInputChange}
                                                className='w-[100%]'
                                            />
                                            {errorMessage && (
                                                <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                                    <FaExclamationCircle className="mr-1" />
                                                    {errorMessage}
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex justify-end gap-3 mb-3'>
                                            <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onPress={onCloseModal}>
                                                Cancelar
                                            </Button>
                                            <Button className='font-bold text-white' color="success" type='submit'>
                                                Registrar
                                            </Button>
                                        </div>
                                    </form>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Modal isOpen={isOpenInfo} onClose={onCloseInfo} className='my-auto'>
                    <ModalContent>
                        <>
                            <ModalHeader className='flex flex-col gap-1'>Información de Medida</ModalHeader>
                            <ModalBody>
                                <div className='relative' data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Medida'
                                        value={editedNombreMedida}
                                        onChange={(e) => setEditedNombreMedida(e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className='bg-[#BF2A50] font-bold text-white' onPress={onCloseInfo}>
                                    Cancelar
                                </Button>
                                <Button className='font-bold text-white' color="success" onPress={handleEditMedida}>
                                    Actualizar Valor
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
                <Table
                    aria-label="Lista de Empaques"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={Math.ceil(UseMedidas.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    
                    className="w-[90%]" // Agregar la clase mx-auto para centrar horizontalmente
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">NOMBRE</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="creacion">CREACIÓN</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="estado">ESTADO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(medida => (
                            <TableRow className='text-center font-semibold' key={medida.codigo_medida}>
                                <TableCell className='font-semibold'>{medida.codigo_medida}</TableCell>
                                <TableCell className='font-semibold'>{medida.Nombre_Medida}</TableCell>
                                <TableCell className='font-semibold'>{new Date(medida.fecha_creacion).toLocaleDateString()}</TableCell>
                                
                                <TableCell className='font-semibold'>{medida.estado}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button
                                        color={medida.estado === 'Inactivo' ? 'success' : 'danger'}
                                        className={`bg-${medida.estado === 'Inactivo' ? 'green-500' : 'red-500'} text-white font-semibold`}
                                        onClick={() => { DesactivarMedida(medida.codigo_medida, medida.estado) }}
                                        style={{ fontSize: '15px' }}
                                    >
                                        {medida.estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                                    </Button>

                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => { handleInfo(medida.codigo_medida); }} style={{ fontSize: '15px' }}>
                                        Info
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
