import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";



export const Tables = ({useElementos, UseTipo, listarElementos}) => {

    const [ values, setValues] = useState([]);
    const [ useActualizar, setActualizar] = useState([]);
    const [useDesactivar, setDesactivar] = useState([]);

    const BuscarElemento = async (Codigo_elemento) => {
        try {
            await axios.get(`http://localhost:3000/elemento/buscar/${Codigo_elemento}`)
                .then(response => {
                    setValues(response.data.Elemento)
                    console.log(response.data.Elemento)
                    console.log(UseTipo);
                })
                
                
        } catch {
    
        }
      }

      const editarValores=(event) => {
        setValues({
            ...values,
            [event.target.name]:event.target.value
        });
        console.log(values);
    }

    const Actualizar = async (event, Codigo_elemento) => {
        event.preventDefault();
        try {
            const respuesta = await axios.put(`http://localhost:3000/elemento/actualizar/${Codigo_elemento}`, value);
            if (respuesta.status === 200) {
                alert(respuesta.data.message);
            }
        } catch (error){ 
            console.log(error)
        }
    }
    
    const desactivarElementos = async (Codigo_elemento) => {
    await axios.put(`http://localhost:3000/elemento/desactivar/${Codigo_elemento}`)
        .then(response => {
            setDesactivar(response.data)
            listarElementos();
        })
  };

    const {isOpen, onOpen, onClose} = useDisclosure();
    const size = '3xl'; // Establece el tamaño del modal como '3xl'

    const handleOpen = (Codigo_elemento) => {
        onOpen();
        BuscarElemento(Codigo_elemento);
    }
 
    return (
        <div className=''>  
            <Modal 
          size={size} 
          isOpen={isOpen} 
          onClose={onClose} 
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[22px]">Información Elemento</ModalHeader>
                <ModalBody>
                  <form  action="">
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-5'>
                          <Input
                            isRequired
                            type="text"
                            label="Nombre del elemento"
                            value={values.Nombre_elemento}
                            className="max-w-xs"
                          />
                          <Input
                            isRequired
                            type="number"
                            label="Cantidad del elemento"
                            value={values.stock}
                            className="max-w-xs"
                          />
                        </div>
                        <Select
                          label="Tipo Elemento"
                          placeholder="Selecciona un tipo"
                          name='fk_tipoElemento'
                          selectionMode="multiple"
                          className="max-w-xs"
                          defaultSelectedKeys={[values.fk_tipoElemento]}
                           
                        >
                          {
                            UseTipo.map(tipo => ( 
                              <SelectItem
                              key={tipo.codigo_Tipo} 
                              value={tipo.codigo_Tipo}
                              >
                                {tipo.nombre_tipoElemento}
                              </SelectItem>
                            ))
                          }
                        </Select>
                    </div>
                    <div className='w-full mt-5 flex justify-end gap-5'>
                    <Button style={{width: '100px'}} color="danger"  onPress={onClose}>
                    Close
                    </Button>
                    <Button style={{width: '100px'}} color="primary" type='submit' >
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
            <Table removeWrapper aria-label="Example static collection table">
                <TableHeader style={{}}>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center' }}>Código</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Nombre</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Stock</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Tipo</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Categoría</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Empaque</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Medida</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Ubicación</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Administrar</TableColumn>
                </TableHeader>
                <TableBody style={{ backgroundColor: '#F4F4F5', color: '#000', textAlign: 'center'}}>
                    
                    {useElementos.map(elemento => (
                        <TableRow key={elemento.Codigo_elemento}>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Codigo_elemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_elemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.stock}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.nombre_tipoElemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.nombre_categoria}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_empaque}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_Medida}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_ubicacion}</TableCell>
                            <TableCell style={{ display: 'flex', gap: '5px' }}>
                            <Button color="danger" onClick={()=> {desactivarElementos(elemento.Codigo_elemento)}} style={{fontSize: '15px'}}>
                                 Desactivar
                            </Button>  
                            <Button color="primary" style={{fontSize: '15px'}} onClick={()=> {handleOpen(elemento.Codigo_elemento)}}>
                                Información
                            </Button> 
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}
