import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTable } from "react-table";
import MessageNotFound from "./MessageNotFound";
import { BiSearch } from "react-icons/bi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logoImg from "../../assets/R.jpg";

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
        const elementMatches = row.element_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const idMatches = row.element_id?.toString() === searchTerm.toString();
        const serialMatches =
          row.batch_serial?.toString() === searchTerm.toString();
        const rowDate = convertDateFormat(row.xpiration_date);
        const dateMatches =
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate);
        return (elementMatches || idMatches || serialMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [elementex, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [
      { Header: "Elemento", accessor: "element_name" },
      { Header: "Código", accessor: "element_id" },
      { Header: "Stock", accessor: "stock" },
      { Header: "Categoría", accessor: "category" },
      { Header: "Tipo", accessor: "element_type" },
      { Header: "Medida", accessor: "measurement_unit" },
      { Header: "Lote", accessor: "batch_serial" },
      { Header: "Fecha Expiración", accessor: "expiration_date" },
      { Header: "Bodega", accessor: "warehouse" },
      { Header: "Ubicación", accessor: "wlocation" },
    ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    worksheet.columns = [
      { header: "Código", key: "element_id", width: 12 },
      { header: "Elemento", key: "element_name", width: 20 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Categoría", key: "category", width: 15 },
      { header: "Tipo", key: "element_type", width: 20 },
      { header: "Medida", key: "measurement_unit", width: 15 },
      { header: "Lote", key: "batch_serial", width: 10 },
      { header: "Fecha Expiración", key: "expiration_date", width: 15 },
      { header: "Bodega", key: "warehouse", width: 15 },
      { header: "Ubicación", key: "wlocation", width: 15 },
    ];

  const response = await fetch(logoImg);
  const logo = await response.arrayBuffer();
  const imageId = workbook.addImage({
    buffer: logo,
    extension: 'png',
  });
  worksheet.addImage(imageId, 'A1:A2'); 

  worksheet.mergeCells('B2:H2');
  worksheet.getCell('B2').value = 'Reporte de Elementos Expirados';
  worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('B2').font = { size: 16, bold: true };

  worksheet.mergeCells('B1:H1');
  worksheet.getCell('B1').value = 'INVENTARIO ELEMENTOS INOUT';
  worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('B1').font = { size: 17, bold: true };

  worksheet.mergeCells('I1:J1');
  worksheet.getCell('I1').value = 'ADSO-2644590';
  worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
 
  const headers = [
    "Código",
    "Elemento",
    "Stock",
    "Categoría",
    "Tipo",
    "Medida",
    "Lote",
    "Fecha Expiración",
    "Bodega",
    "Ubicación"
  ];
  worksheet.addRow(headers);

   headers.forEach((header, index) => {
    const cell = worksheet.getRow(4).getCell(index + 1);
    cell.font = {size: 12, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  data.forEach((row) => {
    worksheet.addRow([
      row.element_id,
      row.element_name,
      row.stock,
      row.category,
      row.element_type,
      row.measurement_unit,
      row.batch_serial,
      row.expiration_date,
      row.warehouse,
      row.wlocation,
    ]);
  });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
      {showFilters && (
        <div className="flex justify-between items-center p-2 border rounded-xl bg-gray-300 mt-1" 
        style={{background: 'linear-gradient(to right, #f0f0f0 70%, #cccccc 100%)',}}>
          <div className="flex items-center">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                ref={searchInputRef}
                className="border rounded p-1"
              />
              <div
                className={`fixed mt-[50px] ml-2 text-xs transition-opacity duration-100 ${
                  searchTerm ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="bg-gray-200 z-20">
                  Búsqueda por Código, Elemento
                </span>
              </div>
            </div>
            <div className="flex items-center ml-2">
              <div className="text-2xl cursor-pointer rounded-lg bg-gray-400 p-1 hover:bg-gray-500 transition-colors duration-300">
                <BiSearch
                  className="ml-1 text-gray-700"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
          <h2 className="uppercase font-semibold mr-4">
            Reporte Elementos Expirados
          </h2>
        </div>
      )}
      {searchPerformed && data.length > 0 && (
        <div
          className="flex justify-center items-center p-2 rounded-xl border bg-gray-300 mt-1"
          style={{background: 'linear-gradient(to right, #f0f0f0 20%, #cccccc 50%, #f0f0f0 80%)',}}
        >
          <div className="p-1 uppercase rounded text-m bg-gray-200">
            <span>
              {" "}
              resultados encontrados{" "}
              <span className="text-blue-600 bg-gray-200 pr-1">
                {data.length}
              </span>
            </span>
          </div>
          <button
            onClick={handleNewSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white border font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
          >
            Nueva Búsqueda
          </button>
          <button
            onClick={handleDownload}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
          >
            Descargar
          </button>
        </div>
      )}
      {searchPerformed && data.length === 0 && (
        <div className="flex justify-center items-center flex-col p-2">
          <div
            className="flex justify-center rounded-xl w-full items-center flex-col p-2 bg-gray-300 mt-1"
            style={{
              background: "linear-gradient(to left, #f1f1f1, #bbbbbb)",
            }}
          >
            <button
              onClick={handleNewSearch}
              className="bg-blue-500 hover:bg-blue-700 text-white border font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
            >
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
          style={{
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead className="bg-gray-800">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
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
      ) : (
        !searchPerformed && <MessageNotFound />
      )}
    </div>
  );
};

export default ReporteExpirados;
