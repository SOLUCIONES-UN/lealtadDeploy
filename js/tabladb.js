const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

$(function () {
    let tabla = getTablaDb();
    getSelect();
    function validarDescripcion(descripcion) {
        const descripcionValida =/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(descripcion);
        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no admite caracteres especiales ni espacios en blanco solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }


    $('#modalNew').on('show.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);
    });

    $('#modalEdit').on('show.bs.modal', function () {
        limpiarFormulario();  
        $("#btnSubmEdit").attr("disabled",false);

    });

    $('#modalNew').on('hidden.bs.modal', function () {
        limpiarFormulario();     
        $("#btnSubmit").attr("disabled",false);

    });

    $('#modalEdit').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);

    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);

    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled",false);

    });

    $('#formNew').submit(function () {

        console.log("Datos", $('#descripcion').val());
        const descripcion = $('#descripcion').val();

        getSelect();
        if (!validarDescripcion(descripcion)) {
            return false;
        }

        $("#btnSubmit").attr("disabled",true);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        var raw = JSON.stringify({
            "nombre_tabla": $('#descripcion').val(),
            "idProyectos": $('#ruta').val()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}tabladb`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalNew').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }
            })
            .catch(error => { Alert(error.errors, 'error') });
           
        return false;
    });

    //eventos de edicion para un 

    $('#formEdit').submit(function () {

        const descripcion = $('#descripcionEdit').val();

        if (!validarDescripcion(descripcion)) {
            return false;
        }
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        const id = $('#id').val();

        var raw = JSON.stringify({
            "nombre_tabla": $('#descripcionEdit').val(),
            "idProyecto": $('#rutaEdit').val(),
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}tabladb/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalEdit').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }
            })
            .catch(error => { Alert(error.errors, 'error') });
        return false;
    });

    //eventos para la inhabilitacion de un proyecto
    $('#BtnDelete').click(function () {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        const id = $('#idDelete').val();
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${url}tabladb/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalDelete').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    console.log("Result",result);

                    Alert(result.message, 'error')
                }

            })
            .catch(error => { 
                console.log("Error",error);
                Alert(error.errors, 'error') });
            
    })
});

//obtiene la lista de proyectos
const getTablaDb = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}tabladb`,
            type: "GET",
            datatype: "json",
            dataSrc: "",
            headers: headers,
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return meta.row + 1;
                    }
                    return meta.row + 1;
                }
            },
            { data: "nombre_tabla" },
            {
                data: "id",
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                        feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                        '</a>' +
                        '<div class="dropdown-menu dropdown-menu-right">' +
                        '<a href="#" onclick="OpenEdit(' + data + ')" class="btn_edit dropdown-item">' +
                        feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + ' Actualizar' +
                        '</a>' +
                        '<a href="#" onclick="OpenDelete(' + data + ')" class="btn_delete dropdown-item">' +
                        feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + ' Inhabilitar' +
                        '</a>' +
                        '</div>' +
                        '</div>';
                }
            }
        ],
        // order: [[1, 'asc']],
        dom:
            '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
            '<"col-lg-12 col-xl-6" l>' +
            '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
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
        // Buttons with Dropdown
        buttons: [
            {
                text: 'Nuevo',
                className: 'add-new btn btn-primary mt-50',
                attr: {
                    'data-toggle': 'modal',
                    'data-target': '#modalNew',
                },
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary');
                    //Metodo para agregar un nuevo proyecto
                },
            },
        ],
    });
    
}

function limpiarFormulario() {
    $('#descripcion').val('');
    $('#ruta').val();
    $('.descripcion').removeClass('is-invalid');
    $('.descripcion-error').empty().removeClass('text-danger');
    $('.ruta').removeClass('is-invalid');
    $('.ruta-error').empty().removeClass('text-danger');
}

const Alert = function (message, status) // si se proceso correctamente la solicitud
{
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false
    });
}

const OpenEdit = (id) => {
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        redirect: 'follow'
    };

    
    fetch(`${url}tablabd/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Error de autenticación: Token no válido o expirado.");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            // Lógica para llenar el formulario de edición con los datos obtenidos
            $('#id').val(id);
            $('#descripcionEdit').val(result.descripcion);
            $('#rutaEdit').val(result.ruta);
            $('#modalEdit').modal('toggle');
        })
        .catch(error => {
            console.error("Error en la solicitud GET:", error);
            Alert("Error al obtener datos del proyecto", 'error');
        });
}


const OpenDelete = (id) => { 
    $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
}


const getSelect = ()=>{
    var requestOptions ={
        method: 'GET',
        redirect: 'follow',
        headers: {"Authorization":token}
    };

    fetch(`${url}projects`,requestOptions)
        .then(response => response.json())
        .then(result =>{
            result.forEach(element=>{
                var opc = `<option value="${element.id}">${element.descripcion}</option>`; 
                $('#ruta').append(opc);
                $('#rutaEdit').append(opc);
            });
        })
        .catch(err => console.log('error', err))

}
