import React, { useEffect, useState } from 'react'
import { TableHeaderMaterial } from './TableHeaderMaterial'
import { TableBodyMaterial } from './TableBodyMaterial'
import { PaginationMaterial } from './PaginationMaterial'
import { InputSearch } from '../../../../moleculas/InputSearch'
import { Modal } from '../ModalMaterial/Modal'

export const TableMaterial = ({ funcionListar, funcionBuscar }) => {

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
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border mb-5">
            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
                <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
                    <div className="flex w-full gap-2 shrink-0 md:w-max">
                        <InputSearch setData={setData} funcionListar={funcionListar} funcionBuscar={funcionBuscar} />
                        <Modal title='Realizar préstamo'/>
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
