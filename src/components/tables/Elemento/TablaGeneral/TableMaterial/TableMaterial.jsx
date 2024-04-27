import React, { useEffect, useState } from 'react'
import { TableHeaderMaterial } from './TableHeaderMaterial'
import { TableBodyMaterial } from './TableBodyMaterial'
import { PaginationMaterial } from './PaginationMaterial'
import { InputSearch } from '../../../../moleculas/InputSearch'

export const TableMaterial = ({ funcionListar }) => {

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const pages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (activePage - 1) * itemsPerPage;
    const itemsOnCurrentPage = data.slice(startIndex, startIndex + itemsPerPage);


    const options = {
        rowsPerPageOptions: [4, 10, 15],
        rowsPerPage: 4
    };

    const listar = async () => {
        const items = await funcionListar()
        setData(items)

        const todasLasClaves = items.map(objeto => Object.keys(objeto));
        todasLasClaves[0].push('Acciones');
        setColumns(todasLasClaves[0])
    }

    useEffect(() => {
        listar();
    }, [])

    return (
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
                <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
                    <div className="flex w-full gap-2 shrink-0 md:w-max">
                        <InputSearch setData={setData} funcionListar={funcionListar} />
                        <button
                            className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                                aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3">
                                </path>
                            </svg>
                            Añadir Préstamo
                        </button>
                    </div>
                </div>
            </div>
            <div className=" px-0 overflow-y-auto">
                {data.length > 0 ? (
                    <table className="w-full text-left min-w-max">
                        <TableHeaderMaterial columns={columns} />
                        <TableBodyMaterial data={itemsOnCurrentPage} />
                    </table>) : (
                    <p className='w-full text-center text-[30px] p-4 font-semibold'>No hay Movimientos</p>
                )}
            </div>
            <PaginationMaterial
                activePage={activePage}
                setActivePage={setActivePage}
                pages={pages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage} />
        </div>
    )
}
