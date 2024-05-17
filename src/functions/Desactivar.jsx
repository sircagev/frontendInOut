import React, {useEffect} from 'react'
import axios from 'axios';
import axiosClient from '../components/config/axiosClient';


export const DesactivarCategorias = async (codigoCategoria, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar la categoría
        await axiosClient.put(`categoria/desactivar/${codigoCategoria}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar la categoría:", error);
    }
};