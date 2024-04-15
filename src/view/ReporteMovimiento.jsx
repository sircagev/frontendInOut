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
      console.log(response.data.datos);
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
              <Text style={styles.tableHeader}>Estado</Text>
              <Text style={styles.tableHeader}>Observación</Text>
            </View>
            {movimientos.map(movimiento => (
              <View style={styles.tableRow} key={movimiento.Codigo}>
                <Text style={styles.tableCell}>{movimiento.Codigo}</Text>
                <Text style={styles.tableCell}>{formatDate(movimiento.Fecha)}</Text>
                <Text style={styles.tableCell}>{movimiento.Usuario_solicitud}</Text>
                <Text style={styles.tableCell}>{movimiento["Nombre_movimiento"]}</Text>
                <Text style={styles.tableCell}>{movimiento.Estado}</Text>
                <Text style={styles.tableCell}>{movimiento["Observaciones"]}</Text>
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
           <button className=" d-flex align-items-center bg-[#3D7948] w-[140px] text-[10] bg-gree h-[40px] rounded font-sans 
           text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 
           focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none
           disabled:opacity-50 disabled:shadow-none font-semibold" >
             <BiPrinter style={{ marginRight: '5px' }} />
             {loading ? 'Cargando documento...' : 'Descargar Reporte'}
           </button>
        }
      </PDFDownloadLink>
    );
  };


  
    //Formato de fecha día/mes/año
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().substr(-2);
      return `${day}/${month}/${year}`;
    };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">Reporte de Movimientos</h1>

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

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Solicitud</th>
            <th>Estado</th>
            <th>Elemento</th>
            <th>Cantidad</th>
            <th>Recibe</th>
            <th>Devolución</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(movimiento => (
            <tr key={movimiento.Codigo}>
              <td dangerouslySetInnerHTML={{ __html: (movimiento.Codigo.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (formatDate(movimiento.Fecha)) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento.Usuario) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento.Estado) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento["fk_elemento"]) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento["cantidad"]) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento["Usuario_recibe"]) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento["Usuario_entrega"]) }}></td>
              <td dangerouslySetInnerHTML={{ __html: (movimiento.Tipo) }}></td>
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
