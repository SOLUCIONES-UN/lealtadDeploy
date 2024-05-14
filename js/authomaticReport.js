const url = "http://localhost:3000/";
let tokenReportA = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos
let archivadas = 0;
$(function() {
   
    getCampanias();
    getCampaniasForEditModal();
    $("#btnDescargarExcel, #PantallaInfo").hide(); // Ocultar botones al inicio
    // Inicializar el plugin multiple-select
    $('#selecCampania').multipleSelect({
        filter: true,
        selectAll: true, // Habilitar la opción de seleccionar todos los elementos
        placeholder: "Elige una campania",
    });
    $('#selecCampaniaEdit').multipleSelect({
        filter: true,
        selectAll: true, // Habilitar la opción de seleccionar todos los elementos
        placeholder: "Elige una campania",
    });



    $('#modalEdit').on('show.bs.modal', function () {
        limpiarFormulario();  
        $("#btnSubmEdit").attr("disabled",false);

    });



    $('#modalEdit').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });



    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });


    

    $("#btnSubmit").attr("disabled", false);


    $('#formNew').submit(function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto
    
        // Deshabilitar el botón de enviar para evitar envíos múltiples
        $("#btnSubmit").attr("disabled", true);
    
        // Obtener los datos del formulario
        var formData = {
            diasemana: $('#diasemana').val(),
            diames: $('#diames').val(),
            campanias: $('#selecCampania').val(),
            frecuencia: $('#frecuencia').val(),
            tiporeporte: $('#tiporeporte').val(),
            emails: $('#emails').val()
        };

        fetch(`${url}authomatic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenReportA
            },
            body: JSON.stringify(formData) // Enviar el array como JSON
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.code == "ok") {
                limpiarFormulario();
                $('#modalNew').modal('toggle');
                limpiarFormulario();
                alert(result.message, 'success');
            } else {
                alert(result.message, 'error');
            }
            $('#btnSubmit').prop('disabled', false);
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            $('#btnSubmit').prop('disabled', false);
        });
    });

    function limpiarFormulario() {
       
        $('#diasemana').val('');
        $('#diames').val('');
        $('#selecCampania').val([]);
        $('#emails').val('');
    
       
        $('#frecuencia').val(null);
        $('#tiporeporte').val([]);
    
        // Si estás usando el plugin multipleSelect, también necesitas refrescarlo después de limpiar los valores
        $('#selecCampania').multipleSelect('refresh');
    }



    $("#ConsultarPromo").on("click", function() {
        if (
            $("#reporte").val() !== null
        ) {
            getReport();
        } else {
            alert("Debe llenar todos los campos", "error");
        }
    });

    $("#PantallaInfo").on("click", function() {
        if (datosObtenidos) {
            mostrarDatosEnTabla(datosObtenidos);
        } else {
            alert("Primero debes obtener los datos", "error");
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

const getCampaniasForEditModal = () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { Authorization: tokenReportA },
    };
    $("#selecCampaniaEdit").empty();
           

    fetch(`${url}Campania`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Campanias obtenidas para modal de edición:", result);
            // Limpiar el select antes de agregar opciones
            // $("#selecCampaniaEdit").empty();
            
            result.forEach((element) => {
                // Agregar opciones al select
                $("#selecCampaniaEdit").append(
                    `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
                );
            });
            // Actualizar el select múltiple después de agregar opciones
            $('#selecCampaniaEdit').multipleSelect('refresh');
        })
        .catch((error) => {
            console.error("Error al obtener Campanias para modal de edición:", error);
            alert(error, "error");
        });
};


$('#formEdit').submit(function () {


   const diasemana = $('#diasemana').val();
     const diames = ('#diames').val();
          const campanias = $('#selecCampania').val();
         const frecuencia = $('#frecuencia').val();
        const tiporeporte = $('#tiporeporte').val();
          const emails = $('#emails').val()

  
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", tokenReportA);

    const id = $('#id').val();

    var raw = JSON.stringify({
        // "descripcion": $('#descripcionEdit').val(),
        // "ruta": $('#rutaEdit').val(),
        "diasemana": $('#diasemanaeddit').val(),
        "diames": $('#diameseddit').val(),
        "campanias": $('#selecCampaniaEdit').val(),
        "frecuencia": $('#frecuenciaeddit').val(),
        "tiporeporte": $('#tiporeporteessit').val(),
        "emails": $('#emailseddit').val()

    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}authomatic/update${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                limpiarFormulario();
                tabla._fnAjaxUpdate();
                $('#modalEdit').modal('toggle');
                alert(result.message, 'success')
            } else {
                alert(result.message, 'error')
            }
        })
        .catch(error => { alert(error.errors, 'error') });
    return false;
});





