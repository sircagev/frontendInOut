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
    <div className='w-full flex justify-center items-center flex-col h-screen'>
      <div className='w-[500px] h-auto bg-[#3d7948] rounded-lg'>
        <h2 className='text-center mt-3 mb-4 text-3xl font-semibold text-white'>In-Out</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center w-full flex-wrap md:flex-nowrap gap-4">
            <Input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required label="Email"
              className='w-[70%]'
            />
            <Input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} required label="Password"
              className='w-[70%]'
            />
            <Button color="primary" type='submit' className='mb-4 font-semibold text-sm'>
              Iniciar Sesión
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
