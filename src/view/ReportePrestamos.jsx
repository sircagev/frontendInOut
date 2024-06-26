import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import {
  BiSearch,
  BiPrinter,
  BiInfoCircle,
  BiError,
  BiCommentDetail,
} from "react-icons/bi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const Prestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [bodega, setBodega] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showResultsAndPrint, setShowResultsAndPrint] = useState(false);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  useEffect(() => {
    const listarPrestamos = async () => {
      try {
        const response = await axiosClient.get("reporte/prestamos");
        const dataWithUbicacion = response.data.datos.map((prestamo) => ({
          ...prestamo,
          Ubicacion: `${prestamo.Nombre_bodega} - ${prestamo.Nombre_ubicacion}`,
        }));
        setPrestamos(dataWithUbicacion);
        const filteredData = aplicarFiltros(dataWithUbicacion);
        setFilteredPrestamos(filteredData);
        setSearchResultsCount(filteredData.length);
        setShowNoResultsMessage(filteredData.length === 0);
      } catch (error) {
        console.error("Error al obtener la lista de préstamos:", error);
      }
    };

    listarPrestamos();
  }, []);

  const aplicarFiltros = (data) => {
    let filteredData = [...data];

    if (bodega) {
      filteredData = filteredData.filter(
        (prestamo) => prestamo["Nombre de Bodega"] === bodega
      );
    }

    if (fechaInicio || fechaFin) {
      filteredData = filteredData.filter((prestamo) => {
        const fechaPrestamo = new Date(prestamo["Fecha del Prestamo"]);
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
    const filteredData = aplicarFiltros(prestamos);
    setFilteredPrestamos(filteredData);
    setSearchResultsCount(filteredData.length);
    setShowFilters(false);
    setShowResultsAndPrint(true);
    setShowNoResultsMessage(filteredData.length === 0);
  };

  const handleNewSearch = () => {
    setShowFilters(true);
    setShowResultsAndPrint(false);
    setBodega("");
    setFechaInicio("");
    setFechaFin("");
    window.location.reload(); // Recargar la página para limpiar los filtros
  };

  const FilterAndSearch = () => (
    <div className="d-flex justify-content-start relative">
      <div className="d-flex justify-content-start align-items-center mb-4">
        <div className="col">
          <div className="input-group flex-grow-1">
            <select
              className="form-control pr-4"
              value={bodega}
              onChange={(e) => setBodega(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Bodega Principal">Principal</option>
              <option value="Almacén Secundario">Secundario</option>
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

      <div className="absolute right-1 bg-green-100 rounded h-[50px] w-[300px] border-t-2 border-green-400">
        <div className="flex items-center">
          <div className="text-3xl text-green-600 ml-2">
            <BiInfoCircle />
          </div>
          <h2 className="p-2 text-justify mr-2 text-xs">
            Listado de todos los préstamos, se puede filtrar su resultado por su
            ubicación y fecha.
          </h2>
        </div>
      </div>
    </div>
  );

  const ResultsAndPrint = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-bold text-xs uppercase text-white shadow-md">
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
      <div
        className="d-flex font-sans cursor-pointer w-[180px] h-[40px] text-m uppercase align-items-center mb-3 bg-blue-800 text-white px-1 mt-3 rounded ml-4"
        onClick={handleNewSearch}
      >
        <div
          className="icon-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
          }}
        >
          <BiSearch style={{ marginLeft: "5px", fontSize: "1.5em" }} />
        </div>
        <button className="mr-2 text-white text-xs font-bold uppercase w-full">
          Nueva búsqueda
        </button>
      </div>
      <div className="col d-flex align-items-center ml-4">{handlePrint()}</div>
    </div>
  );

  const MyDocument = ({ data }) => (
    <Document>
      <Page size="A1">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Préstamos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Ubicación</Text>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Solicitud</Text>
              <Text style={styles.tableHeader}>Fecha Solicitud</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Estado</Text>
              <Text style={styles.tableHeader}>Aprueba</Text>
              <Text style={styles.tableHeader}>Fecha Entrega</Text>
              <Text style={styles.tableHeader}>Observaciones</Text>
            </View>
            {data.map((prestamo) => (
              <View style={styles.tableRow} key={prestamo["ID del Prestamo"]}>
                <Text style={styles.tableCell}>
                  {prestamo["Nombre de Bodega"]}
                </Text>
                <Text style={styles.tableCell}>{prestamo["Elemento"]}</Text>
                <Text style={styles.tableCell}>
                  {prestamo["Codigo de Elemento"]}
                </Text>
                <Text style={styles.tableCell}>
                  {prestamo["Solicitado por"]}
                </Text>
                <Text style={styles.tableCell}>
                  {formatDate(prestamo["Fecha de solicitud"])}
                </Text>
                <Text style={styles.tableCell}>{prestamo["cantidad"]}</Text>
                <Text style={styles.tableCell}>{prestamo["Estado"]}</Text>
                <Text style={styles.tableCell}>
                  {prestamo["Autorizado por"]}
                </Text>
                <Text style={styles.tableCell}>
                {formatDate(prestamo["Fecha de entrega"])}
                </Text>
                <Text style={styles.tableCell}>
                  {prestamo["Observaciones"]}
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
      document={<MyDocument data={filteredPrestamos} />}
      fileName="Reporte_de_prestamos.pdf"
    >
      {({}) => (
        <button
          className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold"
          style={{ textDecoration: "none" }}
          onClick={(e) => {
            if (searchResultsCount === 0) {
              e.preventDefault(); // Evita realizar alguna descarga si no hay resultados
            }
          }}
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
        Reporte de Préstamos
      </h1>

      {showFilters && <FilterAndSearch />}
      {showResultsAndPrint && <ResultsAndPrint />}

      {showNoResultsMessage && (
        <div className="text-center mt-4 pl-10 pr-10">
          <div className="flex items-center p-4 space-x-4 bg-red-100 border-b h-12 border-red-400 rounded">
            <BiError className="text-red-400 text-3xl" />
            <p className="text-red-700">No hay préstamos para mostrar</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="relative flex flex-col items-center">
              <BiCommentDetail className="text-black text-[80px]" />
            </div>
            <p className="mt-2 text-black text-center w-[340px]">
              Este mensaje sugiere que no hay criterios asociados con tu
              búsqueda o que no hay datos en el sistema para ser mostrados
              actualmente.
            </p>
          </div>
        </div>
      )}

      {searchResultsCount > 0 && (
        <table className="table table-bordered table-striped text-center table-responsive thead-dark">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Elemento</th>
              <th>Código</th>
              <th>Solicitud</th>
              <th>Fecha Solicitud</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Aprueba</th>
              <th>Fecha Entrega</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrestamos.map((prestamo, index) => (
              <tr key={index}>
                <td>{prestamo["Nombre de Bodega"]}</td>
                <td>{prestamo["Elemento"]}</td>
                <td>{prestamo["Codigo de Elemento"]}</td>
                <td>{prestamo["Solicitado por"]}</td>
                <td>{formatDate(prestamo["Fecha de solicitud"])}</td>

                <td>{prestamo["cantidad"]}</td>
                <td>{prestamo["Estado"]}</td>

                <td>{prestamo["Autorizado por"]}</td>
                <td>{formatDate(prestamo["Fecha de entrega"])}</td>
                <td>{prestamo["Observaciones"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

export default Prestamos;
