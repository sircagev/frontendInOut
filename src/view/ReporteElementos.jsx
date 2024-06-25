import React, { useEffect, useState } from "react";
import axiosClient from "../components/config/axiosClient";
import { BiPrinter, BiSearch, BiInfoCircle } from "react-icons/bi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const Elementos = () => {
  const [elementos, setElementos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    listarElementos();
  }, []);

  const listarElementos = async () => {
    try {
      const response = await axiosClient.get("reporte/elementos");
      if (response.data && response.data.datos) {
        setElementos(response.data.datos);
      } else {
        console.error(
          "La respuesta de la solicitud GET no contiene los datos esperados:",
          response.data
        );
        alert("Error al obtener información de los elementos");
      }
    } catch (error) {
      console.log("Error al obtener información de elementos:", error);
      alert("Error al obtener información de los elementos");
    }
  };

  const buscarElementos = () => {
    return elementos.filter(
      (elemento) =>
        elemento.Nombre_elemento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Elementos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Stock</Text>
              <Text style={styles.tableHeader}>Categoría</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
              <Text style={styles.tableHeader}>En Préstamo</Text>
              <Text style={styles.tableHeader}>Observaciones</Text>
            </View>
            {buscarElementos().map((elemento, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{elemento.Codigo_elemento}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_elemento}</Text>
                <Text style={styles.tableCell}>{elemento.stock}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_Categoria}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_ubicacion}</Text>
                <Text style={styles.tableCell}>{elemento.cantidad_en_prestamo}</Text>
                <Text style={styles.tableCell}>{elemento.observaciones}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => (
    <PDFDownloadLink
      document={<MyDocument />}
      fileName="Reporte_elementos.pdf"
    >
      {({}) => (
        <button className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold">
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

  return (
    <div className="container">
      <h1 className="text-center text-lg font-bold uppercase mb-4 mt-4">
        Reporte de Elementos
      </h1>

      <div className="d-flex justify-content-start relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col">
            <div className="input-group flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                }}
              />
              <button
                className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-lg font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                Listado de todos los elementos. Puedes buscar por nombre y descargar el reporte.
              </h2>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>En Préstamo</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {buscarElementos().map((elemento, index) => (
            <tr key={index}>
              <td>{elemento.Codigo_elemento}</td>
              <td>{elemento.Nombre_elemento}</td>
              <td>{elemento.stock}</td>
              <td>{elemento.Nombre_Categoria}</td>
              <td>{elemento.Nombre_ubicacion}</td>
              <td>{elemento.cantidad_en_prestamo}</td>
              <td>{elemento.observaciones}</td>
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
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    width: "14%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  tableCell: {
    width: "14%",
    textAlign: "center",
    padding: 5,
  },
});

export default Elementos;
