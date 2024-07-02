import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTable } from "react-table";
import MessageNotFound from "./MessageNotFound";
import { BiSearch } from "react-icons/bi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const convertDateFormat = (dateStr) => {
   if (!dateStr) return null; 
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

const ReporteExpirados = ({ elementex }) => {
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
    if (!elementex?.datos) return [];
    let filteredData = elementex.datos;

    if (searchPerformed) {
      filteredData = filteredData.filter((row) => {
        const elementMatches = row.element_name.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatches = row.element_id.toString().includes(searchTerm.toString());
        const rowFechaVencimiento = convertDateFormat(row.xpiration_date);
        const dateMatches = (!startDate || rowFechaVencimiento >= startDate) && (!endDate || rowFechaVencimiento <= endDate);
        return (elementMatches || idMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [elementex, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [
        { Header: "Código", accessor: "element_id" },
        { Header: "Elemento", accessor: "element_name" },
        { Header: "Stock", accessor: "stock" },
        { Header: "Categoría", accessor: "category" },
        { Header: "Tipo", accessor: "element_type" },
        { Header: "Medida", accessor: "measurement_unit" },
        { Header: "Lote", accessor: "batch_serial" },
        { Header: "Fecha Expiración", accessor: "expiration_date" },
        { Header: "Bodega", accessor: "warehouse" },
        { Header: "Ubicación", accessor: "wlocation" }
      ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");
  
    worksheet.columns = [
      { header: "Elemento", key: "element_name", width: 20 },
      { header: "Código", key: "element_id", width: 8 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Categoría", key: "category", width: 15 },
      { header: "Tipo", key: "element_type", width: 20 },
      { header: "Medida", key: "measurement_unit", width: 15 },
      { header: "Lote", key: "batch_serial", width: 10 },
      { header: "Fecha Expiración", key: "expiration_date", width: 15 },
      { header: "Bodega", key: "warehouse", width: 15 },
      { header: "Ubicación", key: "wlocation", width: 15 }
    ]
    ;
  
    data.forEach((row) => {
      worksheet.addRow(row);
    });
   
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte elementos expirados.xlsx");
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

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
        Reporte Elementos Expirados
      </h2>
      {showFilters && (
        <div className="flex p-2 border bg-gray-300 mt-1">
          <div className="flex items-center ml-2">
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
              <span className="bg-gray-200">Búsqueda por Código, Elemento</span>
            </div>
          </div>
          <div className="flex items-center ml-2">
            <div className="text-2xl cursor-pointer rounded-lg bg-gray-400 p-1 hover:bg-gray-500 transition-colors duration-300">
                <BiSearch className="ml-1 text-gray-700" onClick={handleSearch} />
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

export default ReporteExpirados;
