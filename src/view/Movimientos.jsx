import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";

//Iconos
import { FaSearch, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

export const Movimientos = () => {

    const movementTypeOptions = [
        { name: "Ingreso", uid: "ingreso" },
        { name: "Egreso", uid: "egreso" },
        { name: "Prestamo", uid: "prestamo" },
    ];

    const [movimientos, setMovimientos] = useState([]);
    const [keysColumns, setKeysColumns] = useState([]);

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(keysColumns));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const pages = Math.ceil(movimientos.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return keysColumns;

        return keysColumns.filter((column) => Array.from(visibleColumns).includes(column));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredMovements = [...movimientos];

        if (hasSearchFilter) {
            filteredMovements = filteredMovements.filter((movimiento) =>
                movimiento.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredMovements = filteredMovements.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredMovements;
    }, [movimientos, filterValue, statusFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          const cmp = first < second ? -1 : first > second ? 1 : 0;
    
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
      }, [sortDescriptor, items]);

    

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const ListarMovimientos = async () => {
        try {
            await axios.get('http://localhost:3000/movimientos/listar')
                .then(response => {
                    const keysInfo = Object.keys(response.data.datos[0])
                    setMovimientos(response.data.datos)
                    console.log(keysInfo)
                    setKeysColumns(keysInfo)
                })
        } catch (error) {

        }
    }

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    useEffect(() => {
        ListarMovimientos();
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<FaSearch className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<IoIosArrowDown className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {movementTypeOptions.map((movementType) => (
                                    <DropdownItem key={movementType.uid} className="capitalize">
                                        {capitalize(movementType.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<IoIosArrowDown className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {keysColumns.map((column) => (
                                    <DropdownItem key={column} className="capitalize">
                                        {capitalize(column)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="bg-foreground text-background"
                            endContent={<FaPlus />}
                            size="sm"
                        >
                            Realizar Movimiento
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {movimientos.length} Movimientos</span>
                    <label className="flex items-center text-default-400 text-small">
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        movimientos.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        )
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
            ],
        }),
        [],
    );

    return (
        <>
        </>
    )
}
