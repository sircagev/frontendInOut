import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";

export const TableGeneral = ({ funcionListar, columns, title, updateTable, setIsOpenUpdate }) => {
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
    customBodyRender: (value) => <div className="text-center">{value}</div>
  };

  return (
    <div className='w-[90%] h-screen flex flex-col'>
      <div>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns(listar)}
          options={options}
        />
      </div>
    </div>
  );
};
