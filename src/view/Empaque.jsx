import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

export const Empaque = () => {


    const [UseEmpaques, setEmpaques] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [selectedEmpaque, setSelectedEmpaque] = useState(null);
    const [editedNombreEmpaque, setEditedNombreEmpaque] = useState('');


    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const {isOpen, onOpen, onOpenChange,  onClose} = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const itemsPerPage = 5;
    // Índice del primer elemento en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
    const itemsOnCurrentPage = UseEmpaques.slice(startIndex, startIndex + itemsPerPage);

    // Función para obtener el valor de una clave específica de un objeto
    const getKeyValue = (item, key) => {
        return item[key];
    };

    const [values,setValues] = useState(
        {
            Nombre_Empaque: "",
        }
    )
    
    const handleInputChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };
    
    const handleForm = async (event) => {
        event.preventDefault();
        if (!values.Nombre_Empaque.trim()) {
            alert('Por favor ingrese un nombre de empaque');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/empaque/registrar', values);
            if (response.status === 200) {
                ListarEmpaque();
                setValues({ Nombre_Empaque: '' }); // Resetear el formulario después de enviarlo
                onClose()
            }
        } catch (error) {
            console.log(error);
        }
    };

    const ListarEmpaque = async () => {
        await axios.get('http://localhost:3000/empaque/listar')
            .then(response => {
                setEmpaques(response.data)
            })
    };

    const DesactivarEmpaque = async (codigo_Empaque) => {
        await axios.put(`http://localhost:3000/empaque/desactivar/${codigo_Empaque}`)
            .then(response => {
                setDesactivar(response.data)
                ListarEmpaque();
            })
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
            if (!editedNombreEmpaque.trim()) {
                console.log('El nombre del empaque no puede estar vacío');
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
        } catch (error) {
            console.log(error);
        }
    };
    
    
    
    
    

    useEffect(() => {
        ListarEmpaque()
    }, [])

  return (
    <div className='w-90% flex justify-center mt-[70px]'>
        
        <div className=''>
            <div className='flex gap-3'>
                <Button className='bg-[#39A900] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Categoría</Button>
                <div className='flex justify-center'>
                    <input 
                    type="text" 
                    className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Categoría' 
                    />
                    <button
                        class="flex justify-center items-center middle none center mr-4 bg-blue-500 h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                        >
                        <FaSearch className='w-[20px] h-auto ' />
                    </button>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Registrar Nuevo Empaque</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleForm}>
                                <div class="relative mb-3" data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Empaque'
                                        name='Nombre_Empaque'
                                        value={values.Nombre_Empaque}
                                        onChange={handleInputChange}
                                    />                    
                                </div>
                                <div className='flex justify-end gap-3 mt-5'>
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
            <Modal isOpen={isOpenInfo} onClose={onCloseInfo}>
            <ModalContent>
                        <>
                            <ModalHeader className='flex flex-col gap-1'>Información de Empaque</ModalHeader>
                            <ModalBody>
                                <div className='relative mb-3' data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Categoría'
                                        value={editedNombreEmpaque}
                                        onChange={(e) => setEditedNombreEmpaque(e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='danger' variant='light' onPress={onCloseInfo}>
                                    Cancelar
                                </Button>
                                <Button className='bg-[#39A900] font-semibold' onPress={handleEditEmpaque}>
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
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">CÓDIGO</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">NOMBRE</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">ADMINISTRAR</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                    {itemsOnCurrentPage.map(empaque => (
                        <TableRow className='text-center font-semibold' key={empaque.codigo_Empaque}>
                            <TableCell className='font-semibold'>{empaque.codigo_Empaque}</TableCell>
                            <TableCell className='font-semibold'>{empaque.Nombre_Empaque}</TableCell>
                            <TableCell className='flex gap-2 justify-center'>
                                    <Button color="danger" onClick={()=> {DesactivarEmpaque(empaque.codigo_Empaque)}} style={{fontSize: '15px'}}>
                                        Desactivar
                                    </Button>  
                                    <Button color='primary' onClick={() => {handleInfo(empaque.codigo_Empaque);}} style={{ fontSize: '15px' }}>
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
