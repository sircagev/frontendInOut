import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";


  export const Modals = () => {
    
    
    const [UseTipo, SetTipo] = useState([]);
    const [UseCategorias, setCategorias] = useState([]);
    const [UseEmpaques, SetEmpaques] = useState([]);
    const [UseMedidas, SetMedidas] = useState([]);
    const [UseUbicacion, SetUbicacion] = useState([]);
    
    const [values,setValues] = useState(
      {
          Nombre_elemento: "",
          stock: "",
          fk_tipoElemento: "",
          fk_unidadMedida: "",
          fk_categoria: "",
          fk_tipoEmpaque: "",
          fk_detalleUbicacion: ""
      }
  )
  const handleInputChange=(event) => {
      setValues({
          ...values,
          [event.target.name]:event.target.value
      });
      console.log(values);
  }
  
  const handleForm = async (event) => {
      try {
          event.preventDefault();
          const response = await axios({
              method: 'post',
              url: `http://localhost:3000/elemento/registrar`,
              data: values
          });
          if (response.status === 200) {
              console.log(response.data.message);
              onClose();
              listarElementos(); // Actualiza la lista de elementos después de registrar uno nuevo
          }
      } catch (error) {
          console.log(error);
      }
  };

  const ListarTipo = async () => {
    try {
        await axios.get('http://localhost:3000/tipo/listar')
            .then(response => {
                SetTipo(response.data)
                console.log(response.data)
            })
    } catch {

    }
  }

const ListarCategorias = async () => {
    try {
        await axios.get('http://localhost:3000/categoria/listar')
            .then(response => {
                setCategorias(response.data)
                console.log(response.data)
            })
    } catch {

    }
  }

  const ListarEmpaques = async () => {
    try {
        await axios.get('http://localhost:3000/empaque/listar')
            .then(response => {
                SetEmpaques(response.data)
                console.log(response.data)
            })
            
            
    } catch {

    }
  }
  
  const ListarMedidas = async () => {
    try {
        await axios.get('http://localhost:3000/medida/listar')
            .then(response => {
                SetMedidas(response.data)
                console.log(response.data)
            })
            
            
    } catch {

    }
  } 

  const Listarubicacion = async () => {
    try {
        await axios.get('http://localhost:3000/ubicacion/listar')
            .then(response => {
                SetUbicacion(response.data)
                console.log(response.data)
            })
            
            
    } catch {

    }
  }

  useEffect(() => {
    ListarTipo()
    ListarCategorias()
    ListarEmpaques()
    ListarMedidas()
    Listarubicacion()
    }, [])

    const {isOpen, onOpen, onClose} = useDisclosure();
    const size = '3xl'; // Establece el tamaño del modal como '3xl'

    const handleOpen = () => {
        onOpen();
    }

    return (
      <div className='w-full'>
         <div className="flex flex-wrap gap-3">
          <Button color='success' onPress={handleOpen}
          className='bg-[#39A900] mb-2 text-[15px] text-white font-semibold'
          >Registrar nuevo elemento</Button> {/* Muestra solo el botón para abrir el modal con tamaño '3xl' */}  
        </div>
        <Modal 
          size={size} 
          isOpen={isOpen} 
          onClose={onClose} 
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[22px]">Registrar Elemento</ModalHeader>
                <ModalBody>
                  <form onSubmit={handleForm} action="">
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-3'>
                          <Input
                            isRequired
                            type="text"
                            label="Nombre del elemento"
                            value={values.nombre_elemento}
                            onChange={(e) => setValues({ ...values, Nombre_elemento: e.target.value })}
                            className="max-w-xs"
                          />
                          <Input
                            isRequired
                            type="number"
                            label="Cantidad del elemento"
                            value={values.stock}
                            onChange={(e) => setValues({ ...values, stock: e.target.value })}
                            className="max-w-xs"
                          />
                        </div>
                        <div className='flex gap-5'>
                        <Select
                          label="Tipo Elemento"
                          placeholder="Selecciona un tipo"
                          name='fk_tipoElemento'
                          selectionMode="multiple"
                          onChange={handleInputChange}
                          className="max-w-xs"
                           
                        >
                          {
                            UseTipo.map(tipo => ( 
                              <SelectItem
                              key={tipo.codigo_Tipo} 
                              value={tipo.fk_tipoElemento}
                              >
                                {tipo.nombre_tipoElemento}
                              </SelectItem>
                            ))
                          }
                        </Select>
                        <Select
                          label="Unidad Medida"
                          placeholder="Seleccione una medida"
                          name='fk_unidadMedida'
                          selectionMode="multiple"
                          onChange={handleInputChange}
                          className="max-w-xs"
                        >
                          {
                          UseMedidas.map(medida => (
                            <SelectItem 
                            key={medida.codigo_medida}
                            value={medida.fk_unidadMedida}
                            >
                              {medida.Nombre_Medida}
                            </SelectItem>
                            ))
                          }                        
                        </Select>
                        </div>
                        <div className='flex gap-5'>
                        <Select
                          label="Categoría Elemento"
                          placeholder="Seleccione una categoría"
                          name='fk_categoria'
                          selectionMode="multiple"
                          onChange={handleInputChange}
                          className="max-w-xs"
                        > 
                          {
                            UseCategorias.map(categoria => (
                            <SelectItem 
                            key={categoria.codigo_Categoria}
                            value={categoria.fk_categoria}
                            >
                              {categoria.Nombre_Categoria}
                            </SelectItem>
                            ))
                          }                         
                        </Select>
                        <Select
                          label="Tipo Empaque"
                          placeholder="Seleccione un empaque"
                          name='fk_detalleUbicacion'
                          selectionMode="multiple"
                          onChange={handleInputChange}
                          className="max-w-xs"
                        > 
                          {
                            UseEmpaques.map(empaque => (
                            <SelectItem 
                            key={empaque.codigo_Empaque}
                            value={empaque.fk_tipoEmpaque}
                            >
                              {empaque.Nombre_Empaque}
                            </SelectItem>
                            ))
                          }
                        </Select>
                        </div>
                        <div className='flex gap-5'>
                        <Select
                          label="Ubicación"
                          placeholder="Seleccione una Ubicación"
                          onChange={handleInputChange}
                          className="max-w-xs"
                        > {
                          UseUbicacion.map(ubicacion => (
                            <SelectItem 
                            key={ubicacion.codigo_detalle}
                            value={ubicacion.fk_detalleUbicacion}
                            >
                              {ubicacion.Nombre_ubicacion}
                            </SelectItem>
                            ))
                          }
                        </Select>
                        </div>
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button style={{width: '100px'}} color="danger"  onPress={onClose}>
                    Close
                  </Button>
                  <Button style={{width: '100px'}} color="success" type='submit'>
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    )
  }
