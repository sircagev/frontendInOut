import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import Pagination from 'react-bootstrap/Pagination';

let myModal;
let myModalEstado;

const Usuario = () => {
  const [useUsuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRol, setSelectedRol] = useState("");
  const [Estado, setEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState({});
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
    Id_ficha: ""
  });

  const handleRolChange = (event) => {
    setSelectedRol(event.target.value);
  };

  const handleInputChangee = (event) => {
    const { name, value } = event.target;
    if (name === 'rol') {
      setSelectedRol(value);
    } else if (name === 'Estado') { 
      setEstado(value);
    } 
  };

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleForm = async (event) => {
    try {
      event.preventDefault();
      console.log("Valores enviados en la solicitud:", values);
      const response = await axios.post(`http://localhost:3000/usuario/registrar`, values);
      if (response.status === 200)
        alert(response.data.message);
      myModal.hide();
      ListarUsuarios();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };

  const handleFormm = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.put(`http://localhost:3000/usuario/actualizar/${selectedUser.id_usuario}`, values);
      if (response.status === 200)
        alert(response.data.message);
      myModal.hide();
      ListarUsuarios();
    } catch (error) {
      console.error("Error al Actualizar el usuario:", error);
      console.error("Detalles del error:", error.response.data);
    }
  };

  const handleForma = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.put(`http://localhost:3000/usuario/estado/${selectedUser.id_usuario}`, { Estado: Estado });
      if (response.status === 200)
        alert(response.data.message);
      myModalEstado.hide();
      ListarUsuarios();
    } catch (error) {
      console.error("Error al actualizar Estado:", error);
      alert("Error al actualizar Estado");
    }
  };

  const buscarUsuario = async (id_usuario) => {
    try {
      if (id_usuario.trim() !== '') {
        const response = await axios.get(`http://localhost:3000/usuario/buscar/${id_usuario}`);
        console.log(response.data.Datos);
        setUsuarios(response.data.Datos);
      } else {
        ListarUsuarios();
      }
    } catch (error) {
      console.log("Error al obtener Usuario:", error);
      setError("Error al obtener Usuario: " + error.message);
      alert("No existe Usuario con el ID Ingresado");
    }

  };
  const handleClose = () => {
    myModal.hide();  
    ListarUsuarios();
    setUsuarioEncontrado({});
  };

  const handleSearch = async () => {
    setError(null);
    buscarUsuario(searchTerm);
  };

  const ListarUsuarios = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/usuario/listar`);
      if (response.data && Array.isArray(response.data.result)) {
        setUsuarios(response.data.result);
      } else {
        console.error("La respuesta de la solicitud GET no contiene un array en la propiedad 'result':", response.data);
        alert("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      console.log( error);
      alert("Error al obtener la lista de usuarios");
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setSelectedRol(user.rol);
    setValues({
      ...values,
      nombre_usuario: user.nombre_usuario,
      apellido_usuario: user.apellido_usuario,
      email_usuario: user.email_usuario,
      rol: user.rol,
      numero: user.numero,
      contraseña_usuario: user.contraseña_usuario,
      Id_ficha: user.Id_ficha
    });

    myModal.show();
  };


  useEffect(() => {
    myModal = new bootstrap.Modal('#myModal', {
      keyboard: false
    });
    myModalEstado = new bootstrap.Modal('#myModalEstado', {
      keyboard: false
    });
    ListarUsuarios();
  }, []);


  // Lógica para mostrar la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = useUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  // Lógica para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="row ">
        <div className="col ">
          <button 
            type="button" 
            className="bg-[#39A900] w-[210px] text-[12] bg-gree h-[40px] rounded-tr-md rounded-br-md font-sans 
            text-xs uppercase text-white shadow-md  transition-all hover:shadow-lg hover:shadow-green-500/40 
            focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none
            disabled:opacity-50 disabled:shadow-nonepx] font-semibold ml-[30px] " 
            style={{ marginTop: '20px', borderRadius: '10px'  }}
            onClick={() => {
              setSelectedUser(null);
              setValues({
                nombre_usuario: "",
                apellido_usuario: "",
                email_usuario: "",
                rol: "",
                numero: "",
                contraseña_usuario: "",
                Id_ficha: ""
              });
              myModal.show();
            }}
          >
            Registrar Usuario
          </button>
        </div>
        <div className="col align-self-end">
          <div className="input-group flex-grow-1 w-[250px]">
            <input
              type="text"
              className="form-control "
              placeholder="Buscar Usuario por ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn bg-gray-500 hover:bg-gray-600 text-white font-bold w-[40px] " type="button" onClick={handleSearch}>
              <BiSearch />
            </button>
          </div>
        </div>
      </div>

      <br />
  
      <br />

      <div className="mx-auto w-[95%] ">
        <table className="divide-y divide-gray-200">
          <thead className="bg-[#39A900] ">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider  rounded-tl">Id</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Apellido</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rol</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Numero tel</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Id Ficha</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider  rounded-tr">Administrar</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {Object.keys(usuarioEncontrado).length > 0 ? (
              <tr key={usuarioEncontrado.id_usuario} className="hover:bg-gray-100">
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.id_usuario}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.nombre_usuario}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.apellido_usuario}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.email_usuario}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.rol}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.numero}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.Id_ficha}</td>
                <td className="px-3 whitespace-nowrap">{usuarioEncontrado.Estado}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-1 block"
                    onClick={() => handleUpdateClick(usuarioEncontrado)}
                  >
                    Actualizar
                  </button>
                  <button 
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedUser(usuarioEncontrado);
                      setEstado(usuarioEncontrado.Estado); 
                      myModalEstado.show();
                    }}
                  >
                    Estado
                  </button>
                </td>
              </tr>
            ) : (
              currentUsers.map(user => (
                <tr key={user.id_usuario} className="hover:bg-gray-100">
                  <td className="px-3 whitespace-nowrap">{user.id_usuario}</td>
                  <td className="px-3 whitespace-nowrap">{user.nombre_usuario}</td>
                  <td className="px-3 whitespace-nowrap">{user.apellido_usuario}</td>
                  <td className="px-3 whitespace-nowrap">{user.email_usuario}</td>
                  <td className="px-3 whitespace-nowrap">{user.rol}</td>
                  <td className="px-3 whitespace-nowrap">{user.numero}</td>
                  <td className="px-3 whitespace-nowrap">{user.Id_ficha}</td>
                  <td className="px-3 whitespace-nowrap">{user.Estado}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-1 block"
                      onClick={() => handleUpdateClick(user)}
                    >
                      Actualizar
                    </button>
                    <button 
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        setSelectedUser(user);
                        setEstado(user.Estado); 
                        myModalEstado.show();
                      }}
                    >
                      Estado
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {Array.from({ length: Math.ceil(useUsuarios.length / usersPerPage) }).map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
      <div className="modal" tabindex="-1" id="myModal">
        <div className="modal-dialog style={{ maxWidth: '20rem' }}">
          <div className="modal-content" style={{ borderRadius: '10px' }}>
            <div className="modal-header" style={{ backgroundColor: '#39A900', color: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
              <h5 className="modal-title flex items-center justify-center">Ingresar Datos del Usuario</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <form action="" onSubmit={selectedUser ? handleFormm : handleForm} className="col-6">
                <div className="form-group" style={{ marginBottom: '20px' }} />
                <label>Nombre</label>
                <input 
                  type="text" 
                  name="nombre_usuario" 
                  className="form-control" 
                  value={values.nombre_usuario} 
                  onChange={handleInputChange} 
                />
                
                <label>Apellido</label>
                <input 
                  type="text" 
                  name="apellido_usuario" 
                  className="form-control" 
                  value={values.apellido_usuario} 
                  onChange={handleInputChange} 
                />
                
                <label>Email</label>
                <input 
                  type="text" 
                  name="email_usuario" 
                  className="form-control" 
                  value={values.email_usuario} 
                  onChange={handleInputChange} 
                />
                
                <label>Rol</label>
                <select name="rol" onChange={handleInputChange} className="form-control">
                  <option selected>Seleccione un Rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="Encargado">Encargado</option>
                  <option value="Usuario">Usuario</option>
                </select>
                
                <label>Numero</label>
                <input 
                  type="text" 
                  name="numero" 
                  className="form-control" 
                  value={values.numero} 
                  onChange={handleInputChange} 
                />
                
                <label>Contraseña</label>
                <input 
                  type="text" 
                  name="contraseña_usuario" 
                  className="form-control" 
                  value={values.contraseña_usuario} 
                  onChange={handleInputChange} 
                />
                
                <label>ID Ficha</label>
                <input 
                  type="int" 
                  name="Id_ficha" 
                  className="form-control" 
                  value={values.Id_ficha} 
                  onChange={handleInputChange} 
                />

                <br />

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    type="submit" 
                    className="mt-[11px] w-[40%] h-[40px] bg-[#10A900] hover:bg-[#39A900] rounded-[8px] cursor-pointer text-white hover:text-white"
                  >
                    {selectedUser ? 'Actualizar' : 'Registrar'}
                  </button>
                  <button 
                    type="button" 
                    className="bg-gray-500 hover:bg-gray-700 text-white mt-[11px] w-[40%] h-[40px] rounded-[8px]"  
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabindex="-1" id="myModalEstado">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Actualizar Estado</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleForma}>
                <label>Estado</label>
                <select 
                  name="Estado" 
                  onChange={handleInputChangee} 
                  className="form-control" 
                  value={Estado}
                >
                  <option selected>Selecciona un Estado</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>

                <br />
                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ 
                      backgroundColor: '#00008B',
                      color: '#fff', 
                    }}
                  >
                    Actualizar Estado
                  </button>
                  <button 
                    type="button" 
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"  
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
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
