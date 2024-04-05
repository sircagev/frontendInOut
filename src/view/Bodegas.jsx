import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import swal from 'sweetalert';

export const Bodega = () => {
    const [bodegas, setBodegas] = useState([]);
    const [codigoBodega, setCodigoBodega] = useState('');
    const [selectedBodega, setSelectedBodega] = useState(null);
    const [editedNombreBodega, setEditedNombreBodega] = useState('');
    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
    const itemsPerPage = 5;

    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = bodegas.slice(startIndex, startIndex + itemsPerPage);

    const getKeyValue = (item, key) => {
        return item[key];
    };

    const [values, setValues] = useState({
        nombreBodega: "",
        ubicacionBodega: "",
    });

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

        console.log("values del form",values)

        if ((!values.nombreBodega.trim()) || /^\d+$/.test(values.nombreBodega.trim())) {
            swal({
                title: "Datos incompletos o inválidos",
                text: "Por favor, ingrese un nombre válido para la bodega.",
                icon: "warning",
                buttons: false,
                timer: 2000,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/bodega/registrar', values);
            if (response.status === 200) {
                ListarBodegas();
                onClose();
                console.log("bodegas", response.data)
                swal({
                    title: "Registro exitoso",
                    text: "La bodega se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
                
            }
            
        } catch (error) {
            console.log(error);
        }
    };
    

    const ListarBodegas = async () => {
        try {
            let response;
            console.log(codigoBodega)
            if (codigoBodega.trim() !== '') {
                response = await axios.get(`http://localhost:3000/bodega/buscar/${codigoBodega}`);
                console.log(response.data);
                setBodegas(response.data.Bodega ? response.data.Bodega : []);
                setPage(1)
            } else {
                response = await axios.get('http://localhost:3000/bodega/listar');
                setBodegas(response.data || []);
                console.log("bodegas", response.data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const DesactivarBodega = async (codigo_Bodega, estado) => {
        let mensaje;

        if (estado === 'activo') {
            mensaje = "¿Desea desactivar la bodega?";
        } else if (estado === 'inactivo') {
            mensaje = "¿Desea reactivar la bodega?";
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
                    await axios.put(`http://localhost:3000/bodega/desactivar/${codigo_Bodega}`);
                    ListarBodegas();
                    swal("¡Se ha desactivado correctamente!", {
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                swal("La bodega está segura.");
            }
        });
    };

    const handleInfo = (codigo_Bodega) => {
        const bodega = bodegas.find((bodega) => bodega.codigo_Bodega === codigo_Bodega);
        if (bodega) {
            setSelectedBodega(bodega);
            setEditedNombreBodega(bodega.nombreBodega);
            onOpenInfo();
        } else {
            console.log('La bodega no se encontró');
        }
    };

    const handleActualizarBodega = (codigo_Bodega) => {
        const bodega = bodegas.find((bodega) => bodega.codigo_Bodega === codigo_Bodega);
        if (bodega) {
            setSelectedBodega(bodega);
            setEditedNombreBodega(bodega.nombreBodega);
            onOpenInfo();
        } else {
            console.log('La bodega no se encontró');
        }
    };

    const handleEditBodega = async () => {
        try {
            if (!editedNombreBodega.trim() || /^\d+$/.test(editedNombreBodega.trim())) {
                swal({
                    title: "Datos incompletos",
                    text: "Ingrese un nombre válido para la bodega.",
                    icon: "warning",
                    buttons: false,
                    timer: 2000,
                });
                return;
            }

            await axios.put(`http://localhost:3000/bodega/actualizar/${selectedBodega.codigo_Bodega}`, {
                nombreBodega: editedNombreBodega,
            });

            ListarBodegas();

            onCloseInfo();

            swal({
                title: "Actualización exitosa",
                text: "La bodega se ha actualizado correctamente.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        ListarBodegas();
    }, [codigoBodega]);

    return (
        <div className='w-90% flex justify-center mt-[70px]'>
            <div className=''>
                <div className='flex gap-3'>
                    <Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Bodega</Button>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md'
                            placeholder='Código Bodega'
                            onChange={(e) => {
                                setCodigoBodega(e.target.value)
                            }}
                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <FaSearch className='w-[20px] h-auto ' />
                        </button>
                    </div>
                </div>
                <Modal isOpen={isOpen} onClose={onClose} className='my-auto'>
                    <ModalContent>
                        {(onCloseModal) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Registrar Nueva Bodega</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleForm}>
                                        <div class="relative mb-3" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Ubicación Bodega'
                                                name='ubicacionBodega'
                                                value={values.ubicacionBodega}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div class="relative mb-3" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Nombre Bodega'
                                                name='nombreBodega'
                                                value={values.nombreBodega}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className='flex justify-end gap-3 mt-3'>
                                            <Button color="danger" className='font-bold text-white bg-[#BF2A50]' onPress={onCloseModal}>
                                                Cancelar
                                            </Button>
                                            <Button className='font-bold text-white' color="success" type='submit'>
                                                Registrar
                                            </Button>
                                        </div>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Modal isOpen={isOpenInfo} onClose={onCloseInfo} className='my-auto'>
                   
                </Modal>
                <Table
                    aria-label="Lista de Bodegas"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={Math.ceil(bodegas.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "w-[900px]",
                    }}
                    className="mx-auto"
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">Nombre</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="ubicacion">Ubicación</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(bodega => (
                            <TableRow className='text-center font-semibold' key={bodega.codigo_Bodega}>
                                <TableCell className='font-semibold'>{bodega.codigo_Bodega}</TableCell>
                                <TableCell className='font-semibold'>{bodega.Nombre_bodega}</TableCell>
                                <TableCell className='font-semibold'>{bodega.ubicacion}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button
                                        color={bodega.estado === 'inactivo' ? 'success' : 'danger'}
                                        className={`bg-${bodega.estado === 'inactivo' ? 'green-500' : 'red-500'} text-white font-semibold`}
                                        onClick={() => { DesactivarBodega(bodega.codigo_Bodega, bodega.estado) }}
                                        style={{ fontSize: '15px' }}
                                    >
                                        {bodega.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
                                    </Button>
                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => { handleInfo(bodega.codigo_Bodega); }} style={{ fontSize: '15px' }}>
                                        Desactivar
                                    </Button>
                                    <Button color='primary' className='bg-[#FFC107] font-semibold' onClick={() => { handleActualizarBodega(bodega.codigo_Bodega); }} style={{ fontSize: '15px' }}>
                                        Actualizar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Bodega;
