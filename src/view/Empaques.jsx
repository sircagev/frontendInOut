import React, { useState } from "react";
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table';
import { ListarEmpaques } from '../functions/Listar';
import { columnsEmpaques } from '../functions/columnsData';
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormUpdateEmpaque } from "../functions/Update/UpdateElemento/FormUpdateEmpaque";
import { FormDataEmpaque } from "../functions/Register/RegisterElemento/FormDataEmpaque";
import Cards from "../components/Cards"
import imagen from "../assets/categoria.svg"

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
      to: "/elementos",
    },
    {
      title: "Categorías",
      to: "/elementos/categorias",
    },
    {
      title: "Medidas",
      to: "/elementos/medidas",
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