import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarCategorias, ListarMedidas } from "../functions/Listar";
import { columnsMedidas } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataMedida } from "../functions/Register/RegisterElemento/FormDataMedida";
import { FormUpdateMedida } from "../functions/Update/UpdateElemento/FormUpdateMedida";
import  Cards  from "../components/Cards"
import img from "../../public/img/pala.jpg"


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
      img: "/img/categoria.svg",
      to: "/elementos",
    },
    {
      title: "Categorías",
      img: "/img/categoria.svg",
      to: "/elementos/categorias",
    },
    {
      title: "Empaques",
      img: "/img/categoria.svg",
      to: "/elementos/empaques",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-12 w-full h-screen">
      <div className="w-[95%] flex gap-2 mt-5">
        {list.map((item, index) => (
          <Cards
            key={index}
            title={item.title}
            img={item.img}
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