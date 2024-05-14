const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");
var dataDeptoView=[]
const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

$(function () {
    let tabla = getProyectos();
    Usuario();
    getMunicipios();
    getDepartamento();
    const containerArchivo = document.getElementById('containerArchivo');
  if (containerArchivo) {
    containerArchivo.style.display = 'none';
  }
    function validarDescripcion(descripcion) {
        const descripcionValida =/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(descripcion);
        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no admite caracteres especiales ni espacios en blanco solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }
    function validarRuta(ruta){
        console.log("Imprimir",ruta);
        const rutaValida = /^[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+(?:\s[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+)*$/.test(ruta);
        if (!rutaValida) {
            $('.ruta').addClass('is-invalid');
            $('.ruta-error').text('La ruta no admite caracteres especiales ni espacios en blanco solo contener letras').addClass('text-danger');
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
    //evento submit del formulario
    // let formSubmitted = false;

    $('#formNew').submit(function () {
        // if (formSubmitted) {
        //     // Si el formulario ya se envió, evitar envíos múltiples
        //     event.preventDefault();
        //     return false;
        // }

        console.log("Datos", $('#descripcion').val());
        const descripcion = $('#descripcion').val();
        const ruta = $('#ruta').val();
        
        if (!validarDescripcion(descripcion)) {
            return false;
        }
        if (!validarRuta(ruta)){
            return false;
        }

        $("#btnSubmit").attr("disabled",true);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        var raw = JSON.stringify({
            "descripcion": $('#descripcion').val(),
            "ruta": $('#ruta').val()

        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}projects`, requestOptions)
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
        const ruta = $('#rutaEdit').val();

        if (!validarDescripcion(descripcion)) {
            return false;
        }
        if (!validarRuta(ruta)) {
            return false;
        }
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        const id = $('#id').val();

        var raw = JSON.stringify({
            "descripcion": $('#descripcionEdit').val(),
            "ruta": $('#rutaEdit').val(),
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}projects/${id}`, requestOptions)
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

        fetch(`${url}projects/${id}`, requestOptions)
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

// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }


//obtiene la lista de proyectos
const getProyectos = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}projects`,
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
            { data: "descripcion" },
            { data: "ruta"},
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
    $('#ruta').val('');
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

    
    fetch(`${url}projects/${id}`, requestOptions)
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

const getDepartamento = () => {
    $('#departamento').html(null);
    $('#departamentoEdit').html(null);
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }

      };

      $("#proyecto").html(
        '<option value="0" selected disabled>Selecciona una Opcion</option>'
      );
      fetch(`${url}Departamento`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
          }
          return response.json();
        })
        .then(result => {
          // Vaciar el select antes de agregar las nuevas opciones
          $('#departamento').empty();
          $('#departamentoEdit').empty();
  
          // Agregar la opción por defecto
          $('#departamento').append('<option value="" selected disabled>Selecciona una opción</option>');
          $('#departamentoEdit').append('<option value="" selected disabled>Selecciona una opción</option>');
  
          // Agregar las opciones de los departamentos
          result.forEach(element => {
            var opc = `<option value="${element.id}">${element.nombre}</option>`;
            $('#departamento').append(opc);
            $('#departamentoEdit').append(opc);
          });
  
          dataDeptoView = result;
                 
          console.log('Departamentos obtenidos:', dataDeptoView);
  
          // Verificar si los elementos existen antes de asignar los event listeners
          var selectDepartamento = document.getElementById('departamento');
          var selectDepartamentoEdit = document.getElementById('departamentoEdit');
  
          if (selectDepartamento) {
            selectDepartamento.addEventListener('change', function() {
              var selectedId = this.value;
              getMunicipioByDepto(selectedId);
            });
          }
  
          if (selectDepartamentoEdit) {
            selectDepartamentoEdit.addEventListener('change', function() {
              var selectedId = this.value;
              getMunicipioByDepto(selectedId);
            });
          }
  
          // Resolver la promesa
          resolve();
        })
        .catch(error => {
          console.error('Error al obtener los departamentos:', error);
          reject(error);
        });
    
  };
  
  //Funcion para traer municipios segun el departamento
  const getMunicipioByDepto = (idDepartamento) => {
    $('#municipio').html(null);
    $('#municipioEdit').html(null);
    
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
      };
  
      // Eliminar todas las opciones del select #municipio y #municipioEdit excepto la opción seleccionada por defecto
      $('#municipio option:not(:disabled)').remove();
      $('#municipioEdit option:not(:disabled)').remove();
  
      fetch(`${url}Municipio/by/${idDepartamento}`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
          // Agregar las nuevas opciones de municipios
          result.forEach(element => {
            var opc = `<option value="${element.id}">${element.nombre}</option>`;
            $('#municipio').append(opc);
            $('#municipioEdit').append(opc);
          });
          resolve();
        })
        .catch(err => {
          console.log('error', err);
          reject(err);
        });
    
  };
  //Funcion para traer municipios
const getMunicipios = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {"Authorization": token}
    };
  
    //$('#').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    fetch(`${url}Municipio`, requestOptions)
        .then(response => response.json())
        .then(result => {
          dataMunicipiosView = result;
          console.log('municipios', dataMunicipiosView)
        })
        .catch(error => console.log('error', error));
  
  }
  
const OpenDelete = (id) => { 
    $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
}