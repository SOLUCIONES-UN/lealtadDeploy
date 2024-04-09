const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
$(function() {

    $("#ConsultarReferido").click(function() {
        if ($("#FechaInicio").val() !== "" && $("#FechaFin").val() !== "") {
            GetReport();
        } else {
            Alert("Fecha inicial y fecha final es requerida, por favor vuelve a intentarlo.", "error");
        }

    });
});


const getParticipacionesFechasGeneral = (fecha1, fecha2) => {
    // Definimos los datos de la solicitud
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    // Hacemos la solicitud al backend
    fetch(`${url}reporteGeneralReferido/${fecha1}/${fecha2}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos.');
            }
            return response.json();
        })
        .then(datos => {
            // Creamos un conjunto para almacenar los identificadores únicos
            const referidosUnicos = new Set();
            let datosUnicos = [];

            // Combinamos los dos arrays en uno solo
            const datosCombinados = [...datos[0], ...datos[1]];

            // Filtramos los datos para eliminar duplicados
            datosCombinados.forEach(dato => {
                if (!referidosUnicos.has(dato.noReferido)) {
                    referidosUnicos.add(dato.noReferido);
                    datosUnicos.push(dato);
                }
            });

            // Aquí puedes procesar los datos únicos obtenidos
            let tabla = '';
            datosUnicos.forEach((dato, index) => {
                tabla += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${dato.fecha}</td>
                        <td>${dato.codigo}</td>
                        <td>Descripción</td> <!-- Reemplaza esto con la descripción correspondiente -->
                        <td>${dato.nombreReferido}</td>
                        <td>${dato.userno}</td>
                        <td>${dato.noReferido}</td>
                    </tr>
                `;
            });
            $("#TablaReporteReferidos").html(tabla);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Alert('Ha ocurrido un error al obtener los datos.', 'error');
        });
};

$("#ConsultarReferido").click(function() {
    const fecha1 = $("#fecha1").val().trim();
    const fecha2 = $("#fecha2").val().trim();
    if (fecha1 !== '' && fecha2 !== '') {
        getParticipacionesFechasGeneral(fecha1, fecha2);
    } else {
        console.error('Por favor, ingresa ambas fechas.');
    }
});