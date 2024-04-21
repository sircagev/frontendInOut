import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import swal from 'sweetalert';
import { toast, ToastContainer } from 'react-toastify';
import { FaExclamationCircle } from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';

export const Categorias = () => {

    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const [UseCategorias, setCategorias] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [editedNombreCategoria, setEditedNombreCategoria] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = UseCategorias.slice(startIndex, startIndex + itemsPerPage) // Obtener los elementos que se mostrarán en la página actu

    const [values, setValues] = useState(
        {
            Nombre_Categoria: "",
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

        // Verificar si el campo de nombre de categoría está vacío o contiene números
        if (!values.Nombre_Categoria.trim() || /\d/.test(values.Nombre_Categoria.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; // Salir de la función sin enviar el formulario
        } else {
            setErrorMessage('');
        }

        try {
            // Si no hay ningún mensaje de error, enviar el formulario
            const response = await axios.post('http://localhost:3000/categoria/registrar', values);
            if (response.status === 200) {
                ListarCategorias();
                setValues({ Nombre_Categoria: '' }); // Resetear el formulario después de enviarlo
                onClose();
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
        setValues({ Nombre_Categoria: '' });
        setErrorMessage('');
    };

    const [codigoCategoria, setCodigoCategoria] = useState('');

    const ListarCategorias = async () => {
        try {
            let response;
            console.log(codigoCategoria)
            if (codigoCategoria.trim() !== '') {
                // Realizar una solicitud específica para obtener la categoría por su código
                response = await axios.get(`http://localhost:3000/categoria/buscar/${codigoCategoria}`);
                console.log(response.data);
                setCategorias(response.data.categoria ? response.data.categoria : []);
                setPage(1)
            } else {
                // Obtener todos las categorías si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/categoria/listar');
                setCategorias(response.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const DesactivarCategorias = async (codigo_Categoria, estado) => {
        let mensaje;

        if (estado === 'Activo') {
            mensaje = "¿Desea desactivar la categoría?";
        } else if (estado === 'Inactivo') {
            mensaje = "¿Desea reactivar la categoría?";
        }

        swal({
            title: "¿Está seguro?",
            text: mensaje,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDesactivar) => {
            if (willDesactivar) {
                await axios.put(`http://localhost:3000/categoria/desactivar/${codigo_Categoria}`)
                    .then(response => {
                        setDesactivar(response.data);
                        ListarCategorias(); // Vuelve a cargar la lista completa de categorías
                        swal("¡Se ha actualizado el estado correctamente!", {
                            icon: "success",
                            button: false,
                            timer: 2000,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                swal("La categoría está segura.");
            }
        });
    };

    const handleInfo = (codigo_Categoria) => {
        const categoria = UseCategorias.find((categoria) => categoria.codigo_Categoria === codigo_Categoria);
        if (categoria) {
            setSelectedCategoria(categoria);
            setEditedNombreCategoria(categoria.Nombre_Categoria);
            onOpenInfo();
        } else {
            console.log('La categoría no se encontró');
        }
    };


    const handleEdit = async () => {
        try {
            if (!editedNombreCategoria.trim() || /^\d+$/.test(editedNombreCategoria.trim())) {
                swal({
                    title: "Datos incompletos o inválidos",
                    text: "Ingrese un nombre, no puede tener números.",
                    icon: "warning",
                    buttons: false, // Ocultar el botón "Aceptar"
                    timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
                });
                return;
            }

            await axios.put(`http://localhost:3000/categoria/actualizar/${selectedCategoria.codigo_Categoria}`, {
                Nombre_Categoria: editedNombreCategoria,
            });
            ListarCategorias();
            onCloseInfo();
            swal({
                title: "Actualización exitosa",
                text: "La categoría se ha actualizado correctamente.",
                icon: "success",
                buttons: false, // Ocultar el botón "Aceptar"
                timer: 2000, // Cerrar el SweetAlert automáticamente después de 2 segundos
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredCategorias = UseCategorias.filter(
            (categoria) =>
                categoria.codigo_Categoria.toLowerCase().includes(codigoCategoria.toLowerCase()) ||
                categoria.Nombre_Categoria.toLowerCase().includes(codigoCategoria.toLowerCase())
        );
        setCategorias(filteredCategorias);
        // Vuelve a cargar la lista completa de categorías actualizada
        ListarCategorias();
    };

    useEffect(() => {
        ListarCategorias()
    }, [codigoCategoria])


    return (
        <div className='w-full flex flex-col justify-center items-center mt-[50px]'>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='flex gap-4 w-[90%]'>
                    <Button className='bg-[#3d7948] mb-3 w-[150px] text-[14px] text-white font-semibold' onPress={onOpen}>Registrar Categoría</Button>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Categoría'
                            onChange={(e) => {
                                setCodigoCategoria(e.target.value);
                                handleFilter();
                            }}

                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3d7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                                <ModalHeader className="flex flex-col gap-1">Registrar Nueva Categoría</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleForm}>
                                        <div className='flex justify-center items-center'></div>
                                        <div class="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Nombre Categoría'
                                                name='Nombre_Categoria'
                                                value={values.Nombre_Categoria}
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
                                        <div className='flex justify-end gap-3 mb-3'>
                                            <Button color="danger" className='bg-[#BF2A50] font-bold text-white' variant="light" onPress={onCloseModal}>
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
                            <ModalHeader className='flex flex-col gap-1'>Información de Categoría</ModalHeader>
                            <ModalBody>
                                <div className='relative' data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Categoría'
                                        value={editedNombreCategoria}
                                        onChange={(e) => setEditedNombreCategoria(e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='danger' className='bg-[#BF2A50] font-bold text-white' onPress={onCloseInfo}>
                                    Cancelar
                                </Button>
                                <Button className='font-bold text-white' color="success" onPress={handleEdit}>
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
                                total={Math.ceil(UseCategorias.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    className="w-[90%]" // Agregar la clase mx-auto para centrar horizontalmente
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3d7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3d7948] text-white' key="nombre">NOMBRE</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3d7948] text-white' key="creacion">CREACIÓN</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3d7948] text-white' key="estado">ESTADO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3d7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(categoria => (
                            <TableRow className='text-center font-semibold' key={categoria.codigo_Categoria}>
                                <TableCell className='font-semibold'>{categoria.codigo_Categoria}</TableCell>
                                <TableCell className='font-semibold'>{categoria.Nombre_Categoria}</TableCell>
                                <TableCell className='font-semibold'>{new Date(categoria.fecha_creacion).toLocaleDateString()}</TableCell>

                                <TableCell className='font-semibold'>{categoria.estado}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button
                                        color={categoria.estado === 'Inactivo' ? 'success' : 'danger'}
                                        className={`${categoria.estado === 'Inactivo' ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`}
                                        onClick={() => { DesactivarCategorias(categoria.codigo_Categoria, categoria.estado) }}
                                        style={{ fontSize: '15px' }}
                                    >
                                        {categoria.estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                                    </Button>
                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => { handleInfo(categoria.codigo_Categoria); }} style={{ fontSize: '15px' }}>
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
