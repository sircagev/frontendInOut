import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import { BiPrinter, BiSearch } from "react-icons/bi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const Bodega = () => {
  const [bodegas, setBodegas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBodegas, setFilteredBodegas] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/stockminelementos");
      setBodegas(response.data);
    } catch (error) {
      console.error(
        "Error al obtener la información de los elementos con bajo Stock:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filteredData = Object.fromEntries(
      Object.entries(bodegas).map(([bodegaNombre, bodegaData]) => [
        bodegaNombre,
        bodegaData.filter((bodega) =>
          Object.values(bodega)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ),
      ])
    );
    setFilteredBodegas(filteredData);
  }, [searchTerm, bodegas]);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>
            Reporte de Elementos con Mínimo Stock
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Bodega</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
            </View>
            {Object.keys(filteredBodegas).map((bodegaNombre) =>
              filteredBodegas[bodegaNombre].map((bodega) => (
                <View
                  style={styles.tableRow}
                  key={`${bodegaNombre}_${bodega.Id_elemento}`}
                >
                  <Text style={styles.tableCell}>{bodega.Nombre_elemento}</Text>
                  <Text style={styles.tableCell}>
                    {bodega.Id_elemento.toString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {bodega.Stock !== undefined ? bodega.Stock : "0"}
                  </Text>
                  <Text style={styles.tableCell}>{bodega.Bodega}</Text>
                  <Text style={styles.tableCell}>
                    {bodega.Nombre_ubicacion}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => (
    <PDFDownloadLink
      document={<MyDocument />}
      fileName="Reporte de Mínimo Stock.pdf"
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

  const highlightSearchTerm = (text) => {
    if (!searchTerm || !text || typeof text !== "string") return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4 font-bold uppercase">
        Reporte Mínimo Stock
      </h1>

      <div className="d-flex justify-content-start">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col">
            <div className="input-group flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="flex justify-center items-center bg-[#3D7948] h-[40px] w-[50px] rounded-tr-md rounded-br-md font-sans text-lg font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <BiSearch style={{ fontSize: "1em" }} />
              </button>
            </div>
          </div>
          <div className="col d-flex align-items-center ml-5">
            {handlePrint()}
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Elemento</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Bodega</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filteredBodegas).flatMap((bodegaNombre) =>
            filteredBodegas[bodegaNombre].map((bodega) => (
              <tr key={`${bodegaNombre}_${bodega.Id_elemento}`}>
                <td>{bodega.Nombre_elemento}</td>
                <td>{bodega.Id_elemento}</td>
                <td>{bodega.Stock !== undefined ? bodega.Stock : "0"}</td>
                <td>{bodega.Bodega}</td>
                <td>{bodega.Nombre_ubicacion}</td>
              </tr>
            ))
          )}
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
    width: "20%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
  },
  tableCell: {
    width: "20%",
    textAlign: "center",
    padding: 5,
  },
});

export default Bodega;
