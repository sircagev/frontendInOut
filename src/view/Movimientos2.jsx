import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/react";
import { ListarElementos, ListarUsuarios } from '../functions/Listar';

export const Movimientos2 = () => {
    //Sirve para guardar la información que se traiga al listar los datos 
    const [movimientos, setMovimientos] = useState([]);
    const [detallesMovimiento, setDetallesMovimiento] = useState([]);

    const [nuevosDetalles, setNuevosDetalles] = useState([]);

    const [dataElements, setDataElements] = useState([]);
    const [dataUsuarios, setDataUsuarios] = useState([]);

    //Para guardar la informacion del codigo de movimiento a usar
    const [codigoMovimiento, setCodigoMovimiento] = useState('');

    // Definición de la función agregarNuevoDetalle
    // Agrega un nuevo detalle con su elemento asociado
    const agregarNuevoDetalle = () => {
        setNuevosDetalles([...nuevosDetalles, { Movimiento: '', Elemento: '', Fecha: '', Cantidad: '', Recibe: '', Entrega: '' }]);
    };

    const eliminarNuevoDetalle = (index) => {
        const detallesActualizados = [...nuevosDetalles];
        detallesActualizados.splice(index, 1);
        setNuevosDetalles(detallesActualizados);
    };

    // Función para agregar un nuevo detalle al detalle del movimiento
    const agregarDetalleMovimiento = async (nuevoDetalle) => {
        try {
            nuevoDetalle.Movimiento = codigoMovimiento;
            console.log(nuevoDetalle)

            const response = await axios.post(`http://localhost:3000/movimientos/${nuevoDetalle.Movimiento}/aniadirDetalle`, nuevoDetalle)
            
            if (response.status === 200) {
                handleInfo(codigoMovimiento);
            }

        } catch (error) {
            console.log(error)
        }

    };

    const handleInputChange = (index, fieldName, value) => {
        const updatedDetalles = [...nuevosDetalles];
        const detalle = updatedDetalles[index];

        if (fieldName === 'elemento') {
            detalle.Elemento = value;
        } else if (fieldName === 'fecha') {
            detalle.Fecha = value || null;
        } else if (fieldName === 'cantidad') {
            detalle.Cantidad = value;
        } else if (fieldName === 'recibe') {
            detalle.Recibe = value;
        } else if (fieldName === 'entrega') {
            detalle.Entrega = value;
        }

        updatedDetalles[index] = detalle;
        setNuevosDetalles(updatedDetalles);
    };


    

    //Para guardar la informacion del editar o no
    const [editable, setEditable] = useState(false);

    //Inicializar page
    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);

    const itemsPerPage = 6;
    // Índice del primer elemento en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
    const itemsOnCurrentPage = movimientos.slice(startIndex, startIndex + itemsPerPage);

    const size = '3xl'; // Establece el tamaño del modal como '3xl'

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handleInfo = async (codigo) => {
        try {
            const response = await axios.get(`http://localhost:3000/movimientos/${codigo}/detalles`);
            console.log(response);
            setCodigoMovimiento(codigo)
            setDetallesMovimiento(response.data.datos ? response.data.datos : []);
            onOpen();
        } catch (error) {

        }
    };

    const listarMovimientos = async () => {
        try {
            let response;
            if (codigoMovimiento.trim() !== '') {

                // Realizar una solicitud específica para obtener un movimiento por su código
                response = await axios.get(`http://localhost:3000/movimientos/buscar/${codigoMovimiento}`);
                setMovimientos(response.data.Movimiento ? response.data.Movimiento : []);

            } else {
                // Obtener todos los movimientos si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/movimientos/listar');
                setMovimientos(response.data.datos || []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const listarDetallesMovimiento = async () => {
        try {
            // Realizar una solicitud específica para obtener un movimiento por su código
            let response = await axios.get(`http://localhost:3000/movimientos/buscar/${codigoMovimiento}`);
            console.log(response);
            setDetallesMovimiento(response.data.datos ? response.data.datos : []);

        } catch (error) {
            console.log(error);
        }
    }

    const toggleEditables = () => {
        setEditable(!editable);
    }

    const fectchData = async () => {
        try {
            const itemsElements = await ListarElementos();
            const itemsUsers = await ListarUsuarios();
            setDataElements(itemsElements);
            setDataUsuarios(itemsUsers);
            console.log(itemsUsers);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarMovimientos();
        fectchData();
    }, [codigoMovimiento])

    return (
        <div className='w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto'>
            <div className='w-[90%]'>
                <div className='flex gap-3'>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md mb-2'
                            placeholder='Código Movimiento'
                            onChange={(e) => {
                                setCodigoMovimiento(e.target.value)
                            }}
                        />
                        <button
                            className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                        >
                            <FaSearch className='w-[20px] h-auto ' />
                        </button>
                    </div>
                </div>
                <Modal
                    size="4xl"
                    isOpen={isOpen}
                    onClose={onClose}
                    className='my-auto'
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[22px]">Informacion Detallada</ModalHeader>
                                <ModalBody>
                                    <form action="">
                                        <div className='flex flex-col gap-4'>
                                            <div className='w-full'>
                                                {detallesMovimiento.map((detalle, index) => (
                                                    <div className='w-full mb-3' key={index}>
                                                        <form action="" className='w-full'>
                                                            <div className='flex items-start pl-3 font-bold pb-2'>{detalle.Elemento}</div>
                                                            <div className='flex w-full'>
                                                                <div className='w-[10%] flex justify-center items-centerc text-4xl'> {detalle.Codigo}</div>
                                                                <div className='flex w-[90%] gap-1'>
                                                                    <Input
                                                                        isReadOnly={editable}
                                                                        isRequired
                                                                        key="fecha"
                                                                        type={editable ? "text" : 'date'}
                                                                        label="Fecha"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        defaultValue={detalle.Fecha ? detalle.Fecha.split('T')[0] : 'Sin fecha'}
                                                                    />
                                                                    <Input
                                                                        isReadOnly={editable}
                                                                        isRequired
                                                                        key="cantidad"
                                                                        type="number"
                                                                        label="Cantidad"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        defaultValue={detalle.Cantidad}
                                                                    />
                                                                    <Input
                                                                        isReadOnly={editable}
                                                                        isRequired
                                                                        key="recibio"
                                                                        type="text"
                                                                        label="Recibio"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        defaultValue={detalle.Recibe}
                                                                    />
                                                                    <Input
                                                                        isReadOnly={editable}
                                                                        isRequired
                                                                        key="entrego"
                                                                        type="text"
                                                                        label="Entrego"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        defaultValue={detalle.Entrega}
                                                                    />
                                                                    <div>
                                                                        <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={toggleEditables} style={{ fontSize: '15px' }}>
                                                                            {editable ? "Editar" : "Cancelar"}
                                                                        </Button>
                                                                        {editable ? "" : <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={() => alert('Realizando cambio')} style={{ fontSize: '15px' }}>
                                                                            {editable ? "Editar" : "Realizar Cambios"}
                                                                        </Button>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                ))}
                                                {nuevosDetalles.map((detalle, index) => (
                                                    <div className='w-full mb-3' key={index}>
                                                        <form action="" className='w-full'>
                                                            {/* Aquí renderizas los campos de entrada para el elemento y los detalles */}
                                                            <div className='flex w-full'>
                                                                <div className='flex w-full gap-1'>
                                                                    <Autocomplete
                                                                        label="Select an element"
                                                                        placeholder="Search an animal"
                                                                        isRequired
                                                                        variant="underlined"
                                                                        selectedKey={detalle.Elemento}
                                                                        onSelectionChange={(value) => handleInputChange(index, 'elemento', value)}
                                                                    >
                                                                        {dataElements.map((element) => (
                                                                            <AutocompleteItem
                                                                                key={element.Codigo_elemento}
                                                                                value={element.Codigo_elemento}
                                                                            >
                                                                                {element.Nombre_elemento}
                                                                            </AutocompleteItem>
                                                                        ))}
                                                                    </Autocomplete>
                                                                    <Input
                                                                        isRequired
                                                                        type="date"
                                                                        label="Fecha"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        onChange={(e) => handleInputChange(index, 'fecha', e.target.value)}
                                                                        value={detalle.Fecha}
                                                                    />
                                                                    <Input
                                                                        isRequired
                                                                        type="number"
                                                                        label="Cantidad"
                                                                        variant="underlined"
                                                                        labelPlacement="outside"
                                                                        onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)}
                                                                        value={detalle.Cantidad}
                                                                    />
                                                                    <Autocomplete
                                                                        label="Select a user"
                                                                        placeholder="Search a user"
                                                                        isRequired
                                                                        variant="underlined"
                                                                        selectedKey={detalle.Recibe}
                                                                        onSelectionChange={(value) => handleInputChange(index, 'recibe', value)}
                                                                    >
                                                                        {dataUsuarios.map((user) => (
                                                                            <AutocompleteItem
                                                                                key={user.id_usuario}
                                                                                value={user.id_usuario}
                                                                            >
                                                                                {user.nombre_usuario}
                                                                            </AutocompleteItem>
                                                                        ))}
                                                                    </Autocomplete>
                                                                    <Autocomplete
                                                                        label="Select a user"
                                                                        placeholder="Search a user"
                                                                        isRequired
                                                                        variant="underlined"
                                                                        selectedKey={detalle.Entrega}
                                                                        onSelectionChange={(value) => handleInputChange(index, 'entrega', value)}
                                                                    >
                                                                        {dataUsuarios.map((user) => (
                                                                            <AutocompleteItem
                                                                                key={user.id_usuario}
                                                                                value={user.id_usuario}
                                                                            >
                                                                                {user.nombre_usuario}
                                                                            </AutocompleteItem>
                                                                        ))}
                                                                    </Autocomplete>


                                                                    <div>
                                                                        <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={() => {
                                                                            agregarDetalleMovimiento(detalle)
                                                                            eliminarNuevoDetalle(index)
                                                                        }} style={{ fontSize: '15px' }}>
                                                                            Registrar Detalle
                                                                        </Button>
                                                                        <button onClick={() => eliminarNuevoDetalle(index)}>Eliminar</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                ))}
                                                <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={agregarNuevoDetalle} style={{ fontSize: '15px' }}>
                                                    Añadir Detalle
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='w-full mt-5 flex justify-end gap-2 text-white'>
                                            <Button style={{ width: '100px' }} className='font-bold bg-[#BF2A50]' color="danger" onPress={onClose}>
                                                Cerrar
                                            </Button>
                                            <Button style={{ width: '100px' }} className='font-bold text-white' color="success" type='submit'>
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
                                total={Math.ceil(movimientos.length / itemsPerPage)}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    className="mx-auto"// Agregar la clase mx-auto para centrar horizontalmente
                >
                    <TableHeader>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">FECHA</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="stock">USUARIO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="tipo">TIPO MOVIMIENTO</TableColumn>
                        <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(elemento => (
                            <TableRow className='text-center font-semibold' key={elemento.Codigo}>
                                <TableCell className='font-semibold'>{elemento.Codigo}</TableCell>
                                <TableCell className='font-semibold'>{elemento.Fecha}</TableCell>
                                <TableCell className='font-semibold'>{elemento.Usuario}</TableCell>
                                <TableCell className='font-semibold'>{elemento.Tipo}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                    <Button color='primary' className='font-semibold bg-[#1E6C9B] hover:bg-[#E4B803]' onClick={() => {
                                        handleInfo(elemento.Codigo);
                                    }}
                                        style={{ fontSize: '15px' }}>
                                        Info
                                    </Button>
                                    <Button color="danger" className='font-semibold bg-[#BF2A50] hover:bg-[#BF2A50]' onClick={() => { desactivarElementos(elemento.Codigo) }} style={{ fontSize: '15px' }}>
                                        Desactivar
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
