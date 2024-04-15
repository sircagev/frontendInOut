import React, { useState } from 'react';
import Bodegas from './ReporteBodega';
import Elemento from './ReporteElemento';
import Movimientos from './ReporteMovimiento';
import Usuario from './ReporteUsuario';
import { ImUsers } from "react-icons/im";
import { FaTools, FaPencilRuler } from "react-icons/fa";
import { FaBoxesPacking, FaArrowRightArrowLeft } from "react-icons/fa6";

const Reportes = () => {
  const [currentComponent, setCurrentComponent] = useState('Bodegas');

  // Función que devuelve los estilos de los botones
  const buttonStyles = () => ({
    className: "d-flex align-items-center bg-blue-500 w-[140px] text-[10] bg-blue-600 h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-400 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold mr-5 flex",
  });

  const renderComponent = () => {
    switch (currentComponent) {
      case 'Movimientos':
        return <Movimientos />;
      case 'Elemento':
        return <Elemento />;
      case 'Usuario':
        return <Usuario />;
      case 'Bodegas':
        return <Bodegas />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="mb-4 mt-4 d-flex ml-3">
        <button {...buttonStyles()} onClick={() => setCurrentComponent('Elemento')}>
          <FaPencilRuler className='mr-2 flex mt-1 text-lg ml-2'/> Elementos
        </button>
        <button {...buttonStyles()} onClick={() => setCurrentComponent('Usuario')}>
          <ImUsers className='mr-2 flex mt-1 text-lg ml-2'/> Usuarios
        </button>
        <button {...buttonStyles()} onClick={() => setCurrentComponent('Bodegas')}>
          <FaBoxesPacking className='mr-2 flex mt-1 text-lg ml-2'/> Bodegas
        </button>
        <button {...buttonStyles()} onClick={() => setCurrentComponent('Movimientos')}>
          <FaArrowRightArrowLeft className='mr-2 flex mt-1 text-lg ml-2'/> Movimientos
        </button>
      </div>
      {renderComponent()}
    </div>
  );
};

export default Reportes;
