const url = "http://localhost:3000/";
let tokenReportA = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos
let archivadas = 0;
$(function() {
    getCampanias();
    $("#btnDescargarExcel, #PantallaInfo").hide(); // Ocultar botones al inicio

    // Inicializar el plugin multiple-select
    $('#selecCampania').multipleSelect({
        filter: true,
        selectAll: true, // Habilitar la opción de seleccionar todos los elementos
        placeholder: "Elige una promoción",
    });

    // Eventos para el modal New
    $('#modalNew').on('hidden.bs.modal', function() {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });




    // Evento para el botón de cerrar el modal New
    $('#modalNew').find('[data-dismiss="modal"]').click(function() {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });


    $("#ConsultarPromo").on("click", function() {
        if (
            $("#selecCampania").val() !== null && // Verificar si se ha seleccionado al menos una opción
            $("#selecCampania").val().length > 0 && // Verificar si se ha seleccionado al menos una opción
            $("#FechaInicio").val() !== "" &&
            $("#FechaFin").val() !== "" &&
            $("#checkbox").val() !== ""
        ) {
            getReport();
        } else {
            Alert("Debe llenar todos los campos", "error");
        }
    });

    $("#PantallaInfo").on("click", function() {
        if (datosObtenidos) {
            mostrarDatosEnTabla(datosObtenidos);
        } else {
            Alert("Primero debes obtener los datos", "error");
        }
    });

    // Agregar evento de escucha al checkbox
    $("#checkboxArchivadas").on("change", function() {
        // Obtener el valor del checkbox
        archivadas = this.checked ? 1 : 0;
        // Llamar a la función getReport con el valor del checkbox como parámetro

    });
});

const getCampanias = () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { Authorization: tokenReportA },
    };

    fetch(`${url}Campania`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Campania obtenidas:", result);
            // Limpiar el select antes de agregar opciones
            $("#selecCampania").empty();
            // Agregar la opción por defecto
            // $("#selectpromo").append(
            //   "<option disabled selected value='0'>Elige una promoción</option>"
            // );

            result.forEach((element) => {
                // Agregar opciones al select
                $("#selecCampania").append(
                    // '<option value="' + element.id + '">' + element.nombre + "</option>"
                    `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
                );
            });
            // Actualizar el select múltiple después de agregar opciones
            $('#selecCampania').multipleSelect('refresh');
        })
        .catch((error) => {
            console.error("Error al obtener Campania:", error);
            alert(error, "error");
        });
};


function mostrarOcultarSelectDia() {
    var selectConfiguracion = document.getElementById("seleccionConfiguracion");
    var selectDiaContainer = document.getElementById("selectDiaContainer");

    if (selectConfiguracion.value === "semana") {
        selectDiaContainer.style.display = "block";
    } else {
        selectDiaContainer.style.display = "none";
    }
}



function mostrarOcultarSelectDiaMes() {
    var selectConfiguracion = document.getElementById("seleccionConfiguracion");
    var selectDiaMesContainer = document.getElementById("selectDiaMesContainer");
    var selectDiaMes = document.getElementById("selectDiaMes");

    if (selectConfiguracion.value === "mes") {
        selectDiaMesContainer.style.display = "block";
        // Limpiar el select antes de agregar opciones
        selectDiaMes.innerHTML = "";
        // Agregar opciones del 1 al 30
        for (var i = 1; i <= 30; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            selectDiaMes.appendChild(option);
        }
    } else {
        selectDiaMesContainer.style.display = "none";
    }
}

$(function() {
    // Otro código que puedas tener...

    // Llama a la función mostrarOcultarSelectDiaMes cuando cambie el valor del primer select
    $('#seleccionConfiguracion').change(function() {
        mostrarOcultarSelectDiaMes();
    });
});












const getReport = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        idCampanas: $("#selecCampania").val(),
        fecha1: $("#FechaInicio").val(),
        fecha2: $("#FechaFin").val(),
        archivadas: archivadas


    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(url + "reporteOfferCraft", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Datos del informe de oferCraft:", result);
            datosObtenidos = result;
            $("#btnDescargarExcel, #PantallaInfo").show(); // Mostrar botones después de obtener los datos
        })
        .catch((error) => {
            console.error("Error al obtener el informe de oferCraft:", error);
            alert(error, "error");
        });
};


function mostrarDatosEnTabla(datos) {
    console.log("Datos para mostrar en la tabla:", datos);
    $("#TablaReportePromo").empty();
    if ($.fn.dataTable.isDataTable('.datatables-basic')) {
        $('.datatables-basic').DataTable().destroy();
    }
    let tabla = '';
    datos.forEach((element) => {
        element.participaciones.forEach((participacion) => {
            const fecha = formatearFechaHora(participacion.fecha);
            const telefono = participacion.customerInfo ? participacion.customerInfo.telno : "Desconocido";
            const descripcionTrx = participacion.descripcionTrx || "Sin descripción";
            const valor = participacion.valor || "Sin valor";
            const nombre = participacion.customerInfo ? participacion.customerInfo.fname : "Sin nombre";
            const codigo = participacion.customerInfo ? participacion.customerInfo.customer_reference : "Sin código";
            const nombreCampania = participacion.campanium ? participacion.campanium.nombre : "Sin campaña";
            const fechaCreacion = participacion.campanium ? participacion.campanium.fechaCreacion : "Sin fecha";
            const premioDescripcion = participacion.premioDescripcion || "Sin premio";
            const premioMonto = participacion.detallepromocion && participacion.detallepromocion.premiopromocion ? parseFloat(participacion.detallepromocion.premiopromocion.valor).toFixed(2) : "0.00";
            const cupon = participacion.detallepromocion ? participacion.detallepromocion.cupon : "Sin cupón";

            tabla += `
        <tr> 
          <td>${fechaCreacion}</td>
          <td>${telefono}</td>
          <td>${nombre}</td>
          <td>${nombreCampania}</td>
          <td>${premioDescripcion}</td>
          <td>${valor}</td>
          <td>${descripcionTrx}</td>
          <td>${codigo}</td>
          <td>${premioMonto}</td>
          <td>${fecha}</td>
        </tr>
      `;
        });
    });
    $('.datatables-basic tbody').html(tabla);
    $('.datatables-basic').DataTable({

        order: [
            [0, 'asc']
        ],
        ordering: true,
        language: {
            search: "Buscar:",
            searchPlaceholder: "Buscar",
            lengthMenu: "Mostrar _MENU_",

        },
        scrollX: true,
        buttons: [{
            text: 'Nuevo',
            className: 'add-new btn btn-primary mt-50',
            attr: {
                'data-toggle': 'modal',
                'data-target': '#modalNew',
            },
            init: function(api, node, config) {
                $(node).removeClass('btn-secondary');
                //Metodo para agregar un nuevo usuario
            },
        }, ],
    });

}