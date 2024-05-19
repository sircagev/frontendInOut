import React from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { Switch, Button } from "@nextui-org/react";
import { DesactivarCategorias, DesactivarEmpaque, DesactivarMedida } from "./Desactivar";

export const columnsCategorias = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "codigo_Categoria",
    label: "Código",
  },
  {
    name: "Nombre_Categoria",
    label: "Nombre",
  },
  {
    name: "fecha_creacion",
    label: "Creación",
  },
  {
    name: "estado",
    label: "Estado",
  },
  {
    name: 'options',
    label: 'OPCIONES',
    options: {
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[3] === "Activo";

        const handleEstado = async () => {
          const codigoCategoria = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarCategorias(codigoCategoria, nuevoEstado);
            updateValue(nuevoEstado);
            listar();
          } catch (error) {
            console.error("Error al cambiar el estado:", error);
          }
        };

        const handleEdit = () => {
            setIsOpenUpdate(true);
            const data = {
              codigo: rowData[0],
              nombre: rowData[1],
            };
            setSelectedCategory(data);
          };

        return (
          <div>
            <Switch
              isSelected={Active}
              onChange={handleEstado}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
            >
              <FaPencilAlt />
            </Button>
          </div>
        );
      },
    },
  },
];

export const columnsEmpaques = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "codigo_Empaque",
    label: "Codigo",
    options: {
      filter: false,
    },
  },
  {
    name: "Nombre_Empaque",
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
    label: 'OPCIONES',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[2] === "Activo";

        const handleEstado = async () => {
          const codigoEmpaque = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarEmpaque(codigoEmpaque, nuevoEstado);
            updateValue(nuevoEstado);
            listar();
          } catch (error) {
            console.error("Error al cambiar el estado:", error);
          }
        };

        const handleEdit = () => {
          setIsOpenUpdate(true);
          const data = {
            codigo: rowData[0],
            nombre: rowData[1],
          };
          setSelectedCategory(data);
        };

        return (
          <div>
            <Switch
              isSelected={Active}
              onChange={handleEstado}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
            >
              <FaPencilAlt />
            </Button>
          </div>
        );
      },
      filter: false
    }
  }
];

export const columnsMedidas = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "codigo_medida",
    label: "Codigo",
    options: {
      filter: false,
    },
  },
  {
    name: "Nombre_Medida",
    label: "Nombre",
    options: {
      filter: false,
    },
  },
  {
    name: "fecha_creacion",
    label: "Creacion",
  },
  {
    name: "estado",
    label: "Estado",
    options: {
      filter: false,
    },
  },
  {
    name: 'options',
    label: 'OPCIONES',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[3] === "Activo";

        const handleEstado = async () => {
          const codigoMedida = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarMedida(codigoMedida, nuevoEstado);
            updateValue(nuevoEstado);
            listar();
          } catch (error) {
            console.error("Error al cambiar el estado:", error);
          }
        };

        const handleEdit = () => {
          setIsOpenUpdate(true);
          const data = {
            codigo: rowData[0],
            nombre: rowData[1],
          };
          setSelectedCategory(data);
        };

        return (
          <div>
            <Switch
              isSelected={Active}
              onChange={handleEstado}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
            >
              <FaPencilAlt />
            </Button>
          </div>
        );
      },
      filter: false
    }
  }
];

export const columnsPrestamos = [
    {
        name: "Codigo",
        label: "Codigo",
    },
    {
        name: "Usuario",
        label: "Usuario",
    },
    {
        name: "Fecha",
        label: "Fecha",
    },
    {
        name: 'options', // Nombre de la nueva columna
        label: 'Opciones',
    }
]