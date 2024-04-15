import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import swal from 'sweetalert';
import { ListarTipo, ListarCategorias, Listarubicacion, ListarEmpaques, ListarMedidas } from '../functions/Listar';



export const Elemento = () => {

  const [useElementos, setElementos] = useState([]);
  const [useDesactivar, setDesactivar] = useState([]);
  const [UseTipo] = useState([]);
  const [UseCategorias] = useState([]);
  const [UseUbicacion] = useState([]);
  const [UseEmpaques] = useState([]);
  const [UseMedidas] = useState([]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();



  const [page, setPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState([]);

  const size = '3xl'; // Establece el tamaño del modal como '3xl'

  const itemsPerPage = 5;
  // Índice del primer elemento en la página actual
  const startIndex = (page - 1) * itemsPerPage;
  // Obtener los elementos que se mostrarán en la página actual
  const itemsOnCurrentPage = useElementos.slice(startIndex, startIndex + itemsPerPage);

  // Función para obtener el valor de una clave específica de un objeto
  const getKeyValue = (item, key) => {
    return item[key];
  };

  const [codigoElemento, setCodigoElemento] = useState('');

  const listarElementos = async () => {
    try {
      let response;
      console.log(codigoElemento)
      if (codigoElemento.trim() !== '') {
        // Realizar una solicitud específica para obtener el elemento por su código
        response = await axios.get(`http://localhost:3000/elemento/buscar/${codigoElemento}`);
        console.log(response.data);
        setElementos(response.data.Elemento ? response.data.Elemento : []);
        setPage(1)
      } else {
        // Obtener todos los elementos si no se proporciona ningún código
        response = await axios.get('http://localhost:3000/elemento/listar');
        setElementos(response.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const desactivarElementos = async (Codigo_elemento, estado) => {
    let mensaje;
    if (estado === 'Activo') {
        mensaje = "¿Desea desactivar la categoría?";
    } else if (estado === 'Inactivo') {
        mensaje = "¿Desea reactivar la categoría?";
    }
    await swal({
        title: "¿Está seguro?",
        text: mensaje,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then(async (willDesactivar) => {
        if (willDesactivar) {
            await axios.put(`http://localhost:3000/elemento/desactivar/${Codigo_elemento}`)
                .then(response => {
                    setDesactivar(response.data);
                    listarElementos();
                    swal("¡Se ha actualizado el estado correctamente!", {
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            swal("La ubicación está segura.");
        }
    });
  };


  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
  const [selectedElemento, setSelectedElemento] = useState(null);
  const [editedElemento, setEditedElemento] = useState('');

  const handleInfo = (Codigo_elemento) => {
    const elemento = useElementos.find((elemento) => elemento.Codigo_elemento === Codigo_elemento);
    if (elemento) {
      setSelectedElemento(elemento);
      setEditedElemento({
        Nombre_elemento: elemento.Nombre_elemento,
        stock: elemento.stock,
        fk_tipoElemento: elemento.fk_tipoElemento,
        fk_unidadMedida: elemento.fk_unidadMedida,
        fk_categoria: elemento.fk_categoria,
        fk_tipoEmpaque: elemento.fk_tipoEmpaque,
        fk_detalleUbicacion: elemento.fk_detalleUbicacion
      });
      console.log(elemento);
      onOpenInfo();
    } else {
      console.log('El Elemento no se encontró');
    }
  };

  const handleEditElemento = async () => {
    try {
      // Verificar si editedElemento tiene un valor válido
      // Realizar la solicitud PUT para actualizar el elemento
      await axios.put(`http://localhost:3000/elemento/actualizar/${selectedElemento.Codigo_elemento}`, {
        Nombre_elemento: editedElemento.Nombre_elemento,
        stock: editedElemento.stock,
        fk_tipoElemento: editedElemento.fk_tipoElemento,
        fk_unidadMedida: editedElemento.fk_unidadMedida,
        fk_categoria: editedElemento.fk_categoria,
        fk_tipoEmpaque: editedElemento.fk_tipoEmpaque,
        fk_detalleUbicacion: editedElemento.fk_detalleUbicacion
      });
  
      // Actualizar la lista de elementos
      listarElementos();
  
      // Cerrar el modal de información
      onCloseInfo();
  
      // Mostrar una notificación de actualización exitosa
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
    listarElementos()
  }, [codigoElemento])

  return (

    <div className='w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto'>
      <div className='w-[90%]'>
        <div className='flex gap-3'>
          <Button className='bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold ' onClick={onOpen}>Registrar Elemento</Button>
          <div className='flex justify-center'>
            <input
              type="text"
              className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md'
              placeholder='Nombre Elemento'
              onChange={(e) => {
                setCodigoElemento(e.target.value)
              }}
            />
            <button
              className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
            >
              <FaSearch className='w-[20px] h-auto ' />
            </button>
          </div>
        </div>
        
        <Modal
          size={size}
          isOpen={isOpenInfo}
          onClose={onCloseInfo}
          className='my-auto'
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[22px]">Registrar Elemento</ModalHeader>
                <ModalBody>
                  <form onSubmit={handleForm} action="">
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
                        <Input
                          isRequired
                          type="number"
                          label="Cantidad del elemento"
                          value={editedElemento.stock}
                          onChange={(e) => setEditedElemento({ ...editedElemento, stock: e.target.value })}
                          className="max-w-xs"
                        />
                      </div>
                      <div className='flex gap-5'>
                        <select
                          name="fk_tipoElemento"
                          class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editedElemento.fk_tipoElemento}
                          onChange={(e) => setEditedElemento({ ...editedElemento, fk_tipoElemento: e.target.value })}
                        >
                          <option disabled selected>Seleccione un tipo de elemento</option>
                          {UseTipo.map(tipo => (
                            <option
                              value={tipo.codigo_Tipo}
                              key={tipo.fk_tipoElemento}
                            >
                              {tipo.nombre_tipoElemento}
                            </option>
                          ))}
                        </select>
                        <select
                          name='fk_categoria'
                          class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editedElemento.fk_categoria}
                          onChange={(e) => setEditedElemento({ ...editedElemento, fk_categoria: e.target.value })}
                        >
                          <option disabled selected>Seleccione una categoría</option>
                          {UseCategorias.map(categoria => (
                            <option
                              value={categoria.codigo_Categoria}
                              key={categoria.fk_categoria}
                            >
                              {categoria.Nombre_Categoria}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='flex gap-5'>
                        <select
                          name='fk_tipoEmpaque'
                          class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editedElemento.fk_tipoEmpaque}
                          onChange={(e) => setEditedElemento({ ...editedElemento, fk_tipoEmpaque: e.target.value })}
                        >
                          <option disabled selected>Seleccione un empaque</option>
                          {UseEmpaques.map(empaque => (
                            <option
                              value={empaque.codigo_Empaque}
                              key={empaque.fk_tipoEmpaque}
                            >
                              {empaque.Nombre_Empaque}
                            </option>
                          ))}
                        </select>
                        <select
                          name='fk_unidadMedida'
                          class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editedElemento.fk_unidadMedida}
                          onChange={(e) => setEditedElemento({ ...editedElemento, fk_unidadMedida: e.target.value })}
                        >
                          <option disabled selected>Seleccione una medida</option>
                          {UseMedidas.map(medida => (
                            <option
                              value={medida.codigo_medida}
                              key={medida.fk_unidadMedida}
                            >
                              {medida.Nombre_Medida}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='flex gap-5'>
                        <select
                          name='fk_detalleUbicacion'
                          class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editedElemento.fk_detalleUbicacion}
                          onChange={(e) => setEditedElemento({ ...editedElemento, fk_detalleUbicacion: e.target.value })}
                        >
                          <option disabled selected>Selecciones una Ubicación</option>
                          {UseUbicacion.map(ubicacion => (
                            <option
                              value={ubicacion.codigo_Detalle}
                              key={ubicacion.fk_detalleUbicacion}
                            >
                              {ubicacion.Nombre_ubicacion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='w-full mt-5 flex justify-end gap-2'>
                      <Button style={{ width: '100px' }} className='font-bold text-white' color="danger" onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button style={{ width: '100px' }} className='font-bold text-white' color="success" onPress={handleEditElemento}>
                        Actualizar
                      </Button>
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Table
          aria-label="Lista de Empaques"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={Math.ceil(useElementos.length / itemsPerPage)}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          className="mx-auto"// Agregar la clase mx-auto para centrar horizontalmente
        >
          <TableHeader>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">NOMBRE</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="stock">STOCK</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="tipo">TIPO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="categoria">CATEGORIA</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="emapque">EMPAQUE</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="medida">MEDIDA</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="ubicacion">UBICACIÓN</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
          </TableHeader>
          <TableBody items={itemsToShow}>
            {itemsOnCurrentPage.map(elemento => (
              <TableRow className='text-center font-semibold' key={elemento.Codigo_elemento}>
                <TableCell className='font-semibold'>{elemento.Codigo_elemento}</TableCell>
                <TableCell className='font-semibold'>{elemento.Nombre_elemento}</TableCell>
                <TableCell className='font-semibold'>{elemento.stock}</TableCell>
                <TableCell className='font-semibold'>{elemento.nombre_tipoElemento}</TableCell>
                <TableCell className='font-semibold'>{elemento.nombre_categoria}</TableCell>
                <TableCell className='font-semibold'>{elemento.Nombre_empaque}</TableCell>
                <TableCell className='font-semibold'>{elemento.Nombre_Medida}</TableCell>
                <TableCell className='font-semibold'>{elemento.Nombre_ubicacion}</TableCell>
                <TableCell className='flex gap-2 justify-center'>
                  <Button color='primary' className='font-semibold bg-[#1E6C9B] hover:bg-[#E4B803]' onClick={() => { handleInfo(elemento.Codigo_elemento); }}
                    style={{ fontSize: '15px' }}>
                    Info
                  </Button>
                  <Button color="danger" className={`${elemento.Estado === 'Inactivo' ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`} onClick={() => { desactivarElementos(elemento.Codigo_elemento) }} style={{ fontSize: '15px' }}>
                  {elemento.Estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


