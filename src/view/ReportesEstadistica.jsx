import React, { useState, useEffect } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axiosClient from "../components/config/axiosClient";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const getMonthYear = (date) => {
  const options = { year: "numeric", month: "short" };
  return new Date(date).toLocaleDateString("default", options);
};

const ReporteEstadistico = () => {
  const navigate = useNavigate();
  const [movementsData, setmovementsData] = useState([]);
  const [loansEleData, setloansEleData] = useState([]);
  const [loansApiData, setloansApiData] = useState([]);
  const [consumableData, setconsumableData] = useState([]);
  const [consumableApiData, setconsumableApiData] = useState([]);

  const fetchData = async () => {
    try {
      const movementsResponse = await axiosClient.get("/reporte/movimientospie");
      const loansResponse = await axiosClient.get("/reporte/prestamospie");
      const loansApiResponse = await axiosClient.get("/reporte/prestamosapi");
      const consumableResponse = await axiosClient.get("/reporte/consumiblespie");
      const consumableApiResponse = await axiosClient.get("/reporte/consumiblesapi");
  
      console.log("Datos recibidos movimientos:", movementsResponse.data.datos);
      console.log("Datos recibidos prestamos Pie:", loansResponse.data.datos);
      console.log("Datos recibidos prestamos Api:", loansApiResponse.data.datos);
      console.log("Datos recibidos consumibles:", consumableResponse.data.datos);
      console.log("Datos recibidos consumibles Api:", consumableApiResponse.data.datos);
  
      setmovementsData(movementsResponse.data.datos);
      setloansEleData(loansResponse.data.datos);
      setloansApiData(loansApiResponse.data.datos);
      setconsumableData(consumableResponse.data.datos);
      setconsumableApiData(consumableApiResponse.data.datos);
    } catch (error) {
      console.error("Error al obtener la información:", error);
      setmovementsData([]);
      setloansEleData([]);
      setloansApiData([]);
      setconsumableData([]);
      setconsumableApiData([]);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const datosMovementsPie = Array.isArray(movementsData)
    ? movementsData.reduce((acc, curr) => {
        const found = acc.find((item) => item.name === curr.movement_type);
        if (found) {
          found.value += 1;
        } else {
          acc.push({ name: curr.movement_type, value: 1 });
        }
        return acc;
      }, [])
    : [];

  const datosConsumablePie = Array.isArray(consumableData)
  ? consumableData.map((item) => ({
    name: item.name,
    value: parseFloat(item.Percentage),
  }))
: [];

const datosConsumableApi = Array.isArray(consumableApiData)
? consumableApiData.reduce((acc, curr) => {
    const found = acc.find((item) => item.mes === curr.month_year);
    if (found) {
      found.Total += parseFloat(curr.Total);
    } else {
      acc.push({
        mes: curr.date,
        Total: parseFloat(curr.Total),
      });
    }
    return acc;
  }, [])
: [];

  const datosMovementsBar = Array.isArray(movementsData)
    ? movementsData.reduce((acc, curr) => {
        const monthYear = getMonthYear(curr.created_at);
        const found = acc.find((item) => item.mes === monthYear);
        if (found) {
          found[curr.movement_type] = (found[curr.movement_type] || 0) + 1;
        } else {
          acc.push({ mes: monthYear, [curr.movement_type]: 1 });
        }
        return acc;
      }, [])
    : [];

  const datosLoansPie = Array.isArray(loansEleData)
    ? loansEleData.map((item) => ({
        name: item.element_name,
        value: parseFloat(item.percentage),
      }))
    : [];

  const datosLoansBar = Array.isArray(loansApiData)
    ? loansApiData.reduce((acc, curr) => {
        const found = acc.find((item) => item.mes === curr.month_year);
        if (found) {
          found.Total += parseFloat(curr.Total);
        } else {
          acc.push({
            mes: curr.month_year,
            Total: parseFloat(curr.Total),
          });
        }
        return acc;
      }, [])
    : [];

  console.log("Datos para el gráfico de movimientos Pie:", datosMovementsPie);
  console.log("Datos para el gráfico de movimientos Barra:", datosMovementsBar);
  console.log("Datos para el gráfico de prestamos Pie:", datosLoansPie);
  console.log("Datos para el gráfico de prestamos Barra:", datosLoansBar);
  console.log("Datos para el gráfico de consumible Barra:", datosConsumableApi);
  console.log(
    "Datos para el gráfico de consumibles Pie:",
    datosConsumablePie
  );

  const coloresPie = [
    "#8884d8",
    "#00C49F",
    "#FFD700",
    "#ff8042",
    "#83a6ed",
    "#FF8042",
    "#d0ed57",
    "#a4de6c",
    "#8dd1e1",
  ];
  const coloresBar = {
    ingreso: "#8884d8",
    salida: "#00C49F",
    text: "#f0f0f0",
  };

  return (
    <div className="container mx-auto pl-12 pr-12">
      <div className="absolute right-[15px] bottom-[5px]">
        <button
          onClick={() => navigate("/reportes")}
          className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <BiRightArrowAlt className="mr-1" size={24} />
          Reportes
        </button>
      </div>
      <h1 className="flex justify-center font-extrabold text-2xl mb-4">
        Bienvenid@!
      </h1>

      <div className="pl-12 pr-12">
        <h2 className="font-bold text-lg justify-center flex pb-2">
          Módulo de Consumibles
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Top 5 Consumibles Más Solicitados</h2>
            {datosConsumablePie.length > 0 ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={datosConsumablePie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {datosConsumablePie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>

          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosConsumableApi.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
                <BarChart
                  data={datosConsumableApi}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" stackId="a" fill="#8884d8">
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="Total"
                      position="inside"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>

      <div className="pl-12 pr-12 pt-5">
        <h2 className="font-bold text-lg justify-center pt-3 flex pb-2 ">
          Módulo de Préstamos
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Top 5 Elementos Más Solicitados</h2>
            {datosLoansPie.length > 0 ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={datosLoansPie}
                  dataKey="value"
                  nameKey="element_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ value }) => `${value.toFixed(2)}%`}
                >
                  {datosLoansPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>

          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosLoansBar.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
                <BarChart
                  data={datosLoansBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" stackId="a" fill="#8884d8">
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="Total"
                      position="inside"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>

      <div className="pl-12 pr-12 pt-5">
        <h2 className="font-bold text-lg justify-center flex pb-2">
          Módulo de Movimientos
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Movimientos Totales</h2>
            {datosMovementsPie.length > 0 ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={datosMovementsPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {datosMovementsPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>

          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosMovementsBar.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
                <BarChart
                  data={datosMovementsBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingreso" stackId="a" fill={coloresBar.ingreso}>
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="ingreso"
                      position="inside"
                    />
                  </Bar>
                  <Bar dataKey="salida" stackId="a" fill={coloresBar.salida}>
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="salida"
                      position="inside"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteEstadistico;
