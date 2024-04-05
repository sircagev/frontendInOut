import React from 'react'
import axios from 'axios';

export const ListarElementos = async() => {
    try {
        const response = await axios.get('http://localhost:3000/elemento/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const BuscarElemento = async(codigoElemento) => {
   try {
       const response = await axios.get(`http://localhost:3000/elemento/buscar/${codigoElemento}`);
       return response.data
   } catch (error) {
       console.log(error);
   }
}

export const ListarUsuarios = async() => {
    try {
        const response = await axios.get('http://localhost:3000/usuario/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}
