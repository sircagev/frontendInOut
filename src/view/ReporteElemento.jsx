import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Elemento = () => {
  const [useElementos, setElementos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const ListarElementos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/elemento/listar`);
      if (response && response.data && Array.isArray(response.data)) {
        setElementos(response.data);
      } else {
        console.error("La respuesta del servidor no contiene los datos esperados:", response);
        alert("Error al obtener la lista de elementos: respuesta no válida");
      }
    } catch (error) {
      console.log("Error al obtener la lista de elementos:", error);
      alert("Error al obtener la lista de elementos: " + error.message);
    }
  };
  

  useEffect(() => {
    ListarElementos();
  }, []);

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
              <Text style={styles.tableHeader}>Tipo</Text>
              <Text style={styles.tableHeader}>Categoría</Text>
              <Text style={styles.tableHeader}>Empaque</Text>
              <Text style={styles.tableHeader}>Medida</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
            </View>
            {useElementos.map(elemento => (
              <View style={styles.tableRow} key={elemento.Codigo_elemento}>
                <Text style={styles.tableCell}>{elemento.Codigo_elemento}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_elemento}</Text>
                <Text style={styles.tableCell}>{elemento.stock}</Text>
                <Text style={styles.tableCell}>{elemento.nombre_tipoElemento}</Text>
                <Text style={styles.tableCell}>{elemento.nombre_categoria}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_empaque}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_Medida}</Text>
                <Text style={styles.tableCell}>{elemento.Nombre_ubicacion}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => {
    return (
      <PDFDownloadLink document={<MyDocument />} fileName="elementos.pdf">
        {({ loading }) =>
          loading ? 'Cargando documento...' : 'Descargar Reporte'
        }
      </PDFDownloadLink>
    );
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">Reporte de Elementos</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar elemento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <BiSearch />
            </button>
          </div>
        </div>
        <div className="col d-flex align-items-center ml-5">
          <button className="btn btn-primary flex-shrink-0 mr-2">
            <BiPrinter />
          </button>
          {handlePrint()}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Stok</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Empaque</th>
            <th>Medida</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {useElementos.map(elemento => (
            <tr key={elemento.Codigo_elemento}>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.Codigo_elemento.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.Nombre_elemento) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.stock.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.nombre_tipoElemento) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.nombre_categoria) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.Nombre_empaque) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.Nombre_Medida) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(elemento.Nombre_ubicacion) }}></td>
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
    width: '12.5%',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    padding: 5,
  },
  tableCell: {
    width: '12.5%',
    textAlign: 'center',
    padding: 5,
  },
});

export default Elemento;
