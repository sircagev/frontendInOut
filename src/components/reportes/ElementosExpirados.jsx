import React, { useState, useMemo, useRef, useEffect } from "react";
import MessageNotFound from "./MessageNotFound";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell,Input,Button,DropdownTrigger,Dropdown,DropdownMenu,DropdownItem,Chip,Pagination,} from "@nextui-org/react";
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
        const elementMatches = row.element_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatches = row.element_id?.toString().includes(searchTerm.toString());
        const serialMatches = row.batch_serial?.toString().includes(searchTerm.toString());
        const rowDate = convertDateFormat(row.expiration_date);
        const dateMatches =
          (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
        return (elementMatches || idMatches || serialMatches) && dateMatches;
      });
    }

    return filteredData;
  }, [elementex, searchTerm, startDate, endDate, searchPerformed]);

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
      { header: "Ubicación", key: "wlocation", width: 15 },
    ];

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Reporte_elementos_expirados.xlsx");
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

  return (
    <div className="m-2">
     
      {showFilters && (
        <div className="flex justify-between items-center p-2 border rounded-xl bg-gray-300 mt-1">
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
              <span className="bg-gray-200 z-20">Búsqueda por Código, Elemento</span>
            </div>
          </div>
          <div className="flex items-center ml-2">
            <div className="text-2xl cursor-pointer rounded-lg bg-gray-400 p-1 hover:bg-gray-500 transition-colors duration-300">
              <BiSearch className="ml-1 text-gray-700" onClick={handleSearch} />
            </div>
          </div>
        </div>
        <h2 className="uppercase font-semibold mr-4">Reporte Elementos Expirados</h2>
      </div>
      
      )}
      {searchPerformed && data.length > 0 && (
        <div className="flex justify-center items-center p-2 rounded-xl border bg-gray-300 mt-1">
        <div className="p-1 uppercase rounded text-m bg-gray-200">
          <span>
            {" "}
            resultados encontrados{" "}
            <span className="text-blue-600 bg-gray-200 pr-1">{data.length}</span>
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
          <div className="flex justify-center w-full items-center rounded-xl flex-col p-2 border bg-gray-300 mt-1">
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
        <Table className="top-2" aria-label="Reporte de Elementos Expirados" emptyContent={"No se encontraron elementos expirados"}>
          <TableHeader >
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Código</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Elemento</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Stock</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Categoría</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Tipo</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Medida</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Lote</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Fecha Expiración</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Bodega</TableColumn>
            <TableColumn className="bg-gray-200 text-gray-700 text-center font-bold uppercase p-2">Ubicación</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{row.element_id}</TableCell>
                <TableCell>{row.element_name}</TableCell>
                <TableCell className="text-center">{row.stock}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.element_type}</TableCell>
                <TableCell>{row.measurement_unit}</TableCell>
                <TableCell className="text-center">{row.batch_serial}</TableCell>
                <TableCell className="text-center">{row.expiration_date}</TableCell>
                <TableCell>{row.warehouse}</TableCell>
                <TableCell>{row.wlocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !searchPerformed && <MessageNotFound />
      )}
    </div>
  );
};

export default ReporteExpirados;
