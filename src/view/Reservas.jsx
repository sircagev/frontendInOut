import React, { useState, useEffect } from 'react';
import { ButtonRegistrar } from '../components/Buttons/ButtonRegistrar';
import { Input, Textarea } from '@nextui-org/react';
import axiosClient from '../components/config/axiosClient';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";

export const Reservas = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const ListarElementos = async () => {
    try {
      const response = await axiosClient.get('elemento/listar');
      // Filtrar los datos para que solo contengan name, stock y category_id
      const filteredData = response.data.map(item => ({
        name: item.name,
        stock: item.stock,
        category_id: item.category_id
      }));
      setData(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ListarElementos();
  }, []);

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [page, data]);

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:gap-96 mt-16 px-4'>
      <div className='min-w-[330px] lg:w-[300px] bg-white rounded-xl p-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'>
        <form action="" className='flex flex-col gap-4 mb-1'>
          <h1 className='text-xl font-bold'>Reservar Elementos</h1>
          <Input type="text" label="Elemento" fullWidth />
          <Input type="number" label="Cantidad" fullWidth />
          <Textarea
            label="Descripción"
            placeholder="Enter your description"
            className="max-w-xs mb-2"
            fullWidth
          />
          <div className='w-full flex justify-end gap-3 mb-3'>
            <ButtonRegistrar label={"Reservar"} />
          </div>
        </form>
      </div>
      <div className='w-full lg:w-auto'>
        <Table
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px] lg:min-h-[400px]",
            table: "w-full lg:w-[800px]" 
          }}
        >
          <TableHeader>
            <TableColumn className='bg-[#1F2937] text-white' key="name">NAME</TableColumn>
            <TableColumn className='bg-[#1F2937] text-white' key="stock">STOCK</TableColumn>
            <TableColumn className='bg-[#1F2937] text-white' key="category_id">CATEGORY ID</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
