import React, { useState, useEffect } from "react";
import logo from "../assets/LogoIO.png";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axiosClient from "../components/config/axiosClient";
import NotificacionesModal from "./modals/Notificaciones";
import { FormUpdatePerfil } from "../functions/Update/UpdatePerfil/FormUpdatePerfil";
import Modal1 from "../components/Modal1";
import { useAuth } from "../context/AuthProvider";

export const Navbar = ({ setLogIn }) => {

  //#region constantes
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [elementosConBajoStock, setElementosConBajoStock] = useState([]);
  const [prestamosVencidos, setPrestamosVencidos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [elementosExpirados, setElementosExpirados] = useState([]);
  const [contadorPrestamosActivos, setContadorPrestamosActivos] = useState(0);
  const [contadorStockMin, setContadorStockMin] = useState(0);
  const [contadorPrestamosVencidos, setContadorPrestamosVencidos] = useState(0);
  const [contadorSolicitudes, setContadorSolicitudes] = useState(0);
  const [contadorElementosExpirados, setContadorElementosExpirados] = useState(0);
  const [showSubMenu, setShowSubMenu] = useState(false); // Estado para controlar la visibilidad del submenú

  //#endregion constantes

  const { logout, user } = useAuth();


  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    swal({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que deseas cerrar la sesión?",
      icon: "warning",
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        logout();
        navigate("/login");
      }
    });
  };

  const toggleSubMenu = () => {

    setShowSubMenu(!showSubMenu); // Alternar la visibilidad del submenú
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseStock = await axiosClient.get("/reporte/stockminmodal");
        const stockMinimo = responseStock.data;
        setElementosConBajoStock(stockMinimo);
        setContadorStockMin(stockMinimo > 0 ? 1 : 0);

        const responsePrestamos = await axiosClient.get("/reporte/prestamosactivosmodal");
        const prestamosActivos = responsePrestamos.data;
        setPrestamosActivos(prestamosActivos);
        setContadorPrestamosActivos(prestamosActivos > 0 ? 1 : 0);

        const responseLoansDue = await axiosClient.get("/reporte/prestamosvencidosmodal");
        const loansDue = responseLoansDue.data;
        setPrestamosVencidos(loansDue);
        setContadorPrestamosVencidos(loansDue > 0 ? 1 : 0);

        const responseApplications = await axiosClient.get("/reporte/solicitudesmodal");
        const applications = responseApplications.data;
        setSolicitudes(applications);
        setContadorSolicitudes(applications > 0 ? 1 : 0);

        const responseExpired = await axiosClient.get("/reporte/elementosexpiradosmodal");
        const expired = responseExpired.data;
        setElementosExpirados(expired);
        setContadorElementosExpirados(expired > 0 ? 1 : 0);

      } catch (error) {
        console.error(
          "Error al obtener información de los contadores para el modal:",
          error
        );
      }

      const storedUserName = localStorage.getItem("userName");
      const storedRole = localStorage.getItem("role");

      if (storedUserName) {
        setUserName(storedUserName);
      }

      if (storedRole) {
        setRole(storedRole);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [setLogIn]);

  return (
    <div className="w-full flex items-center justify-between h-[80px] bg-[#fff] text-white">
      <div className="flex items-center gap-4">
        <img src={logo} className="w-[60px] h-auto ml-10" alt="logo" />
        <h1 className="hidden sm:block text-black font-bold text-lg">Inventario de bodegas</h1>
      </div>
      <div className="flex items-center gap-4 mr-10">
        <div className="text-black flex items-center gap-2 relative">
          <FaUserCircle
            className="text-[38px] cursor-pointer"
            onClick={() => (
              setIsOpen(true)
            )} // Alternar la visibilidad del submenú al hacer clic en el icono de usuario
          />
          <Modal1
            isOpen={isOpen}
            size={"4xl"}
            onClose={() => setIsOpen(false)}
            form={<FormUpdatePerfil onClose={() => setIsOpen(false)} />}
            title={"Administrar perfil"}
          />
          <div className="flex flex-col gap-1 mt-3">
            <h1 className="cursor-pointer font-bold text-[16px]">{userName}</h1>
            <p className="flex text-xs">
              {role && role === "1" && "administrador"}
              {role && role === "2" && "encargado"}
              {role && role === "3" && "usuario"}
            </p>
          </div>

        </div>
        {user.role_id != 3 && <div
          className="relative cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {contadorStockMin + contadorPrestamosActivos + contadorPrestamosVencidos + contadorSolicitudes + contadorElementosExpirados > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 rounded-full text-white font-bold px-2 py-1 text-xs">
              {contadorStockMin + contadorPrestamosActivos + contadorPrestamosVencidos + contadorSolicitudes + contadorElementosExpirados}
            </span>
          )}
          <FaFileAlt className="flex text-black text-[25px] top-1 right-[28px] bottom-[28px]" />
        </div>}

        <div>

          <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout} />
        </div>
      </div>

      <NotificacionesModal
        showModal={showModal && (contadorStockMin > 0 || contadorPrestamosActivos > 0 || contadorPrestamosVencidos > 0 || contadorSolicitudes > 0 || contadorElementosExpirados > 0)}
        setShowModal={setShowModal}
        elementosConBajoStock={elementosConBajoStock}
        prestamosActivos={prestamosActivos}
        prestamosVencidos={prestamosVencidos}
        solicitudes={solicitudes}
        elementosExpirados={elementosExpirados}
      />
    </div>
  );
};
