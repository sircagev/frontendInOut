import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Usuario = () => {
  const [useUsuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const ListarUsuarios = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/usuario/listar`);
      if (response.data && Array.isArray(response.data.result)) {
        setUsuarios(response.data.result);
      } else {
        console.error("La respuesta de la solicitud GET no contiene un array en la propiedad 'result':", response.data);
        alert("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      console.log("Error al obtener la lista de usuarios:", error);
      alert("Error al obtener la lista de usuarios");
    }
  };

  useEffect(() => {
    ListarUsuarios();
  }, []);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Usuarios</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Id</Text>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Apellido</Text>
              <Text style={styles.tableHeader}>Email</Text>
              <Text style={styles.tableHeader}>Rol</Text>
              <Text style={styles.tableHeader}>Numero</Text>
              <Text style={styles.tableHeader}>Id Ficha</Text>
              <Text style={styles.tableHeader}>Estado</Text>
            </View>
            {useUsuarios.map(user => (
              <View style={styles.tableRow} key={user.id_usuario}>
                <Text style={styles.tableCell}>{user.id_usuario}</Text>
                <Text style={styles.tableCell}>{user.nombre_usuario}</Text>
                <Text style={styles.tableCell}>{user.apellido_usuario}</Text>
                <Text style={styles.tableCell}>{user.email_usuario}</Text>
                <Text style={styles.tableCell}>{user.rol}</Text>
                <Text style={styles.tableCell}>{user.numero}</Text>
                <Text style={styles.tableCell}>{user.Id_ficha}</Text>
                <Text style={styles.tableCell}>{user.Estado}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrint = () => {
    return (
      <PDFDownloadLink document={<MyDocument />} fileName="usuarios.pdf">
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
      <h1 className="text-center mb-4 mt-4">Reporte de Usuarios</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar usuario..."
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
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Número</th>
            <th>Id Ficha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
        {useUsuarios.map(user => (
          <tr key={user.id_usuario}>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.id_usuario.toString()) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.nombre_usuario) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.apellido_usuario) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.email_usuario) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.rol) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.numero.toString()) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.Id_ficha.toString()) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.Estado) }}></td>
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

export default Usuario;
