import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import NextUITable from "../components/NextUITable";
import { Button } from '@nextui-org/react';
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData';
import axiosClient from '../components/config/axiosClient';
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";
import { DesactivarElemento } from "../functions/Desactivar";
import { Categoria } from "./Categoria"; // Asegúrate de importar correctamente
import { Empaques } from "./Empaques"; // Asegúrate de importar correctamente
import { Medidas } from "./Medidas"; // Asegúrate de importar correctamente

export const Elemento = () => {
    const [data, setData] = useState([]);

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
                <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
                <Modal1
                    title={"Registrar Elemento"}
                    size={"md"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    form={<FormDataElemento onClose={() => setIsOpen(false)} listar={ListarElementos} />}
                />
            </div>
        );
    };

    const Actions = ({ item }) => {
        const [isOpenUpdate, setIsOpenupdate] = useState(false);

        const handleDesactivar = async (codigoElemento, estadoActual) => {
            const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
            await DesactivarElemento(codigoElemento, nuevoEstado);
            ListarElementos();
        };

        return (
            <div className='flex gap-3'>
                <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpenupdate(true)}>Actualizar</Button>
                <Modal1
                    title={"Actualizar Elemento"}
                    size={"md"}
                    isOpen={isOpenUpdate}
                    onClose={() => setIsOpenupdate(false)}
                    form={<FormUpdateElemento onClose={() => setIsOpenupdate(false)} category={item} Listar={ListarElementos} />}
                />
                <Button
                    color={item.status === 'activo' ? 'danger' : 'success'}
                    variant="bordered"
                    size="sm"
                    className="w-[15px]"
                    onClick={() => handleDesactivar(item.codigo, item.status)}
                >
                    {item.status === 'activo' ? 'Desactivar' : 'Activar'}
                </Button>
            </div>
        );
    };

    return (
        <div className="flex w-[95%] mr-[2.5%] ml-[2.5%] flex-col mt-5">
            <Tabs aria-label="Options">
                <Tab key="elementos" title="Elementos" color="primary">
                    <Card>
                        <CardBody>
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
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="categorias" title="Categorías">
                    <Card>
                        <CardBody>
                            <Categoria />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="empaques" title="Empaques">
                    <Card>
                        <CardBody>
                            <Empaques />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="medidas" title="Medidas">
                    <Card>
                        <CardBody>
                            <Medidas />
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};
