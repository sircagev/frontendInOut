import React, { useState } from 'react'
import { Button, IconButton, Select, Option } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const PaginationMaterial = ({ activePage, setActivePage, pages, itemsPerPage, setItemsPerPage }) => {

    const buttons = []

    const getItemProps = (index) =>
    ({
        variant: activePage === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActivePage(index),
        className: "rounded-full",
    });

    const next = () => {
        if (activePage === 5) return;

        setActivePage(activePage + 1);
    };

    const prev = () => {
        if (activePage === 1) return;

        setActivePage(activePage - 1);
    };

    for (let i = 1; i <= pages; i++) {
        buttons.push(<IconButton {...getItemProps(i)}>{i}</IconButton>);
    }

    return (
        <div className="w-full flex items-center justify-end gap-4">
            <select
                className='w-[45px] h-[35px] pl-2 border-1 rounded-lg border-[#c3c3c6] text-[14px] font-semibold outline-none'
                onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value))
                    setActivePage(1)
                }}
                value={itemsPerPage}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
            </select>
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={activePage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Anterior
            </Button>
            {buttons}
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={next}
                disabled={activePage === pages || pages === 1}
            >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" /> Siguiente
            </Button>
        </div>
    )
}