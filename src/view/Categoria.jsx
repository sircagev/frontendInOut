import React, { useState, useEffect } from 'react';
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table';
import { ListarCategorias } from '../functions/Listar';
import { columnsCategorias } from '../functions/columnsData';
import { ButtonGeneral } from '../components/Button';
import { ModalGeneral } from '../components/Modal';
import { FormData } from '../functions/FormData';

export const Categoria = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-12 w-full h-screen">
      <div className='w-[90%] flex justify-end'>
        <ButtonGeneral color={"primary"} label={"Registrar Categoría"} onClick={() => setIsOpen(true)} />
      </div>
      <ModalGeneral isOpen={isOpen} onClose={() => setIsOpen(false)} form={<FormData onClose={handleCloseForm} />} title={"Registrar Categoría"} />
      <TableGeneral funcionListar={ListarCategorias} columns={columnsCategorias} title={"Lista de Categorías"} />
    </div>
  );
};
