import React, {useEffect} from 'react'
import axios from 'axios';
import axiosClient from '../components/config/axiosClient';

export const ListarElementos = async () => {
    try {
        const response = await axios.get('http://localhost:3000/elemento/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const BuscarElemento = async (codigoElemento) => {
    try {
        const response = await axios.get(`http://localhost:3000/elemento/buscar/${codigoElemento}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarUsuarios = async () => {
    try {
        const response = await axios.get('http://localhost:3000/usuario/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarTipo = async () => {
    try {
        const response = await axiosClient.get('tipo/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
  }

export const ListarCategorias = async () => {
    try {
        
        const response = await axiosClient.get('categoria/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
  }

 export const Listarubicacion = async () => {
    try {
        const response = await axios.get('http://localhost:3000/ubicacion/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
  }

 export const ListarEmpaques = async () => {
    try {
     const response = await axiosClient.get('empaque/listar')
      return response.data
    } catch (error) {
        console.log(error);
    }
  }
  export const ListarMedidas = async () => {
    try {
     const response = await axios.get('http://localhost:3000/medida/listar')
      return response.data
    } catch (error) {
        console.log(error);
    }
  } 
  
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertirAMinusculas = (texto) => {
    return texto.toLowerCase();
  }
  