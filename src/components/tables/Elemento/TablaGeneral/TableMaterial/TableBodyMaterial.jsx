export const TableBodyMaterial = ({ data }) => {

    const cambiarFecha = (fecha) => {
        const NewFecha = new Date(fecha);
        if (isNaN(NewFecha.getTime())) {
            return 'Fecha inválida';
        }
        return NewFecha.toLocaleDateString();
    }

    return (
        <tbody className="max-h-[320px] overflow-y-auto">
            {data.map((datum) => (
                <tr key={datum.Codigo}>
                    <td className="px-3 border-b border-blue-gray-50">
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 text-center">
                            {datum.Codigo}
                        </p>
                    </td>
                    <td className="px-3 border-b border-blue-gray-50">
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {cambiarFecha(datum.Fecha)}
                        </p>
                    </td>
                    <td className="px-3 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 p-1 border rounded-md h-9 border-blue-gray-50">
                                <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/visa.png"
                                    alt="visa"
                                    className="relative inline-block h-full w-full !rounded-none  object-contain object-center p-1" />
                            </div>
                            <div className="flex flex-col">
                                <p
                                    className="block font-sans text-sm antialiased font-normal leading-normal capitalize text-blue-gray-900">
                                    {datum.Usuario + " " + datum.Apellido}
                                </p>
                                <p
                                    className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                                    {datum.Correo}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="px-3 border-b border-blue-gray-50">
                        <p className={`block font-sans text-sm antialiased leading-normal uppercase font-semibold 
                        ${datum.Tipo === "Prestamo"
                                ? "text-yellow-700"
                                : datum.Tipo === "Ingreso"
                                    ? "text-green-700"
                                    : datum.Tipo === "Egreso"
                                        ? "text-red-700"
                                        : "text-blue-gray-900"}`}>
                            {datum.Tipo}
                        </p>
                    </td>


                    <td className="px-3 border-b border-blue-gray-50">
                        <div className="w-max">

                            <div
                                className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap  
                                    ${datum.Estado === "En espera" || datum.Estado === "En Prestamo"
                                        ? "text-yellow-900 bg-yellow-500/20"
                                        : datum.Estado === "Confirmada" || datum.Estado === "Finalizada"
                                            ? "text-green-900 bg-green-500/20"
                                            : "text-red-900 bg-red-500/20"}`}>
                                <span className="">{datum.Estado}</span>
                            </div>

                        </div>
                    </td>
                    <td className="py-[10px] border-b border-blue-gray-50">
                        <button
                            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                    className="w-4 h-4">
                                    <path
                                        d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                    </path>
                                </svg>
                            </span>
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
