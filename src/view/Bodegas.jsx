import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { Listarbodegas } from "../functions/Listar";
import { columnsBodegas } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormDataBodega } from "../functions/Register/FormDataBodega";
import { FormUpdateBodega } from "../functions/Update/UpdateBodega/FormUpdateBodega";

const Bodegas = () => {
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
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Bodega"} onClick={() => setIsOpen(true)} />
      </div>
      <ModalGeneral
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataBodega onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />}
        title={"Registrar Bodega"}
      />
      <Modalupdatel
        title={"Actualizar Bodega"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        formUpdate={<FormUpdateBodega onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCategory
      />
      <TableGeneral
        funcionListar={Listarbodegas}
        columns={(listar) => columnsBodegas(listar, setIsOpenUpdate, setSelectedCategory)} 
        title={"Lista de Bodegas"}
        updateTable={updateTable}
      />
    </div>
  );

};

export default Bodegas;