import React, { useState, useEffect } from "react";
import { Listarbodegas } from "../functions/Listar";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataBodega } from "../functions/Register/RegisterBodega/FormDataBodega";
import { FormUpdateBodega } from "../functions/Update/UpdateBodega/FormUpdateBodega";
import { columnsWarehouses, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/WarehousesData';
import axiosClient from '../components/config/axiosClient';
import NextUITable from "../components/NextUITable";

const Bodegas = () => {

  const [data, setData] = useState([]);

  const ListarBodegas = async () => {
    try {
      const response = await axiosClient.get('bodega/listar');
      setData(response.data); 
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ListarBodegas();
  }, []);

  const Buttons = () => {
    return(
      <div>Botones</div>
    )
  }

  const Actions = ({codigo}) => {
    return(
      <div>Acciones</div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center gap-3 mt-8 w-full">
      <NextUITable
      columns={columnsWarehouses}
        rows={data}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        statusColorMap={statusColorMap}
        statusOptions={statusOptions}
        searchKeys={searchKeys}
        statusOrType={'status'}
      />
    </div>
  );

};

export default Bodegas;