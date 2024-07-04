import React, { useEffect, useState } from 'react'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData'
import axiosClient from '../components/config/axiosClient'
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";

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
          size={"2xl"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataElemento onClose={()=> setIsOpen(false)} listar={ListarElementos}/>}
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
          title={"Actualizar Elemento"}
          size={"2xl"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateElemento onClose={()=> setIsOpenupdate(false)} category={item} Listar={ListarElementos} />}
        />
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
