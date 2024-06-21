import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarCategorias } from "../functions/Listar";
import { columnsCategorias } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Buttons/Button";
import { FormDataCategoria } from "../functions/Register/RegisterElemento/FormDataCategoria";
import { FormUpdateCategoria } from "../functions/Update/UpdateElemento/FormUpdateCategoria";
import Modal1 from "../components/Modal1";

export const Categoria = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-12 w-full h-screen">
      <div className="w-[95%] flex justify-end">
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Categoría"} onClick={() => setIsOpen(true)} />
      </div>
      <Modal1
        title={"Registrar Categoría"}
        size={"md"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataCategoria onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
      <Modal1
        title={"Actualizar Categoría"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        form={<FormUpdateCategoria onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCategory
      />
      <TableGeneral
        funcionListar={ListarCategorias}
        columns={(listar) => columnsCategorias(listar, setIsOpenUpdate, setSelectedCategory)} 
        title={"Listar de Categorías"}
        updateTable={updateTable}
      />
    </div>
  );
};
