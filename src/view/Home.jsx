import React, { useState } from 'react';

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12; // Número de artículos por página (3 filas de 3 artículos)

  // Datos simulados para los préstamos con URLs de imágenes
  const prestamosData = [
    { nombre: 'Pala', descripcion: 'Perfecta para una amplia gama\n de tareas de jardinería\n y construcción', imagen: '../public/img/pala.jpg' },
    { nombre: 'Artículo 2', descripcion: 'Descripción del artículo 2', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 3', descripcion: 'Descripción del artículo 3', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 4', descripcion: 'Descripción del artículo 4', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 5', descripcion: 'Descripción del artículo 5', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 6', descripcion: 'Descripción del artículo 6', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 7', descripcion: 'Descripción del artículo 7', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 8', descripcion: 'Descripción del artículo 8', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 9', descripcion: 'Descripción del artículo 9', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 10', descripcion: 'Descripción del artículo 10', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 11', descripcion: 'Descripción del artículo 11', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 12', descripcion: 'Descripción del artículo 12', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 13', descripcion: 'Descripción del artículo 9', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 14', descripcion: 'Descripción del artículo 10', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 15', descripcion: 'Descripción del artículo 11', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Artículo 16', descripcion: 'Descripción del artículo 12', imagen: 'https://via.placeholder.com/150' },
  ];

  // Calcular los datos a mostrar en la página actual
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = prestamosData.slice(indexOfFirstArticle, indexOfLastArticle);

  // Número total de páginas
  const totalPages = Math.ceil(prestamosData.length / articlesPerPage);

  // Manejar cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Dividir artículos en filas de 3
  const rows = [];
  for (let i = 0; i < currentArticles.length; i += 4) {
    rows.push(currentArticles.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col space-y-8">
        {rows.map((row, index) => (
          <RowPrestamos key={index} articles={row} />
        ))}
      </div>
      <div className="flex space-x-4 mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function RowPrestamos({ articles }) {
  return (
    <div className="flex justify-center space-x-8">
      {articles.map((article, index) => (
        <PrestamoDeArticulo
          key={index}
          nombre={article.nombre}
          descripcion={article.descripcion}
          imagen={article.imagen}
        />
      ))}
    </div>
  );
}

function PrestamoDeArticulo({ nombre, descripcion, imagen }) {
  return (
    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 shadow-md">
      <div className="w-68 h-40 mb-4">
      <img
        src={imagen}
        alt={nombre}
        className="w-full h-full object-contain rounded-md"
      />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{nombre}</h3>
        <p className="mb-4 description" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{descripcion}</p>
        <div className="flex justify-center space-x-4">
          <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Reservar</button>
          <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
