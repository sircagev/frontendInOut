import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";


export const TableGeneral = ({ funcionListar, columns, title, updateTable }) => {
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const listar = async () => {
    const items = await funcionListar();
    setData(items);
  };

  useEffect(() => {
    listar();
  }, [updateTable]);

  const options = {
    rowsPerPageOptions: [4, 10, 15],
    rowsPerPage: rowsPerPage,
    onChangeRowsPerPage: (newRowsPerPage) => {
      setRowsPerPage(newRowsPerPage);
    },
    customBodyRender: (value) => <div className="text-center">{value}</div>,
    selectableRows: 'none' // Desactivar selección de filas
  };

  return (
    <div className='w-[95%] h-screen flex flex-col'>
      <div>
        <MUIDataTable
          className="mb-10"
          title={title}
          data={data}
          columns={columns(listar)}
          options={options}
        />
      </div>
    </div>
  );
};
