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

const ElementosDesactivados = () => {
  const [elementos, setElementos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    listarElementosDesactivados();
  }, []);

  const listarElementosDesactivados = async () => {
    try {
      const response = await axiosClient.get("reporte/elementosdesactivados");
      if (response.data && response.data.datos) {
        setElementos(response.data.datos);
      } else {
        console.error(
          "La respuesta de la solicitud GET no contiene los datos esperados:",
          response.data
        );
        alert("Error al obtener información de los elementos desactivados");
      }
    } catch (error) {
      console.log(
        "Error al obtener información de elementos desactivados:",
        error
      );
      alert("Error al obtener información de los elementos desactivados");
    }
  };

  const buscarElementos = () => {
    return elementos.filter(
      (elemento) =>
        elemento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        elemento.codigo.toString().includes(searchTerm)
    );
  };

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Elementos Desactivados</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Categoría</Text>
              <Text style={styles.tableHeader}>Bodega</Text>
            </View>
            {buscarElementos().length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellEmpty} colSpan={5}>
                  <div className="text-center mt-4 pl-10 pr-10">
                    <div className="flex items-center p-4 space-x-4 bg-red-100 border-b h-12 border-red-400 rounded">
                      <BiError className="text-red-400 text-3xl" />
                      <p className="text-red-700">
                        No hay elementos para mostrar
                      </p>
                    </div>

                    <div className="flex flex-col items-center p-4">
                      <div className="relative flex flex-col items-center">
                        <BiCommentDetail className="text-black text-[80px]" />
                      </div>
                      <p className="mt-2 text-black text-center w-[340px]">
                        Este mensaje sugiere que no hay criterios asociados con
                        tu búsqueda o que no hay datos en el sistema para ser
                        mostrados actualmente.
                      </p>
                    </div>
                  </div>
                </Text>
              </View>
            ) : (
              buscarElementos().map((elemento, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{elemento.codigo}</Text>
                  <Text style={styles.tableCell}>{elemento.nombre}</Text>
                  <Text style={styles.tableCell}>{elemento.cantidad}</Text>
                  <Text style={styles.tableCell}>{elemento.categoria}</Text>
                  <Text style={styles.tableCell}>{elemento.bodega}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => {
    const elementosFiltrados = buscarElementos();
    const hayElementos = elementosFiltrados.length > 0;

    return (
      <PDFDownloadLink
        document={<MyDocument />}
        fileName="Reporte_elementos_desactivados.pdf"
        disabled={!hayElementos}
      >
        {({}) => (
          <button
            className={`d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none ${
              !hayElementos
                ? "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                : ""
            } font-semibold`}
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
  };

  return (
    <div className="container">
      <h1 className="text-center text-lg font-bold uppercase mb-4 mt-4">
        Reporte de Elementos Desactivados
      </h1>

      <div className="d-flex justify-content-start relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col d-flex align-items-center ml-5">
            <div className="input-group flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar.."
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
                Aquí encontrarás todos los elementos en estado desactivado.
                Puedes descargar el reporte.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {buscarElementos().length > 0 ? (
        <table className="table table-bordered table-striped text-center table-responsive thead-dark">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Bodega</th>
            </tr>
          </thead>
          <tbody>
            {buscarElementos().map((elemento, index) => (
              <tr key={index}>
                <td>{elemento.codigo}</td>
                <td>{elemento.nombre}</td>
                <td>{elemento.cantidad}</td>
                <td>{elemento.categoria}</td>
                <td>{elemento.bodega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
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
    width: "20%",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  tableCell: {
    width: "20%",
    textAlign: "center",
    padding: 5,
  },
});

export default ElementosDesactivados;
