import React, { useEffect, useState } from 'react'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData'
import axiosClient from '../components/config/axiosClient'
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";

export const Elemento = () => {

  const [data, setData] = useState([])

  const ListarElementos = async () => {
    try {
      const response = await axiosClient.get('elemento/listar');
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    ListarElementos()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Elemento"}
          size={"md"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataElemento />}
        />
      </div>
    )
  }

  const Actions = ({item}) => {
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => { console.log(item) }}>bs</Button>
        <Modal1 />
      </div >
    )
  }


  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%] mt-10'>
      <NextUITable
        columns={columnsElements}
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
}

