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

export const Movimientos3 = () => {

    const { user } = useAuth();

    const [data, setData] = useState([]);

    const list = async () => {
        try {
            const response = await MovementList();
            setData(response.data)
            console.log(response.data)
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
                    Incoming
                </Button >
                <Modal1
                    title={"Registrar Ingreso"}
                    size={"2xl"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="danger"
                    variant="shadow"
                    className="text-white font-bold"
                    onClick={()=>setIsOpen2(true)}
                >
                    Outgoing
                </Button >
                <Modal1
                    title={"Registrar Salida"}
                    size={"2xl"}
                    isOpen={isOpen2}
                    onClose={() => setIsOpen2(false)}
                />
            </>
        )
    }

    const Actions = ({ codigo }) => {
        return (
            <div className="relative flex items-center gap-2">

                <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Button color='primary' variant="ligth" className="text-lg" onClick={() => { console.log(codigo) }} isIconOnly> <EyeIcon /></Button>
                        <Modal1></Modal1>
                    </span>
                </Tooltip>
                {user.role_id === 1 && (
                    <Tooltip content="Edit">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {<EditIcon />}
                        </span>
                    </Tooltip>
                )}
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
        <div className="w-auto h-[100%] m-auto flex">
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
