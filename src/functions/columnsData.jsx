import React from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { Switch, Button } from "@nextui-org/react";
import { DesactivarCategorias, DesactivarEmpaque, DesactivarMedida, DesactivarUbicacion, DesactivarElemento, DesactivarBodega, DesactivarUsuario } from "./Desactivar";
import { createColumns } from './CreateColumn';

const categoriasColumnData = [
  { name: "codigo_Categoria", label: "Código" },
  { name: "Nombre_Categoria", label: "Nombre" },
  { name: "fecha_creacion", label: "Fecha" },
  { name: "estado", label: "Estado" },
];

export const columnsCategorias = (listar, setIsOpenUpdate, setSelectedCategory) =>
  createColumns(categoriasColumnData, listar, setIsOpenUpdate, setSelectedCategory, DesactivarCategorias, {
    codigo: 0, nombre: 1
  });

const empaquesColumnData = [
  { name: "codigo_Empaque", label: "Código" },
  { name: "Nombre_Empaque", label: "Nombre" },
  { name: "fecha_creacion", label: "Fecha" },
  { name: "estado", label: "Estado" },
];

export const columnsEmpaques = (listar, setIsOpenUpdate, setSelectedCategory) =>
  createColumns(empaquesColumnData, listar, setIsOpenUpdate, setSelectedCategory, DesactivarEmpaque, {
    codigo: 0, nombre: 1
  });

const medidasColumnData = [
  { name: "codigo_medida", label: "Código" },
  { name: "Nombre_Medida", label: "Nombre" },
  { name: "fecha_creacion", label: "Fecha" },
  { name: "estado", label: "Estado" },
];

export const columnsMedidas = (listar, setIsOpenUpdate, setSelectedCategory) =>
  createColumns(medidasColumnData, listar, setIsOpenUpdate, setSelectedCategory, DesactivarMedida, {
    codigo: 0, nombre: 1
  });

const BodegaColumnData = [
  { name: "codigo_Bodega", label: "Código" },
  { name: "Nombre_bodega", label: "Nombre" },
  { name: "ubicacion", label: "Ubicación" },
  { name: "fecha_creacion", label: "Fecha" },
  { name: "Estado", label: "Estado" },
];

export const columnsBodegas = (listar, setIsOpenUpdate, setSelectedCategory) =>
  createColumns(BodegaColumnData, listar, setIsOpenUpdate, setSelectedCategory, DesactivarBodega, {
    codigo: 0, nombre: 1, ubicacion: 2
  });

const UbicacionColumnData = [
  { name: "codigo_Detalle", label: "Código" },
  { name: "Nombre_ubicacion", label: "Nombre" },
  { name: "fk_bodega", label: "Bodega" },
  { name: "fecha_creacion", label: "Fecha" },
  { name: "estado", label: "Estado" },
];

export const columnsUbicacion = (listar, setIsOpenUpdate, setSelectedCategory) =>
  createColumns(UbicacionColumnData, listar, setIsOpenUpdate, setSelectedCategory, DesactivarUbicacion, {
    codigo: 0, nombre: 1, nombreBodega: 2
  });


export const columnsUsuarios = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "id_usuario",
    label: "Código",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "nombre_usuario",
    label: "Nombre",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "apellido_usuario",
    label: "Apellido",
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "email_usuario",
    label: "Email",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "rol",
    label: "Rol",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "numero",
    label: "Teléfono",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "Id_ficha",
    label: "Ficha",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "identificacion",
    label: "ID",
    options: {
      sort: false, 
      filter: false,
    },
  },
  {
    name: "Estado",
    label: "Estado",
    options: {
      sort: false,
    },
  },
  {
    name: 'options',
    label: 'OPCIONES',
    options: {
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[8] === "Activo";

        const handleEstado = async () => {
          const CodigoUsuario = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarUsuario(CodigoUsuario, nuevoEstado);
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
            apellido: rowData[2],
            email: rowData[3],
            rol: rowData[4],
            numero: rowData[5],
            ficha: rowData[6],
            identificacion: rowData[7]
          };
          console.log(data);
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

export const columnsElemntos = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "Codigo_elemento",
    label: "Código",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "Nombre_elemento",
    label: "Nombre",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "stock",
    label: "Cantidad",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fecha_creacion",
    label: "Fecha",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fk_tipoElemento",
    label: "Tipo",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fk_unidadMedida",
    label: "Medida",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fk_categoria",
    label: "Categoria",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fk_tipoEmpaque",
    label: "Empaque",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "fk_detalleUbicacion",
    label: "Ubicación",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "Estado",
    label: "Estado",
  },
  {
    name: 'options',
    label: 'OPCIONES',
    options: {
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[9] === "Activo";

        const handleEstado = async () => {
          const codigoElemento = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarElemento(codigoElemento, nuevoEstado);
            updateValue(nuevoEstado);
            listar();
          } catch (error) {
            console.log(error);
          }
        };

        const handleEdit = () => {
          setIsOpenUpdate(true);
          const data = {
            codigo: rowData[0],
            nombre: rowData[1],
            tipo: rowData[4],
            medida: rowData[5],
            categoria: rowData[6],
            empaque: rowData[7],
            ubicacion: rowData[8],
          }
          console.log(data);
          setSelectedCategory(data);
        };
        return (
          <div className='flex'>
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