import { useState, useEffect } from 'react';
import axiosClient from '../components/config/axiosClient';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input, Button } from "@nextui-org/react";
import Swal from 'sweetalert2';
import imgLogin from '../assets/imgLogin.png';
import logo from '../assets/logoInout.png';

function Login({ setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(!!token);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    // Si hay un token en la URL, mostramos automáticamente el formulario de reset
    if (token) {
      setShowResetPassword(true);
    }
  }, [token]);

  // Función para manejar el inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('validate/validar', {
        email_usuario: email,
        contraseña_usuario: password,
      });
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('codigo', response.data.codigo);
        setLoggedIn(true);
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario inactivo. Por favor, contacta al administrador.',
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario no autenticado. Por favor, verifica tus credenciales.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error. Por favor, inténtalo nuevamente.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar al servidor. Por favor, inténtalo nuevamente.',
        });
      }
    }
  };
  
  // Función para manejar el envío del formulario de olvido de contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/contrasena/recuperar', {
        email_usuario: email,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Por favor, revisa tu correo electrónico para restablecer tu contraseña.',
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo de recuperación.',
      });
    }
  };

  // Función para manejar el envío del formulario de reset de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Expresiones regulares para verificar la complejidad de la contraseña
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    const lengthRegex = /^.{8,}$/;
    
    // Verificar que la contraseña cumpla con todos los criterios
    if (!uppercaseRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos una letra mayúscula.',
      });
      return;
    }
    
    if (!numberRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un número.',
      });
      return;
    }
    
    if (!specialCharRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un carácter especial.',
      });
      return;
    }
    
    if (!lengthRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }

    // Si las contraseñas no coinciden, mostrar mensaje de error
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const response = await axiosClient.put('/contrasena/cambiar', {
        token,
        contraseña_usuario: newPassword,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido actualizada exitosamente.',
        });
    
        setShowResetPassword(false); 
        setEmail(''); 
        setPassword(''); 
        navigate('/login'); // Redirige al usuario al login
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña.',
      });
    }
  };

  // Función para manejar el envío del formulario de olvido de contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/contrasena/recuperar', {
        email_usuario: email,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Por favor, revisa tu correo electrónico para restablecer tu contraseña.',
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo de recuperación.',
      });
    }
  };

  // Función para manejar el envío del formulario de reset de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Expresiones regulares para verificar la complejidad de la contraseña
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    const lengthRegex = /^.{8,}$/;
    
    // Verificar que la contraseña cumpla con todos los criterios
    if (!uppercaseRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos una letra mayúscula.',
      });
      return;
    }
    
    if (!numberRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un número.',
      });
      return;
    }
    
    if (!specialCharRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un carácter especial.',
      });
      return;
    }
    
    if (!lengthRegex.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }

    // Si las contraseñas no coinciden, mostrar mensaje de error
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const response = await axiosClient.put('/contrasena/cambiar', {
        token,
        contraseña_usuario: newPassword,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido actualizada exitosamente.',
        });
    
        setShowResetPassword(false); 
        setEmail(''); 
        setPassword(''); 
        navigate('/login'); // Redirige al usuario al login
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña.',
      });
    }
  };

  return (
    <div className='w-full h-screen relative'>
      <div className='w-full h-[50%] bg-[#39A900] flex' style={{ paddingTop: '1.5rem' }}>
        <div>
          <h1 className='text-white text-2xl font-bold ml-9'><img src={logo} alt="Logo InOut" className='h-[50px] w-[auto]' /></h1>
          <div className='ml-[60px] mt-[60px] h-[200px] w-[300px]'>
            <h1 className='text-3xl font-bold text-white'>Ingrese a In-Out</h1>
            <h2 className='mt-2 text-xl text-white font-semibold'>Gestión de inventarios</h2>
            <p className='text-sm mt-2 text-white font-light text-justify'>
              InOut es un software que aumenta la eficiencia en la gestión de préstamos, y esto se logra a través de múltiples funciones.
              Al gestionar préstamos, se pueden automatizar procesos, optimizar recursos, y mejorar la experiencia del cliente.
            </p>
          </div>
        </div>
        <div className='ml-[60px] mt-5'>
          <img src={imgLogin} alt="Imagen de Login" className='w-[300px] h-[250px]' /> 
        </div>
      </div>
      <div
        className='w-[500px] h-auto bg-[#fff] rounded-[25px] absolute shadow-xl'
        style={{
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          marginRight: '120px'
        }}
      >
        <div className='w-[80%] mt-7 ml-[10%] mr-[10%]'>
          <h3 className='text-lg font-bold'>Bienvenido a <span className='text-[#00AC4F]'>IN-OUT</span></h3>
          <h2 className='mt-1 mb-[60px] text-4xl font-semibold text-black'>Sign In</h2>
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3' htmlFor="">Ingrese su Email:</label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  variant="bordered"
                  className="w-full mb-[45px]"
                />
                <Button color="primary" type='submit' className='bg-[#39A900] mb-7 h-[50px] text-base font-medium'>
                  Enviar
                </Button>
                <Button onClick={() => setShowForgotPassword(false)} className='bg-[#f1f1f1] mb-7 h-[50px] text-base font-medium'>
                  Volver al Inicio de Sesión
                </Button>
              </div>
            </form>
          ) : showResetPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3'>Ingrese su nueva contraseña:</label>
                <Input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  label="Nueva Contraseña"
                  variant="bordered"
                  className="w-full mb-4"
                />
                <label className='text-[15px] font-semibold mb-3'>Confirme su nueva contraseña:</label>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirmar Nueva Contraseña"
                  variant="bordered"
                  className="w-full mb-4"
                />
                <Button color="primary" type='submit' className='bg-[#39A900] mb-7 h-[50px] text-base font-medium'>
                  Restablecer Contraseña
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3' htmlFor="">Ingrese su Email:</label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  variant="bordered"
                  className="w-full mb-[45px]"
                />
                <label className='text-[15px] font-semibold mb-3'>Ingrese su contraseña:</label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  variant="bordered"
                  className="w-full mb-2"
                />

                <div className='flex justify-end items-center mb-[20px] mr-[10px]'>
                  <Link to="#" onClick={() => setShowForgotPassword(true)} className='text-[14px] text-[#39A900] cursor-pointer'>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button color="primary" type='submit' className='bg-[#39A900] mb-7 h-[50px] text-base font-medium'>
                  Ingresar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className='w-full h-[50%] bg-[#fff]'>
      </div>
    </div>
  );
}

export default Login;
