import { FaPencilAlt } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import { DesactivarCategorias } from "./Desactivar";

export const columnsCategorias = [
    {
        name: "codigo_Categoria",
        label: "Código",
        options: {
            filter: false,
        },
    },
    {
        name: "Nombre_Categoria",
        label: "Nombre",
        options: {
            filter: false,
        },
    },
    {
        name: "estado",
        label: "Estado",
    },
    {
        name: "fecha_creacion",
        label: "Creación",
        options: {
            filter: false,
        },
    },
    {
        name: 'options',
        label: 'Opciones',
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                const codigoCategoria = tableMeta.rowData[0];
                const estado = tableMeta.rowData[2];
                const isActive = estado === 'Activo';

                const handleSwitchChange = async () => {
                    const nuevoEstado = isActive ? 'Inactivo' : 'Activo';
                    await DesactivarCategorias(codigoCategoria, nuevoEstado);
                    updateValue(nuevoEstado); // Actualiza el estado en la tabla.
                };

                return (
                    <div className='flex justify-center items-center gap-3 text-xl'>
                        <Switch
                            isSelected={isActive} // El switch se selecciona cuando es 'Activo'
                            onChange={handleSwitchChange} // Cambia el estado
                        />
                        <button>
                            <FaPencilAlt />
                        </button>
                    </div>
                );
            },
            filter: false,
        },
    },
];


export const columnsEmpaques = [
    {
        name: "codigo_Empaque",
        label: "Codigo",
        options: {
            filter: false, // Desactivar filtro para esta columna
        },
    },
    {
        name: "Nombre_Empaque",
        label: "Nombre",
        options: {
            filter: false, // Desactivar filtro para esta columna
        },
    },
    {
        name: "estado",
        label: "Estado"
    },
    {
        name: "fecha_creacion",
        label: "Creación",
        options: {
            filter: false, // Desactivar filtro para esta columna
        },
    },
    {
        name: 'options', // Nombre de la nueva columna
        label: 'Opciones',
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <div className='flex gap-3 text-xl'>
                        <button><FaPencilAlt /></button>
                        <button><FaPencilAlt /></button>
                    </div>
                );
            },
            filter: false
        }
    }
]