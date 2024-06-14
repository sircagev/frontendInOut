import React, { useState, useEffect } from 'react';
import axiosClient from '../components/config/axiosClient';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Bodega = () => {
  const [bodegas, setBodegas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/reporte/elementosubicacion');
        setBodegas(response.data); 
      } catch (error) {
        console.error("Error al obtener la información de bodegas:", error);
      }
    };

    fetchData();
  }, []);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Bodegas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Bodega</Text>
              <Text style={styles.tableHeader}>Elemento</Text>
              <Text style={styles.tableHeader}>Código</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Ubicación</Text>
            </View>
            {Object.keys(bodegas).map(bodegaNombre => (
              bodegas[bodegaNombre].map(bodega => (
                <View style={styles.tableRow} key={`${bodegaNombre}_${bodega.Id_elemento}`}>
                  <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Bodega)}</Text>
                  <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Nombre_elemento)}</Text>
                  <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Id_elemento.toString())}</Text>
                  <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Stock  !== undefined ?bodega.Stock: '0')}</Text>
                  <Text style={styles.tableCell}>{highlightSearchTerm(bodega.Nombre_ubicacion)}</Text>
                </View>
              ))
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => (
    <PDFDownloadLink document={<MyDocument />} fileName="bodegas.pdf">
      {({ loading }) =>
        <button
          className="d-flex align-items-center bg-[#3D7948] w-[200px] h-[40px] rounded font-sans text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold"
        >
          <div className="icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
            <BiPrinter style={{ fontSize: '1.5em' }} />
          </div>
          <div className="text-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {loading ? 'Cargando documento...' : 'Descargar Reporte'}
          </div>
        </button>
      }
    </PDFDownloadLink>
  );

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">Reporte de Bodegas</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
            <button
              className="flex justify-center items-center bg-[#3D7948] h-[40px] w-[50px] rounded-tl-md rounded-bl-md font-sans text-lg font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <BiSearch style={{ fontSize: '1em' }} />
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

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Bodega</th>
            <th>Elemento</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(bodegas).map(bodegaNombre => (
            bodegas[bodegaNombre].map(bodega => (
              <tr key={`${bodegaNombre}_${bodega.Id_elemento}`}>
                <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Bodega) }}></td>
                <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Nombre_elemento) }}></td>
                <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Id_elemento.toString()) }}></td>
                <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Stock  !== undefined ?bodega.Stock: '0') }}></td>
                <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(bodega.Nombre_ubicacion) }}></td>
              </tr>
            ))
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
    width: '20%',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    padding: 5,
  },
  tableCell: {
    width: '20%',
    textAlign: 'center',
    padding: 5,
  },
});

export default Bodega;
