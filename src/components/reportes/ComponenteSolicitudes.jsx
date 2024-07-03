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

const ReporteSolicitudes = ({ solicitudes }) => {
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
    if (!solicitudes?.datos) return [];
    let filteredData = solicitudes.datos;

    if (searchPerformed) {
      filteredData = filteredData.filter((row) => {
        const idMatches = row.user_id?.toString() === searchTerm.toString();
        const rolMatches = row.role_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const rowDate = convertDateFormat(row.created_at);
        const dateMatches = (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
        return (idMatches || rolMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [solicitudes, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [
      { Header: "Rol", accessor: "role_name" },
      { Header: "Usuario Solicitante", accessor: "user_applicant" },
      { Header: "Identificación", accessor: "user_id" },
      { Header: "ID Ficha", accessor: "course_id" },
      { Header: "Elemento", accessor: "element_name" },
      { Header: "Código Elemento", accessor: "element_id" },
      { Header: "Fecha de Solicitud", accessor: "created_at" },
      { Header: "Fecha de Devolución", accessor: "actual_return" },
      { Header: "Usuario que Recibe", accessor: "user_receiving" },
    ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
  
    worksheet.columns = [
      { header: "Rol", key: "role_name", width: 15 },
      { header: "Usuario Solicitante", key: "user_applicant", width: 20 },
      { header: "Identificación", key: "user_id", width: 20 },
      { header: "ID Ficha", key: "course_id", width: 10 },
      { header: "Elemento", key: "element_name", width: 20 },
      { header: "Código Elemento", key: "element_id", width: 20 },
      { header: "Fecha de Solicitud", key: "created_at", width: 20 },
      { header: "Fecha de Devolución", key: "actual_return", width: 20 },
      { header: "Usuario que Recibe", key: "user_receiving", width: 20 },
    ];
  
    const response = await fetch(logoImg);
    const logo = await response.arrayBuffer();
    const imageId = workbook.addImage({
      buffer: logo,
      extension: 'png',
    });
    worksheet.addImage(imageId, 'A1:A2'); 
  
    worksheet.mergeCells('B2:G2');
    worksheet.getCell('B2').value = 'Reporte de Solicitudes';
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B2').font = { size: 16, bold: true };
  
    worksheet.mergeCells('B1:G1');
    worksheet.getCell('B1').value = 'INVENTARIO ELEMENTOS INOUT';
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').font = { size: 17, bold: true };
  
    worksheet.mergeCells('H1:I1');
    worksheet.getCell('H1').value = 'ADSO-2644590';
    worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
   
    const headers = [
"Rol",
"Usuario Solicitante",
"Identificación",
"ID Ficha",
"Elemento",
"Código Elemento",
"Fecha de Solicitud",
"Fecha de Devolución",
"Usuario que Recibe",
    ];
    worksheet.addRow(headers);
  
     headers.forEach((header, index) => {
      const cell = worksheet.getRow(4).getCell(index + 1);
      cell.font = {size: 12, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  
    data.forEach((row) => {
      worksheet.addRow([
        row.role_name,
        row.user_applicant,
        row.user_id,
        row.course_id,
        row.element_name,
        row.element_id,
        row.created_at,
        row.actual_return,
        row.user_receiving,
      ]);
    });
   
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte solicitudes.xlsx");
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
                Búsqueda por Rol, Identificación
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
          Reporte de Solicitudes
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

export default ReporteSolicitudes;
