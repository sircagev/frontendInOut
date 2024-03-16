import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";



export const Tables = () => {

    const [useElementos, setElementos] = useState([]);
    


    const listarElementos = async () => {
        await axios.get('http://localhost:3000/elemento/listar')
            .then(response => {
                setElementos(response.data)
                console.log(response.data)
            })
    };

    

    useEffect(() => {
        listarElementos()
    }, [])


    
    return (
        <div className=''>  
         
            <Table removeWrapper aria-label="Example static collection table">
                <TableHeader style={{}}>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center' }}>Código</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Nombre</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Stock</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Tipo</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Categoría</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Empaque</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Medida</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Ubicación</TableColumn>
                    <TableColumn  style={{fontSize: '16px', backgroundColor: '#39A900', color: '#fff', textAlign: 'center'  }}>Administrar</TableColumn>
                </TableHeader>
                <TableBody style={{ backgroundColor: '#F4F4F5', color: '#000', textAlign: 'center'}}>
                    
                    {useElementos.map(elemento => (
                        <TableRow key={elemento.Codigo_elemento}>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Codigo_elemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_elemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.stock}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.nombre_tipoElemento}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.nombre_categoria}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_empaque}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_Medida}</TableCell>
                            <TableCell style={{fontSize: '15px'}}>{elemento.Nombre_ubicacion}</TableCell>
                            <TableCell style={{ display: 'flex', gap: '5px' }}>
                            <Button color="danger" style={{fontSize: '15px'}}>
                                 Desactivar
                            </Button>  
                            <Button color="primary" style={{fontSize: '15px'}}>
                                Información
                            </Button> 
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}
