import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import { BiSearch, BiPrinter } from "react-icons/bi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showResultsAndPrint, setShowResultsAndPrint] = useState(false);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const [showResultsNotification, setShowResultsNotification] = useState(false);

  useEffect(() => {
    const listarMovimientos = async () => {
      try {
        const response = await axiosClient.get("reporte/movimientoshistorial");
        const dataWithUbicacion = response.data.datos.map((movimiento) => ({
          ...movimiento,
          Ubicacion: `${movimiento.Nombre_bodega} - ${movimiento.Nombre_ubicacion}`,
        }));
        setMovimientos(dataWithUbicacion);
        const filteredData = aplicarFiltros(dataWithUbicacion);
        setFilteredMovimientos(filteredData);
        setSearchResultsCount(filteredData.length);
        setShowResultsNotification(true);
      } catch (error) {
        console.error("Error al obtener la lista de movimientos:", error);
      }
    };

    listarMovimientos();
  }, []);

  const aplicarFiltros = (data) => {
    let filteredData = [...data];

    if (tipoMovimiento) {
      filteredData = filteredData.filter(
        (movimiento) => movimiento["Tipo de Movimiento"] === tipoMovimiento
      );
    }

    if (fechaInicio || fechaFin) {
      filteredData = filteredData.filter((movimiento) => {
        const fechaPrestamo = new Date(movimiento["Fecha del Prestamo"]);
        const fechaInicioValida = fechaInicio ? new Date(fechaInicio) : null;
        const fechaFinValida = fechaFin ? new Date(fechaFin) : null;

        return (
          (!fechaInicioValida || fechaPrestamo >= fechaInicioValida) &&
          (!fechaFinValida || fechaPrestamo <= fechaFinValida)
        );
      });
    }

    filteredData.sort(
      (a, b) =>
        new Date(b["Fecha del Prestamo"]) - new Date(a["Fecha del Prestamo"])
    );
    return filteredData;
  };

  const handleSearch = () => {
    const filteredData = aplicarFiltros(movimientos);
    setFilteredMovimientos(filteredData);
    setSearchResultsCount(filteredData.length);
    setShowFilters(false);
    setShowResultsAndPrint(true);
  };

  const handleNewSearch = () => {
    setShowFilters(true);
    setShowResultsAndPrint(false);
    setTipoMovimiento("");
    setFechaInicio("");
    setFechaFin("");
    setShowResultsNotification(false);
    window.location.reload();
  };

  const FilterAndSearch = () => (
    <div className="d-flex justify-content-start">
      <div className="d-flex justify-content-start align-items-center mb-4">
        <div className="col">
          <div className="input-group flex-grow-1">
            <select
              className="form-control pr-4"
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
              <option value="Prestamo">Préstamo</option>
            </select>

            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <button
              className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tr-lg rounded-br-lg font-sans text-lg font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleSearch}
            >
              <BiSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultsAndPrint = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md">
        <div
          className="text-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {searchResultsCount > 0
            ? `${searchResultsCount} Resultados encontrados`
            : "Ninguna coincidencia"}
        </div>
      </div>
      <div className="d-flex font-sans cursor-pointer w-[180px] h-[40px] text-m uppercase align-items-center mb-3 bg-blue-800 text-white px-1 mt-3 rounded ml-4" onClick={handleNewSearch}>
        <div
          className="icon-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
          }}
        >
          <BiSearch style={{ fontSize: "1.5em" }} />
        </div>
        <button className="ml-2 text-white" >
          Nueva búsqueda
        </button>
      </div>
      <div className="col d-flex align-items-center ml-5">{handlePrint()}</div>
    </div>
  );

  const MyDocument = ({ data }) => (
    <Document>
      <Page size="A1">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Movimientos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Tipo</Text>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Solicitud</Text>
              <Text style={styles.tableHeader}>Fecha</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Stock</Text>
              <Text style={styles.tableHeader}>Usuario Recibe</Text>
              <Text style={styles.tableHeader}>Usuario Entrega</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
              <Text style={styles.tableHeader}>Observaciones</Text>
            </View>
            {data.map((movimiento) => (
              <View style={styles.tableRow} key={movimiento["ID del Prestamo"]}>
                <Text style={styles.tableCell}>
                  {movimiento["Tipo de Movimiento"]}
                </Text>
                <Text style={styles.tableCell}>
                  {movimiento["Nombre del Elemento"]}
                </Text>
                <Text style={styles.tableCell}>
                  {movimiento["ID del Prestamo"]}
                </Text>
                <Text style={styles.tableCell}>{movimiento["Usuario"]}</Text>
                <Text style={styles.tableCell}>
                  {formatDate(movimiento["Fecha del Prestamo"])}
                </Text>
                <Text style={styles.tableCell}>{movimiento["Cantidad"]}</Text>
                <Text style={styles.tableCell}>{movimiento["Stock"]}</Text>
                <Text style={styles.tableCell}>
                  {movimiento["Usuario Recibe"]}
                </Text>
                <Text style={styles.tableCell}>
                  {movimiento["Usuario Entrega"]}
                </Text>
                <Text style={styles.tableCell}>{movimiento["Ubicacion"]}</Text>
                <Text style={styles.tableCell}>
                  {movimiento["Observaciones"]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => (
    <PDFDownloadLink
      document={<MyDocument data={filteredMovimientos} />}
      fileName="Reporte_de_movimientos.pdf"
    >
      {({}) => (
        <button
          className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold"
          style={{ textDecoration: "none" }}
        >
          <div
            className="icon-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
            }}
          >
            <BiPrinter style={{ fontSize: "1.5em" }} />
          </div>
          <div
            className="text-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {"Descargar Reporte"}
          </div>
        </button>
      )}
    </PDFDownloadLink>
  );

  // Función para formatear la fecha a día/mes/año
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4 font-bold uppercase">
        Reporte de Movimientos
      </h1>

      {showFilters && <FilterAndSearch />}
      {showResultsAndPrint && <ResultsAndPrint />}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Elemento</th>
            <th>Código</th>
            <th>Solicitud</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Stock</th>
            <th>Recibe</th>
            <th>Aprueba</th>
            <th>Ubicación</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovimientos.map((movimiento, index) => (
            <tr key={index}>
              <td>{movimiento["Tipo de Movimiento"]}</td>
              <td>{movimiento["Nombre del Elemento"]}</td>
              <td>{movimiento["ID del Prestamo"]}</td>
              <td>{movimiento["Usuario"]}</td>
              <td>{formatDate(movimiento["Fecha del Prestamo"])}</td>
              <td>{movimiento["Cantidad"]}</td>
              <td>{movimiento["Stock"]}</td>
              <td>{movimiento["Usuario Recibe"]}</td>
              <td>{movimiento["Usuario Entrega"]}</td>
              <td>{movimiento["Ubicacion"]}</td>
              <td>{movimiento["Observaciones"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    width: "10%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
  },
  tableCell: {
    width: "10%",
    textAlign: "center",
    padding: 5,
  },
});

export default Movimientos;
