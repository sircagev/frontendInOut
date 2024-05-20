import React, { useState, useEffect } from "react";
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table'
import { ListarEmpaques } from '../functions/Listar'
import { columnsEmpaques } from '../functions/columnsData'
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { FormDataEmpaque } from "../functions/Register/FormDataEmpaque";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormUpdateEmpaque } from "../functions/Update/UpdateElemento/FormUpdateEmpaque";



export const Empaques = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <div className='flex flex-col justify-center items-center gap-3 mt-12 w-full h-screen'>
      <div className="w-[90%] flex justify-end">
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Empaque"} onClick={() => setIsOpen(true)} />
      </div>
      <ModalGeneral
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataEmpaque onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate}/>}
        title={"Registrar Empaque"}
      />
      <Modalupdatel
        title={"Actualizar Empaque"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        formUpdate={<FormUpdateEmpaque onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCategory
      />
      <TableGeneral 
      funcionListar={ListarEmpaques} 
      columns={(listar) => columnsEmpaques(listar, setIsOpenUpdate, setSelectedCategory)} 
      title={"Lista de Empaques"}
      updateTable={updateTable}
      />
    </div>
  )
}