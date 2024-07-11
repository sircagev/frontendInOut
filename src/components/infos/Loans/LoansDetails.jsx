import React, { useEffect, useState } from 'react'
import { MovementDetailsById, ListarElementos } from '../../../functions/Listar';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button } from "@nextui-org/react";
import { useAuth } from '../../../context/AuthProvider';
import axiosClient from '../../config/axiosClient';

export const LoanDetails = ({ item, listarMovimientos }) => {

    const { user } = useAuth();

    console.log(item)

    const [movement, setMovement] = useState(item)

    const baseColumns = [
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

    const columns = movement.status !== "Solicitado"
        ? [...baseColumns, { key: "actions", label: "ACCIONES" }]
        : baseColumns;
    const [data, setData] = useState([]);
    const [dataElements, setElements] = useState([]);

    const list = async () => {
        try {
            const details = await MovementDetailsById(movement.codigo);
            const elements = await ListarElementos();
            setData(details.data);
            setElements(elements);
        } catch (error) {
            console.log(error);
        }
    }

    const getNewMovementData = async () => {
        try {
            const response = await axiosClient.get(`movimientos/loans/list/${movement.codigo}`);
            console.log(response.data)
            setMovement(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getKeyData = (item, columnKey) => {

        /* const [isDisable, setIsDisable] = useState(false) */

        if (columnKey === 'element_name') {
            const filteredItems = Array.isArray(dataElements) ? dataElements.filter(element => element.codigo === item.element_id) : [];
            return filteredItems.length > 0 ? filteredItems[0].name : 'Elemento no encontrado';
        }

        if (columnKey === 'actions') {
            return (
                <>
                    {((movement.status == 'En préstamo') && (user.user_id == 1 || user.user_id == 2)) && (
                        <Button
                            size='sm'
                            onClick={() => {
                                console.log({ id: item.movementDetail_id, newStatus: 6 })
                                
                            }}
                            
                        >
                            Devolver
                        </Button>)}
                </>
            )
        }
        return item[columnKey];
    };

    useEffect(() => {
        list();
        console.log(movement)
    }, [movement])

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

    const handleUpdateStatus = async () => {
        try {
            const response = axiosClient.put(`movimientos/update-logan-status/${movement.codigo}`);
            console.log(response);
            await listarMovimientos()
            await getNewMovementData()
        } catch (error) {
            console.log(error)
        }
    }

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
            {((movement.status == 'Solicitado') && (user.user_id == 1 || user.user_id == 2)) && (<Button size='sm' onClick={handleUpdateStatus}>Pasar a revisión</Button>)}
        </div>
    )
}