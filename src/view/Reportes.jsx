import React from "react";
import { useNavigate } from "react-router-dom";
import elementosImg from "../assets/tools.png";
import usuariosImg from "../assets/team.png";
import bodegasImg from "../assets/min_stock.png";
import movimientosImg from "../assets/move.png";

const Reportes = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Reporte",
      img: elementosImg,
      text: "de Préstamos Activos",
      path: "/reportes/prestamosactivos",
    },
    {
      title: "Reporte",
      img: bodegasImg,
      text: " de Elementos con stock mínimo",
      path: "/reportes/stockmin",
    },  
    {
      title: "Reporte",
      img: usuariosImg,
      text: "Solicitudes de Usuarios",
      path: "/reportes/solicitudusuario",
    },
    {
      title: "Reporte",
      img: movimientosImg,
      text: " de Movimientos",
      path: "/reportes/movimientos",
    },
  ];

  return (
    <div className="container justify-center p-5 h-full flex flex-wrap overflow-hidden">
      <div className="flex flex-wrap w-full h-full items-center justify-center">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col m-2 items-center justify-center w-full h-full rounded font-sans text-sm uppercase text-green-800 shadow-md transition-all hover:shadow-lg hover:shadow-blue-400 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold cursor-pointer"
            style={{ width: "calc(40% - 8px)", height: "calc(38% - 8px)" }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[100px] rounded-t translate-y-[-25%]"
            />
            <h2>{item.title}</h2>
            <p className="text-center">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reportes;
