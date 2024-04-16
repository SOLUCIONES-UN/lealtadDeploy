const url = "http://localhost:3000/";
let token = localStorage.getItem("token");





$(function() {
    $("#ConsultarReferido").click(function() {
        const fecha1 = $("#fecha1").val().trim();
        const fecha2 = $("#fecha2").val().trim();
        if (fecha1 !== '' && fecha2 !== '') {
            getParticipacionesFechasGeneral(fecha1, fecha2);
        } else {
            console.error('Por favor, ingresa ambas fechas.');
        }
    });
});

const getParticipacionesFechasGeneral = (fecha1, fecha2) => {
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    fetch(`${url}reporteGeneralReferido/${fecha1}/${fecha2}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos.');
            }
            return response.json();
        })
        .then(datos => {
            // Mostrar los botones y la tabla
            $("#MostrarTabla").show();
            $("#excel").show();
            $(".card-datatable").show();

            // Mostrar la tabla solo después de hacer clic en el botón "Mostrar Tabla"
            $("#MostrarTabla").click(function() {
                mostrarDatosEnTabla(datos);
            });
            $("#excel").click(function() {
                generarExcel(datos);
            });
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Alert('Ha ocurrido un error al obtener los datos.', 'error');
        });
};

const mostrarDatosEnTabla = (datos) => {
    let tabla = '';
    // Iteramos sobre cada conjunto de datos recibidos
    datos.forEach(array => {
        array.forEach(dato => {
            tabla += `
                <tr>
                    <td>${dato.userno}</td>
                    <td>${dato.nombreReferidor}</td>
                    <td>${dato.codigo}</td>
                    <td>${dato.noReferido}</td>
                    <td>${dato.nombreReferido}</td>
                    <td>${dato.fecha}</td>
                </tr>
            `;
        });
    });
    // Insertamos las filas en la tabla
    $("#TablaReporteReferidos").html(tabla);
};



// const generarExcel = (datos) => {
//     // Crear una hoja de trabajo
//     const wb = XLSX.utils.book_new();
//     // Convertir los datos de la tabla en una matriz
//     const data = [
//         ['Reporte General de Referidos'],
//         ['NUMERO DE TELÉFONO', 'Nombre Referidor', 'CÓDIGO REFERIDO', 'NUMERO DE REFERIDO', 'Nombre de referido', 'FECHA Y HORA']
//     ];
//     datos.forEach(array => {
//         array.forEach(dato => {
//             data.push([dato.userno, dato.nombreReferidor, dato.codigo, dato.noReferido, dato.nombreReferido, dato.fecha]);
//         });
//     });
//     // Crear una hoja de cálculo
//     const ws = XLSX.utils.aoa_to_sheet(data);
//     // Agregar la hoja de cálculo al libro de trabajo
//     XLSX.utils.book_append_sheet(wb, ws, 'Reporte Referidos');
//     // Convertir el libro de trabajo a un archivo de Excel
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
//     // Descargar el archivo Excel
//     saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Reporte_Referidos.xlsx');
// };
// // Función auxiliar para convertir datos en binario
// const s2ab = (s) => {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//     return buf;
// };


const generarExcel = (datos) => {
    // Crear una hoja de trabajo
    const wb = XLSX.utils.book_new();
    // Convertir los datos de la tabla en una matriz
    const data = [];
    datos.forEach(obj => {
        const row = [];
        row.push(obj.userno, obj.nombreReferidor, obj.codigo, obj.noReferido, obj.nombreReferido, obj.fecha);
        data.push(row);
    });
    // Agregar el encabezado
    const header = ['NUMERO DE TELÉFONO', 'Nombre Referidor', 'CÓDIGO REFERIDO', 'NUMERO DE REFERIDO', 'Nombre de referido', 'FECHA Y HORA'];
    data.unshift(['Reporte General de Referidos'], header);
    // Crear una hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Establecer colores para las columnas del encabezado
    const columnColors = [
        { index: header.indexOf('NUMERO DE TELÉFONO'), color: '808080' },
        { index: header.indexOf('Nombre Referidor'), color: '808080' },
        { index: header.indexOf('CÓDIGO REFERIDO'), color: '808080' },
        { index: header.indexOf('NUMERO DE REFERIDO'), color: '808080' },
        { index: header.indexOf('Nombre de referido'), color: '808080' },
        { index: header.indexOf('FECHA Y HORA'), color: '808080' }
    ];
    columnColors.forEach(item => {
        const cellRef = XLSX.utils.encode_cell({ r: 1, c: item.index });
        if (!ws[cellRef].s) {
            ws[cellRef].s = { fill: { fgColor: { rgb: item.color } } };
        } else {
            ws[cellRef].s.fill = { fgColor: { rgb: item.color } };
        }
    });

    // Agregar la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Referidos');
    // Convertir el libro de trabajo a un archivo de Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    // Descargar el archivo Excel
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Reporte_Referidos.xlsx');
};

// Función auxiliar para convertir datos en binario
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
};





$("#MostrarTabla").click(function() {
    const fecha1 = $("#fecha1").val().trim();
    const fecha2 = $("#fecha2").val().trim();
    if (fecha1 !== '' && fecha2 !== '') {
        getParticipacionesFechasGeneral(fecha1, fecha2);
    } else {
        console.error('Por favor, ingresa ambas fechas.');
    }
});