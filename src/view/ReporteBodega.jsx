import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Bodega = () => {
  const [bodegas, setBodegas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const ListarBodegas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bodega/listar');
      setBodegas(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de bodegas:", error);
    }
  };

  useEffect(() => {
    ListarBodegas();
  }, []);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Bodegas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
            </View>
            {bodegas.map(bodega => (
              <View style={styles.tableRow} key={bodega.codigo_Bodega}>
                <Text style={styles.tableCell}>{highlightSearchTerm(bodega.codigo_Bodega.toString())}</Text>
                <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Nombre_bodega)}</Text>
                <Text style={styles.tableCell}>{highlightSearchTerm(bodega.ubicacion)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => {
    return (
    <PDFDownloadLink document={<MyDocument />} fileName="bodegas.pdf">
    {({ loading }) =>
       <button className=" d-flex align-items-center bg-[#3D7948] w-[140px] text-[10] bg-gree h-[40px] rounded font-sans 
       text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 
       focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none
       disabled:opacity-50 disabled:shadow-none font-semibold" onClick={handlePrint}>
         <BiPrinter style={{ marginRight: '5px' }} />
         {loading ? 'Cargando documento...' : 'Descargar Reporte'}
       </button>
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
      <h1 className="text-center mb-4 mt-4">Reporte de Bodegas</h1>

      {/* Barra de búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
          <button className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tl-md rounded-bl-md font-sans 
            text-lg font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] 
            focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
              <BiSearch />
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col d-flex align-items-center ml-5">
          {handlePrint()}
        </div>
      </div>

      {/* Tabla de bodegas */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Cantidad Elementos</th>
          </tr>
        </thead>
        <tbody>
          {bodegas.map(bodega => (
            <tr key={bodega.codigo_Bodega}>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.codigo_Bodega.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Nombre_bodega) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.ubicacion) }}></td>
              <td></td>
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

export default Bodega;
