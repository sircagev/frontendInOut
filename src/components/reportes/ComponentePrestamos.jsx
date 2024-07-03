import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTable, useFilters } from "react-table";
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

const ReportePrestamos = ({ prestamos }) => {
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
    if (!prestamos?.datos) return [];
    let filteredData = prestamos.datos;

    if (searchPerformed) {
      filteredData = filteredData.filter((row) => {
        const elementMatches = row.element_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatches = row.loan_status?.toLowerCase().includes(searchTerm.toLowerCase());
        const codeMatches = row.element_id?.toString() === searchTerm.toString();
        const rowDate = convertDateFormat(row.created_at);
        const dateMatches = (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
        return (elementMatches || codeMatches || statusMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [prestamos, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [
      { Header: "Estado", accessor: "loan_status" },
      { Header: "Código", accessor: "element_id" },
      { Header: "Elemento", accessor: "element_name" },
      { Header: "Cantidad", accessor: "quantity" },
      { Header: "Usuario Solicita", accessor: "user_application" },
      { Header: "Usuario Recibe", accessor: "user_receiving" },
      { Header: "Fecha de Solicitud", accessor: "created_at" },
      { Header: "Fecha Vencimiento", accessor: "estimated_return" },
      { Header: "Fecha Devolución", accessor: "actual_return" },
      { Header: "Usuario Devuelve", accessor: "user_returning" },
      { Header: "Observaciones", accessor: "remarks" },
    ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
  
    worksheet.columns = [
      { header: "Estado", key: "loan_status", width: 15 },
      { header: "Código", key: "element_id", width: 8 },
      { header: "Elemento", key: "element_name", width: 20 },
      { header: "Cantidad", key: "quantity", width: 10 },
      { header: "Usuario Solicita", key: "user_application", width: 20 },
      { header: "Usuario Recibe", key: "user_receiving", width: 20 },
      { header: "Fecha de Solicitud", key: "created_at", width: 15 },
      { header: "Fecha Vencimiento", key: "estimated_return", width: 15 },
      { header: "Fecha Devolución", key: "actual_return", width: 15 },
      { header: "Usuario Devuelve", key: "user_returning", width: 20 },
      { header: "Observaciones", key: "remarks", width: 20 },
    ];
  
    const response = await fetch(logoImg);
    const logo = await response.arrayBuffer();
    const imageId = workbook.addImage({
      buffer: logo,
      extension: 'png',
    });
    worksheet.addImage(imageId, 'A1:A2'); 
  
    worksheet.mergeCells('B2:I2');
    worksheet.getCell('B2').value = 'Reporte de Préstamos';
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B2').font = { size: 16, bold: true };
  
    worksheet.mergeCells('B1:I1');
    worksheet.getCell('B1').value = 'INVENTARIO ELEMENTOS INOUT';
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').font = { size: 17, bold: true };
  
    worksheet.mergeCells('J1:K1');
    worksheet.getCell('J1').value = 'ADSO-2644590';
    worksheet.getCell('J1').alignment = { vertical: 'middle', horizontal: 'center' };
   
    const headers = [
"Estado",
"Código",
"Elemento",
"Cantidad",
"Usuario Solicita",
"Usuario Recibe",
"Fecha de Solicitud",
"Fecha Vencimiento",
"Fecha Devolución",
"Usuario Devuelve",
"Observaciones",
    ];
    worksheet.addRow(headers);
  
     headers.forEach((header, index) => {
      const cell = worksheet.getRow(4).getCell(index + 1);
      cell.font = {size: 12, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  
    data.forEach((row) => {
      worksheet.addRow([
        row.loan_status,
        row.element_id,
        row.element_name,
        row.quantity,
        row.user_application,
        row.user_receiving,
        row.created_at,
        row.estimated_return,
        row.actual_return,
        row.user_returning,
        row.remarks,
      ]);
    });
   
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte de prestamos.xlsx");
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
                Búsqueda por Estado, Código, Elemento
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
          Reporte de Préstamos
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
export default ReportePrestamos;
