import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { Listarbodegas } from "../functions/Listar";
import { columnsBodegas } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataBodega } from "../functions/Register/RegisterBodega/FormDataBodega";
import { FormUpdateBodega } from "../functions/Update/UpdateBodega/FormUpdateBodega";
import Cards from "../components/Cards";
import imagen from "../assets/categoria.svg"


const Bodegas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  const list = [
    {
      title: "Ubicaciones",
      to: "/bodegas/ubicacion",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-8 w-full">
      <div className="w-[95%] flex gap-2">
        {list.map((item, index) => (
          <Cards
            key={index}
            title={item.title}
            imagen={imagen}
            to={item.to}
          />
        ))}
      </div>
      <div className="w-[95%] flex justify-end">
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Bodega"} onClick={() => setIsOpen(true)} />
      </div>
      <Modal1
        title={"Registrar Bodega"}
        size={"md"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataBodega onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
      <Modal1
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