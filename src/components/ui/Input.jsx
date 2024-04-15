import React from 'react'
import { Input } from "@nextui-org/react";

export const Input = () => {
    return (
        <div>
            <Input
                type='text'
                label='Nombre Categoría'
                name='Nombre_Categoria'
                value={values.Nombre_Categoria}
                onChange={handleInputChange}
            />
        </div>
    )
}
