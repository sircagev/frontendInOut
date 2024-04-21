import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, useBadge, Select, SelectItem } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { FaExclamationCircle } from 'react-icons/fa';
import swal from 'sweetalert';

export const Ubicacion = () => {

    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    const [UseUbicacion, setUbicacion] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [UseBodega, SetBodega] = useState([]);


    const [itemsPerPage, setItemsPerPage] = useState(5);
    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = UseUbicacion.slice(startIndex, startIndex + itemsPerPage)

    // Función para obtener el valor de una clave específica de un objeto
    const getKeyValue = (item, key) => {
        return item[key];
    };



    const [codigoUbicacion, setCodigoUbicacion] = useState('');

    const ListarUbicacion = async () => {
        try {
            let response;
            console.log(codigoUbicacion)
            if (codigoUbicacion.trim() !== '') {
                // Realizar una solicitud específica para obtener la categoría por su código
                response = await axios.get(`http://localhost:3000/ubicacion/buscar/${codigoUbicacion}`);
                console.log(response.data);
                setUbicacion(response.data.Ubicacion ? response.data.Ubicacion : []);

            } else {
                // Obtener todos las categorías si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/ubicacion/listar');
                setUbicacion(response.data || []);
                setPage(1)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const ListarBodegas = async () => {
        try {
            await axios.get('http://localhost:3000/bodega/listar')
                .then(response => {
                    SetBodega(response.data)

                })
        } catch {

        }
    }

    const [values, setValues] = useState(
        {
            Nombre_ubicacion: "",
            fk_bodega: "",
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

    const [errorUbicacion, setErrorMessage] = useState('');
    const [errorBodega, setErrorBodega] = useState('');

    const handleForm = async (event) => {
        event.preventDefault();

        // Verificar si alguno de los campos está vacío
        let hasError = false;

        if (!values.Nombre_ubicacion.trim()) {
            setErrorMessage('El nombre de la ubicación no puede estar vacío.');
            hasError = true;
        } else {
            setErrorMessage('');
        }

        if (!values.fk_bodega.trim()) {
            setErrorBodega('El select de bodega no puede estar vacío.');
            hasError = true;
        } else {
            setErrorBodega('');
        }

        if (hasError) {
            return;
        }


        try {
            const response = await axios.post('http://localhost:3000/ubicacion/registrar', values);
            if (response.status === 200) {
                ListarUbicacion();
                setValues({ Nombre_ubicacion: '', fk_bodega: '' }); // Resetear el formulario después de enviarlo
                onClose()

                swal({
                    title: "Registro exitoso",
                    text: "La ubicación se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearForm = () => {
        setValues({ Nombre_ubicacion: '', fk_bodega: '' });
        setErrorMessage('');
        setErrorBodega('');
        setSelectedUbicacion(null);
        setEditedUbicacion('');
    };



    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
    const [selectedUbicacion, setSelectedUbicacion] = useState(null);
    const [editedUbicacion, setEditedUbicacion] = useState('');

    const handleInfo = (codigo_Detalle) => {
        const ubicacion = UseUbicacion.find((ubicacion) => ubicacion.codigo_Detalle === codigo_Detalle);
        if (ubicacion) {
            setSelectedUbicacion(ubicacion);
            setEditedUbicacion({
                Nombre_ubicacion: ubicacion.Nombre_ubicacion,
                fk_bodega: ubicacion.fk_bodega,
            });
            console.log(ubicacion);
            onOpenInfo();
        } else {
            console.log('La ubicación no se encontró');
        }
    };

    const handleEditUbicacion = async () => {
        // Verificar si el nombre de la ubicación está vacío o es numérico
        if (!editedUbicacion.Nombre_ubicacion.trim() || !isNaN(editedUbicacion.Nombre_ubicacion)) {
            swal({
                title: "Error",
                text: "No puede estar vacio el nombre y no de ser numerico",
                icon: "error",
                buttons: false,
                timer: 2000,
            });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/ubicacion/actualizar/${selectedUbicacion.codigo_Detalle}`, {
                Nombre_ubicacion: editedUbicacion.Nombre_ubicacion,
                fk_bodega: editedUbicacion.fk_bodega // Se mantiene el valor de fk_bodega sin validación
            });
            ListarUbicacion();
            // Cerrar el modal de información
            onCloseInfo();
            if (response.status === 200) {
                swal({
                    title: "Actualización exitosa",
                    text: "La ubicación se ha actualizado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
            } else {
                swal({
                    title: "Error",
                    text: "Hubo un error al actualizar la ubicación.",
                    icon: "error",
                    buttons: false,
                    timer: 2000,
                });
            }
        } catch (error) {
            console.log(error);
            swal({
                title: "Error",
                text: "Hubo un error al actualizar la ubicación.",
                icon: "error",
                buttons: false,
                timer: 2000,
            });
        }
    };


    const DesactivarUbicacion = async (codigo_Detalle, estado) => {
        let mensaje;

        if (estado === 'activo') {
            mensaje = "¿Desea desactivar la ubicación?";
        } else if (estado === 'inactivo') {
            mensaje = "¿Desea reactivar la ubicación?";
        }

        swal({
            title: "¿Está seguro?",
            text: mensaje,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDesactivar) => {
            if (willDesactivar) {
                await axios.put(`http://localhost:3000/ubicacion/desactivar/${codigo_Detalle}`)
                    .then(response => {
                        setDesactivar(response.data);
                        ListarUbicacion(); // Vuelve a cargar la lista completa de ubicaciones
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
                swal("La ubicación está segura.");
            }
        });
    };


    useEffect(() => {
        ListarUbicacion()
        ListarBodegas()
    }, [codigoUbicacion])

    return (
        <div className='w-[full] flex flex-col justify-center items-center mt-[50px]'>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='flex w-[90%] gap-3'>
                    <Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Ubicación</Button>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Empaque'
                            onChange={(e) => {
                                setCodigoUbicacion(e.target.value)
                            }}
                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                                <ModalHeader className="flex flex-col gap-1">Registrar Nueva Ubicación</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleForm}>

                                        <div class="relative mb-4 h-[65px]" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Ubicación'
                                                name='Nombre_ubicacion'
                                                value={values.Nombre_ubicacion}
                                                onChange={handleInputChange}
                                                className="w-full"
                                            />
                                            {errorUbicacion && (
                                                <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                                    <FaExclamationCircle className="mr-1" />
                                                    {errorUbicacion}
                                                </div>
                                            )}
                                        </div>
                                        <div class="relative mb-4 h-[65px]" data-twe-input-wrapper-init>
                                            <select name="fk_bodega" required onChange={handleInputChange} label='Seleccione una Bodega' class="bg-[#F4F4F5] border border-gray-300 w-full h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option selected disabled>Seleccione un tipo de elemento</option>
                                                {UseBodega.map((bodega) => (
                                                    <option
                                                    value={bodega.codigo_Bodega}
                                                        key={bodega.fk_bodega}
                                                    >
                                                        {bodega.Nombre_bodega}
                                                    </option>
                                                ))}
                                            </select>
                                            {errorBodega && (
                                                <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                                    <FaExclamationCircle className="mr-1" />
                                                    {errorBodega}
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

                                <div class="relative" data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Ubicación'
                                        name='Nombre_ubicacion'
                                        value={editedUbicacion.Nombre_ubicacion}
                                        onChange={(e) => setEditedUbicacion({ ...editedUbicacion, Nombre_ubicacion: e.target.value })}
                                    />
                                </div>
                                <div class="relative" data-twe-input-wrapper-init>
                                    <select
                                        name="fk_bodega"
                                        value={editedUbicacion.fk_bodega}
                                        onChange={(e) => setEditedUbicacion({ ...editedUbicacion, fk_bodega: e.target.value })}
                                        className="bg-[#F4F4F5] w-full border border-gray-300 h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option disabled selected>Seleccione una Bodega</option>
                                        {UseBodega.map(bodega => (
                                            <option
                                                value={bodega.codigo_Bodega}
                                            >
                                                {bodega.Nombre_bodega}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color='danger' className='bg-[#BF2A50] font-bold text-white' onPress={onCloseInfo}>
                                    Cancelar
                                </Button>
                                <Button className='font-bold text-white' color="success" onPress={handleEditUbicacion}>
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
                                total={Math.ceil(UseUbicacion.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    className="w-[90%]" // Agregar la clase mx-auto para centrar horizontalmente
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">NOMBRE</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="bodega">BODEGA</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="creacion">CREACION</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="estado">ESTADO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(ubicacion => (
                            <TableRow className='text-center font-semibold' key={ubicacion.codigo_Detalle}>
                                <TableCell className='font-semibold'>{ubicacion.codigo_Detalle}</TableCell>
                                <TableCell className='font-semibold'>{ubicacion.Nombre_ubicacion}</TableCell>
                                <TableCell className='font-semibold'>{ubicacion.Nombre_bodega}</TableCell>
                                <TableCell className='font-semibold'>{new Date(ubicacion.fecha_creacion).toLocaleDateString()}</TableCell>
                                <TableCell className='font-semibold'>{ubicacion.estado}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button
                                        color={ubicacion.estado === 'Inactivo' ? 'success' : 'danger'}
                                        className={`bg-${ubicacion.estado === 'Inactivo' ? 'green-500' : 'red-500'} text-white font-semibold`}
                                        onClick={() => { DesactivarUbicacion(ubicacion.codigo_Detalle, ubicacion.estado) }}
                                        style={{ fontSize: '15px' }}
                                    >
                                        {ubicacion.estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                                    </Button>

                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => { handleInfo(ubicacion.codigo_Detalle); }} style={{ fontSize: '15px' }}>
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
