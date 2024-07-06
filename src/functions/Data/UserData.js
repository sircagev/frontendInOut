import React from 'react';

const columnsUsers = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'user_name', sortable: true },
    { name: 'Apellido', uid: 'lastname' },
    { name: 'Telefono', uid: 'phone' },
    { name: 'Email', uid: 'email' },
    { name: 'Identificación', uid: 'identification' },
    { name: 'Id Ficha', uid: 'course_id' },
    { name: 'Rol', uid: 'role_name' },
    { name: 'Cargo', uid: 'position_name' },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionUser' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "user_name", "lastname", "phone", "email", "identification", "course_id", "role_name", "position_name", "status", "actionUser"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "activo": 'success',
    "inactivo": 'warning'
}

const searchKeys = ['codigo', 'user_name', 'identification']


export { columnsUsers, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };