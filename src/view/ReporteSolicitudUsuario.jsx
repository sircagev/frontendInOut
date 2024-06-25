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

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const response = await axiosClient.get("reporte/solicitudesusuario");
      if (response.data && response.data.datos) {
        setUsuarios(response.data.datos);
      } else {
        console.error(
          "La respuesta de la solicitud GET no contiene los datos esperados:",
          response.data
        );
        alert("Error al obtener información de las solicitudes");
      }
    } catch (error) {
      console.log("Error al obtener información de usuarios:", error);
      alert("Error al obtener información de las solicitudes");
    }
  };

  const buscarUsuarios = () => {
    return usuarios.filter((usuario) => {
      const searchTextMatch =
        usuario.Rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.Nombre_Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.ID_Usuario.toString().includes(searchTerm) ||
        usuario.Numero.toString().includes(searchTerm) ||
        usuario.ID_Ficha.toString().includes(searchTerm) ||
        usuario.Elemento.toLowerCase().includes(searchTerm.toLowerCase());

      const startDateMatch = startDate ? new Date(usuario.Fecha_de_Solicitud) >= new Date(startDate) : true;
      const endDateMatch = endDate ? new Date(usuario.Fecha_de_Entrega) <= new Date(endDate) : true;

      return searchTextMatch && startDateMatch && endDateMatch;
    });
  };

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Solicitudes por Usuarios</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Rol</Text>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Identificación</Text>
              <Text style={styles.tableHeader}>Teléfono</Text>
              <Text style={styles.tableHeader}>Id Ficha</Text>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Fecha de solicitud</Text>
              <Text style={styles.tableHeader}>Fecha de entrega</Text>
              <Text style={styles.tableHeader}>Observaciones</Text>
            </View>
            {buscarUsuarios().map((user, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{user.Rol}</Text>
                <Text style={styles.tableCell}>{`${user.Nombre_Usuario}`}</Text>
                <Text style={styles.tableCell}>{user.ID_Usuario}</Text>
                <Text style={styles.tableCell}>{user.Numero}</Text>
                <Text style={styles.tableCell}>{user.ID_Ficha}</Text>
                <Text style={styles.tableCell}>{user.Elemento}</Text>
                <Text style={styles.tableCell}>{user.Cantidad}</Text>
                <Text style={styles.tableCell}>
                  {formatDate(user.Fecha_de_Solicitud)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatDate(user.Fecha_de_Entrega)}
                </Text>
                <Text style={styles.tableCell}>{user.Observaciones}</Text>
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
      fileName="Reporte solicitudes.pdf"
    >
      {({}) => (
        <button className="d-flex align-items-center bg-[#3D7948] w-[130px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold">
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
              justifyContent: "start",
              flex: 1,
            }}
          >
            {"Descarga"}
          </div>
        </button>
      )}
    </PDFDownloadLink>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <h1 className="text-center text-lg font-bold uppercase mb-4 mt-4">
        Reporte de Solicitudes por Usuarios
      </h1>

      <div className="d-flex justify-content-start relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col">
            <div className="input-group flex-grow-1">
              <input
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
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
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
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
                Solicitudes de cada usuario, se
                pueden buscar por Identificación, filtrar por fechas y descargar.
              </h2>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Teléfono</th>
            <th>Id Ficha</th>
            <th>Elemento</th>
            <th>Cantidad</th>
            <th>Fecha de solicitud</th>
            <th>Fecha de entrega</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {buscarUsuarios().map((user, index) => (
            <tr key={index}>
              <td>{user.Rol}</td>
              <td>{user.Nombre_Usuario}</td>
              <td>{user.ID_Usuario}</td>
              <td>{user.Numero}</td>
              <td>{user.ID_Ficha}</td>
              <td>{user.Elemento}</td>
              <td>{user.Cantidad}</td>
              <td>{formatDate(user.Fecha_de_Solicitud)}</td>
              <td>{formatDate(user.Fecha_de_Entrega)}</td>
              <td>{user.Observaciones}</td>
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
    width: "11%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  tableCell: {
    width: "11%",
    textAlign: "center",
    padding: 5,
  },
});

export default Usuario;
