import React from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { Switch, Button } from "@nextui-org/react";

const handleEstado = async (codigo, nuevoEstado, desactivarFunction, listar, updateValue) => {
  try {
    await desactivarFunction(codigo, nuevoEstado);
    if (updateValue) {
      updateValue(nuevoEstado);
    }
    listar();
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  }
};

const handleEdit = (rowData, setIsOpenUpdate, setSelectedCategory, dataMap) => {
  setIsOpenUpdate(true);
  const data = Object.keys(dataMap).reduce((acc, key, index) => {
    acc[key] = rowData[dataMap[key]];
    return acc;
  }, {});
  setSelectedCategory(data);
};

const OptionsComponent = ({ rowData, Active, desactivarFunction, listar, setIsOpenUpdate, setSelectedCategory, dataMap, updateValue }) => (
  <div>
    <Switch
      isSelected={Active}
      onChange={() => handleEstado(rowData[0], Active ? "Inactivo" : "Activo", desactivarFunction, listar, updateValue)}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleEdit(rowData, setIsOpenUpdate, setSelectedCategory, dataMap)}
    >
      <FaPencilAlt />
    </Button>
  </div>
);

export const createColumns = (columnDefinitions, listar, setIsOpenUpdate, setSelectedCategory, desactivarFunction, dataMap) => [
  ...columnDefinitions,
  {
    name: 'options',
    label: 'OPCIONES',
    options: {
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowData = tableMeta.rowData;
        const Active = rowData[columnDefinitions.length - 1] === "Activo";

        return (
          <OptionsComponent
            rowData={rowData}
            Active={Active}
            desactivarFunction={desactivarFunction}
            listar={listar}
            setIsOpenUpdate={setIsOpenUpdate}
            setSelectedCategory={setSelectedCategory}
            dataMap={dataMap}
            updateValue={updateValue}
          />
        );
      },
    },
  },
];

