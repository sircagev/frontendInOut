import React from 'react'

export const TableHeaderMaterial = ({ columns }) => {
    return (
        <thead>
            <tr>
                {
                    columns.map((column) => (
                        <th className="px-4 py-3 border-y border-blue-gray-100 bg-blue-gray-50/50">
                            <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                {column.label}
                            </p>
                        </th>
                    ))
                }
            </tr>
        </thead>
    )
}
