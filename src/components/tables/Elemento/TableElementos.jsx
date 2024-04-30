import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { ListarTipo, ListarCategorias, Listarubicacion, ListarEmpaques, ListarMedidas } from '../../../functions/Listar';
import { ModalRegistrar } from '../../modals/Elemento/ModalRegistrar';
import { ModalActualizarElemento } from '../../modals/Elemento/ModalActualizarElemento';
import swal from 'sweetalert';

export const TableElementos = ({ items, user }) => {

    const [useElementos, setElementos] = useState([]);
    const [SetTipo, setCategorias, SetUbicacion, SetEmpaques, SetMedidas] = useState([]);
    const [useDesactivar, setDesactivar] = useState([]);
    const [isOpenModalActualizar, setIsOpenModalActualizar] = useState(false);
    const [isOpenModalRegistrar, setIsOpenModalRegistrar] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [itemsToShow, setItemsToShow] = useState([]);
    const [roleUserLogin, setRoleUserLogin] = useState('')

    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = useElementos.slice(startIndex, startIndex + itemsPerPage) // Obtener los elementos que se mostrarán en la página actual

    const [codigoElemento, setCodigoElemento] = useState('');

    const listarElementos = async () => {
        try {
            let response;
 
            if (codigoElemento.trim() !== '') {
                // Realizar una solicitud específica para obtener el elemento por su código
                response = await axios.get(`http://localhost:3000/elemento/buscar/${codigoElemento}`);
                
                setElementos(response.data.Elemento ? response.data.Elemento : []);
                setPage(1)
            } else {
                // Obtener todos los elementos si no se proporciona ningún código
                response = await axios.get('http://localhost:3000/elemento/listar');
                setElementos(response.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [selectedElemento, setSelectedElemento] = useState(null);
    const handleInfo = (elemento) => {
        console.log(elemento); // Mostrar los datos del elemento en la consola
        setSelectedElemento(elemento);
        setIsOpenModalActualizar(true);
    };

    const desactivarElementos = async (Codigo_elemento, estado) => {
        let mensaje;
        if (estado === 'Activo') {
            mensaje = "¿Desea desactivar la categoría?";
        } else if (estado === 'Inactivo') {
            mensaje = "¿Desea reactivar la categoría?";
        }
        await swal({
            title: "¿Está seguro?",
            text: mensaje,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDesactivar) => {
            if (willDesactivar) {
                await axios.put(`http://localhost:3000/elemento/desactivar/${Codigo_elemento}`)
                    .then(response => {
                        setDesactivar(response.data);
                        listarElementos();
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

    const fectchData = async () => {
        try {
            const itemsTipo = await ListarTipo();
            const itemsCategoria = await ListarCategorias();
            const itemsUbicacion = await Listarubicacion();
            const itemsEmpaques = await ListarEmpaques();
            const itemsMedidas = await ListarMedidas();
            SetTipo(itemsTipo);
            setCategorias(itemsCategoria);
            SetUbicacion(itemsUbicacion);
            SetEmpaques(itemsEmpaques);
            SetMedidas(itemsMedidas);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarElementos()
        fectchData()
        setRoleUserLogin(user.role);
    }, [codigoElemento])

    useEffect(() => {
        if (selectedElemento) {
            setIsOpenModalActualizar(true);
        }
    }, [selectedElemento]);

    return (
        <div className='w-[90%] mb-5'>
            <div className='flex gap-3'>
                <div className='flex gap-3'>
                    {user.role === 'administrador' && (<Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold' onClick={() => setIsOpenModalRegistrar(true)}>Registrar Elemento</Button>)}
                    <div className='flex justify-center mb-3'>
                        <input
                            type="text"
                            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md'
                            placeholder='Nombre Elemento'
                            onChange={(e) => {
                                setCodigoElemento(e.target.value)
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
            </div>
            <ModalRegistrar isOpen={isOpenModalRegistrar} onClose={() => setIsOpenModalRegistrar(false)} listarElementos={listarElementos} />
            <ModalActualizarElemento isOpen={isOpenModalActualizar} onClose={() => {
                setIsOpenModalActualizar(false);
                setSelectedElemento(null); // Restablecer el elemento seleccionado
            }} elemento={selectedElemento} listarElementos={listarElementos} />
            <Table
                aria-label="Lista de Empaques"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            color="secondary"
                            page={page}
                            total={Math.ceil(useElementos.length / itemsPerPage)}
                            onChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                }
                className="mx-auto"// Agregar la clase mx-auto para centrar horizontalmente
            >
                <TableHeader>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">NOMBRE</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="stock">STOCK</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="tipo">TIPO</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="categoria">CATEGORIA</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="empaque">EMPAQUE</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="medida">MEDIDA</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="ubicacion">UBICACIÓN</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="estado">ESTADO</TableColumn>
                    <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                    {itemsOnCurrentPage.map(elemento => (
                        <TableRow className='text-center font-semibold' key={elemento.Codigo_elemento}>
                            <TableCell className='font-semibold'>{elemento.Codigo_elemento}</TableCell>
                            <TableCell className='font-semibold'>{elemento.Nombre_elemento}</TableCell>
                            <TableCell className='font-semibold'>{elemento.stock}</TableCell>
                            <TableCell className='font-semibold'>{elemento.nombre_tipoElemento}</TableCell>
                            <TableCell className='font-semibold'>{elemento.nombre_categoria}</TableCell>
                            <TableCell className='font-semibold'>{elemento.Nombre_empaque}</TableCell>
                            <TableCell className='font-semibold'>{elemento.Nombre_Medida}</TableCell>
                            <TableCell className='font-semibold'>{elemento.Nombre_ubicacion}</TableCell>
                            <TableCell className='font-semibold'>{elemento.Estado}</TableCell>
                            <TableCell className='flex gap-2 justify-center'>
                                <Button color="danger" className={`${elemento.Estado === 'Inactivo' ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`} onClick={() => { desactivarElementos(elemento.Codigo_elemento) }} style={{ fontSize: '15px' }} isDisabled={user.role === 'administrador' ? false : true }>
                                    {elemento.Estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                                </Button>
                                <Button color='primary' className='font-semibold bg-[#1E6C9B] hover:bg-[#E4B803]' onClick={() => handleInfo(elemento)} style={{ fontSize: '15px' }} isDisabled={user.role === 'administrador' ? false : true }>
                                    Info
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
