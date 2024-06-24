import React, { useState } from "react";
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table';
import { ListarEmpaques } from '../functions/Listar';
import { columnsEmpaques } from '../functions/columnsData';
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormUpdateEmpaque } from "../functions/Update/UpdateElemento/FormUpdateEmpaque";
import { FormDataEmpaque } from "../functions/Register/RegisterElemento/FormDataEmpaque";
import  Cards  from "../components/Cards"

export const Empaques = () => {
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
      title: "Medidas",
      img: "/img/categoria.svg",
      to: "/elementos/medidas",
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
        <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Empaque"} onClick={() => setIsOpen(true)} />
      </div>
      <Modal1
        title={"Registrar Empaque"}
        size={"md"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={<FormDataEmpaque onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
      />
      <Modal1
        title={"Actualizar Empaque"}
        isOpen={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        form={<FormUpdateEmpaque onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate} />} 
      />
      <TableGeneral 
        funcionListar={ListarEmpaques} 
        columns={(listar) => columnsEmpaques(listar, setIsOpenUpdate, setSelectedCategory)} 
        title={"Lista de Empaques"}
        updateTable={updateTable}
      />
    </div>
  );
};