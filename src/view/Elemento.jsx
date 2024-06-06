import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarElementos } from "../functions/Listar";
import { columnsElemntos } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { FormDataElemento } from "../functions/Register/FormDataElemento";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";


export const Elemento = () => {
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
          <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Elemento"} onClick={() => setIsOpen(true)} />
        </div>
        <ModalGeneral
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataElemento onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />}
          title={"Registrar Elemento"}
        />
        <Modalupdatel
          title={"Actualizar Elemento"}
          isOpen={isOpenUpdate}
          formUpdate={<FormUpdateElemento onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate}/>}
          onClose={() => setIsOpenUpdate(false)}
        />
        <TableGeneral
          funcionListar={ListarElementos}
          columns={(listar) => columnsElemntos(listar, setIsOpenUpdate, setSelectedCategory)} 
          title={"Lista de Elementos"}
          updateTable={updateTable}
        />
      </div>
    );
}
