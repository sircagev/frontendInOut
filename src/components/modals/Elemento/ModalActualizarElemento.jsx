import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { ListarTipo, ListarCategorias, Listarubicacion, ListarEmpaques, ListarMedidas } from '../../../functions/Listar';

export const ModalActualizarElemento = ({ isOpen, onClose, elemento, listarElementos }) => {
    const [UseTipo, SetTipo] = useState([]);
    const [UseCategorias, setCategorias] = useState([]);
    const [UseUbicacion, SetUbicacion] = useState([]);
    const [UseEmpaques, SetEmpaques] = useState([]);
    const [UseMedidas, SetMedidas] = useState([]);

    const [editedElemento, setEditedElemento] = useState({
        Nombre_elemento: '',
        fk_tipoElemento: '',
        fk_unidadMedida: '',
        fk_categoria: '',
        fk_ubicacion: '',
        fk_tipoEmpaque: '',
        fk_medida: '',
        fk_detalleUbicacion: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsTipo = await ListarTipo();
                const itemsCategoria = await ListarCategorias();
                const itemsUbicacion = await Listarubicacion();
                const itemsEmpaques = await ListarEmpaques();
                const itemsMedidas = await ListarMedidas();
                SetTipo(itemsTipo);
                setCategorias(itemsCategoria);
                SetUbicacion(itemsUbicacion);
                SetEmpaques(itemsEmpaques);
                SetMedidas(itemsMedidas);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleEditElemento = async (Codigo_elemento) => {
        try {
            console.log(editedElemento)
            await axios.put(`http://localhost:3000/elemento/actualizar/${Codigo_elemento}`, editedElemento);
            listarElementos();
            onClose();
            swal({
                title: "Actualización exitosa",
                text: "El elemento se ha actualizado correctamente.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (elemento) {
            setEditedElemento({
                Nombre_elemento: elemento.Nombre_elemento,
                stock: elemento.stock,
                fk_tipoElemento: elemento.fk_tipoElemento,
                fk_unidadMedida: elemento.fk_unidadMedida,
                fk_categoria: elemento.fk_categoria,
                fk_ubicacion: elemento.fk_ubicacion,
                fk_tipoEmpaque: elemento.fk_tipoEmpaque,
                fk_medida: elemento.fk_medida,
                fk_detalleUbicacion: elemento.fk_detalleUbicacion
            });
        }
    }, [elemento]);

    return (
        <div>
            <Modal
                size='3xl'
                isOpen={isOpen}
                onClose={onClose}
                className='my-auto'
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-[22px]">Información Elemento</ModalHeader>
                    <ModalBody>
                        <div className='flex justify-center items-center'>
                            <form action="">
                                <div className='flex flex-col gap-4'>
                                    <div className='flex gap-5'>
                                        <Input
                                            isRequired
                                            type="text"
                                            label="Nombre del elemento"
                                            value={editedElemento.Nombre_elemento}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, Nombre_elemento: e.target.value })}
                                            className="max-w-xs"
                                        />
                                        <select
                                            name='fk_detalleUbicacion'
                                            className="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={editedElemento.fk_detalleUbicacion}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, fk_detalleUbicacion: e.target.value })}
                                        >
                                            <option disabled>Seleccione una Ubicación</option>
                                            {UseUbicacion.map(ubicacion => (
                                                <option
                                                    value={ubicacion.codigo_Detalle}
                                                    key={ubicacion.codigo_Detalle}
                                                >
                                                    {ubicacion.Nombre_ubicacion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex gap-5'>
                                        <Input
                                            type="text"
                                            label="Fecha de Creación"
                                            value={elemento && elemento.fecha_creacion}
                                            disabled // Deshabilitamos la edición
                                            className="max-w-xs"
                                        />
                                        <Input
                                            type="text"
                                            label="Fecha de Actualización"
                                            value={elemento && elemento.fecha_actualizacion}
                                            disabled
                                            className="max-w-xs"
                                        />
                                    </div>
                                    <div className='flex gap-5'>
                                        <select
                                            name="fk_tipoElemento"
                                            className="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={editedElemento.fk_tipoElemento}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, fk_tipoElemento: e.target.value })}
                                        >
                                            <option disabled>Seleccione un tipo de elemento</option>
                                            {UseTipo.map(tipo => (
                                                <option
                                                    value={tipo.codigo_Tipo}
                                                    key={tipo.codigo_Tipo}
                                                >
                                                    {tipo.nombre_tipoElemento}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name='fk_categoria'
                                            className="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={editedElemento.fk_categoria}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, fk_categoria: e.target.value })}
                                        >
                                            <option disabled>Seleccione una categoría</option>
                                            {UseCategorias.map(categoria => (
                                                <option
                                                    value={categoria.codigo_Categoria}
                                                    key={categoria.codigo_Categoria}
                                                >
                                                    {categoria.Nombre_Categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex gap-5 mb-5'>
                                        <select
                                            name='fk_tipoEmpaque'
                                            className="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={editedElemento.fk_tipoEmpaque}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, fk_tipoEmpaque: e.target.value })}
                                        >
                                            <option disabled>Seleccione un empaque</option>
                                            {UseEmpaques.map(empaque => (
                                                <option
                                                    value={empaque.codigo_Empaque}
                                                    key={empaque.codigo_Empaque}
                                                >
                                                    {empaque.Nombre_Empaque}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name='fk_unidadMedida'
                                            className="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={editedElemento.fk_unidadMedida}
                                            onChange={(e) => setEditedElemento({ ...editedElemento, fk_unidadMedida: e.target.value })}
                                        >
                                            <option disabled>Seleccione una medida</option>
                                            {UseMedidas.map(medida => (
                                                <option
                                                    value={medida.codigo_medida}
                                                    key={medida.codigo_medida}
                                                >
                                                    {medida.Nombre_Medida}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='w-full mb-3 flex justify-end gap-2'>
                                    <Button style={{ width: '100px' }} className='font-bold text-white' color="danger" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button style={{ width: '100px' }} className='font-bold text-white' color="success" onClick={() => { handleEditElemento(elemento.Codigo_elemento) }}>
                                        Actualizar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

