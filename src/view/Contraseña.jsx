import styled from "styled-components"
import Modal from "../components/modals/Modal"
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

function ResetPassword() {

  const [modal, setModal] = useState(true)
  const location = useLocation();
  const navigate = useNavigate();

  //buscar el token de la url
  const token = new URLSearchParams(location.search).get('token');

  const [contraseña_usuario, setPassword] = useState({
    contraseña_usuario: ""
  });
  const [confirm, setConfirm] = useState({
    confirm: ""
  });

  const inputPassword = (event) => {
    setPassword({
      ...contraseña_usuario,
       [event.target.name]: event.target.value
    })
  }
  const inputConfirm = (event) => {
    setConfirm({
      ...confirm,
       [event.target.name]: event.target.value
    })
  }

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      if (contraseña_usuario.contraseña_usuario === confirm.confirm ) {
        await axios.put('http://localhost:3000/contraseña_usuario/reset', { token, contraseña_usuario: contraseña_usuario.contraseña_usuario});
        alert('Contraseña restablecida con éxito');
        navigate('/');
      } else {
        
        alert("Las contraseñas no coinciden") 
      }
    } catch (error) {
        alert('Hubo un error al restablecer la contraseña');
        console.log(error);
    }
};
  return (
    <Container>
       <Modal 
       estado={modal}
       cambiarEstado={()=> setModal(false)}
    titulo="INGRESA TU NUEVA CONTRASEÑA"
    >
      <Formulario onSubmit={changePassword} >
        <input name="contraseña_usuario" value={contraseña_usuario.contraseña_usuario}  onChange={inputPassword} type="text" placeholder="New Password"/>
        <input name="confirm" value={confirm.confirm}  onChange={inputConfirm} type="text" placeholder="Confirm New Password"/>
        <button>CAMBIAR CONTRASEÑA</button>
      </Formulario>
    </Modal>
    </Container>
  )
}

const Container = styled.div`
width: 100%;
height: 100vh;
`;

const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #38a80060;
  padding: 15px;
  border-radius: 10px;

  input{
    padding: 10px;
    border: none;
    outline: none;
  }

  button{
    padding: 10px;
    border-radius: 10px;
    border: none;
    color: white;
    background: #38a800;
    font-weight: bold;
  }

`;

export default ResetPassword