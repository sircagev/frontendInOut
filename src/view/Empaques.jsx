import React, { useState, useEffect } from "react";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnsPackage, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/PackageData'
import Modal1 from "../components/Modal1";
import { FormUpdateEmpaque } from "../functions/Update/UpdateElemento/FormUpdateEmpaque";
import { FormDataEmpaque } from "../functions/Register/RegisterElemento/FormDataEmpaque";


export const Empaques = () => {


  const [data, setData] = useState([])

  const ListarEmpaques = async () => {
    try {
      const response = await axiosClient.get('empaque/listar');
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    ListarEmpaques()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Elemento"}
          size={"sm"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataEmpaque onClose={()=> setIsOpen(false)} listar={ListarEmpaques}/>}
        />
      </div>
    )
  }

  const Actions = ({item}) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpenupdate(true)}>Actualizar</Button>
        <Modal1 
          title={"Actualizar Empaque"}
          size={"sm"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateEmpaque onClose={()=> setIsOpenupdate(false)} category={item} Listar={ListarEmpaques} />}
        />
      </div >
    )
  }

  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%] mt-10'>
      <NextUITable
        columns={columnsPackage}
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