import React, {useState, useEffect} from 'react'
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import { FaPencilAlt } from "react-icons/fa";


export const TableGeneral = () => {

    const [products, Setproducts] = useState([]);
    const endpoint = ('http://localhost:3000/categoria/listar');
    
    const listar = async () => {
        await axios.get(endpoint).then((response) => {
            const data = response.data;
            console.log(data);
            Setproducts(data);
        })
    }
    //4 Renderizar los datos 
    useEffect(() => {
        listar();
    }, [])

    const columns = [
        {
            name: "codigo_Categoria",
            label: "Codigo",
            options: {
                filter: false, // Desactivar filtro para esta columna
              },
        },
        {
            name: "Nombre_Categoria",
            label: "Nombre",
            options: {
                filter: false, // Desactivar filtro para esta columna
              },
        },
        {
            name: "estado",
            label: "Estado"
        },
        {
            name: "fecha_creacion",
            label: "Creación",
            options: {
                filter: false, // Desactivar filtro para esta columna
              },
        },
        {
            name: 'options', // Nombre de la nueva columna
            label: 'Opciones',
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='flex gap-3 text-xl'>
                            <button><FaPencilAlt/></button>
                            <button><FaPencilAlt/></button>
                        </div>
                    );
                },
                filter: false
            }
        }
    ]

    const options = {
        rowsPerPageOptions: [5, 10, 15],
        rowsPerPage: 5
    };


  return (
    <div className='w-[90%]'>
        <div>
            <MUIDataTable
            title={"Lista de categorías"}
            data={products}
            columns={columns}
            options={options}
            />
        </div>
    </div>
  )
}
