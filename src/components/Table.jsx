import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";



export const Tables = ({useElementos, UseTipo, listarElementos}) => {

    const [ values, setValues] = useState([]);
    const [editingValues, setEditingValues] = useState({});
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

      const handleEditChange = (event) => {
        setEditingValues({
            ...editingValues,
            [event.target.name]: event.target.value
        });
    };

    const handleUpdate = async (event, Codigo_elemento) => {
      event.preventDefault();
      try {
          const respuesta = await axios.put(`http://localhost:3000/elemento/actualizar/${Codigo_elemento}`, editingValues);
          if (respuesta.status === 200) {
              alert(respuesta.data.message);
          }
      } catch (error){ 
          console.log(error)
      }
  };
    
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
                    <form  action="" onSubmit={(event) => handleUpdate(event, values.Codigo_elemento)}>
                      <div className='flex flex-col gap-4'>
                          <div className='flex gap-5'>
                            <Input
                              isRequired
                              type="text"
                              label="Nombre del elemento"
                              name="Nombre_elemento"
                              value={editingValues.Nombre_elemento || values.Nombre_elemento}
                              className="max-w-xs"
                              onChange={handleEditChange}
                            />
                            <Input
                              isRequired
                              type="number"
                              label="Cantidad del elemento"
                              name="stock"
                              value={editingValues.stock || values.stock}
                              className="max-w-xs"
                              onChange={handleEditChange}
                            />
                          </div>
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
                          total={Math.ceil(UseEmpaques.length / itemsPerPage)}
                          onChange={(page) => setPage(page)}
                      />
                  </div>
                  }
                  classNames={{
                      wrapper: "w-[900px]",
                  }}
                  className="mx-auto" // Agregar la clase mx-auto para centrar horizontalmente
              >
                  <TableHeader>
                      <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">CÓDIGO</TableColumn>
                      <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">NOMBRE</TableColumn>
                      <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">ADMINISTRAR</TableColumn>
                  </TableHeader>
                  <TableBody items={itemsToShow}>
                      {itemsOnCurrentPage.map(empaque => (
                          <TableRow className='text-center font-semibold' key={empaque.codigo_Empaque}>
                              <TableCell className='font-semibold'>{empaque.codigo_Empaque}</TableCell>
                              <TableCell className='font-semibold'>{empaque.Nombre_Empaque}</TableCell>
                              <TableCell className='flex gap-2 justify-center'>
                                      <Button color="danger" onClick={()=> {DesactivarEmpaque(empaque.codigo_Empaque)}} style={{fontSize: '15px'}}>
                                          Desactivar
                                      </Button>  
                                      <Button color='primary' onClick={() => {handleInfo(empaque.codigo_Empaque);}} style={{ fontSize: '15px' }}>
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
