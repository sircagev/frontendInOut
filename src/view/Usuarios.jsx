import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarUsuarios } from "../functions/Listar";
import { columnsUsuarios } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { FormData } from "../functions/FormData";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormDataUsuario } from "../functions/Register/RegisterUsuario/FormDataUsuario";
import Modal1 from "../components/Modal1";

export const Usuarios = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-12 w-full h-screen">
      <div className="w-[95%] flex justify-end">
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Usuario"} onClick={() => setIsOpen(true)} />
      </div>
      <Modal1
        title={"Registrar Usuario"}
        size={"2xl"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataUsuario onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
      <TableGeneral
          funcionListar={ListarUsuarios}
          columns={(listar) => columnsUsuarios(listar, setIsOpenUpdate, setSelectedCategory)} 
          title={"Lista de Usuarios"}
          updateTable={updateTable}
        />
    </div>
  );
};
