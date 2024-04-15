import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const DesactivarElemento = ({ codigoElemento, listarElementos }) => {

  const desactivarElemento = async (Codigo_elemento, estado) => {
    let mensaje;

    if (estado === 'Activo') {
        mensaje = "¿Desea desactivar la categoría?";
    } else if (estado === 'Inactivo') {
        mensaje = "¿Desea reactivar la categoría?";
    }
    await swal({
        title: "¿Está seguro?",
        text: mensaje,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then(async (willDesactivar) => {
        if (willDesactivar) {
            await axios.put(`http://localhost:3000/elemento/desactivar/${Codigo_elemento}`)
                .then(response => {
                    listarElementos(); // Llamar a la función para actualizar la lista de elementos
                    swal("¡Se ha actualizado el estado correctamente!", {
                        icon: "success",
                        button: false,
                        timer: 2000,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            swal("La ubicación está segura.");
        }
    });
  };

  return (
    <Button color="danger" className="text-white font-semibold" onClick={() => desactivarElemento(codigoElemento)}>Desactivar</Button>
  );
};

export default DesactivarElemento;
