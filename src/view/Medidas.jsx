import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarCategorias, ListarMedidas } from "../functions/Listar";
import { columnsMedidas } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { FormDataMedida } from "../functions/Register/FormDataMedida";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormUpdateMedida } from "../functions/Update/UpdateElemento/FormUpdateMedida";

export const Medidas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-12 w-full h-screen">
      <div className="w-[90%] flex justify-end">
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Categoría"} onClick={() => setIsOpen(true)} />
      </div>
      <ModalGeneral
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataMedida onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />}
        title={"Registrar Medida"}
      />
      <Modalupdatel
        title={"Actualizar Medida"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        formUpdate={<FormUpdateMedida onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCategory
      />
      <TableGeneral
        funcionListar={ListarMedidas}
        columns={(listar) => columnsMedidas(listar, setIsOpenUpdate, setSelectedCategory)}
        title={"Lista de Categorías"}
        updateTable={updateTable}
      />
    </div>
  );
};