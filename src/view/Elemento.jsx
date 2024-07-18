import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import NextUITable from "../components/NextUITable";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData';
import axiosClient from '../components/config/axiosClient';
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";
import { DesactivarElemento } from "../functions/Desactivar";
import { Categoria } from "./Categoria"; // Asegúrate de importar correctamente
import { Empaques } from "./Empaques"; // Asegúrate de importar correctamente
import { Medidas } from "./Medidas"; // Asegúrate de importar correctamente
import { useAuth } from '../context/AuthProvider';

export const Elemento = () => {
    const [data, setData] = useState([]);

    const { user } = useAuth();

    const ListarElementos = async () => {
        try {
            const response = await axiosClient.get('elemento/listar');
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        ListarElementos();
    }, []);

    const Buttons = () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div>
                {user.role_id == 1 ? (
                    <>
                        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
                        <Modal1
                            title={"Registrar Elemento"}
                            size={"md"}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            form={<FormDataElemento onClose={() => setIsOpen(false)} listar={ListarElementos} />}
                        />
                    </>
                ) : (null)}
            </div>
        );
    };

    const Actions = ({ item }) => {
        const [isOpenUpdate, setIsOpenupdate] = useState(false);
        const [isOpenLotes, setIsOpenLotes] = useState(false);

        const handleDesactivar = async (codigoElemento, estadoActual) => {
            const nuevoEstado = estadoActual == 1 ? "0" : "1";
            console.log(codigoElemento, nuevoEstado)
            await DesactivarElemento(codigoElemento, nuevoEstado);
            ListarElementos();
        };

        const [data, setData] = useState([]);

        const ListarBodegas = async () => {
            try {
                const response = await axiosClient.get(`batches/list/${item.codigo}`);
                setData(response.data.data);

            } catch (error) {
                console.log(error);
            }
        };

        useEffect(() => {
            ListarBodegas();
        }, []);

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

        const columns = [
            {
                key: 'batch_id',
                label: "CODIGO"
            },
            {
                key: "quantity",
                label: "CANTIDAD"
            },
            {
                key: "expiration",
                label: "EXPIRACIÓN"
            },
            {
                key: "location_nanme",
                label: "UBICACIÓN"
            }
        ];

        return (
            <div className='flex justify-center items-center gap-3'>
                <Button
                    color={user.role_id == 1 ? 'primary' : 'default'}
                    variant="bordered"
                    size="sm"
                    className="w-[15px]"
                    onClick={() => setIsOpenupdate(true)}
                    disabled={user.role_id != 1}
                >
                    Actualizar
                </Button>
                <Modal1
                    title={"Actualizar Elemento"}
                    size={"md"}
                    isOpen={isOpenUpdate}
                    onClose={() => setIsOpenupdate(false)}
                    form={<FormUpdateElemento onClose={() => setIsOpenupdate(false)} category={item} Listar={ListarElementos} />}
                />
                <Button
                    color={user.role_id != 1 ? 'default' : item.status === 'Activo' ? 'danger' : 'success'}
                    variant="bordered"
                    size="sm"
                    className="w-[15px]"
                    onClick={() => handleDesactivar(item.codigo, item.status)}
                    disabled={user.role_id != 1}
                >
                    {item.status == 1 ? 'Desactivar' : 'Activar'}
                </Button>
                <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => {
                    setIsOpenLotes(true);
                    ListarBodegas();
                }}>Lotes</Button>
                <Modal1
                    title={"Lotes"}
                    size={"3xl"}
                    isOpen={isOpenLotes}
                    onClose={() => setIsOpenLotes(false)}
                    form={
                        <Table
                            aria-label="info table"
                            removeWrapper
                            classNames={classNames}>
                            <TableHeader columns={columns}>
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={data} emptyContent={'No hay detalles'}>
                                {(item) => (
                                    <TableRow key={item.batch_id}>
                                        {(columnKey) => <TableCell>{    (item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    }
                />
            </div>
        );
    };

    return (
        <div className="flex w-[95%] mr-[2.5%] ml-[2.5%] flex-col mt-2">
            <Tabs aria-label="Options" className='ml-7'>
                <Tab key="elementos" title="Elementos" color="primary">
                    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
                        <NextUITable
                            columns={columnsElements}
                            rows={data}
                            initialColumns={INITIAL_VISIBLE_COLUMNS}
                            statusColorMap={statusColorMap}
                            statusOptions={statusOptions}
                            searchKeys={searchKeys}
                            buttons={Buttons}
                            statusOrType={'status'}
                            actions={Actions}
                        />
                    </div>
                </Tab>
                <Tab key="categorias" title="Categorías">
                    <Categoria />
                </Tab>
                <Tab key="empaques" title="Empaques">
                    <Empaques />
                </Tab>
                <Tab key="medidas" title="Medidas">
                    <Medidas />
                </Tab>
            </Tabs>
        </div>
    );
};
