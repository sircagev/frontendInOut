import React, { useEffect, useState } from "react";
import axiosClient from "../components/config/axiosClient";
import {
  BiPrinter,
  BiSearch,
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

const Activo = () => {
  const [prestamos, setPrestamosActivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("reporte/prestamosactivos");
        if (response.data && Array.isArray(response.data.datos)) {
          setPrestamosActivos(response.data.datos);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            response.data
          );
          alert("No hay préstamos activos para mostrar.");
        }
      } catch (error) {
        console.log("Error al obtener la lista de préstamos activos:", error);
        alert("Error al obtener la lista de préstamos activos: ");
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const buscarActivos = () => {
    return prestamos.filter(
      (prestamo) =>
        (prestamo["Solicitado por"] &&
          prestamo["Solicitado por"]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (prestamo.Elemento &&
          prestamo.Elemento.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Préstamos Activos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Estado</Text>
              <Text style={styles.tableHeader}>Solicitado por</Text>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Fecha de solicitud</Text>
              <Text style={styles.tableHeader}>Fecha de entrega</Text>
              <Text style={styles.tableHeader}>Autorizado por</Text>
              <Text style={styles.tableHeader}>Observaciones</Text>
            </View>
            {buscarActivos().length === 0 ? (
              <View style={styles.emptyTableMessage}>
                <div className="text-center mt-4 pl-10 pr-10">
                  <div className="flex items-center p-4 space-x-4 bg-red-100 border-b h-12 border-red-400 rounded">
                    <BiError className="text-red-400 text-3xl" />
                    <p className="text-red-700">
                      No hay elementos activos para mostrar
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <div className="relative flex flex-col items-center">
                      <BiCommentDetail className="text-black text-[80px]" />
                    </div>
                    <p className="mt-2 text-black text-center w-[340px]">
                      Este mensaje sugiere que no hay criterios asociados con tu
                      búsqueda o que no hay datos en el sistema para ser
                      mostrados actualmente.
                    </p>
                  </div>
                </div>
              </View>
            ) : (
              buscarActivos().map((prestamo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{prestamo.Estado || "-"}</Text>
                  <Text style={styles.tableCell}>
                    {prestamo["Solicitado por"] || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo.Elemento || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo.cantidad || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo["Fecha de solicitud"]
                      ? new Date(
                          prestamo["Fecha de solicitud"]
                        ).toLocaleDateString()
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo["Fecha de entrega"]
                      ? new Date(
                          prestamo["Fecha de entrega"]
                        ).toLocaleDateString()
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo["Autorizado por"] || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {prestamo.Observaciones || "-"}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handleDownloadClick = (event) => {
    if (!buscarActivos().length > 0) {
      event.preventDefault();
      alert("No hay elementos para descargar");
    }
  };

  const handlePrint = () => {
    const activosFound = buscarActivos().length > 0;

    return (
      <PDFDownloadLink
        document={<MyDocument />}
        fileName="Reporte_prestamos_activos.pdf"
        onClick={handleDownloadClick}
      >
        {({}) => (
          <button
            className={`d-flex align-items-center w-[200px] h-[40px] rounded font-sans text-xs uppercase shadow-md transition-all
              ${
                activosFound
                  ? "bg-[#3D7948] text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            disabled={!activosFound}
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
              {activosFound ? "Descargar Reporte" : "No hay datos"}
            </div>
          </button>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div className="container">
      <h1 className="text-center text-lg font-bold uppercase mb-4 mt-4">
        Reporte de Préstamos Activos
      </h1>

      <div className="d-flex justify-content-start relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col">
            <div className="input-group flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                }}
              />
              <button
                className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tr-lg rounded-br-lg font-sans text-lg font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <BiSearch />
              </button>
            </div>
          </div>
          <div className="col d-flex align-items-center ml-5">
            {handlePrint()}
          </div>
          <div className="absolute right-6 bg-green-100 rounded h-[50px] w-[320px] border-t-2 border-green-400">
            <div className="flex items-center">
              <div className="text-3xl text-green-600 ml-2">
                <BiInfoCircle />
              </div>
              <h2 className="p-2 text-justify mr-2 text-xs">
                Listado de prestamos activos. Puedes buscar por nombre de
                Usuario o Elemento.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {buscarActivos().length > 0 && (
        <table className="table table-bordered table-striped text-center table-responsive thead-dark">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Solicitado por</th>
              <th>Elemento</th>
              <th>Cantidad</th>
              <th>Fecha de solicitud</th>
              <th>Fecha de entrega</th>
              <th>Autorizado por</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {buscarActivos().map((prestamo, index) => (
              <tr key={index}>
                <td>{prestamo.Estado || "-"}</td>
                <td>{prestamo["Solicitado por"] || "-"}</td>
                <td>{prestamo.Elemento || "-"}</td>
                <td>{prestamo.cantidad || "-"}</td>
                <td>
                  {prestamo["Fecha de solicitud"]
                    ? formatDate(prestamo["Fecha de solicitud"])
                    : "-"}
                </td>
                <td>
                  {prestamo["Fecha de entrega"]
                    ? formatDate(prestamo["Fecha de entrega"])
                    : "-"}
                </td>
                <td>{prestamo["Autorizado por"] || "-"}</td>
                <td>{prestamo.Observaciones || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {buscarActivos().length === 0 && (
        <div className="text-center mt-4 pl-10 pr-10">
          <div className="flex items-center p-4 space-x-4 bg-red-100 border-b h-12 border-red-400 rounded">
            <BiError className="text-red-400 text-3xl" />
            <p className="text-red-700">No hay elementos para mostrar</p>
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
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  emptyTableMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default Activo;
