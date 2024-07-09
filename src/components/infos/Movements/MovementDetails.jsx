import React, { useEffect, useState } from 'react'
import { MovementDetailsById, ListarElementos } from '../../../functions/Listar';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

export const MovementDetails = ({ movement }) => {

    const columns = [
        {
            key: "movementDetail_id",
            label: "CODIGO",
        },
        {
            key: "element_id",
            label: "ID",
        },
        {
            key: "element_name",
            label: "ELEMENTO",
        },
        {
            key: "batch_id",
            label: "LOTE",
        },
        {
            key: "quantity",
            label: "CANTIDAD",
        },
        /* {
            key: "remarks",
            label: "OBSERVACIONES",
        }, */
    ];

    const [data, setData] = useState([]);
    const [dataElements, setElements] = useState([]);

    const list = async () => {
        try {
            const details = await MovementDetailsById(movement.codigo);
            const elements = await ListarElementos();

            setData(details.data);
            setElements(elements);
            console.log(details)

        } catch (error) {
            console.log(error);
        }
    }

    const getKeyData = (item, columnKey) => {
        if (columnKey === 'element_name') {
            const filteredItems = Array.isArray(dataElements) ? dataElements.filter(element => element.codigo === item.element_id) : [];
            return filteredItems.length > 0 ? filteredItems[0].name : 'Elemento no encontrado';
        }
        return item[columnKey];
    };

    useEffect(() => {
        list();
    }, [])

    const classNames = React.useMemo(
        () => ({
          wrapper: ["max-h-[382px]", "max-w-3xl"],
          th: ["bg-transparent", "text-default-500", "border-b", "border-divider", "text-black", "text-center"],
          td: [
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
            "text-center"
          ],
        }),
        [],
      );

    return (
        <div className='w-full px-3 pb-3'>
            <Table
                aria-label="info table"
                removeWrapper
                classNames={classNames}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={data} emptyContent={'No hay detalles'}>
                    {(item) => (
                        <TableRow key={item.movementDetail_id}>
                            {(columnKey) => <TableCell>{getKeyData(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

/* data.map((datum) => {
    // Filtrar elementos que coinciden con el código
    const filteredItems = dataElements.filter(item => item.codigo === datum.element_id);
    // Obtener el nombre del primer elemento encontrado, si existe
    const itemName = filteredItems.length > 0 ? filteredItems[0].name : 'Elemento no encontrado';

    return (
        <div key={datum.movementDetail_id}>
            {datum.movementDetail_id} {datum.element_id} {itemName} {datum.batch_id} {datum.quantity} {datum.remarks}
        </div>
    );
}) */