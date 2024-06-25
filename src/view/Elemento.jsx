import React, { useState, useEffect } from "react";
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { ListarElementos } from "../functions/Listar";
import { columnsElemntos } from "../functions/columnsData";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";
import  Cards  from "../components/Cards"
import imagen from "../assets/categoria.svg"


export const Elemento = () => {
    const [isOpen, setIsOpen] = useState(false); //Maneja la visibilidad del modal de registrar
    const [isOpenUpdate, setIsOpenUpdate] = useState(false); //Maneja la visibilidad del modal de actualizar
    const [updateTable, setUpdateTable] = useState(false); // Maneja la actualización de la tabla cada vez que hay un cambio
    const [selectedCategory, setSelectedCategory] = useState(null); // Maneja la categoría seleccionada para actualización.
  
    const handleTableUpdate = () => { //Función que provoca que el componente tabla general actualice su contenido
      setUpdateTable(!updateTable);
    };

    const list = [
      {
        title: "Categorías",
        imagen: "../assets/categoria.svg",
        to: "/elementos/categorias",
      },
      {
        title: "Empaques",
        to: "/elementos/empaques",
      },
      {
        title: "Medidas",
        to: "/elementos/medidas",
      },
    ];
  
    return (
      <div className="flex flex-col justify-center items-center gap-3 mt-8">
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
          <ButtonGeneral className='w-[500px]' color={"primary"} label={"Registrar Elemento"} onClick={() => setIsOpen(true)} />
        </div>
        <Modal1
          title={"Registrar Elemento"}
          size={"2xl"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataElemento onClose={() => setIsOpen(false)} onRegisterSuccess={handleTableUpdate} />} 
        />
        <Modal1
          title={"Actualizar Elemento"}
          size={"2xl"}
          isOpen={isOpenUpdate}
          form={<FormUpdateElemento onClose={() => setIsOpenUpdate(false)} category={selectedCategory} onRegisterSuccess={handleTableUpdate}/>}
          onClose={() => setIsOpenUpdate(false)}
        />
        <TableGeneral
          funcionListar={ListarElementos}
          columns={(listar) => columnsElemntos(listar, setIsOpenUpdate, setSelectedCategory)} //Esta propiedad recibe listar como argumento y retorn las columnas de la tabla
          title={"Lista de Elementos"}
          updateTable={updateTable}
        />
      </div>
    );
}
