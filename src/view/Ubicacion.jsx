import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

export const Ubicacion = () => {

    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const {isOpen, onOpen, onOpenChange,  onClose} = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const [UseUbicacion, setUbicacion] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);

    const itemsPerPage = 5;
    // Índice del primer elemento en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
    const itemsOnCurrentPage = UseUbicacion.slice(startIndex, startIndex + itemsPerPage);

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
        }
        } catch (error) {
        console.log(error);
        }
    };

    const [values,setValues] = useState(
        {
            Nombre_ubicacion: "",
            fk_bodega: "",
        }
    )

    const handleInputChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const handleForm = async (event) => {
        try {
            event.preventDefault();
            console.log(values)
            const response = await axios({
                method: 'post',
                url: `http://localhost:3000/ubicacion/registrar`,
                data: values
            });
            if (response.status === 200) {
                onClose();
                ListarUbicacion();
                setValues({
                    Nombre_ubicacion: "",
                    fk_bodega: "",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const DesactivarUbicacion = async (codigo_Detalle) => {
        await axios.put(`http://localhost:3000/ubicacion/desactivar/${codigo_Detalle}`)
            .then(response => {
                setDesactivar(response.data)
                ListarUbicacion();
            })
    };

    useEffect(() => {
        ListarUbicacion()
    }, [codigoUbicacion])

  return (
    <div className='w-90% flex flex-col justify-center items-center mt-[70px]'>
        <div>
        <div className='flex gap-3'>
            <Button className='bg-[#39A900] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Ubicación</Button>
            <div className='flex justify-center'>
                <input 
                type="text" 
                className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Empaque' 
                onChange={(e) => {
                    setCodigoUbicacion(e.target.value)
                  }}
                />
                <button
                className="flex justify-center items-center middle none center mr-4 bg-blue-500 h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                    <FaSearch className='w-[20px] h-auto ' />
                </button>
                </div>
        </div>
            <Modal isOpen={isOpen} onClose={onClose} className='my-auto'>
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registrar Nueva Ubicación</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleForm}>
                                    <div className='flex gap-3'>
                                        <div class="relative mb-3" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Ubicación'
                                                name='Nombre_ubicacion'
                                                value={values.Nombre_ubicacion}
                                                onChange={handleInputChange}
                                            />                    
                                        </div>
                                        <div class="relative mb-3" data-twe-input-wrapper-init>
                                            <Input
                                                type='text'
                                                label='Bodega'
                                                name='fk_bodega'
                                                value={values.fk_bodega}
                                                onChange={handleInputChange}
                                            />                    
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-3'>
                                        <Button color="danger" variant="light" onPress={onCloseModal}>
                                            Cancelar
                                        </Button>
                                        <Button className='bg-[#39A900]' type='submit'>
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
                            total={Math.ceil(UseUbicacion.length / itemsPerPage)}
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
                        <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">CÓDIGO</TableColumn>
                        <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">NOMBRE</TableColumn>
                        <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="bodega">BODEGA</TableColumn>
                        <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">ADMINISTRAR</TableColumn>
                    </TableHeader>
                    <TableBody items={itemsToShow}>
                        {itemsOnCurrentPage.map(ubicacion => (
                            <TableRow className='text-center font-semibold' key={ubicacion.codigo_Detalle}>
                                <TableCell className='font-semibold'>{ubicacion.codigo_Detalle}</TableCell>
                                <TableCell className='font-semibold'>{ubicacion.Nombre_ubicacion}</TableCell>
                                <TableCell className='font-semibold'>{ubicacion.Nombre_bodega}</TableCell>
                                <TableCell className='flex gap-2 justify-center'>
                                        <Button color="danger" onClick={()=> {DesactivarUbicacion(ubicacion.codigo_Detalle)}} style={{fontSize: '15px'}}>
                                            Desactivar
                                        </Button>  
                                        <Button color='primary' style={{ fontSize: '15px' }}>
                                            Información
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
