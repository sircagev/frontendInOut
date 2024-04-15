import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button } from "@nextui-org/react";


export const TableGeneral = ({endpoint}) => {

    const [UseCategorias, setCategorias] = useState([]);
    const [page, setPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState([]);
    
    const itemsPerPage = 5;

    const startIndex = (page - 1) * itemsPerPage;
    const itemsOnCurrentPage = UseCategorias.slice(startIndex, startIndex + itemsPerPage);

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
            response = await axios.get(`${endpoint}`);
            setCategorias(response.data || []);
        }
        } catch (error) {
        console.log(error);
        }
    };

    useEffect(() => {
        ListarCategorias()
    }, [codigoCategoria])


  return (
    <div>
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
                            <TableCell className='font-semibold'>{categoria.Nombre_Categoria ? categoria.Nombre_Categoria : categoria.Nombre_Medida}</TableCell>
                            <TableCell className='flex gap-2 justify-center'>
                            <Button
                                color={categoria.estado === 'inactivo' ? 'success' : 'danger'}
                                className={`${categoria.estado === 'inactivo' ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`}
                                style={{ fontSize: '15px' }}
                            >
                                {categoria.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
                            </Button>
                            <Button color='primary' className='bg-[#1E6C9B] font-semibold' style={{ fontSize: '15px' }}>
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
