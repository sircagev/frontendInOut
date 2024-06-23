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

const PrestamosActivosTable = ({ prestamosActivos, searchTerm }) => {
  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const renderTableCell = (value) => {
    if (value === null || value === undefined || value === "") {
      return <td>-</td>;
    } else {
      return (
        <td
          dangerouslySetInnerHTML={{
            __html: highlightSearchTerm(value),
          }}
        ></td>
      );
    }
  };

  return (
    <table className="table table-striped">
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
        {prestamosActivos.map(
          (
            {
              Estado,
              "Solicitado por": solicitadoPor,
              Elemento,
              cantidad,
              "Fecha de solicitud": fechaSolicitud,
              "Fecha de entrega": fechaEntrega,
              "Autorizado por": autorizadoPor,
              Observaciones,
            },
            index
          ) => (
            <tr key={index}>
              {renderTableCell(Estado)}
              {renderTableCell(solicitadoPor)}
              {renderTableCell(Elemento)}
              {renderTableCell(cantidad.toString())}
              {renderTableCell(
                fechaSolicitud
                  ? new Date(fechaSolicitud).toLocaleDateString()
                  : ""
              )}
              {renderTableCell(
                fechaEntrega ? new Date(fechaEntrega).toLocaleDateString() : ""
              )}
              {renderTableCell(autorizadoPor)}
              {renderTableCell(Observaciones)}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

const MyDocument = ({ prestamosActivos }) => (
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
          {prestamosActivos.map((prestamo, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{prestamo.Estado || "-"}</Text>
              <Text style={styles.tableCell}>
                {prestamo["Solicitado por"] || "-"}
              </Text>
              <Text style={styles.tableCell}>{prestamo.Elemento || "-"}</Text>
              <Text style={styles.tableCell}>{prestamo.cantidad || "-"}</Text>
              <Text style={styles.tableCell}>
                {prestamo["Fecha de solicitud"]
                  ? new Date(
                      prestamo["Fecha de solicitud"]
                    ).toLocaleDateString()
                  : "-"}
              </Text>
              <Text style={styles.tableCell}>
                {prestamo["Fecha de entrega"]
                  ? new Date(prestamo["Fecha de entrega"]).toLocaleDateString()
                  : "-"}
              </Text>
              <Text style={styles.tableCell}>
                {prestamo["Autorizado por"] || "-"}
              </Text>
              <Text style={styles.tableCell}>
                {prestamo.Observaciones || "-"}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const Elemento = () => {
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ListarPrestamosActivos = async () => {
    try {
      const response = await axiosClient.get(`reporte/prestamosactivos`);
      if (response && response.data && Array.isArray(response.data.datos)) {
        const prestamos = response.data.datos.filter((prestamo) =>
          Object.values(prestamo).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setPrestamosActivos(prestamos);
      } else {
        console.error(
          "La respuesta del servidor no contiene los datos esperados:",
          response
        );
        setPrestamosActivos([]); // Limpiar el estado de préstamos activos
        setError("No hay préstamos activos para mostrar.");
      }
    } catch (error) {
      console.log("Error al obtener la lista de préstamos activos:", error);
      setError(
        "Error al obtener la lista de préstamos activos: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    ListarPrestamosActivos();
  }, [searchTerm]);

  useEffect(() => {
    ListarPrestamosActivos();
  }, []);

  const handlePrint = () => {
    if (prestamosActivos.length === 0) {
      return (
        <button
          className="d-flex align-items-center bg-gray-300 w-[200px] h-[40px] rounded font-sans text-xs uppercase text-gray-600 shadow-md cursor-not-allowed"
          disabled
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
            {"Ningun dato para descarga"}
          </div>
        </button>
      );
    }

    return (
      <PDFDownloadLink
        document={<MyDocument prestamosActivos={prestamosActivos} />}
        fileName="Reporte de préstamos activos.pdf"
      >
        {({}) => (
          <button className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none font-semibold">
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
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4 font-bold uppercase">
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
        </div>

        <div className="absolute right-3 bg-green-100 rounded h-[50px] w-[330px] border-t-2 border-green-400">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 ml-2">
              <BiInfoCircle />
            </div>
            <h2 className="p-2 text-justify mr-2 text-xs">
              Listado de todos los préstamos activos, se pueden realizar
              búsquedas individuales.
            </h2>
          </div>
        </div>
      </div>

      {prestamosActivos.length > 0 ? (
        <PrestamosActivosTable
          prestamosActivos={prestamosActivos}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="text-center mt-4 pl-10 pr-10">
          <div className="flex items-center p-4 space-x-4 bg-red-100 border-b h-12 border-red-400 rounded">
            <BiError className="text-red-400 text-3xl" />
            <p className="text-red-700">
              No hay préstamos activos para mostrar
            </p>
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
    width: "12.5%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
  },
  tableCell: {
    width: "12.5%",
    textAlign: "center",
    padding: 5,
  },
});

export default Elemento;
