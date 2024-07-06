import React, { useState, useEffect } from "react";
import { FormDataUsuario } from "../functions/Register/RegisterUsuario/FormDataUsuario";
import Modal1 from "../components/Modal1";
import { FormUpdateUsuario } from "../functions/Update/UpdateUsuario/FormUpdateUsuario";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { columnsUsers, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/UserData'
import { Button } from '@nextui-org/react'
import { DesactivarUsuario } from "../functions/Desactivar";

export const Usuarios = () => {
  const [data, setData] = useState([])

  const ListarCategorias = async () => {
    try {
      const response = await axiosClient.get('usuario/listar');
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    ListarCategorias()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Usuario"}
          size={"2xl"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataUsuario onClose={() => setIsOpen(false)} listar={ListarCategorias} />}
        />
      </div>
    )
  }

  const Actions = ({ codigo }) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);

    const handleDesactivar = async (CodigoUsuario, estadoActual) => {
      const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
      await DesactivarUsuario(CodigoUsuario, nuevoEstado);
      ListarCategorias();
    };

    return (
      <div className="flex gap-2">
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpenupdate(true)}>Actualizar</Button>
        <Modal1
          title={"Actualizar Usuario"}
          size={"2xl"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateUsuario onClose={() => setIsOpenupdate(false)} category={codigo} Listar={ListarCategorias} />}
        />
        <Button
          color={codigo.status === 'Activo' ? 'danger' : 'success'}
          variant="bordered"
          size="sm"
          className="w-[15px]"
          onClick={() => handleDesactivar(codigo.codigo, codigo.status)}
        >
          {codigo.status === 'Activo' ? 'Desactivar' : 'Activar'}
        </Button>
      </div >
    )
  }

  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
      <NextUITable
        columns={columnsUsers}
        rows={data}
        statusOptions={statusOptions}
        statusColorMap={statusColorMap}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        searchKeys={searchKeys}
        buttons={Buttons}
        statusOrType={'status'}
        actions={Actions}
      />
    </div>
  )
};
