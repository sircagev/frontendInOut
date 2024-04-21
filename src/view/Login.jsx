import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from "@nextui-org/react";

function Login({ setLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/validate/validar', {
        email_usuario: email,
        contraseña_usuario: password
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setLoggedIn(true);
        navigate('/elementos');
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className='w-full h-screen relative'> {/* Contenedor padre con posición relativa */}
      <div className='w-full h-[50%] bg-[#39A900]'> 
        <h1 className='text-white text-xl font-bold'>Your Logo</h1>
      </div>
      <div
        className='w-[500px] h-auto bg-[#fff] rounded-[25px] absolute shadow-xl'
        style={{
          top: '50%', /* Posiciona el div a mitad de la pantalla */
          right: '10px', /* Mueve el div hacia la derecha con margen */
          transform: 'translateY(-50%)', /* Centra el div verticalmente */
          marginRight: '120px' /* Margen adicional a la derecha */
        }}
      >
        <div className='w-[80%] mt-7 ml-[10%] mr-[10%]'>
          <h3 className='text-lg font-bold'>Bienvenido a <span className='text-[#00AC4F]'>IN-OUT</span></h3>
          <h2 className='mt-1 mb-[80px] text-4xl font-semibold text-black'>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
              <label className='text-[15px] font-semibold mb-3' htmlFor="">Ingresa tu usuario o número de identificación.</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="bordered" // Mantiene el borde
                className="w-full mb-[45px]" // Limita el ancho máximo
              />
              <label className='text-[15px] font-semibold mb-3'>Ingrese su contraseña</label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                variant="bordered" // Mantiene el borde
                className="w-full mb-2" // Limita el ancho máximo
              />
              <div className=''>
                <a className='w-full text-[14px] text-[#39A900] flex justify-end mb-[45px]' href="">¿Olvidaste tu contraeña?</a>
              </div>
              <Button color="primary" className='bg-[#39A900] mb-7 h-[50px] text-base font-medium'>
                Ingresar
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className='w-full h-[50%] bg-[#fff]'>
      </div>
    </div>
  );
}

export default Login;