function mostrarOcultarSelectDia() {
    var selectConfiguracion = document.getElementById("frecuencia");
    var selectDiaContainer = document.getElementById("selectDiaContainer");

    if (selectConfiguracion.value === "semana") {
        selectDiaContainer.style.display = "block";
    } else {
        selectDiaContainer.style.display = "none";
    }
}



function mostrarOcultarSelectDiaMes() {
    var selectConfiguracion = document.getElementById("frecuencia");
    var selectDiaMesContainer = document.getElementById("selectDiaMesContainer");
    var selectDiaMes = document.getElementById("diames");

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
    $('#frecuencia').change(function() {
        mostrarOcultarSelectDiaMes();
    });
});











const getReport = () => {
    // Obtener el tipo de reporte seleccionado
    const tipoReporte = $("#reporte").val();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    // Incluir el tipo de reporte seleccionado en la URL
    fetch(`${url}authomatic/${tipoReporte}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .then((result) => {
            console.log("Datos del informe de oferCraft:", result);
            datosObtenidos = result;
            mostrarDatosEnTabla(datosObtenidos);
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
    // Verificar si los datos son un array
    if (Array.isArray(datos)) {
        // Iterar sobre cada objeto en el array de datos
        datos.forEach((element) => {
            // Crear una fila de tabla para cada objeto en los datos
            tabla += `
                <tr> 
                    <td>${element.id}</td>
                    <td>${element.frecuencia}</td>
                    <td>${element.diaSemana || '-'}</td>
                    <td>${element.diaMes || '-'}</td>
                    <td>
                        <div class="btn-group">
                            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                                ${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a href="#" onclick="OpenEdit(${element.id})" class="dropdown-item">
                                    ${feather.icons['edit'].toSvg({ class: 'font-small-4 mr-50' })} Editar
                                </a>
                                <a href="#" onclick="eliminar(${element.id})" class="dropdown-item">
                                    ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} Eliminar
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
    } else {
        // Si los datos no son un array, mostrar un mensaje de error en la consola
        console.error('Los datos no son un array:', datos);
    }
    // Insertar las filas de tabla en el cuerpo de la tabla
    $('.datatables-basic tbody').html(tabla);
    // Inicializar el plugin DataTables
    $('.datatables-basic').DataTable({
        // Opciones de configuración de DataTables
        
     order: [
        [0, 'asc']
    ],
    ordering: true,
    dom: 
        '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
        '<"col-lg-6" l>' +
        '<"col-lg-6 pl-0"<"dt-action-buttons text-right text-md-left text-lg-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
        '>t' +
        '<"d-flex justify-content-between mx-2 row mb-1"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
    language: {
        sLengthMenu: 'Show _MENU_',
        search: 'Buscar',
        searchPlaceholder: 'Buscar...',
    },
    buttons: [{
        text: 'Nuevo',
        className: 'add-new btn btn-primary mt-50',
        attr: {
            'data-toggle': 'modal',
            'data-target': '#modalNew',
        },
        init: function(api, node, config) {
            $(node).removeClass('btn-secondary');
            // Método para agregar un nuevo usuario
        },
    }],
});
}



const OpenEdit = (id) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': tokenReportA,
        },
        redirect: 'follow'
    };

    fetch(`${url}authomatic/config/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Error de autenticación: Token no válido o expirado.");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(resultArray => {
            if (resultArray.length > 0) {
                const result = resultArray[0]; 
                console.log('Esto es lo que viene:', result);
                if (result.configreporte) {
                    $('#id').val(id);
                    $('#frecuenciaeddit').val(result.configreporte.frecuencia);
                    $('#tiporeporteeddit').val(result.configreporte.tiporeporte);
                    $('#diasemanaeddit').val(result.configreporte.diaSemana);
                    $('#diameseddit').val(result.configreporte.diaMes);
                    $('#emailseddit').val(result.configreporte.emails);
                    $('#selecCampaniaEdit').val(result.idCampania);
                    getCampaniasForEditModal();

                    $('#selecCampaniaEdit').val(result.idCampania);
                    $('#modalEdit').modal('toggle');
                } else {
                    console.error("Error: El objeto result no tiene la propiedad 'configreporte' definida.");
                    alert("Error al obtener datos del proyecto", 'error');
                }
            } else {
                console.error("Error: No se recibieron resultados para el ID proporcionado.");
                alert("Error al obtener datos del proyecto", 'error');
            }
        })
        .catch(error => {
            console.error("Error en la solicitud GET:", error);
            alert("Error al obtener datos del proyecto", 'error');
        });
}