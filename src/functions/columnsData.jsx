import React from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { Switch, Button } from "@nextui-org/react";
import { DesactivarCategorias, DesactivarEmpaque, DesactivarMedida, DesactivarUbicacion, DesactivarElemento, DesactivarBodega, DesactivarUsuario } from "./Desactivar";

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
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "apellido_usuario",
    label: "Apellido",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "email_usuario",
    label: "Email",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "rol",
    label: "Rol",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "numero",
    label: "Teléfono",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "contraseña_usuario",
    label: "Contraseña",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "Id_ficha",
    label: "Ficha",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "identificacion",
    label: "ID",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
      filter: false,
    },
  },
  {
    name: "Estado",
    label: "Estado",
    options: {
      sort: false, // Deshabilita el ordenamiento para esta columna
    },
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
          console.log(data);
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

export const columnsBodegas = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "codigo_Bodega",
    label: "Código",
  },
  {
    name: "Nombre_bodega",
    label: "Nombre",
  },
  {
    name: "ubicacion",
    label: "Ubicación",
  },
  {
    name: "fecha_creacion",
    label: "Creación",
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
        const Active = rowData[4] === "Activo";

        const handleEstado = async () => {
          const codigoBodega = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarBodega(codigoBodega, nuevoEstado);
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
            ubicacion: rowData[2],
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

export const columnsUbicacion = (listar, setIsOpenUpdate, setSelectedCategory) => [
  {
    name: "codigo_Detalle",
    label: "Codigo",
    options: {
      filter: false,
    },
  },
  {
    name: "Nombre_ubicacion",
    label: "Nombre",
    options: {
      filter: false,
    },
  },
  {
    name: "fk_bodega",
    label: "Bodega",
  },
  {
    name: "fecha_creacion",
    label: "creacion",
    options: {
      filter: false,
    },
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
        const Active = rowData[4] === "Activo";

        const handleEstado = async () => {
          const codigoUbicacion = rowData[0];
          const nuevoEstado = Active ? "Inactivo" : "Activo";
          try {
            await DesactivarUbicacion(codigoUbicacion, nuevoEstado);
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
            nombreBodega: rowData[2],
          };
          console.log(data)
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