import React from 'react'
import { Button, ButtonGroup } from "@nextui-org/react";

export const ButtonGeneral = ({color, label, onClick, type}) => {
    return (
        <div>
            <Button className='cursor-pointer' color="success" onClick={onClick} type={type}>
                <label className='font-bold text-white'>{label}</label>
            </Button>
        </div>
    )
}
