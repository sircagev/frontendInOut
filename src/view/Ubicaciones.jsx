import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarUbicacionesYBodegas } from "../functions/Listar";
import { columnsUbicacion } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { Modalupdatel } from "../components/ModalUpdate";

export const Ubicaciones = () => {
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
        <TableGeneral
          funcionListar={ListarUbicacionesYBodegas}
          columns={columnsUbicacion}
          title={"Lista de Categorías"}
        />
      </div>
    );
  };