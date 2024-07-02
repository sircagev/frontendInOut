import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTable, useFilters } from "react-table";
import MessageNotFound from "./MessageNotFound";
import { BiSearch } from "react-icons/bi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const convertDateFormat = (dateStr) => {
  if (!dateStr) return null; 
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

const ReporteActivos = ({ prestamosa }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const data = useMemo(() => {
    if (!prestamosa?.datos) return [];
    let filteredData = prestamosa.datos;

    if (searchPerformed) {
      filteredData = filteredData.filter((row) => {
        const elementMatches = row.element_name.toLowerCase().includes(searchTerm.toLowerCase());
        const userMatches = row.user_application.toLowerCase().includes(searchTerm.toLowerCase());
        const rowDate = convertDateFormat(row.created_at);
        const dateMatches = (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
        return (elementMatches || userMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [prestamosa, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [

      { Header: "Código", accessor: "element_id" },
      { Header: "Elemento", accessor: "element_name" },
      { Header: "Cantidad", accessor: "quantity" },
      { Header: "Usuario Solicitante", accessor: "user_application" },
      { Header: "Usuario Receptor", accessor: "user_receiving" },
      { Header: "Estado Préstamo", accessor: "loan_status" },
      { Header: "Fecha de Solicitud", accessor: "created_at" },
      { Header: "Fecha de Devolución", accessor: "estimated_return" },
      { Header: "Observaciones", accessor: "remarks" },
    
    ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
  
    worksheet.columns = [

      { header: "Código", key: "element_id", width: 8 },
      { header: "Elemento", key: "element_name", width: 10 },
      { header: "Cantidad", key: "quantity", width: 10 },
      { header: "Usuario Solicitante", key: "user_application", width: 20 },
      { header: "Usuario Receptor", key: "user_receiving", width: 20 },
      { header: "Estado Préstamo", key: "loan_status", width: 20 },
      { header: "Fecha de Solicitud", key: "created_at", width: 20 },
      { header: "Fecha de Devolución", key: "estimated_return", width: 20 },
      { header: "Observaciones", key: "remarks", width: 20 },
    
    ];
  
    data.forEach((row) => {
      worksheet.addRow(row);
    });
   
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte préstamos activos.xlsx");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = 
    useTable({ columns, data }, useFilters);

  const handleSearch = () => {
    setSearchPerformed(true);
    setShowFilters(false); 
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSearchPerformed(false);
    setShowFilters(true); 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="m-2">
      <h2 className="flex justify-center items-center uppercase font-bold mt-2">
        Reporte Préstamos Activos
      </h2>
      {showFilters && (
        <div className="flex p-2 border bg-gray-300 mt-1">
          <div className="flex items-center ml-2 ">
            <label className="mr-2">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border rounded p-1"
            />
          </div>
          <div className="flex items-center ml-4">
            <label className="mr-2">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border rounded p-1"
            />
          </div>
          <div className="flex items-center ml-2">
            <input
              type="text"
              placeholder="Buscar.."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={searchInputRef}
              className="border rounded p-1"
            />
            <div className={`fixed mt-[50px] ml-2 text-xs transition-opacity duration-100 ${searchTerm ? 'opacity-100' : 'opacity-0'}`}>
              <span className="bg-gray-200">Búsqueda por Elemento, Usuario</span>
            </div>
          </div>
          <div className="flex items-center ml-2">
            <div className="text-2xl cursor-pointer rounded-lg bg-gray-400 p-1 hover:bg-gray-500 transition-colors duration-300">
              <BiSearch className="ml-1 text-gray-700 " onClick={handleSearch} />
            </div>
            </div>
        </div>
      )}
      {searchPerformed && data.length > 0 && (
        <div className="flex justify-center items-center p-2 border bg-gray-300 mt-1">
            <div className="p-1 uppercase text-m bg-gray-200">
            <span> resultados encontrados <span className="text-blue-600 bg-gray-200 pr-1">{data.length}</span></span>
            </div>
          <button onClick={handleNewSearch} className="btn btn-primary ml-3 p-1 uppercase text-m">
            Nueva Búsqueda
          </button>
          <button onClick={handleDownload} className="btn btn-secondary ml-3 p-1 uppercase text-m">
            Descargar
          </button>
        </div>
      )}
       {searchPerformed && data.length === 0 && (
        <div className="flex justify-center items-center flex-col p-2">
          <div className="flex justify-center w-full items-center flex-col p-2 border bg-gray-300 mt-1">
            <button onClick={handleNewSearch} className="btn btn-primary p-1 uppercase text-sm">
              Nueva Búsqueda
            </button>
          </div>
          <MessageNotFound />
        </div>
      )}
      {data.length > 0 ? (
        <table
          {...getTableProps()}
          className="table table-bordered table-striped text-center mt-2"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : !searchPerformed && <MessageNotFound />}
    </div>
  );
};

export default ReporteActivos;
