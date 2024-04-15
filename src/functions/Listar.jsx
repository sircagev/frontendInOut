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

export const ListarUsuarios = async() => {
    try {
        const response = await axios.get('http://localhost:3000/usuario/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarTipo = async () => {
    try {
        const response = await axios.get('http://localhost:3000/tipo/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
  }

export const ListarCategorias = async () => {
    try {
        const response = await axios.get('http://localhost:3000/categoria/listar')
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
     const response = await axios.get('http://localhost:3000/empaque/listar')
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