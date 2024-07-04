import React, { useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Button
} from "@nextui-org/react";
import { capitalize } from "../utils/columnsData";
import { EditIcon } from "./icons/EditIcon";
import { EyeIcon } from "./icons/EyeIcon";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { SearchIcon } from "./icons/SearchIcon";
import Modal1 from "./Modal1";

const NextUITable = ({
    columns,
    rows,
    buttons: Buttons,
    initialColumns,
    statusOptions,
    statusColorMap,
    searchKeys,
    actions: Actions,
    statusOrType
}) => {

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(initialColumns));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "codigo",
        direction: "descending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredRows = [...rows];

        if (sortDescriptor) {
            const { column, direction } = sortDescriptor;
            filteredRows.sort((a, b) => {
                if (a[column] < b[column]) return direction === 'ascending' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            setPage(1)
        }

        if (hasSearchFilter) {
            filteredRows = filteredRows.filter((item) =>
                searchKeys.some((key) =>
                    String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
                )
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredRows = filteredRows.filter((item) =>
                Array.from(statusFilter).includes(item[statusOrType])
            );
        }

        return filteredRows;
    }, [rows, filterValue, statusFilter, searchKeys, sortDescriptor]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    /* const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]); */

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "nombre":
                return (
                    <User
                        /* avatarProps={{ radius: "lg", src: user.avatar }} */
                        description={item.correo}
                        name={cellValue + ' ' + item.apellido}
                    >
                        {item.correo}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{item.team}</p>
                    </div>
                );
            case "tipo":
                return (
                    <Chip className="capitalize" color={statusColorMap[item.tipo]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <Actions codigo={item.codigo}></Actions>
                );
            case "codigo":
                return (
                    <div className="flex flex-col w-full">
                        <p className="text-bold text-sm capitalize text-center">{cellValue}</p>
                    </div>
                )
            case "actionElement":
                return (
                    <div className="flex flex-col w-full">
                        <Actions item={item} />
                    </div>
                )
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
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
                        startContent={<SearchIcon className="text-default-300" />}
                        variant="bordered"
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown classNames={{
                            content: 'border border-green-200 bg-transparent'
                        }}>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="bordered"
                                    color="success"
                                /* style={{backgroundColor: 'red'}} */
                                >
                                    Status
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
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        color="success"
                                        variant="bordered"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown classNames={{
                            content: 'border border-blue-200'
                        }}>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="bordered"
                                    color="primary"
                                >
                                    Columns
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
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Buttons></Buttons>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {filteredItems.length} items</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
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
        rows.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {(rowsPerPage * page) - (rowsPerPage - 1)} - {page === pages ? filteredItems.length : page * rowsPerPage} of {filteredItems.length} items
                </span>


                <div className="hidden sm:flex w-[50%] justify-end gap-2">
                    <Pagination
                        isCompact
                        showControls
                        /* classNames={{
                            cursor: "bg-foreground text-background",
                        }} */
                        color="primary"
                        size="sm"
                        page={page}
                        total={pages}
                        variant="light"
                        onChange={setPage}
                        classNames={{
                            wrapper: "gap-0 overflow-visible h-8 rounded border-divider",
                            item: "w-8 h-8 text-small rounded-none bg-transparent active:bg-gray-500 active:rounded-full",
                            cursor:
                                "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold ",
                        }}
                    />
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Hola mundo"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "h-[350px] overflow-y-auto overflow-x-hidden hidden-scrollbar",
                th: "bg-gray-800 text-white",
                td: "group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-none group-data-[last=true]:last:before:rounded-none",
                tr: "shadow-none"

            }}
            selectedKeys={selectedKeys}

            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            isCompact
            color={"success"}
        >
            <TableHeader columns={headerColumns}
                classNames={{

                }}
            >
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        width={column.uid === "codigo" ? '2opx' : ''}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={items} emptyContent={"No hay movimientos"}>
                {(item) => (
                    <TableRow key={item.codigo}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table >
    )
}

export default NextUITable;