import React from 'react'
import { Button, ButtonGroup } from "@nextui-org/react";

export const ButtonGeneral = ({color, label, onClick}) => {
    return (
        <div>
            <Button color={color} onClick={onClick}>
                <label className='font-semibold'>{label}</label>
            </Button>
        </div>
    )
}
