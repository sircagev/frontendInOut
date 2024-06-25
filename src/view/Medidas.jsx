import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarCategorias, ListarMedidas } from "../functions/Listar";
import { columnsMedidas } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataMedida } from "../functions/Register/RegisterElemento/FormDataMedida";
import { FormUpdateMedida } from "../functions/Update/UpdateElemento/FormUpdateMedida";
import  Cards  from "../components/Cards"
import imagen from "../assets/categoria.svg"


export const Medidas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleTableUpdate = () => {
    setUpdateTable(!updateTable);
  };

  const list = [
    {
      title: "Elementos",
      to: "/elementos",
    },
    {
      title: "Categorías",
      to: "/elementos/categorias",
    },
    {
      title: "Empaques",
      to: "/elementos/empaques",
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
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Medida"} onClick={() => setIsOpen(true)} />
      </div>
      <Modal1
        title={"Registrar Medida"}
        size={"md"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataMedida onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
      <Modal1
        title={"Actualizar Medida"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        form={<FormUpdateMedida onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} // Pasar la categoría seleccionada en selectedCategory
      />
      <TableGeneral
        funcionListar={ListarMedidas}
        columns={(listar) => columnsMedidas(listar, setIsOpenUpdate, setSelectedCategory)}
        title={"Lista de Medidas"}
        updateTable={updateTable}
      />
    </div>
  );
};