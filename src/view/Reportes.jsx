import React from 'react';
import { useNavigate } from 'react-router-dom';

import elementosImg from "../assets/elementos.jpg";
import usuariosImg from "../assets/usuarios.jpg";
import bodegasImg from "../assets/bodegas.jpg";
import movimientosImg from "../assets/movimientos.jpg";

const Reportes = () => {
  const navigate = useNavigate();

  const buttonStyles = {
    className: "flex flex-col m-2 items-center justify-center w-full h-full text-lg rounded font-sans text-sm uppercase text-green-800 shadow-md transition-all hover:shadow-lg hover:shadow-blue-400 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold",
  };

  const buttonImages = {
    Elementos: { img: elementosImg, path: '/reportes/elementos' },
    Usuarios: { img: usuariosImg, path: '/reportes/usuarios' },
    Bodegas: { img: bodegasImg, path: '/reportes/bodegas' },
    Movimientos: { img: movimientosImg, path: '/reportes/movimientos' },
  };

  return (
    <div className="container p-5 h-screen flex flex-wrap">
      {Object.keys(buttonImages).map((key) => (
        <button 
          {...buttonStyles} 
          key={key} 
          onClick={() => navigate(buttonImages[key].path)} 
          style={{ width: '48%', height: '48%' }}
        >
          <img 
            src={buttonImages[key].img} 
            alt={key} 
            className="mb-2" 
            style={{ width: '70%', height: '70%' }} 
          />
          {key}
        </button>
      ))}
    </div>
  );
};

export default Reportes;
