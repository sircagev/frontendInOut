import React from 'react'
import { convertirAMayusculas } from '../../../../../functions/Listar'

export const TableHeaderMaterial = ({ columns }) => {
    return (
        <thead className=''>
            <tr className='rounded overflow-hidden'>
                {
                    columns.map(column => (
                        (column !== "Correo" && column !== "Apellido") ? (
                            <th className="px-3 py-3 border-y border-[#D4DCDF] bg-[#F5F7F8]" key={column}>
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-[#878F92] opacity-70">
                                    {convertirAMayusculas(column)}
                                </p>
                            </th>
                        ) : null
                    ))
                }
            </tr>
        </thead>
    )
}
