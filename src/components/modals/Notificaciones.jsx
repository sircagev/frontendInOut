import { useNavigate } from "react-router-dom";
import { BiSearch, BiX } from "react-icons/bi";

const NotificationsModal = ({
  showModal,
  setShowModal,
  elementosConBajoStock,
  prestamosActivos,
  elementosExpirados,
  prestamosVencidos,
  solicitudes,
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

  const handleViewVencidosClick = () => {
    setShowModal(false);
    navigate("/reportes/prestamosvencidos");
  };

  const handleViewSolicitudesClick = () => {
    setShowModal(false);
    navigate("/reportes/solicitud");
  };

  const handleViewExpiradosClick = () => {
    setShowModal(false);
    navigate("/reportes/elementosexpirados");
  };

  return (
    showModal &&
    (elementosConBajoStock > 0 ||
      prestamosActivos > 0 ||
      prestamosVencidos > 0 ||
      solicitudes > 0 ||
      elementosExpirados > 0) && (
      <div className="absolute top-4 right-[70px] z-50 animate-cascade-slide-down">
        <div
          className="fixed top-9 right-11 bottom-0 bg-gray-500 bg-opacity-50 cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <div className="bg-white p-3 rounded-lg shadow-lg ">
          <h2 className="flex text-xl text-black font-bold mb-2 justify-center">
            Notificaciones
            <span
              className="ml-2 cursor-pointer"
              onClick={() => setShowModal(false)}
            ></span>{" "}
          </h2>
          {elementosConBajoStock > 0 && (
            <div
              className="flex items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={handleViewStockClick}
            >
              <p className="flex-1 text-black pr-5">
                <span className="text-blue-700 font-bold">
                  {elementosConBajoStock}
                </span>{" "}
                Elementos con bajo Stock
              </p>
              <BiSearch className="text-blue-900" />
            </div>
          )}
          {prestamosActivos > 0 && (
            <div
              className="flex items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={handleViewPrestamosClick}
            >
              <p className="flex-1 text-black">
                <span className="text-blue-700 font-bold">
                  {prestamosActivos}
                </span>{" "}
                Préstamos activos
              </p>
              <BiSearch className="text-blue-900" />
            </div>
          )}
          {prestamosVencidos > 0 && (
            <div
              className="flex items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={handleViewVencidosClick}
            >
              <p className="flex-1 text-black">
                <span className="text-blue-700 font-bold">
                  {prestamosVencidos}
                </span>{" "}
                Préstamos vencidos
              </p>
              <BiSearch className="text-blue-900" />
            </div>
          )}
          {solicitudes > 0 && (
            <div
              className="flex items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={handleViewSolicitudesClick}
            >
              <p className="flex-1 text-black">
                <span className="text-blue-700 font-bold">{solicitudes}</span>{" "}
                Solicitudes
              </p>
              <BiSearch className="text-blue-900" />
            </div>
          )}
          {elementosExpirados > 0 && (
            <div
              className="flex items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={handleViewExpiradosClick}
            >
              <p className="flex-1 text-black">
                <span className="text-blue-700 font-bold">
                  {elementosExpirados}
                </span>{" "}
                Elementos expirados
              </p>
              <BiSearch className="text-blue-900" />
            </div>
          )}
          <div className="absolute top-1 right-4 justify-center mt-2">
            <button
              className="bg-red-400 hover:text-red-500 shadow-xl font-extrabold px-2 py-2 rounded-full"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
              onClick={() => setShowModal(false)}
            >
              <BiX />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationsModal;
