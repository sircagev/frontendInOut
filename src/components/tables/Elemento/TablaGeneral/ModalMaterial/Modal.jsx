import React, { useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";

export const Modal = ({ title }) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    return (
        <>
            <Button onClick={handleOpen}>{title}</Button>
            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Realizar Préstamo
                        </Typography>
                        <div>
                            <Typography className="mb-1" variant="h6">
                                Usuario
                            </Typography>
                            <Input label="Usuario" size="lg" />
                        </div>
                        <Typography
                            className="mb-1 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Ingrese la información del elemento a prestar
                        </Typography>
                        <div className="w-full flex h-auto gap-3">
                            <div className="flex flex-col w-[50%]">
                                <Typography className="mb-1" variant="h6">
                                    Elemento
                                </Typography>
                                <Input label="Elemento" size="lg" />
                            </div>
                            <div className="flex flex-col w-[50%]">
                                <Typography className="mb-1" variant="h6">
                                    Cantidad
                                </Typography>
                                <Input label="Cantidad" size="lg" type="number" />
                            </div>

                        </div>

                    </CardBody>
                    <CardFooter className="pt-0 gap-3 flex justify-center items-center">
                        <Button variant="gradient" onClick='' className="w-[75%]" >
                            Realizar Préstamo
                        </Button>
                        <Button variant="gradient" onClick={handleOpen} className="w-[75%]" >
                            Cerrar
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    )
}
