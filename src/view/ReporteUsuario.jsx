import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPrinter, BiSearch } from 'react-icons/bi';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const listarUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuario/listar');
      if (response.data && Array.isArray(response.data.result)) {
        setUsuarios(response.data.result);
      } else {
        console.error("La respuesta de la solicitud GET no contiene un array en la propiedad 'result':", response.data);
        alert('Error al obtener la lista de usuarios');
      }
    } catch (error) {
      console.log('Error al obtener la lista de usuarios:', error);
      alert('Error al obtener la lista de usuarios');
    }
  };

  const buscarUsuarios = () => {
    let filteredUsers = usuarios;
    if (searchTerm.trim() !== '') {
      filteredUsers = usuarios.filter(usuario =>
        Object.values(usuario).some(value =>
          value.toString().toLowerCase() === searchTerm.toLowerCase()
        )
      );
    }
    return filteredUsers;
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  const MyDocument = () => (
    <Document>
      <Page size="A2">
        <View style={styles.page}>
          <Text style={styles.title}>Reporte de Usuarios</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Nombre</Text>              
              <Text style={styles.tableHeader}>Email</Text>
              <Text style={styles.tableHeader}>Rol</Text>
              <Text style={styles.tableHeader}>Teléfono</Text>
              <Text style={styles.tableHeader}>Id Ficha</Text>
              <Text style={styles.tableHeader}>Estado</Text>
              <Text style={styles.tableHeader}>Fecha de registro</Text>
            </View>
            {buscarUsuarios().map(user => (
              <View style={styles.tableRow} key={user.id_usuario}>                
                <Text style={styles.tableCell}>{`${user.nombre_usuario} ${user.apellido_usuario}`}</Text>                
                <Text style={styles.tableCell}>{user.email_usuario}</Text>
                <Text style={styles.tableCell}>{user.rol}</Text>
                <Text style={styles.tableCell}>{user.numero}</Text>
                <Text style={styles.tableCell}>{user.Id_ficha}</Text>
                <Text style={styles.tableCell}>{user.Estado}</Text>
                <Text style={styles.tableCell}>{formatDate(user.fecha_creacion)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const handleSearch = () => {
    setUsuarios(buscarUsuarios());
  };

  const handlePrint = () => (
    <PDFDownloadLink document={<MyDocument />} fileName="usuarios.pdf">
      {({ loading }) => (
        <button className=" d-flex align-items-center bg-[#3D7948] w-[140px] text-[10] bg-gree h-[40px] rounded font-sans 
        text-xs uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-green-500/40 
        focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none
        disabled:opacity-50 disabled:shadow-none font-semibold" onClick={handlePrint}>
          <BiPrinter style={{ marginRight: '5px' }} />
          {loading ? 'Cargando documento...' : 'Descargar Reporte'}
        </button>
      )}
    </PDFDownloadLink>
  );

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
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
      <h1 className="text-center mb-4 mt-4">Reporte de Usuarios</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col">
          <div className="input-group flex-grow-1">
            <button className="flex justify-center items-center middle none center bg-[#3D7948] h-[40px] w-[50px] rounded-tl-md rounded-bl-md font-sans 
            text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] 
            focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={handleSearch}>
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
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Id Ficha</th>
            <th>Estado</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {buscarUsuarios().map(user => (
            <tr key={user.id_usuario}>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(`${user.nombre_usuario} ${user.apellido_usuario}`) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.email_usuario) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.rol) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.numero.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.Id_ficha.toString()) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightSearchTerm(user.Estado) }}></td>
              <td style={{ textAlign: 'center' }}  dangerouslySetInnerHTML={{ __html: highlightSearchTerm(formatDate(user.fecha_creacion)) }}></td>
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
    padding: 50,
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
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    width: '14.2%',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  tableCell: {
    width: '14.2%',
    textAlign: 'center',
    padding: 5,
  },
});

export default Usuario;
