import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { FaExclamationCircle } from 'react-icons/fa';
import swal from 'sweetalert';

export const Empaque = () => {


    const [UseEmpaques, setEmpaques] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [selectedEmpaque, setSelectedEmpaque] = useState(null);
    const [editedNombreEmpaque, setEditedNombreEmpaque] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const itemsPerPage = 7;
    // Índice del primer elemento en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
    const itemsOnCurrentPage = UseEmpaques.slice(startIndex, startIndex + itemsPerPage);

    // Función para obtener el valor de una clave específica de un objeto
    const getKeyValue = (item, key) => {
        return item[key];
    };

    const [values, setValues] = useState(
        {
            Nombre_Empaque: "",
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
        if ((!values.Nombre_Empaque.trim()) || /\d/.test(values.Nombre_Empaque.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return;
        } else {
            setErrorMessage('');
        }

        try {
            const response = await axios.post('http://localhost:3000/empaque/registrar', values);
            if (response.status === 200) {
                ListarEmpaque();
                setValues({ Nombre_Empaque: '' }); // Resetear el formulario después de enviarlo
                onClose()

                swal({
                    title: "Registro exitoso",
                    text: "La categoría se ha registrado correctamente.",
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
        setValues({ Nombre_Empaque: '' });
        setErrorMessage('');
      };

    const [codigoEmpaque, setCodigoEmpaque] = useState('');

    const ListarEmpaque = async () => {
        try {
            let response;
            console.log(codigoEmpaque)
            if (codigoEmpaque.trim() !== '') {
                // Realizar una solicitud específica para obtener la categoría por su código
                response = await axios.get(`http://localhost:3000/empaque/buscar/${codigoEmpaque}`);
                console.log(response.data);
                setEmpaques(response.data.Empaque ? response.data.Empaque : []);
                setPage(1)
            } else {
                // Obtener todos las categorías si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/empaque/listar');
                console.log(response.data);
                setEmpaques(response.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const DesactivarEmpaque = async (codigo_Empaque, estado) => {
        let mensaje;

        if (estado === 'Activo') {
            mensaje = "¿Desea desactivar el empaque?";
        } else if (estado === 'Inactivo') {
            mensaje = "¿Desea reactivar el empaque?";
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
                    await axios.put(`http://localhost:3000/empaque/desactivar/${codigo_Empaque}`);
                    const empaqueVisible = UseEmpaques.find(empaque => empaque.codigo_Empaque === codigo_Empaque);
                    if (empaqueVisible) {
                        ListarEmpaque(); // Actualizar la lista completa de empaques
                    }
                    swal("¡Se ha desactivado correctamente!", {
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                swal("El empaque está seguro.");
            }
        });
    };


    const handleInfo = (codigo_Empaque) => {
        const empaque = UseEmpaques.find((empaque) => empaque.codigo_Empaque === codigo_Empaque);
        if (empaque) {
            setSelectedEmpaque(empaque);
            setEditedNombreEmpaque(empaque.Nombre_Empaque);
            onOpenInfo();
        } else {
            console.log('El empaque no se encontró');
        }
    };

    const handleEditEmpaque = async () => {
        try {
            // Verificar si editedNombreEmpaque tiene un valor válido
            if (!editedNombreEmpaque.trim() || /^\d+$/.test(editedNombreEmpaque.trim())) {
                swal({
                    title: "Datos incompletos",
                    text: "Ingrese un nombre, no pude tener números.",
                    icon: "warning",
                    buttons: false, // Ocultar el botón "Aceptar"
                    timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
                });
                return;
            }

            // Realizar la solicitud PUT para actualizar el empaque
            await axios.put(`http://localhost:3000/empaque/actualizar/${selectedEmpaque.codigo_Empaque}`, {
                Nombre_Empaque: editedNombreEmpaque,
                // Otros campos que desees actualizar
            });

            // Actualizar la lista de empaques
            ListarEmpaque();

            // Cerrar el modal de información
            onCloseInfo();

            swal({
                title: "Actualización exitosa",
                text: "El empaque se ha actualizado correctamente.",
                icon: "success",
                buttons: false, // Ocultar el botón "Aceptar"
                timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
            });
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        ListarEmpaque()
    }, [codigoEmpaque])

    return (
        <div className='w-90% flex justify-center mt-[70px]'>

            <div className=''>
                <div className='flex gap-3'>
                    <Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Empaques</Button>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Empaque'
                            onChange={(e) => {
                                setCodigoEmpaque(e.target.value)
                            }}
                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <FaSearch className='w-[20px] h-auto ' />
                        </button>
                    </div>
                </div>
                <Modal isOpen={isOpen} onClose={() => { onClose(); clearForm(); }} className='my-auto'>
                    <ModalContent>
                        {(onCloseModal) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Registrar Nuevo Empaque</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleForm}>
                                        <div class="relative mb-4 h-[65px]" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Nombre Empaque'
                                                name='Nombre_Empaque'
                                                value={values.Nombre_Empaque}
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
                                        <div>
                                        <div className='flex justify-end gap-3 mb-3'>
                                            <Button color="danger" className='font-bold text-white bg-[#BF2A50]' onPress={onCloseModal}>
                                                Cancelar
                                            </Button>
                                            <Button className='font-bold text-white' color="success" type='submit'>
                                                Registrar
                                            </Button>
                                        </div>
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
                            <ModalHeader className='flex flex-col gap-1'>Información de Empaque</ModalHeader>
                            <ModalBody>
                                <div className='relative' data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Categoría'
                                        value={editedNombreEmpaque}
                                        onChange={(e) => setEditedNombreEmpaque(e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className='bg-[#BF2A50] font-bold text-white' onPress={onCloseInfo}>
                                    Cancelar
                                </Button>
                                <Button className='font-bold text-white' color="success" onPress={handleEditEmpaque}>
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
                                total={Math.ceil(UseEmpaques.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "w-[900px]",
                    }}
                    className="mx-auto" // Agregar la clase mx-auto para centrar horizontalmente
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">NOMBRE</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="creacion">CREACIÓN</TableColumn>
                        
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="estado">ESTADO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(empaque => (
                            <TableRow className='text-center font-semibold' key={empaque.codigo_Empaque}>
                                <TableCell className='font-semibold'>{empaque.codigo_Empaque}</TableCell>
                                <TableCell className='font-semibold'>{empaque.Nombre_Empaque}</TableCell>
                                <TableCell className='font-semibold'>{new Date(empaque.fecha_creacion).toLocaleDateString()}</TableCell>
                                <TableCell className='font-semibold'>{empaque.estado}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button
                                        color={empaque.estado === 'Inactivo' ? 'success' : 'danger'}
                                        className={`bg-${empaque.estado === 'Inactivo' ? 'green-500' : 'red-500'} text-white font-semibold`}
                                        onClick={() => { DesactivarEmpaque(empaque.codigo_Empaque, empaque.estado) }}
                                        style={{ fontSize: '15px' }}
                                    >
                                        {empaque.estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                                    </Button>
                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => { handleInfo(empaque.codigo_Empaque); }} style={{ fontSize: '15px' }}>
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
