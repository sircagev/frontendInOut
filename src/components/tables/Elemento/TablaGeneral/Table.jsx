import React, { useState, useEffect } from 'react'
import MUIDataTable from "mui-datatables";

export const TableGeneral = ({ funcionListar, columns, title}) => {

    const [data, Setdata] = useState([]);

    const listar = async () => {
        const items = await funcionListar()
        Setdata(items)
    }
     
    useEffect(() => {
        listar();
    }, [])

    const options = {
        rowsPerPageOptions: [4, 10, 15],
        rowsPerPage: 4
    };

    return (
        <div className='w-[90%] h-screen'>
            <div>
                <MUIDataTable
                    title={title}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </div>
        </div>
    )
}


