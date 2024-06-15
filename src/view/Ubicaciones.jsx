import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarUbicacionesYBodegas } from "../functions/Listar";
import { columnsUbicacion } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Button";
import { ModalGeneral } from "../components/Modal";
import { FormDataUbicacion } from "../functions/Register/FormDataUbicacion";
import { Modalupdatel } from "../components/ModalUpdate";
import { FormUpdateUbicacion } from "../functions/Update/UpdateElemento/FormUpdateUbicacion";
import Modal1 from "../components/Modal1";



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
        <div className="w-[95%] flex justify-end">
          <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Ubicación"} onClick={() => setIsOpen(true)} />
        </div>
        <Modal1
        title={"Registrar Ubicación"}
        size={"md"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataUbicacion onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
        <Modal1
         title={"Actualizar Ubicación"}
         isOpen={isOpenUpdate}
         onClose={() => setIsOpenUpdate(false)}
         form={<FormUpdateUbicacion onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCatego
        />
        <TableGeneral
         funcionListar={ListarUbicacionesYBodegas}
         columns={(listar) => columnsUbicacion(listar, setIsOpenUpdate, setSelectedCategory)}
         title={"Lista de Ubicaciones"}
         updateTable={updateTable}
        />
      </div>
    );
  };