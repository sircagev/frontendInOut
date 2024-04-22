import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { ListarTipo, ListarCategorias, Listarubicacion, ListarEmpaques, ListarMedidas } from '../../../functions/Listar';
import { FaExclamationCircle } from 'react-icons/fa';

export const ModalRegistrar = ({ isOpen, onClose, listarElementos }) => {

  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseUbicacion, SetUbicacion] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);

  const [values, setValues] = useState({
    Nombre_elemento: "",
    fk_tipoElemento: "",
    fk_unidadMedida: "",
    fk_categoria: "",
    fk_tipoEmpaque: "",
    fk_detalleUbicacion: ""
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    console.log(values);
  }

  const handleForm = async (event) => {
    try {
      event.preventDefault();

      for (const key in values) {
        if (!values[key]) {
          setErrorMessage('Por favor complete todos los campos obligatorios');
          return;
        }
      }

      console.log(values)
      const response = await axios({
        method: 'post',
        url: `http://localhost:3000/elemento/registrar`,
        data: values
      });
      if (response.status === 200) {
        listarElementos();
        onClose();
        swal({
          title: "Registro exitoso",
          text: "El elemento se ha registrado correctamente.",
          icon: "success",
          buttons: false,
          timer: 2000,
        });

      }

    } catch (error) {
      console.log(error);
    }
  };

  const fectchData = async () => {
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
  }

  useEffect(() => {
    Listarubicacion()
    ListarEmpaques()
    ListarMedidas()
    fectchData()
  }, [])

  return (
    <div>
      <Modal
        size='3xl'
        isOpen={isOpen}
        onClose={onClose}
        className='my-auto'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[22px]">Registrar Elemento</ModalHeader>
              <ModalBody>
                <div className='flex justify-center items-center'>
                  <form onSubmit={handleForm} action="">
                    <div className='flex flex-col gap-4'>
                      <div className='flex gap-5'>
                        <Input
                          isRequired
                          type="text"
                          label="Nombre del elemento"
                          value={values.Nombre_elemento}
                          onChange={(e) => setValues({ ...values, Nombre_elemento: e.target.value })}
                          className="max-w-xs"
                        />
                        <select name='fk_detalleUbicacion' required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                      <div className='flex gap-5'>
                        <select name="fk_tipoElemento" required onChange={handleInputChange} label='Tipo' class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected disabled>Seleccione un tipo de elemento</option>
                          {UseTipo.map(tipo => (
                            <option
                              value={tipo.codigo_Tipo}
                              key={tipo.fk_tipoElemento}
                            >
                              {tipo.nombre_tipoElemento}
                            </option>
                          ))}
                        </select>
                        <select name='fk_categoria'required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                      <div className='flex gap-5 mb-5'>
                        <select name='fk_tipoEmpaque' required onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                        <select name='fk_unidadMedida' onChange={handleInputChange} class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                    </div>
                    <div className='w-full mb-3 mr-5 flex justify-end gap-2 text-white'>
                      <Button style={{ width: '100px' }} className='font-bold bg-[#BF2A50]' color="danger" onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button style={{ width: '100px' }} className='font-bold text-white' color="success" type='submit'>
                        Registrar
                      </Button>
                    </div>
                  </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
