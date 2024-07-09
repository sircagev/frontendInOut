import React from 'react'
import { Button } from "@nextui-org/react";

export const ButtonRegistrar = ({label}) => {
  return (
    <div>
        <Button className='cursor-pointer' color="success" type="submit">
                <label className='font-bold text-white'>{label}</label>
        </Button>
    </div>
  )
}
