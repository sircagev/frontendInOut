import React, { useEffect, useState } from 'react'
import { MovementDetailsById, ListarElementos } from '../../../functions/Listar';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Button,
    Chip,
    Checkbox,
    Input
} from "@nextui-org/react";
import { useAuth } from '../../../context/AuthProvider';
import axiosClient from '../../config/axiosClient';
import swal from 'sweetalert';

export const LoanDetails = ({ item, listarMovimientos }) => {

    const { user } = useAuth();

    const [movement, setMovement] = useState(item);
    const [data, setData] = useState([]);
    const [dataElements, setElements] = useState([]);
    const [newStatus, setNewStatus] = useState('');

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
        {
            key: "remarks",
            label: "OBSERVACIONES",
        },
        {
            key: "loanStatus_id",
            label: "ESTADO",
        }
    ];
    const columns = movement.status !== "Solicitado"
        ? [...baseColumns, { key: "actions", label: "ENTREGA" }]
        : baseColumns;


    const list = async () => {
        try {
            const detailsData = await MovementDetailsById(movement.codigo);
            const elements = await ListarElementos();
            const details = detailsData.data

            let objectDetails = [];

            for (const detail of details) {
                const { movementDetail_id, loanStatus_id, remarks } = detail;

                const object = {
                    movementDetail_id: movementDetail_id,
                    loanStatus_id: loanStatus_id,
                    remarks: remarks
                }

                objectDetails.push(object);
            }

            setData(details);
            setElements(elements);

            const objectNewStatus = {
                user_returning: 1,
                details: objectDetails
            }

            setNewStatus(objectNewStatus)
        } catch (error) {
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    const handleDetailChange = (item) => {
        setNewStatus(prevNewStatus => {
            const detail = prevNewStatus.details.find(detail => detail.movementDetail_id === item.movementDetail_id);

            if (detail) {
                const detailIndex = prevNewStatus.details.indexOf(detail);
                const currentStatus = detail.loanStatus_id;
                const newDatum = currentStatus === 5 ? 6 : 5;
                console.log(newDatum)
                // Realiza el cambio en el objeto encontrado
                const updatedDetails = prevNewStatus.details.map((detail, i) =>
                    i === detailIndex ? { ...detail, loanStatus_id: newDatum } : detail
                );
                return { ...prevNewStatus, details: updatedDetails };
            } else {
                console.log("No se encontró el detail con el movementDetail_id especificado.");
                return prevNewStatus;
            }
        })
    };

    const getLoanStatus = (item) => {
        const detail = newStatus.details.find(detail => detail.movementDetail_id === item.movementDetail_id);

        console.log(detail)
        if (detail) {
            const currentStatus = detail.loanStatus_id;

            if (currentStatus != 5) return false
        }

        return true
    }


    const getKeyData = (item, columnKey) => {

        /* const [isDisable, setIsDisable] = useState(false) */

        if (columnKey === 'element_name') {
            const filteredItems = Array.isArray(dataElements) ? dataElements.filter(element => element.codigo === item.element_id) : [];
            return filteredItems.length > 0 ? filteredItems[0].name : 'Elemento no encontrado';
        }

        if (columnKey === 'loanStatus_id') {

            let estado;
            let color;

            if (item.loanStatus_id == 5) {
                estado = "En préstamo"
                color = 'warning'
            }

            if (item.loanStatus_id == 6) {
                estado = "Completado"
                color = 'default'
            }
            return <Chip color={color} variant='flat' size='sm'>{estado}</Chip>
        }

        if (columnKey === 'actions') {
            return (
                ((movement.status == 'En préstamo') && (user.user_id == 1 || user.user_id == 2)) && (
                    (item.loanStatus_id == 5) ? (
                        <Checkbox
                            size='sm'
                            onClick={() => {
                                handleDetailChange(item)
                            }}
                        />/* {getLoanStatus(item) ? 'Entregar' : ''}</Button> */
                    ) : (
                        <div>Entregado</div>
                    )
                )
            )
        }
        return item[columnKey];
    };

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
        console.log(newStatus)
    }, [newStatus])

    const classNames = React.useMemo(() => ({
        wrapper: ["max-h-[382px]", "max-w-3xl"],
        table: ["overflow-auto", "w-[150px]"],
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
    }), []);

    const handleUpdateStatus = async () => {
        console.log(movement.codigo)
        try {
            axiosClient.put(`movimientos/update-logan-status/${movement.codigo}`, newStatus)
                .then(response => {
                    const statusCode = response.status;
                    console.log(`Código de estado: ${statusCode}`);
                    // Puedes manejar la respuesta según el código de estado
                    swal({
                        title: `${statusCode == 201 ? 'Info' : 'Éxito'}`,
                        text: response.data.message,
                        icon: `${statusCode == 201 ? 'warning' : 'success'}`,
                        buttons: true
                    })
                })
                .catch(error => {
                    if (error.response) {
                        const statusCode = error.response.status;
                        console.log(error.response);
                        swal({
                            title: "Error",
                            text: error.response.data.message,
                            icon: `warning`,
                            buttons: true
                        })
                        // Puedes manejar el error según el código de estado
                    } else {
                        console.log(`Error: ${error.message}`);
                        // Manejar otros errores, como problemas de red
                    }
                });
            /* await getNewMovementData() */
        } catch (error) {
            console.log(error)
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    return (
        <div className='w-full px-3 pb-3 flex flex-col items-center justify-center gap-4'>
            {movement.status == 'En préstamo' && (
                <Input
                    type='text'
                    placeholder='Selecciona un usuario'
                    label="Usuario"
                    isRequired
                    className='w-1/2'
                />
            )}
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
            {((movement.status == 'En préstamo') && (user.user_id == 1 || user.user_id == 2)) && (
                <Button
                    size='sm'
                    onClick={handleUpdateStatus}
                >
                    Realizar entrega
                </Button>
            )}
        </div>
    )
}