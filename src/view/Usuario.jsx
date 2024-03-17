import React, { useEffect, useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';


let myModal;

const Usuario = () => {

  const [useUsuarios, setUsuarios] = useState([]);

  const [values, setValues] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    email_usuario: "",
    rol: "",
    numero: "",
    contraseña_usuario: "",
    Id_ficha: "",
    Estado: ""
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
      console.error("Error al obtener la lista de usuarios:", error);
      alert("Error al obtener la lista de usuarios");
    }
  };
  

  useEffect(() => {
    myModal = new bootstrap.Modal('#myModal', {
      keyboard: false
    });
    ListarUsuarios();
  }, []);

  return (

    <div className="container">

      <button type="button" className="ml-6 mt-[10px] gap-3 w-[20%] h-[44px] bg-[#9be874] hover:bg-[#39A900] rounded-[8px] cursor-pointer text-black hover:text-white" onClick={() => {
        myModal.show();
      }}>Añadir Nuevo Usuario</button>

      <br />
      <br />
      <h3 className=' text-black'>Registro Usuarios</h3>

      <br />



      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Numero</th>
            <th>Id Ficha</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            useUsuarios.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.id_usuario}</td>
                <td>{user.nombre_usuario}</td>
                <td>{user.apellido_usuario}</td>
                <td>{user.email_usuario}</td>
                <td>{user.rol}</td>
                <td>{user.numero}</td>
                <td>{user.Id_ficha}</td>
                <td>{user.Estado}</td>
                <td><button className="btn btn-danger" onClick={() => {
                  EliminarUsuario(user.id_usuario);
                }}>Eliminar</button>

                  <button className="btn btn-primary" onClick={() => {
                    alert(user.nombre_usuario)
                  }}>Actualizar</button></td>

              </tr>
            ))}
        </tbody>
      </table>

      <div className="modal" tabindex="-1" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registro de Usuarios</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">

              <form action="" onSubmit={handleForm} className="col-6">

                <label>Id Usuario</label>
                <input type="int" name="id_usuario" className="form-control"
                  value={values.id_usuario}
                  onChange={handleInputChange}
                />

                <label>Nombre</label>
                <input type="text" name="nombre_usuario" className="form-control"
                  value={values.nombre_usuario}
                  onChange={handleInputChange}
                />

                <label>Apellido</label>
                <input type="text" name="apellido_usuario" className="form-control"
                  value={values.apellido_usuario}
                  onChange={handleInputChange}
                />

                <label>Email</label>
                <input type="text" name="email_usuario" className="form-control"
                  value={values.email_usuario}
                  onChange={handleInputChange}
                />

                <label>Rol</label>
                <select name="rol" onChange={handleInputChange} className="form-control">
                  <option value="0" disabled="true" selected="true">Seleccione un Rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="Encargado">Encargado</option>
                  <option value="Usuario">Usuario</option>
                </select>


                <label>Numero</label>
                <input type="text" name="numero" className="form-control"
                  value={values.numero}
                  onChange={handleInputChange}
                />

                <label>Contraseña</label>
                <input type="text" name="contraseña_usuario" className="form-control"
                  value={values.contraseña_usuario}
                  onChange={handleInputChange}

                />

                <label>ID Ficha</label>
                <input type="int" name="ID_ficha" className="form-control"
                  value={values.Id_ficha}
                  onChange={handleInputChange}

                />
    
                <br />



                <div className="modal-footer">
                  <button type="submit" className=" ml-6 mt-[10px] gap-3 w-[20%] h-[44px] bg-[#9be874] hover:bg-[#39A900] rounded-[8px] cursor-pointer text-black hover:text-white">Registrar</button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>

    </div>


  )
}

export default Usuario;