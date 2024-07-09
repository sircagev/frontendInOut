import axiosClient from '../components/config/axiosClient';

export const DesactivarElemento = async (codigoElemento, nuevoEstado) => {
    try {
        await axiosClient.put(`elemento/desactivar/${codigoElemento}`, { estado: nuevoEstado });
    } catch (error) {
        console.error("Error al desactivar el elemento:", error);
    }
};


export const DesactivarCategorias = async (codigoCategoria, nuevoEstado) => {
    try {
        await axiosClient.put(`categoria/desactivar/${codigoCategoria}`, { estado: nuevoEstado });
    } catch (error) {
        console.error("Error al desactivar la categoría:", error);
    }
};

export const DesactivarEmpaque = async (codigoEmpaque, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`empaque/desactivar/${codigoEmpaque}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar el empaque:", error);
    }
};

export const DesactivarMedida = async (codigoMedida, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`medida/desactivar/${codigoMedida}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar la medida:", error);
    }
};

export const DesactivarUbicacion = async (codigoUbicacion, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`ubicacion/desactivar/${codigoUbicacion}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar la medida:", error);
    }
};

export const DesactivarBodega = async (codigoBodega, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`bodega/desactivar/${codigoBodega}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar la bodega:", error);
    }
};

export const DesactivarUsuario = async (CodigoUsuario, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`usuario/desactivar/${CodigoUsuario}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar el Usuario:", error);
    }
};