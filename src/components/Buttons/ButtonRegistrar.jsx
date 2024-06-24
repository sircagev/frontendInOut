import React from 'react'
import { Button } from "@nextui-org/react";

export const ButtonRegistrar = () => {
  return (
    <div>
        <Button className='cursor-pointer' color="success" type="submit">
                <label className='font-bold text-white'>Registrar</label>
        </Button>
    </div>
  )
}
