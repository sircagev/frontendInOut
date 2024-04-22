import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { Modal } from 'bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { check, validationResult } from 'express-validator';
import swal from 'sweetalert';

let myModal;

const Usuario = ({ userLogin }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [roleUserLogin, setRoleUserLogin] = useState('')
  const [selectedUser, setSelectedUser] = useState(null);
  const [identificacion, setIdentificacionUsuario] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [values, setValues] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    email_usuario: "",
    rol: "",
    numero: "",
    contraseña_usuario: "",
    Id_ficha: "",
    identificacion: ""
  });

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleForm = async (event) => {
    try {
      event.preventDefault();

      // Realizar validaciones del lado del cliente
      const errors = validationResult(values);
      if (!errors.isEmpty()) {
        // Si hay errores de validación, mostrarlos con SweetAlert
        let errorMessage = "Errores de validación:\n";
        errors.array().forEach(error => {
          errorMessage += `- ${error.msg}\n`;
        });
        swal("Error de validación", errorMessage, "error");
        return; // Detener el proceso de registro si hay errores de validación
      }

      // Preguntar al usuario si está seguro de realizar el registro
      const confirmRegistration = await swal({
        title: "¿Estás seguro?",
        text: "¿Quieres registrar este usuario?",
        icon: "warning",
        buttons: ["Cancelar", "Registrar"],
        dangerMode: true,
      });

      if (confirmRegistration) {
        console.log("Valores enviados en la solicitud:", values);
        const response = await axios.post(`http://localhost:3000/usuario/registrar`, values);
        if (response.status === 200) {
          swal({
            title: "Registro exitoso",
            text: response.data.message,
            icon: "success",
            buttons: false,
            timer: 2000,
          });
          myModal.hide();
          ListarUsuarios();
        }
      } else {
        swal("El registro ha sido cancelado.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      swal({
        title: "Error",
        text: "Error al registrar usuario, Información Incorrecta",
        icon: "error",
        buttons: false,
        timer: 2000,
      });
    }
  };

  const handleFormm = async (event) => {
    try {
      event.preventDefault();

      // Mostrar confirmación
      const confirmacion = await swal({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar los Datos del Usuario?",
        icon: "warning",
        buttons: ["Cancelar", "Actualizar"],
        dangerMode: true,
      });

      // Si el usuario confirma la actualización
      if (confirmacion) {
        const response = await axios.put(`http://localhost:3000/usuario/actualizar/${selectedUser.id_usuario}`, values);
        if (response.status === 200) {
          swal({
            title: "Actualización Éxitosa",
            text: response.data.message,
            icon: "success",
            buttons: false,
            timer: 2000,
          });
          myModal.hide();
          ListarUsuarios();
        }
      }
    } catch (error) {
      console.error("Error al Actualizar el usuario:", error);
      console.error("Detalles del error:", error.response.data);
      swal({
        title: "Error",
        text: "Error al actualizar el usuario\n" + error.response.data.message,
        icon: "error",
        buttons: false,
        timer: 2000,
      });
    }
  };

  const DesactivarUsuario = async (id_usuario) => {
    try {
      // Obtener el usuario actual
      const userToUpdate = usuarios.find(user => user.id_usuario === id_usuario);

      // Determino el nuevo estado (si el usuario estaba activo, lo desactivo, y viceversa)
      const newEstado = userToUpdate.Estado === 'Activo' ? 'Inactivo' : 'Activo';

      // Mostrar confirmación
      const confirmacion = await swal({
        title: "¿Estás seguro?",
        text: `¿Quieres cambiar el estado del usuario ${userToUpdate.nombre_usuario}?`,
        icon: "warning",
        buttons: ["Cancelar", "Aceptar"],
        dangerMode: true,
      });

      // Si el usuario confirma el cambio de estado
      if (confirmacion) {
        // Realizo la solicitud para cambiar el estado del usuario
        const response = await axios.put(`http://localhost:3000/usuario/estado/${id_usuario}`, { Estado: newEstado });

        // Actualizo el estado del usuario en la lista de usuarios
        const updatedUsuarios = usuarios.map(user => {
          if (user.id_usuario === id_usuario) {
            return {
              ...user,
              Estado: newEstado
            };
          }
          return user;
        });

        setUsuarios(updatedUsuarios);

        if (response.status === 200) {
          swal({
            title: "Estado Éxito",
            text: response.data.message,
            icon: "success",
            buttons: false,
            timer: 2000,
          });
          myModal.hide();
        }
      }
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      console.error("Detalles del error:", error.response.data);
      swal({
        title: "Error",
        text: "Error al cambiar el estado del usuario",
        icon: "error",
        buttons: false,
        timer: 2000,
      });
    }
  };
  const handleClose = () => {
    myModal.hide();
    ListarUsuarios();
  };

  const buscarUsuario = async (identificacion) => {
    try {
      const response = await axios.get(`http://localhost:3000/usuario/buscar/${identificacion}`);
      setUsuarios(response.data.Datos ? response.data.Datos : []);
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      swal("Error", "No se encontro usuario con la identificación ingresada", "error");

    }
  };


  const handleSearch = async () => {
    setError(null);
    console.log(searchTerm.trim())
    if (searchTerm.trim() !== '') {
      setIdentificacionUsuario(searchTerm.trim()); // Actualizar id_usuario con el valor de searchTerm
      console.log(searchTerm);
      buscarUsuario(searchTerm.trim());
    } else {
      setIdentificacionUsuario('');
      // Si el campo de búsqueda está vacío, actualizar la lista de usuarios
      try {
        await ListarUsuarios();
      } catch (error) {
        console.error("Error al listar usuarios:", error);
        // Aquí puedes mostrar un mensaje de error si lo deseas
      }
    }
  };

  const ListarUsuarios = async () => {
    try {
      let response;
      if (identificacion.trim() !== '') {
        response = await axios.get(`http://localhost:3000/usuario/buscar/${identificacion}`);
        console.log(response.data);
        setUsuarios(response.data.Datos ? response.data.Datos : []);

      } else {
        response = await axios.get('http://localhost:3000/usuario/listar');
        setUsuarios(response.data.result || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setValues({
      ...values,
      nombre_usuario: user.nombre_usuario,
      apellido_usuario: user.apellido_usuario,
      email_usuario: user.email_usuario,
      rol: user.rol,
      numero: user.numero,
      contraseña_usuario: user.contraseña_usuario,
      Id_ficha: user.Id_ficha,
      identificacion: user.identificacion
    });
    myModal.show();
  };

  useEffect(() => {
    myModal = new Modal(document.getElementById('myModal'), {
      keyboard: false
    });
    ListarUsuarios();
    setRoleUserLogin(userLogin.role);
    console.log(userLogin.role)
    console.log(roleUserLogin);
  }, [identificacion]);

  // Lógica para mostrar la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(usuarios) ? usuarios.slice(indexOfFirstUser, indexOfLastUser) : [];

  // Separa los usuarios activos de los inactivos
  const activeUsers = currentUsers.filter(user => user.Estado === 'Activo');
  const inactiveUsers = currentUsers.filter(user => user.Estado !== 'Activo');

  // Lógica para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(usuarios.length / usersPerPage);

  // Función para renderizar los botones de paginación
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => paginate(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return (
      <>
        <Pagination.Prev onClick={() => paginate(currentPage - 1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Pagination.Prev>
        {pageNumbers}
        <Pagination.Next onClick={() => paginate(currentPage + 1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </Pagination.Next>
      </>
    );
  };

  return (
    <div className="w-full flex flex-col justify-center mt-[70px] items-center gap-5 overflow-auto">
      <div className="w-[90%]">
        <div className="flex gap-3">
          {userLogin.role === 'administrador' && (
            <Button
              className="bg-[#3D7948] mb-3 w-[150px] text-[14px] text-white font-semibold"
              onClick={() => {
                setSelectedUser(null);
                setValues({
                  nombre_usuario: "",
                  apellido_usuario: "",
                  email_usuario: "",
                  rol: "",
                  numero: "",
                  contraseña_usuario: "",
                  Id_ficha: "",
                  identificacion: ""
                });
                myModal.show();
              }}
            >
              Registrar Usuario
            </Button>
          )}
          <div className='flex justify-center mb-3'>
            <input
              type="text"
              className='w-[170px] h-[40px] pl-3 border-1 border-[#c3c3c6] text-[14px] font-semibold outline-none rounded-tl-md rounded-bl-md'
              placeholder='Identificación Usuario...'
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }
              }
            />

            <button
              className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans 
            text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] 
            focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              onClick={handleSearch}
            >
              <BiSearch className='w-[20px] h-auto' />
            </button>
          </div>
        </div>

        <Table
          aria-label="Lista de Usuarios"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination>
                {renderPageNumbers()}
              </Pagination>
            </div>
          }
          className="mx-auto w-[90% ]"
        >
          <TableHeader>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="id_usuario">CÓDIGO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="nombre_usuario">NOMBRE</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="apellido_usuario">APELLIDO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="email_usuario">EMAIL</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="rol">ROL</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="numero">N_TELEFONO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="Id_ficha">FICHA</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="identificacion">IDENTIFICACIÓN</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="Estado">ESTADO</TableColumn>
            <TableColumn className='text-center font-bold bg-[#3D7948] text-white' key="acciones">ADMINISTRAR</TableColumn>
          </TableHeader>
          <TableBody>
            {activeUsers.map(user => (
              <TableRow className='text-center font-semibold' key={user.id_usuario}>
                <TableCell className='font-semibold'>{user.id_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.nombre_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.apellido_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.email_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.rol}</TableCell>
                <TableCell className='font-semibold'>{user.numero}</TableCell>
                <TableCell className='font-semibold'>{user.Id_ficha}</TableCell>
                <TableCell className='font-semibold'>{user.identificacion}</TableCell>
                <TableCell className='font-semibold'>{user.Estado}</TableCell>
                <TableCell className='flex gap-2 justify-center'>
                  <Button color='primary' className={`font-semibold ${userLogin.role === 'administrador' ? 'bg-[#1E6C9B] hover:bg-[#1E6C9B]' : 'bg-gray-500'} `} onClick={() => { handleUpdateClick(user) }} style={{ fontSize: '15px' }} isDisabled={userLogin.role === 'administrador' ? false : true}>Actualizar</Button>
                  <Button color="danger" className={`font-semibold ${userLogin.role === 'administrador' ? 'bg-[#BF2A50] hover:bg-[#BF2A50]' : 'bg-gray-500'} `} onClick={() => DesactivarUsuario(user.id_usuario)} isDisabled={userLogin.role === 'administrador' ? false : true}>Estado</Button>
                </TableCell>
              </TableRow>
            ))}
            {inactiveUsers.map(user => (
              <TableRow className='text-center font-semibold' key={user.id_usuario}>
                <TableCell className='font-semibold'>{user.id_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.nombre_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.apellido_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.email_usuario}</TableCell>
                <TableCell className='font-semibold'>{user.rol}</TableCell>
                <TableCell className='font-semibold'>{user.numero}</TableCell>
                <TableCell className='font-semibold'>{user.Id_ficha}</TableCell>
                <TableCell className='font-semibold'>{user.identificacion}</TableCell>
                <TableCell className='font-semibold'>{user.Estado}</TableCell>
                <TableCell className='flex gap-2 justify-center'>
                <Button color='primary' className={`font-semibold ${userLogin.role === 'administrador' ? 'bg-[#1E6C9B] hover:bg-[#1E6C9B]' : 'bg-gray-500'} `} onClick={() => { handleUpdateClick(user) }} style={{ fontSize: '15px' }} isDisabled={userLogin.role === 'administrador' ? false : true}>Actualizar</Button>
                  <Button color="danger" className={`font-semibold ${userLogin.role === 'administrador' ? 'bg-[#BF2A50] hover:bg-[#BF2A50]' : 'bg-gray-500'} `} onClick={() => DesactivarUsuario(user.id_usuario)} isDisabled={userLogin.role === 'administrador' ? false : true}>Estado</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="modal" tabIndex="-1" id="myModal">
        <div className="modal-dialog" style={{ maxWidth: '40rem' }}>
          <div className="modal-content rounded-3">
            <div className="modal-header bg-[#3D7948] text-white">
              <div className="d-flex justify-content-center align-items-center w-100">
                <h5 className="modal-title">INGRESE LOS DATOS:</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" onSubmit={selectedUser ? handleFormm : handleForm} className="col-6 mx-auto">
                <div className="mb-3" style={{ display: 'flex' }}>
                  <input type="text" id="nombre_usuario" name="nombre_usuario" className="form-control" placeholder="Nombre Usuario" style={{ width: '100%', marginRight: '10px', fontSize: '0.9rem' }} value={values.nombre_usuario} onChange={handleInputChange} />
                  <input type="text" id="apellido_usuario" name="apellido_usuario" className="form-control" placeholder="Apellido Usuario" style={{ width: '100%', fontSize: '0.9rem' }} value={values.apellido_usuario} onChange={handleInputChange} />
                </div>
                <div className="mb-3" style={{ display: 'flex' }}>
                  <input type="text" id="email_usuario" name="email_usuario" className="form-control" placeholder="Email Usuario *" style={{ width: '50%', marginRight: '10px', fontSize: '0.9rem' }} value={values.email_usuario} onChange={handleInputChange} />
                  <input
                    type="text"
                    id="identificacion"
                    name="identificacion"
                    className="form-control"
                    placeholder="ID Usuario"
                    maxLength={10}
                    style={{ width: '50%', fontSize: '0.9rem' }}
                    value={values.identificacion}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange({ target: { name: 'identificacion', value: onlyNumbers } });
                    }}
                  />
                </div>

                <div className="mb-3">
                  <select id="rol" name="rol" onChange={handleInputChange} className="form-select" style={{ width: '100%', fontSize: '0.9rem' }}>
                    <option value="">Seleccione un Rol</option>
                    <option value="administrador">Administrador</option>
                    <option value="Encargado">Encargado</option>
                    <option value="Usuario">Usuario</option>
                  </select>
                </div>

                <div className="mb-3" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    className="form-control"
                    placeholder="Número Telefónico"
                    maxLength={10}
                    style={{ width: '50%', marginRight: '10px', fontSize: '0.9rem' }}
                    value={values.numero}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange({ target: { name: 'numero', value: onlyNumbers } });
                    }}
                  />
                  <input
                    type="text"
                    id="Id_ficha"
                    name="Id_ficha"
                    className="form-control"
                    placeholder="ID Ficha"
                    maxLength={10}
                    style={{ width: '50%', fontSize: '0.9rem' }}
                    value={values.Id_ficha}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange({ target: { name: 'Id_ficha', value: onlyNumbers } });
                    }}
                  />
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn bg-[#3D7948] hover:bg-[#3D7948] text-white me-2">{selectedUser ? 'Actualizar' : 'Registrar'}</button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
