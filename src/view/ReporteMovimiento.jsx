import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { BiSearch, BiPrinter } from 'react-icons/bi';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const listarMovimientos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/movimientos/listar');
      setMovimientos(response.data.datos);
    } catch (error) {
      console.error("Error al obtener la lista de movimientos:", error);
    }
  };

  useEffect(() => {
    listarMovimientos();
  }, []);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Movimientos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Fecha</Text>
              <Text style={styles.tableHeader}>Usuario</Text>
              <Text style={styles.tableHeader}>Tipo de Movimiento</Text>
            </View>
            {movimientos.map(movimiento => (
              <View style={styles.tableRow} key={movimiento.Código}>
                <Text style={styles.tableCell}>{movimiento.Código}</Text>
                <Text style={styles.tableCell}>{movimiento.Fecha}</Text>
                <Text style={styles.tableCell}>{movimiento.Usuario}</Text>
                <Text style={styles.tableCell}>{movimiento["Tipo Movimiento"]}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => {
    return (
      <PDFDownloadLink document={<MyDocument />} fileName="movimientos.pdf">
        {({ loading }) =>
          loading ? 'Cargando documento...' : 'Descargar Reporte'
        }
      </PDFDownloadLink>
    );
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm || typeof searchTerm === 'undefined') return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };
  

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">Reporte de Movimientos</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar movimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <BiSearch />
            </button>
          </div>
        </div>
        <div className="col d-flex align-items-center">
          <button className="btn btn-primary flex-shrink-0" >
            <BiPrinter /> 
          </button>
          {handlePrint()}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Tipo de Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(movimiento => (
            <tr key={movimiento.Código}>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(movimiento.Codigo.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(movimiento.Fecha) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(movimiento.Usuario) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(movimiento["Tipo Movimiento"]) }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    width: '25%',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    padding: 5,
  },
  tableCell: {
    width: '25%',
    textAlign: 'center',
    padding: 5,
  },
});

export default Movimientos;
