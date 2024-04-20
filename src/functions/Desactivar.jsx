import React from 'react'
import axios from 'axios';
import { ListarCategorias } from './Listar';

export const DesactivarCategorias = async (codigo_Categoria, estado) => {
    try {
        await axios.put(`http://localhost:3000/categoria/desactivar/${codigo_Categoria}`);
        ListarCategorias();
    } catch (error) {
        console.error("Error al desactivar la categoría:", error);
    }
};