import React, { useState, useEffect } from "react";
import logo from "../assets/LogoIO.png";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axiosClient from "../components/config/axiosClient";
import NotificacionesModal from "./modals/Notificaciones";
import { FormUpdatePerfil } from "../functions/Update/UpdatePerfil/FormUpdatePerfil";
import { useAuth } from "../context/AuthProvider";
import { CiEdit, CiUnlock } from "react-icons/ci";
import Modal1 from "./Modal1";
import { FormUpdateContraseña } from "../functions/Update/UpdateContraseña/FormUpdateContraseña"

export const Navbar = ({ setLogIn }) => {

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
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
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([])

  const [activeForm, setActiveForm] = useState('');

  const openModal = (formType) => {
    setActiveForm(formType);
    setIsOpen(true);
  };

  const { logout, user } = useAuth();

  const navigate = useNavigate();

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

  const ListarUsuario = async () => {
    try {
      const response = await axiosClient.get('usuario/listar');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ListarUsuario();
  }, []);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu); // Alternar la visibilidad del submenúf04122badf8cae22b1fdea26cce71c80204cc399
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
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowChangePassword(false);
            }}
          />
          {showEditProfile && (
            <div className="absolute w-[250px] top-[60px] right-0 z-20 bg-white border border-gray-200 rounded-md shadow-lg p-4">
              <div className="flex items-center gap-2 cursor-pointer w-full mb-2 hover:bg-slate-300 px-2 py-[3px] rounded-xl transition-all" onClick={() => openModal('editProfile')}>
                <CiEdit className="text-gray-500 text-2xl" />
                <h1 className="font-bold text-[16px]">Editar Perfil</h1>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 px-2 py-[3px] rounded-xl transition-all" onClick={() => openModal('changePassword')}>
                <CiUnlock className="text-gray-500 text-2xl" />
                <h1 className="font-bold text-[16px]">Cambiar Contraseña</h1>
              </div>
            </div>
          )}
          <Modal1
            title={activeForm === 'editProfile' ? 'Editar Perfil' : 'Cambiar Contraseña'}
            size={activeForm === 'editProfile' ? '2xl' : 'base'}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            form={
              activeForm === 'editProfile' ? (
                <FormUpdatePerfil onClose={() => setIsOpen(false)} Listar={ListarUsuario} />
              ) : (
                <FormUpdateContraseña onClose={() => setIsOpen(false)} />
              )
            }
          />
          <div className="flex flex-col gap-1 mt-3">
            <h1 className="cursor-pointer font-bold text-[16px]">{user.name}</h1>
            <p className="flex text-xs">
              {user.role_id == "1" && "Administrador"}
              {user.role_id == "2" && "Encargado"}
              {user.role_id == "3" && "Usuario"}
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
