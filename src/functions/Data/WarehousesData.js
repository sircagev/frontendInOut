import React from 'react';

const columnsWarehouses = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Creación', uid: 'created_at' },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionElement' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name","status","actionElement"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "activo": 'success',
    "inactivo": 'warning'
}

const searchKeys = ['codigo', 'name', 'status']


export { columnsWarehouses, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };