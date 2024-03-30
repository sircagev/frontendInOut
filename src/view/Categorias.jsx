import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

export const Categorias = () => {

    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    const {isOpen, onOpen, onOpenChange,  onClose} = useDisclosure();
    const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

    const [UseCategorias, setCategorias] = useState([]);
    const [UseDesactivar, setDesactivar] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [editedNombreCategoria, setEditedNombreCategoria] = useState('');
    
    
    const itemsPerPage = 5;
    // Índice del primer elemento en la página actual
    const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
    const itemsOnCurrentPage = UseCategorias.slice(startIndex, startIndex + itemsPerPage);

    // Función para obtener el valor de una clave específica de un objeto
    const getKeyValue = (item, key) => {
        return item[key];
    };
    

    const [values,setValues] = useState(
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
        if (!values.Nombre_Categoria.trim()) {
            alert('Por favor ingrese un nombre de categoría');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/categoria/registrar', values);
            if (response.status === 200) {
                ListarCategorias();
                setValues({ Nombre_Categoria: '' }); // Resetear el formulario después de enviarlo
                onClose()
            }
        } catch (error) {
            console.log(error);
        }
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

        } else {
            // Obtener todos las categorías si no se proporciona ningún código
            response = await axios.get('http://localhost:3000/categoria/listar');
            setCategorias(response.data || []);
        }
        } catch (error) {
        console.log(error);
        }
    };

    const DesactivarCategorias = async (codigo_Categoria) => {
        await axios.put(`http://localhost:3000/categoria/desactivar/${codigo_Categoria}`)
            .then(response => {
                setDesactivar(response.data)
                ListarCategorias();
            })
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
            await axios.put(`http://localhost:3000/categoria/actualizar/${selectedCategoria.codigo_Categoria}`, {
                Nombre_Categoria: editedNombreCategoria,
            });
            ListarCategorias();
            onCloseInfo();
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        ListarCategorias()
    }, [codigoCategoria])
  
  
  return (
    <div className='w-90% flex flex-col justify-center items-center mt-[70px]'>
        <div >
            <div className='flex gap-4'>
                <Button className='bg-[#3d7948] mb-3 w-[150px] text-[14px] text-white font-semibold' onPress={onOpen}>Registrar Categoría</Button>
                <div className='flex justify-center'>
                    <input 
                    type="text" 
                    className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Categoría' 
                    onChange={(e) => {
                        setCodigoCategoria(e.target.value)
                      }}
                    />
                    <button
                        className="flex justify-center items-center middle none center mr-4 bg-[#3d7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                        >
                        <FaSearch className='w-[20px] h-auto ' />
                    </button>
                </div>
            </div>
        <Modal isOpen={isOpen} onClose={onClose} className='my-auto'>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Registrar Nueva Categoría</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleForm}>
                                <div class="relative mb-3" data-twe-input-wrapper-init>
                                    <Input
                                        type='text'
                                        label='Nombre Categoría'
                                        name='Nombre_Categoria'
                                        value={values.Nombre_Categoria}
                                        onChange={handleInputChange}
                                    />                    
                                </div>
                                <div className='flex justify-end gap-3 mt-2'>
                                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' variant="light" onPress={onCloseModal}>
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
                classNames={{
                    wrapper: "w-[900px]",
                }}
                className="mx-auto" // Agregar la clase mx-auto para centrar horizontalmente
            >
                <TableHeader>
                    <TableColumn  className='text-center font-bold bg-[#3d7948] text-white' key="codigo">CÓDIGO</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#3d7948] text-white' key="nombre">NOMBRE</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#3d7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                    {itemsOnCurrentPage.map(categoria => (
                        <TableRow className='text-center font-semibold' key={categoria.codigo_Categoria}>
                            <TableCell className='font-semibold'>{categoria.codigo_Categoria}</TableCell>
                            <TableCell className='font-semibold'>{categoria.Nombre_Categoria}</TableCell>
                            <TableCell className='flex gap-2 justify-center'>
                                    <Button color="danger" className='bg-[#BF2A50] font-semibold' onClick={()=> {DesactivarCategorias(categoria.codigo_Categoria)}} style={{fontSize: '15px'}}>
                                        Desactivar
                                    </Button>  
                                    <Button color='primary' className='bg-[#1E6C9B] font-semibold' onClick={() => {handleInfo(categoria.codigo_Categoria);}} style={{ fontSize: '15px' }}>
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
