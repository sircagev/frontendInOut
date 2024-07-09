import React, { useState, useEffect } from "react";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnsUnit, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/measurementUnitData'
import Modal1 from "../components/Modal1";
import { FormDataMedida } from "../functions/Register/RegisterElemento/FormDataMedida";
import { FormUpdateMedida } from "../functions/Update/UpdateElemento/FormUpdateMedida";
import { DesactivarMedida } from "../functions/Desactivar";

export const Medidas = () => {

  const [data, setData] = useState([])

  const listarMedidas = async () => {
    try {
      const response = await axiosClient.get('medida/listar');
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    listarMedidas()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Medida"}
          size={"sm"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataMedida onClose={() => setIsOpen(false)} listar={listarMedidas} />}
        />
      </div>
    )
  }

  const Actions = ({ item }) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);

    const handleDesactivar = async (codigoElemento, estadoActual) => {
      const nuevoEstado = estadoActual === 1 ? '0' : '1';
      await DesactivarMedida(codigoElemento, nuevoEstado);
      listarMedidas();
    };

    return (
      <div className="flex gap-2">
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpenupdate(true)}>Actualizar</Button>
        <Modal1
          title={"Actualizar Medida"}
          size={"sm"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateMedida onClose={() => setIsOpenupdate(false)} category={item} Listar={listarMedidas} />}
        />
        <Button
          color={item.status == 1 ? 'danger' : 'success'}
          variant="bordered"
          size="sm"
          className="w-[15px]"
          onClick={() => handleDesactivar(item.codigo, item.status)}
        >
          {item.status == 1 ? 'Desactivar' : 'Activar'}
        </Button>
      </div >
    )
  }


  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
      <NextUITable
        columns={columnsUnit}
        rows={data}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        statusColorMap={statusColorMap}
        statusOptions={statusOptions}
        searchKeys={searchKeys}
        buttons={Buttons}
        statusOrType={'status'}
        actions={Actions}
      />
    </div>
  )
};