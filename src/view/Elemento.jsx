import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";  


export const Elemento = () => {

  const [useElementos, setElementos] = useState([]);
  const [useDesactivar, setDesactivar] = useState([]);
  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseUbicacion, SetUbicacion] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);


  const [page, setPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState([]);
  const {isOpen, onOpen, onOpenChange,  onClose} = useDisclosure();
  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

  const size = '3xl'; // Establece el tamaño del modal como '3xl'

  const handleOpen = () => {
    onOpen();
  }

  const itemsPerPage = 5;
    // Índice del primer elemento en la página actual
  const startIndex = (page - 1) * itemsPerPage;
    // Obtener los elementos que se mostrarán en la página actual
  const itemsOnCurrentPage = useElementos.slice(startIndex, startIndex + itemsPerPage);

    // Función para obtener el valor de una clave específica de un objeto
  const getKeyValue = (item, key) => {
      return item[key];
  };
  
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
           
            onClose();
            listarElementos();
        }
    } catch (error) {
        console.log(error);
    }
  };
    
  const listarElementos = async () => {
      await axios.get('http://localhost:3000/elemento/listar')
          .then(response => {
              setElementos(response.data)
          })
  };


  const ListarTipo = async () => {
    try {
        await axios.get('http://localhost:3000/tipo/listar')
            .then(response => {
                SetTipo(response.data)
            })
    } catch {

    }
  }

  const ListarCategorias = async () => {
    try {
        await axios.get('http://localhost:3000/categoria/listar')
            .then(response => {
                setCategorias(response.data)
                
            })
    } catch {

    }
  }

  const Listarubicacion = async () => {
    try {
        await axios.get('http://localhost:3000/ubicacion/listar')
            .then(response => {
                SetUbicacion(response.data)
                
            })
            
            
    } catch {

    }
  }

  const ListarEmpaques = async () => {
    try {
        await axios.get('http://localhost:3000/empaque/listar')
            .then(response => {
                SetEmpaques(response.data)
               
            })
            
            
    } catch {

    }
  }
  
  const ListarMedidas = async () => {
    try {
        await axios.get('http://localhost:3000/medida/listar')
            .then(response => {
                SetMedidas(response.data)
                
            })
            
            
    } catch {

    }
  }

  const desactivarElementos = async (Codigo_elemento) => {
    await axios.put(`http://localhost:3000/elemento/desactivar/${Codigo_elemento}`)
        .then(response => {
            setDesactivar(response.data)
            listarElementos();
          })
    };
  

  useEffect(() => {
      listarElementos()
      ListarTipo()
      ListarCategorias()
      Listarubicacion()
      ListarEmpaques()
      ListarMedidas()
      desactivarElementos();
  }, [])

  
  return (

    <div className='w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto'>
      <div>
      <div className='flex gap-3'>
        <Button className='bg-[#39A900] mb-3 w-[150px] text-[14px] text-white font-semibold ' onPress={onOpen}>Registrar Elemento</Button>
        <div className='flex justify-center'>
          <input 
            type="text" 
            className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md' placeholder='Código Elemento' 
          />
          <button
            class="flex justify-center items-center middle none center mr-4 bg-blue-500 h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            >
            <FaSearch className='w-[20px] h-auto ' />
          </button>
        </div>
      </div>
        <Modal 
            size={size} 
            isOpen={isOpen} 
            onClose={onClose} 
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
                              value={values.Nombre_elemento}
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
                            <select id="countries" class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option selected>Choose a country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                            <select id="countries" class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option selected>Choose a country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                          </div>
                          <div className='flex gap-5'>
                            <select id="countries" class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option selected>Choose a country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                            <select id="countries" class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option selected>Choose a country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                          </div>
                          <div className='flex gap-5'>
                            <select id="countries" class="bg-[#F4F4F5] border border-gray-300 w-[320px] h-[55px] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option selected>Choose a country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                          </div>
                      </div>
                      <div className='w-full mt-5 flex justify-end gap-5'>
                      <Button style={{width: '100px'}} color="danger"  onPress={onClose}>
                      Close
                      </Button>
                      <Button style={{width: '100px'}} color="success" type='submit'>
                        Registrar
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
                className="mx-auto"// Agregar la clase mx-auto para centrar horizontalmente
            >
                <TableHeader>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">CÓDIGO</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">NOMBRE</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">STOCK</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">TIPO</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">CATEGORIA</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">EMPAQUE</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="codigo">MEDIDA</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="nombre">UBICACIÓN</TableColumn>
                    <TableColumn  className='text-center font-bold bg-[#39A900] text-white' key="acciones">ADMINISTRAR</TableColumn>
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
                              <Button color="danger" onClick={()=> {desactivarElementos(elemento.Codigo_elemento)}} style={{fontSize: '15px'}}>
                                Desactivar
                              </Button>  
                              <Button color='primary' style={{ fontSize: '15px' }}>
                                Información
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
