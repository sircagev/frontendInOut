import React, {useState, useEffect} from 'react'
import { Tables } from '../components/Table'
import { Modals } from '../components/Modals'
import axios from 'axios'


export const Elemento = () => {

  const [useElementos, setElementos] = useState([]);
  const [useDesactivar, setDesactivar] = useState([]);
  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseUbicacion, SetUbicacion] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);
    
    
  const listarElementos = async () => {
      await axios.get('http://localhost:3000/elemento/listar')
          .then(response => {
              setElementos(response.data)
          })
  };


  const ListarTipo = async () => {
    try {
        await axios.get('http://localhost:3000/tipo/listar')
            .then(response => {
                SetTipo(response.data)
            })
    } catch {

    }
  }

  const ListarCategorias = async () => {
    try {
        await axios.get('http://localhost:3000/categoria/listar')
            .then(response => {
                setCategorias(response.data)
                
            })
    } catch {

    }
  }

  const Listarubicacion = async () => {
    try {
        await axios.get('http://localhost:3000/ubicacion/listar')
            .then(response => {
                SetUbicacion(response.data)
                
            })
            
            
    } catch {

    }
  }

  const ListarEmpaques = async () => {
    try {
        await axios.get('http://localhost:3000/empaque/listar')
            .then(response => {
                SetEmpaques(response.data)
               
            })
            
            
    } catch {

    }
  }
  
  const ListarMedidas = async () => {
    try {
        await axios.get('http://localhost:3000/medida/listar')
            .then(response => {
                SetMedidas(response.data)
                
            })
            
            
    } catch {

    }
  }
  

  useEffect(() => {
      listarElementos()
      ListarTipo()
      ListarCategorias()
      Listarubicacion()
      ListarEmpaques()
      ListarMedidas()
      
  }, [])

  
  return (
    <div className='w-90% flex flex-col justify-center items-center gap-5'>
      <div className='mt-[50px]'>
        <div>
        <Modals
        listarElementos={listarElementos}
        UseTipo={UseTipo}
        UseCategorias={UseCategorias}
        UseUbicacion={UseUbicacion}
        UseEmpaques={UseEmpaques}
        UseMedidas={UseMedidas}
        useDesactivar={useDesactivar}
        
          />
        </div>
        <Tables
        listarElementos={listarElementos}
        useElementos={useElementos}
        UseTipo={UseTipo}
        UseCategorias={UseCategorias}
        UseUbicacion={UseUbicacion}
        UseEmpaques={UseEmpaques}
        UseMedidas={UseMedidas}
        useDesactivar={useDesactivar}/>
        </div>
    </div>
 )
}
