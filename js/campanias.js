const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");
var actualStep = 0;

$(function () {
  const tabla = getTable();
  initStepper();

  //select
  getProjecs();
  getDepartamento();
  getMunicipio();
  getTransaccion();
  getPremio();

  //provisionalmente aqui 
  const containerArchivo = document.getElementById('containerArchivo');
  containerArchivo.style.display = 'none';
  const containerTotal = document.getElementById('totalMinimo-container');
  containerTotal.style.display = 'none';


  $('#modalNew').on('show.bs.modal', function () {
    
  });

  $('#modalNew').on('hidden.bs.modal', function () {
    
  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
    
  });

  $('#formNew').submit(function(){


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}Campania`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                limpiarForm();
                tabla._fnAjaxUpdate();
                $('#modalNew').modal('toggle');
                Alert(result.message, 'success');
            } else {
                Alert(result.message, 'error');
            }

        })
        .catch(error => { Alert(error.errors, 'error') });
      return false;
  });
});


//Funcion del stepper
function initStepper() {
  actualStep=0;
  var steps = $('#stepper').children(); // Obtener todos los elementos hijos del contenedor #stepper
  var totalSteps = steps.length;
  
  showStep(actualStep);
  
  console.log(steps);

  $('.next-btn').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado

    if (actualStep < totalSteps - 1) {
      hideStep(actualStep);
      actualStep++;
      showStep(actualStep);
    }
  });

  $('.prev-btn').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado
    
    if (actualStep > 0) {
      hideStep(actualStep);
      actualStep--;
      showStep(actualStep);
    }
  });

  function showStep(stepIndex) {
    steps.eq(stepIndex).show();
  }

  function hideStep(stepIndex) {
    steps.eq(stepIndex).hide();
  }
}

//funcion para la visualizacion previa de las imagenes
function previewImage(event, textImg, textContent) {
  const input = event.target;
  const preview = document.getElementById(textImg);
  const imgCampania = document.getElementById(textContent);
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
  
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      imgCampania.style.display = 'none'; 
    }
  
    reader.readAsDataURL(input.files[0]);
    
  } else {
    preview.src = '#';
    preview.style.display = 'none';
  }
}

//Funcion para validar la restriccion de usuarios (Primeros cambios)
function userValidator(event, container) {
  const input = event.target;
  const containerArchivo = document.getElementById(container);

  const regexNumerico = /^[2-4]$/;
  
  switch(container){
    case 'containerArchivo':
      if (input.value === '0' || input.value === 0 || input.value === null) {
        containerArchivo.style.display = 'none';
      } else {
        containerArchivo.style.display = 'block';
      }
    break;
    
    case 'totalMinimo-container':
      if (regexNumerico.test(input.value)) {
        containerArchivo.style.display = 'block';
      } else {
        containerArchivo.style.display = 'none';
      }
    break;

    default:
      containerArchivo.style.display = 'none';
    break;
      
  }
}

/*FUNCIONES PARA TRAER DATOS A LOS SELECT*/

//Funcion para traer los proyectos
const getProjecs = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}projects`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#proyecto').append(opc);
      });
    })
}

//Funcion para traer los departamentos 
const getDepartamento = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Departamento`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#departamento').append(opc);
      });
    })
}

//Funcion para traer los municipios
const getMunicipio = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Municipio`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#municipio').append(opc);
      });
    })
}

//Funcion para traer los Transacciones
const getTransaccion = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Transaccion`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#transaccion').append(opc);
      });
    })
}

//Funcion para traer los Transacciones
const getPremio = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Premio`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#premio').append(opc);
      });
    })
}


$(document).ready(function() {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var selectedDate = null;

  function generateCalendar(year, month) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    var calendar = '';

    $('#current-month-year').text(getMonthName(month) + ' ' + year);

    for (var i = 0; i < firstDayOfMonth; i++) {
      calendar += '<div class="calendar-day"></div>';
    }
    for (var i = 1; i <= daysInMonth; i++) {
      var date = new Date(year, month, i);
      var dateString = date.toISOString().slice(0, 10);
      var isSelected = selectedDate === dateString;
      calendar += '<div class="calendar-day' + (isSelected ? ' selected' : '') + '" data-date="' + dateString + '">' + i + '</div>';
    }

    $('#calendar-days').html(calendar);

    $('.calendar-day').click(function() {
      var date = $(this).data('date');
      if (date) {
        selectedDate = date;
        generateCalendar(year, month);
      }
    });
  }

  function getMonthName(month) {
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[month];
  }

  $('#prev-month').click(function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  });

  $('#next-month').click(function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  });

  generateCalendar(currentYear, currentMonth);
});

//Funcion Para limpiar el form
const limpiarForm = ()=>{
  actualStep = 0;
}

//Alertas
/*
const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
      closeButton: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right',
      rtl: false
  });
}*/

//Funcion para limpiar el form
const getTable = () => {
  
  return $('#tableTodas').dataTable({
      ajax: {
          url: `${url}Campania`,
          type: "GET",
          datatype: "json",
          dataSrc: "",
          headers: { "Authorization": token }
      },
      columns: [
          {
              data: null, render: function (data, type, row, meta) {

                  if (type === 'display') {
                      return meta.row + 1;
                  }
                  return meta.row + 1;
              }
          },
          { data: "nombre" },
          {  
            data: "estado",
            render: function (data) {
              switch (data) {
                case 1:
                  return `Activa`;
                case 2:
                  return `Pausada`;
                case 3:
                  return `Borrador`;
                default:
                  return ``;
              }
            },
          },
          {
            data: "fechaInicio",
          },
          {
            data: "fechaFin",
          },
          {
            data: "id",
            render: function (data, type, row) {
              var opcAdd = ``;
    
              switch (row.estado) {
                case 1:
                  opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},2)" class="btn_pausar dropdown-item">
                  ${feather.icons["pause-circle"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Pausar
                </a>`;
                  break;
                case 2:
                  opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},1)" class="btn_activar dropdown-item">
                    ${feather.icons["play"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Activar
                  </a>`;
                  break;
              }
    
              //console.log(`row_id: ${data} estado: ${row.estado}`)
    
              if (row.estado != 0) {
                opcAdd += `<a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
                ${feather.icons["archive"].toSvg({
                  class: "font-small-4 mr-50",
                })} Actualizar
                </a><a href="#" onclick="eliminarFila(${data})" class="btn_delete dropdown-item">
                    ${feather.icons["trash-2"].toSvg({
                  class: "font-small-4 mr-50",
                })} Inhabilitar
                        </a>`;
              }
    
              return `
              <div class="btn-group">
                <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                    ${feather.icons["more-vertical"].toSvg({
                class: "font-small-4",
              })}
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                   ${opcAdd}
                </div>
              </div> 
            `;
            },
          },
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
                  //Metodo para agregar un nuevo usuario
              },
          },
      ],
  });
}
