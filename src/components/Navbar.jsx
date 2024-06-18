import React, { useState, useEffect } from "react";
import logo from "../assets/in.png";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosClient from "../components/config/axiosClient";

export const Navbar = ({ setLogIn }) => {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [elementosConBajoStock, setElementosConBajoStock] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseStock = await axiosClient.get("/reporte/stockminmodal");
        setElementosConBajoStock(responseStock.data);

        const responsePrestamos = await axiosClient.get("/reporte/prestamosactivosmodal");
        setPrestamosActivos(responsePrestamos.data);
      } catch (error) {
        console.error(
          "Error al obtener la información de los elementos con bajo Stock o préstamos activos:",
          error
        );
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    setLogIn(false);
    navigate("/login");
  };

  const handleViewStockClick = () => {
    setShowModal(false);
    navigate("/reportes/stockmin");
  };

  const handleViewPrestamosClick = () => {
    setShowModal(false);
    navigate("/reportes/prestamosactivos");
  };

  const modalContent = (
    <div className="fixed top-9 right-11 z-50">
      <div
        className="fixed top-9 right-11 bottom-0 bg-gray-500 bg-opacity-50 cursor-pointer"
        onClick={() => setShowModal(false)}
      />
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="flex text-xl text-black font-bold mb-4 justify-center">Notificaciones</h2>
        <div
          className="flex items-center mb-2 hover:bg-gray-200 p-2 rounded cursor-pointer"
          onClick={handleViewStockClick}
        >
          <p className="flex-1 text-black pr-5">
            {elementosConBajoStock} Elementos con bajo Stock
          </p>
          <FaSearch className="text-blue-900"/>
        </div>
        <div
          className="flex items-center hover:bg-gray-200 p-2 rounded cursor-pointer"
          onClick={handleViewPrestamosClick}
        >
          <p className="flex-1 text-black">
            {prestamosActivos} Préstamos activos
          </p>
          <FaSearch className="text-blue-900"/>
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
  );

  return (
    <div className="w-full flex items-center justify-between h-[100px] bg-[#D9DADF] text-white">
      <div className="flex items-center gap-4">
        <img src={logo} className="w-[80px] h-auto ml-10" alt="logo" />
        <h1 className="text-black font-bold text-lg">Inventario de bodegas</h1>
      </div>
      <div className="flex items-center gap-4 mr-10">
        <div className="text-black flex items-center gap-2">
          <FaUserCircle className="text-[38px] cursor-pointer" />
          <div className="flex flex-col gap-1 mt-3">
            <h1 className="cursor-pointer font-bold text-[16px]">{userName}</h1>
            <p className="flex text-xs">{role}</p>
          </div>
        </div>
        <FaBell
          className="cursor-pointer text-black text-[25px]"
          onClick={() => setShowModal(true)}
        />
        <IoMdLogOut
          className="cursor-pointer text-black text-[30px] font-bold"
          onClick={handleLogout}
        />
      </div>
      {showModal && modalContent}
    </div>
  );
};
