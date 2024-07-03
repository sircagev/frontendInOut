import React, {useEffect, useState} from 'react'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData'
import axiosClient from '../components/config/axiosClient'

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
    return (
      <div>
        <Button variant="primary">Agregar</Button>
      </div>
    )
  }

  const Actions = () => {
    return (
      <div>
        <Button variant="primary">Actualizar</Button>
        <Button variant="secondary">Borrar</Button>
      </div>
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
        actions={Actions}
      />
    </div>
  )
}

