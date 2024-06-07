import React, { useState, useEffect } from 'react'
import axiosClient from '../components/config/axiosClient';
import {
   Table,
   TableHeader,
   TableColumn,
   TableBody,
   TableRow,
   TableCell,
   Pagination
} from "@nextui-org/react";
import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Button,
   useDisclosure,
   Input
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/react";
import { ListarElementos, ListarUsuarios } from '../functions/Listar';

export const Movimientos2 = ({user}) => {
   //Sirve para guardar la información que se traiga al listar los datos 
   const [movimientos, setMovimientos] = useState([]);
   const [detallesMovimiento, setDetallesMovimiento] = useState([]);

   const [nuevosDetalles, setNuevosDetalles] = useState([]);

   const [dataElements, setDataElements] = useState([]);
   const [dataUsuarios, setDataUsuarios] = useState([]);

   const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

   const handleUsuarioSeleccionado = (idUsuario) => {
      // Encuentra el usuario seleccionado basado en su id_usuario
      const usuario = dataUsuarios.find(user => user.id_usuario === idUsuario);
      console.log(dataUsuarios)
      // Actualiza el estado con el usuario seleccionado
      setUsuarioSeleccionado(usuario);
   };

   //Para guardar la informacion del codigo de movimiento a usar
   const [codigoMovimiento, setCodigoMovimiento] = useState('');

   //Modales y sirve para abrir y cerrar el modal de informacion
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const { isOpen: isOpenStock, onOpen: onOpenStock, onOpenChange: onOpenChangeStock, onClose: onCloseStock } = useDisclosure();

   //Guardar la información que se envia para ejecutar un cambio en el Stock
   const [dataStock, setDataStock] = useState({
      usuario_solicitud: user.codigo,
      fk_movimiento: '',
      Estado: null,
      detalles: [{
         fk_elemento: '',
         estado: null,
         fecha_vencimiento: null,
         cantidad: 0,
         Usuario_recibe: '',
         Usuario_entrega: '',
         Observaciones: null
      }]
   });

   // Agrega un nuevo detalle con su elemento asociado
   const agregarNuevoDetalle = () => {
      setNuevosDetalles([...nuevosDetalles, { Movimiento: '', Elemento: '', Fecha: '', Cantidad: '', Recibe: '', Entrega: '' }]);
   };

   const eliminarNuevoDetalle = (index) => {
      const detallesActualizados = [...nuevosDetalles];
      detallesActualizados.splice(index, 1);
      setNuevosDetalles(detallesActualizados);
   };

   // Función para agregar un nuevo detalle al detalle del movimiento
   const agregarDetalleMovimiento = async (nuevoDetalle) => {
      try {
         nuevoDetalle.Movimiento = codigoMovimiento;
         console.log(nuevoDetalle)

         const response = await axiosClient.post(`movimientos/${nuevoDetalle.Movimiento}/aniadirDetalle`, nuevoDetalle)

         if (response.status === 200) {
            handleInfo(codigoMovimiento);
         }

      } catch (error) {
         console.log(error)
      }

   };

   const handleInputChange = (index, fieldName, value) => {
      const updatedDetalles = [...nuevosDetalles];
      const detalle = updatedDetalles[index];

      if (fieldName === 'elemento') {
         detalle.Elemento = value;
      } else if (fieldName === 'fecha') {
         detalle.Fecha = value || null;
      } else if (fieldName === 'cantidad') {
         detalle.Cantidad = value;
      } else if (fieldName === 'recibe') {
         detalle.Recibe = value;
      } else if (fieldName === 'entrega') {
         detalle.Entrega = value;
      }

      updatedDetalles[index] = detalle;
      setNuevosDetalles(updatedDetalles);
   };

   const handleInputUser = () => {

   }

   //Para guardar la informacion del editar o no
   const [editable, setEditable] = useState(true);

   //Inicializar page
   const [page, setPage] = useState(1);
   const [itemsToShow, setItemsToShow] = useState([]);

   const itemsPerPage = 6;

   // Índice del primer elemento en la página actual
   const startIndex = (page - 1) * itemsPerPage;

   // Obtener los elementos que se mostrarán en la página actual
   const itemsOnCurrentPage = movimientos.slice(startIndex, startIndex + itemsPerPage);

   const size = '3xl'; // Establece el tamaño del modal como '3xl'

   //Buscar detalles de movimientos de un movimiento especifico mediante su ID
   const handleInfo = async (codigo) => {
      try {
         const response = await axiosClient.get(`movimientos/${codigo}/detalles`);
         console.log(response);
         setCodigoMovimiento(codigo)
         setDetallesMovimiento(response.data.datos ? response.data.datos : []);
         onOpen();
      } catch (error) {

      }
   };

   const listarMovimientos = async () => {
      try {
         let response;
         if (codigoMovimiento.trim() !== '') {
            // Realizar una solicitud específica para obtener un movimiento por su código
            response = await axiosClient.get(`movimientos/buscar/${codigoMovimiento}`);
            setMovimientos(response.data.Movimiento ? response.data.Movimiento : []);
         } else {
            // Obtener todos los movimientos si no se proporciona ningún código
            response = await axiosClient.get('movimientos/listar');
            setMovimientos(response.data.datos || []);
         }
      } catch (error) {
         console.log(error);
      }
   }

   //Cambiar el valor del editable
   const toggleEditables = () => {
      setEditable(!editable);
   }

   //Inicializar la informacion de acuerdo a las funciones importadas
   const fectchData = async () => {
      try {
         const itemsElements = await ListarElementos();
         const itemsUsers = await ListarUsuarios();
         setDataElements(itemsElements);
         setDataUsuarios(itemsUsers.result);
      } catch (error) {
         console.log(error);
      }
   }

   const AnadirStock = async (e) => {
      e.preventDefault();
      try {
         console.log(dataStock);
         const response = await axiosClient.post(`movimientos/aniadirStock`, dataStock);
         console.log(response.data)
         listarMovimientos();
         setUsuarioSeleccionado(null)
         onCloseStock();
      } catch (error) {
         console.log(error);
      }
   };

   //Ejecutar funciones
   useEffect(() => {
      listarMovimientos();
      fectchData();
   }, [codigoMovimiento])

   return (
      <div className='w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto'>
         <div className='w-[90%]'>
            <div className='flex gap-3 justify-between'>
               <div className='flex justify-center ml-4'>
                  <input
                     type="text"
                     className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md mb-2'
                     placeholder='Código Movimiento'
                     onChange={(e) => {
                        setCodigoMovimiento(e.target.value)
                     }}
                  />
                  <button
                     className="flex justify-center items-center middle none center mr-4 bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                     data-ripple-light="true"
                  >
                     <FaSearch className='w-[20px] h-auto ' />
                  </button>
               </div>
               <div className='flex mr-6 gap-3'>
                  <button className='bg-green-700 hover:bg-green-800 h-10 px-2 rounded text-white font-semibold' onClick={() => {
                     setDataStock(prevDataStock => ({
                        ...prevDataStock,
                        fk_movimiento: 1,
                        detalles: [{
                           ...prevDataStock.detalles[0],
                           Usuario_recibe: user.codigo,
                        }]
                     }));
                     console.log(dataStock);
                     onOpenStock()
                  }}>Registrar Ingreso</button>
                  <button className='bg-red-700 hover:bg-red-800 h-10 px-2 rounded text-white font-semibold' onClick={() => {
                     setDataStock(prevDataStock => ({
                        ...prevDataStock,
                        fk_movimiento: 2,
                        detalles: [{
                           ...prevDataStock.detalles[0],
                           Usuario_entrega: user.codigo,
                        }]
                     }));
                     onOpenStock()
                  }}>Registrar Salida</button>
               </div>
            </div>
            <Modal
               size="4xl"
               isOpen={isOpen}
               onClose={onClose}
               className='my-auto'
            >
               <ModalContent>
                  {(onClose) => (
                     <>
                        <ModalHeader className="flex flex-col gap-1 text-[22px]">Informacion Detallada</ModalHeader>
                        <ModalBody>
                           <form action="">
                              <div className='flex flex-col gap-4'>
                                 <div className='w-full'>
                                    {detallesMovimiento.map((detalle, index) => (
                                       <div className='w-full mb-3' key={index}>
                                          <form action="" className='w-full'>
                                             <div className='flex items-start pl-3 font-bold pb-2'>{detalle.Elemento}</div>
                                             <div className='flex w-full'>
                                                <div className='w-[10%] flex justify-center items-centerc text-4xl'> {detalle.Codigo}</div>
                                                <div className='flex w-[90%] gap-1'>
                                                   <Input
                                                      isReadOnly={editable}
                                                      isRequired
                                                      key="fecha"
                                                      type={editable ? "text" : 'date'}
                                                      label="Fecha"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      defaultValue={detalle.Fecha ? detalle.Fecha.split('T')[0] : 'Sin fecha'}
                                                   />
                                                   <Input
                                                      isReadOnly={editable}
                                                      isRequired
                                                      key="cantidad"
                                                      type="number"
                                                      label="Cantidad"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      defaultValue={detalle.Cantidad}
                                                   />
                                                   <Input
                                                      isReadOnly={editable}
                                                      isRequired
                                                      key="recibio"
                                                      type="text"
                                                      label="Recibio"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      defaultValue={detalle.Recibe}
                                                   />
                                                   <Input
                                                      isReadOnly={editable}
                                                      isRequired
                                                      key="entrego"
                                                      type="text"
                                                      label="Entrego"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      defaultValue={detalle.Entrega}
                                                   />
                                                   <div>
                                                      <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={toggleEditables} style={{ fontSize: '15px' }}>
                                                         {editable ? "Editar" : "Cancelar"}
                                                      </Button>
                                                      {editable ? "" : <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={() => alert('Realizando cambio')} style={{ fontSize: '15px' }}>
                                                         {editable ? "Editar" : "Realizar Cambios"}
                                                      </Button>}
                                                   </div>
                                                </div>
                                             </div>
                                          </form>
                                       </div>
                                    ))}
                                    {nuevosDetalles.map((detalle, index) => (
                                       <div className='w-full mb-3' key={index}>
                                          <form action="" className='w-full'>
                                             {/* Aquí renderizas los campos de entrada para el elemento y los detalles */}
                                             <div className='flex w-full'>
                                                <div className='flex w-full gap-1'>
                                                   <Autocomplete
                                                      label="Select an element"
                                                      placeholder="Search an animal"
                                                      isRequired
                                                      variant="underlined"
                                                      selectedKey={detalle.Elemento}
                                                      onSelectionChange={(value) => handleInputChange(index, 'elemento', value)}
                                                   >
                                                      {dataElements.map((element) => (
                                                         <AutocompleteItem
                                                            key={element.Codigo_elemento}
                                                            value={element.Codigo_elemento}
                                                         >
                                                            {element.Nombre_elemento}
                                                         </AutocompleteItem>
                                                      ))}
                                                   </Autocomplete>
                                                   <Input
                                                      isRequired
                                                      type="date"
                                                      label="Fecha"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      onChange={(e) => handleInputChange(index, 'fecha', e.target.value)}
                                                      value={detalle.Fecha}
                                                   />
                                                   <Input
                                                      isRequired
                                                      type="number"
                                                      label="Cantidad"
                                                      variant="underlined"
                                                      labelPlacement="outside"
                                                      onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)}
                                                      value={detalle.Cantidad}
                                                   />
                                                   <Autocomplete
                                                      label="Select a user"
                                                      placeholder="Search a user"
                                                      isRequired
                                                      variant="underlined"
                                                      selectedKey={detalle.Recibe}
                                                      onSelectionChange={(value) => handleInputChange(index, 'recibe', value)}
                                                   >
                                                      {dataUsuarios.map((user) => (
                                                         <AutocompleteItem
                                                            key={user.id_usuario}
                                                            value={user.id_usuario}
                                                         >
                                                            {user.nombre_usuario}
                                                         </AutocompleteItem>
                                                      ))}
                                                   </Autocomplete>
                                                   <Autocomplete
                                                      label="Select a user"
                                                      placeholder="Search a user"
                                                      isRequired
                                                      variant="underlined"
                                                      selectedKey={detalle.Entrega}
                                                      onSelectionChange={(value) => handleInputChange(index, 'entrega', value)}
                                                   >
                                                      {dataUsuarios.map((user) => (
                                                         <AutocompleteItem
                                                            key={user.id_usuario}
                                                            value={user.id_usuario}
                                                         >
                                                            {user.nombre_usuario}
                                                         </AutocompleteItem>
                                                      ))}
                                                   </Autocomplete>


                                                   <div>
                                                      <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={() => {
                                                         agregarDetalleMovimiento(detalle)
                                                         eliminarNuevoDetalle(index)
                                                      }} style={{ fontSize: '15px' }}>
                                                         Registrar Detalle
                                                      </Button>
                                                      <button onClick={() => eliminarNuevoDetalle(index)}>Eliminar</button>
                                                   </div>
                                                </div>
                                             </div>
                                          </form>
                                       </div>
                                    ))}
                                    <Button color="danger" className='font-semibold bg-black hover:bg-[#BF2A50]' onClick={agregarNuevoDetalle} style={{ fontSize: '15px' }}>
                                       Añadir Detalle
                                    </Button>
                                 </div>
                              </div>
                              <div className='w-full mt-5 flex justify-end gap-2 text-white'>
                                 <Button style={{ width: '100px' }} className='font-bold bg-[#BF2A50]' color="danger" onPress={onClose}>
                                    Cerrar
                                 </Button>
                                 <Button style={{ width: '100px' }} className='font-bold text-white' color="success" type='submit'>
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
            <Modal
               isOpen={isOpenStock}
               onClose={onCloseStock}
               onOpenChange={onOpenChangeStock}
               size='3xl'
               className='my-auto'
            >
               <ModalContent>
                  {(onCloseStock) => (
                     <>
                        <ModalHeader className={`flex flex-col gap-1 ${dataStock.fk_movimiento == 1 ? 'text-green-700' : 'text-red-700'} font-bold`}>{dataStock.fk_movimiento == 1 ? 'Registrar Ingreso' : 'Registrar Salida'}</ModalHeader>
                        <ModalBody>
                           <form action="" className='flex flex-col'>
                              <div className='flex gap-6 justify-center mb-3'>
                                 <Autocomplete
                                    label="Selecciona un elemento"
                                    placeholder="Busca un elemento"
                                    isRequired
                                    variant="underlined"
                                    className='w-[75%] h-[60px]'
                                    onSelectionChange={(value) => {
                                       const element = value;
                                       setDataStock(prevDataStock => ({
                                          ...prevDataStock,
                                          detalles: [{
                                             ...prevDataStock.detalles[0],
                                             fk_elemento: element
                                          }]
                                       }));

                                       console.log(dataStock)
                                    }}
                                 >
                                    {dataElements.map((element) => (
                                       <AutocompleteItem
                                          key={element.Codigo_elemento}
                                          value={element.Codigo_elemento}
                                       >
                                          {element.Nombre_elemento}
                                       </AutocompleteItem>
                                    ))}
                                 </Autocomplete>
                                 <Input
                                    isRequired
                                    type="number"
                                    label="Cantidad"
                                    placeholder='Ingresa una cantidad'
                                    variant="underlined"
                                    labelPlacement="outside"
                                    className='w-[20%]'
                                    min={0}
                                    onChange={(e) => {
                                       const nuevaCantidad = parseInt(e.target.value);
                                       if (!isNaN(nuevaCantidad)) { // Verificar si el nuevo valor es un número
                                          setDataStock(prevDataStock => ({
                                             ...prevDataStock,
                                             detalles: [{
                                                ...prevDataStock.detalles[0],
                                                cantidad: nuevaCantidad,
                                             }]
                                          }));
                                       } else {
                                          // Aquí puedes manejar el caso cuando el usuario ingresa un valor no válido
                                          console.log('Por favor ingrese un número válido para la cantidad.');
                                       }
                                       console.log(dataStock)
                                    }}
                                 />
                              </div>
                              <div className='flex gap-6 justify-center'>
                              {
                                    dataStock.fk_movimiento == 2 && (
                                       <Autocomplete
                                          label="Tipo Salida"
                                          placeholder="Tipo Salida"
                                          isRequired
                                          variant="underlined"
                                          className='w-[25%] h-[60px]'
                                          /* onSelectionChange={(value) => {
                                             const element = value;
                                             setDataStock(prevDataStock => ({
                                                ...prevDataStock,
                                                detalles: [{
                                                   ...prevDataStock.detalles[0],
                                                   fk_elemento: element
                                                }]
                                             }));

                                             console.log(dataStock)
                                          }} */
                                       >
                                             <AutocompleteItem
                                                key='asignacion'
                                                value= '1'
                                             >
                                                Asignación
                                             </AutocompleteItem>
                                             <AutocompleteItem
                                                key='prestamo'
                                                value= '2'
                                             >
                                                Préstamo
                                             </AutocompleteItem>
                                       </Autocomplete>
                                    )
                                 }
                                 <Autocomplete
                                    label="Seleccione un usuario"
                                    placeholder="Busca un usuario"
                                    isRequired
                                    variant="underlined"
                                    className='w-[30%]'
                                    onSelectionChange={(value) => {
                                       handleUsuarioSeleccionado(parseInt(value))
                                       setDataStock(prevDataStock => ({
                                          ...prevDataStock,
                                          detalles: [{
                                             ...prevDataStock.detalles[0],
                                             [prevDataStock.fk_movimiento === 2 ? 'Usuario_recibe' : 'Usuario_entrega']: value,
                                             
                                          }]
                                       }));

                                       console.log(dataStock)
                                    }}
                                 >
                                    {dataUsuarios.map((user) => (
                                       <AutocompleteItem
                                          key={user.id_usuario}
                                          value={user.id_usuario}
                                       >
                                          {user.nombre_usuario}
                                       </AutocompleteItem>
                                    ))}
                                 </Autocomplete>
                                 <label className='flex pl-5 items-center w-[40%]'>{usuarioSeleccionado ? usuarioSeleccionado.nombre_usuario + ' ' + usuarioSeleccionado.apellido_usuario : ''}</label>
                              </div>
                           </form>
                        </ModalBody>
                        <ModalFooter>
                           <Button style={{ width: '100px' }} className='font-bold bg-[#BF2A50]' color="danger" onPress={onCloseStock}>
                              Cerrar
                           </Button>
                           <Button style={{ width: '100px' }} className='font-bold text-white' color="success" type='submit' onClick={AnadirStock}>
                              Registrar
                           </Button>
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
                        total={Math.ceil(movimientos.length / itemsPerPage)}
                        onChange={(page) => setPage(page)}
                     />
                  </div>
               }
               className="mx-auto"// Agregar la clase mx-auto para centrar horizontalmente
            >
               <TableHeader>
                  <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="codigo">CÓDIGO</TableColumn>
                  <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre">FECHA</TableColumn>
                  <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="stock">USUARIO</TableColumn>
                  <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="tipo">TIPO MOVIMIENTO</TableColumn>
                  <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
               </TableHeader>
               <TableBody items={itemsToShow}>
                  {itemsOnCurrentPage.map(elemento => (
                     <TableRow className='text-center font-semibold' key={elemento.Codigo}>
                        <TableCell className='font-semibold'>{elemento.Codigo}</TableCell>
                        <TableCell className='font-semibold'>{elemento.Fecha}</TableCell>
                        <TableCell className='font-semibold'>{elemento.Usuario}</TableCell>
                        <TableCell className='font-semibold'>{elemento.Tipo}</TableCell>
                        <TableCell className='flex gap-2 justify-center'>
                           <Button color='primary' className='font-semibold bg-[#1E6C9B] hover:bg-[#E4B803]' onClick={() => {
                              handleInfo(elemento.Codigo);
                           }}
                              style={{ fontSize: '15px' }}>
                              Info
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

//Debo Realizar un movimineto de préstamo, este movimiento tiene estados de entrega o en prestamo, se listan los que tienen el estado en prestamo para saber cuantos elementos en total hay prestados, sobre estos se hacen los cálculos  