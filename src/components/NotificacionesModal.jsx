import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationsModal = ({
  showModal,
  setShowModal,
  elementosConBajoStock,
  prestamosActivos,
}) => {
  const navigate = useNavigate();

  const handleViewStockClick = () => {
    setShowModal(false);
    navigate("/reportes/stockmin");
  };

  const handleViewPrestamosClick = () => {
    setShowModal(false);
    navigate("/reportes/prestamosactivos");
  };

  return (
    showModal && (
      <div className="absolute top-7 right-8 z-50">
        <div
          className="fixed top-9 right-11 bottom-0 bg-gray-500 bg-opacity-50 cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="flex text-xl text-black font-bold mb-4 justify-center">
            Notificaciones
            <span
              className="ml-2 cursor-pointer"
              onClick={() => setShowModal(false)}
            ></span>{" "}
          </h2>
          <div
            className="flex items-center mb-2 hover:bg-gray-200 p-2 rounded cursor-pointer"
            onClick={handleViewStockClick}
          >
            <p className="flex-1 text-black pr-5">
              <span className="text-blue-700 font-bold">
                {elementosConBajoStock}
              </span>{" "}
              Elementos con bajo Stock
            </p>
            <FaSearch className="text-blue-900" />
          </div>
          <div
            className="flex items-center hover:bg-gray-200 p-2 rounded cursor-pointer"
            onClick={handleViewPrestamosClick}
          >
            <p className="flex-1 text-black">
              <span className="text-blue-700 font-bold">
                {prestamosActivos}
              </span>{" "}
              Préstamos activos
            </p>
            <FaSearch className="text-blue-900" />
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-4"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationsModal;
