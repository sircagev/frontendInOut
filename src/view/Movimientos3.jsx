//React importaciones y contextos
import React, { useEffect, useState } from 'react';
import { useAuth } from './../context/AuthProvider';

//Componentes de librerias
import NextUITable from './../components/NextUITable'
import { Button, Tooltip } from '@nextui-org/react';
import Modal1 from '../components/Modal1';

//Iconos e imagenes
import { PlusIcon } from './../components/icons/PlusIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EditIcon } from '../components/icons/EditIcon';

//Datos estaticos
import {
    columnsMovements,
    INITIAL_VISIBLE_COLUMNS,
    searchKeys, statusColorMap,
    statusOptions
} from '../functions/Data/MovementsData'

//Funciones propias
import { MovementList } from '../functions/Listar'

//Formularios
import { RegisterMovement } from '../components/forms/Movements/RegisterMovement';
import { RegisterMovmentOutgoing } from '../components/forms/Movements/RegisterMovmentOutgoing';

export const Movimientos3 = () => {

    const { user } = useAuth();

    const [data, setData] = useState([]);

    const list = async () => {
        try {
            const response = await MovementList();
            setData(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const Buttons = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [isOpen2, setIsOpen2] = useState(false);
        return (
            <>
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="success"
                    variant="shadow"
                    className="text-white font-bold"
                    onClick={() => setIsOpen(true)}
                >
                    Ingreso
                </Button >
                <Modal1
                    title={"Registrar Ingreso"}
                    size={"2xl"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    form={<RegisterMovement onClose={() => setIsOpen(false)} />}
                />
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="danger"
                    variant="shadow"
                    className="text-white font-bold"
                    onClick={() => setIsOpen2(true)}
                >
                    Salida
                </Button >
                <Modal1
                    title={"Registrar Salida"}
                    size={"2xl"}
                    isOpen={isOpen2}
                    onClose={() => setIsOpen2(false)}
                    form={<RegisterMovmentOutgoing onClose={() => setIsOpen(false)} />}
                />
            </>
        )
    }

    const Actions = ({ codigo }) => {
        const [isOpen3, setIsOpen3] = useState(false)
        return (
            <div className="relative flex items-center gap-2">

                <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Button color='primary' variant="ligth" className="text-lg" onClick={() => { setIsOpen3(true) }} isIconOnly> <EyeIcon color="#007BFF" /></Button>
                        <Modal1
                            title={"El modal de info"}
                            size={'xl'}
                            isOpen={isOpen3}
                            onClose={() => setIsOpen3(false)} />
                    </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete user">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        {/* <DeleteIcon /> */}
                    </span>
                </Tooltip>
            </div>
        )
    }

    useEffect(() => {
        list();
    }, []);

    return (
        <div className="w-auto h-[100%] m-auto flex pt-[15px]">
            <NextUITable
                columns={columnsMovements}
                rows={data}
                searchKeys={searchKeys}
                statusOptions={statusOptions}
                statusColorMap={statusColorMap}
                initialColumns={INITIAL_VISIBLE_COLUMNS}
                statusOrType={'tipo'}
                actions={Actions}
                buttons={Buttons}
            />
        </div>
    )
}
