import React from 'react'
import axios from 'axios';

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

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertirAMinusculas = (texto) => {
    return texto.toLowerCase();
}

export const convertirAMayusculas = (texto) => {
    return texto.toUpperCase();
}

export const ListarMovimientosSolicitados = async () => {
    try {
        const response = await axios.get('http://localhost:3000/movimientos/listar')
        const datos = response.data.datos;
        const newData = [];
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && (dato.Estado === "En espera" || dato.Estado === "Confirmada")) {
                newData.push(dato)
            }
        });
        return newData;
    } catch (error) {
        console.log(error);
    }
}

export const BuscarMovimientosSolicitados = async (codigoMovimiento) => {
    try {
        // Realizar una solicitud específica para obtener un movimiento por su código
        const response = await axios.get(`http://localhost:3000/movimientos/buscar/${codigoMovimiento}`);
        const data = response.data.Movimiento;
        console.log(data)
        const newData = [];
        data.forEach(datum => {
            if (datum.Tipo === "Prestamo" && (datum.Estado === "En espera" || datum.Estado === "Confirmada")) {
                newData.push(datum)
            }
        });

        return newData;
    } catch (error) {
        console.log(error)
        const status = error.response.request.status;
        if (status === 404) {
            // Si la respuesta es 404, devolver un arreglo vacío
            return [];
        }
    }
}

export const ListarMovimientosEnPrestamo = async () => {
    try {
        const response = await axios.get('http://localhost:3000/movimientos/listar')
        const datos = response.data.datos;
        const newData = []
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && dato.Estado === "En Prestamo") {
                newData.push(dato)
            }
        });
        return newData
    } catch (error) {
        console.log(error);
    }
}

export const ListarMovimientosCancelados = async () => {
    try {
        const response = await axios.get('http://localhost:3000/movimientos/listar')
        const datos = response.data.datos;
        const newData = []
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && (dato.Estado === "Cancelada" || dato.Estado === "Finalizada")) {
                newData.push(dato)
            }
        });
        return newData
    } catch (error) {
        console.log(error);
    }
}