const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");
var actualStep = 0;
var saveDataParams = [];
// Arreglo para almacenar los datos guardados de la tabla
var datosTablaLocalidad = [];
var datosTablaPremio = [];
var datosTablaParametro = [];
var datosTablaParticipacion= [];
var permitidoUsuario =[];

//var datosBloqueados = [];
var TEMP =[];
var etapasData=[]
//variables de imagenes
let imgCampania = null;

var bloqueadosUsuarios =[];
var DataEtapa =[];




//valor para poder editar etapas
var dataEditEtapa =[];

$(function () {

  initStepper();
  initStepperEdit();
  getAllCampanias();
  //select
  getProjecs();
  Calendar();
  getTransaccion();

  const containerArchivo = document.getElementById('containerArchivo');
  if (containerArchivo) {
    containerArchivo.style.display = 'none';
  }

  // Ocultar el contenedor de bloqueo
  const containerBloqueo = document.querySelector('#Bloqueo');
  if (containerBloqueo) {
    containerBloqueo.style.display = 'none';
  }
  //Inicializacion de Navs
  $("#NavsOpc button").on("click", function(event) {
    let data = $(this).attr("data-bs-target");
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });


  $('#modalNew').on('show.bs.modal', function () {
      
  });

  $('#modalNew').on('hidden.bs.modal', function () {
    limpiarFormulario();     
  
  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled",false);
  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled",false);
  });

  $('#modalEdit').on('show.bs.modal', function () {
    
  });

  $('#modalEdit').on('hidden.bs.modal', function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled",false);
  });

  
  $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled",false);
  });

  

  $('#formNew').submit(function(){
    var imgPushFile = $('#imgCampania')[0].files[0];
    var imgAkisiFile = $('#imgNotificacion')[0].files[0];
    const valor = $('#tipoUsuarios').val();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);
    
    
    var raw = JSON.stringify({
      nombre: $('#campania').val(),
      descripcion: $('#descripcionCampania').val(),
      fechaCreacion: "2024-02-04",
      fechaRegistro: $("#fechaRegistro").val(),
      fechaInicio: $("#fechaInicial").val(),
      fechaFin: $("#fechaFinal").val(),
      diaReporte: 3,
      horaReporte: $('#HoraRecordatorio').val(),
      emails: $('#correo').val(),
      edadInicial:parseInt($('#edadInicial').val()),
      edadFinal: parseInt($('#edadFinal').val()),
      sexo: parseInt($('#sexo').val()),
      tipoUsuario: valor,
      tituloNotificacion: $('#notificacion').val() ,
      descripcionNotificacion:  $('#descripcionNotificacion').val(),
      imgPush:  imgPushFile ? imgPushFile.name : null, 
      imgAkisi:  imgAkisiFile ? imgAkisiFile.name : null,
      estado: 1,
      maximoParticipaciones:  parseInt($('#maximoParticipantes').val()),
      campaniaTerceros: parseInt($('#tercerosCampania').val()),
      allDay: parseInt($('#allday').val()),
      repetir: parseInt($('#repeat').val()),
      fechaRecordatorioIni: $('#FechaIniRecordatorio').val(),
      fechaRecordatorioFin: $('#FechaFinRecordatorio').val(),
      terminosCondiciones: $('#terminosCondiciones').val(),
      observaciones: $('#Observaciones').val(),
      esArchivada: 0,
      restriccionUser: parseInt($('#restriccionUsuarios').val()),
      idProyecto: parseInt($('#proyecto').val()),
      etapas: getEtapasData(),
      bloqueados: bloqueadosUsuarios,
      participacion:permitidoUsuario
      
    });

    console.log(raw);
    
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
          limpiarFormulario();
          $('#modalNew').modal('toggle'); // Mover esta línea aquí
          Alert(result.message, 'success');
          console.log(result);
        } else {
          console.log("Verifica datos");
          Alert(result.message, 'error');
        }
    })
    .catch(error => { Alert(error.errors, 'error') });
    return false;
  });

  $('#formEdit').submit(function () {

  
    $("#btnSubmitEdit").attr("disabled", true);

    const id = $('#id').val();
    
    var raw = JSON.stringify({
       
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}Campania/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                $('#modalEdit').modal('toggle');
                Alert(result.message, 'success')
            } else {
                Alert(result.message, 'error')
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
  Calendar();

  //provisional
  const containerBloqueo = document.querySelector('#Bloqueo');
  containerBloqueo.style.display = 'none';

  showStep(actualStep);

  $('.next-btn').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado

    if (actualStep < totalSteps - 1) {
      
      if(validarCamposStep(actualStep)){
        hideStep(actualStep);
        actualStep++;
        showStep(actualStep);  
        console.log(actualStep)
      }else{
        console.log("Error")
      }
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
  
    // Cambiar el color del botón correspondiente al paso actual
    $('.step-progress').removeClass('active');
    $('.step-btn-' + (stepIndex + 1)).addClass('active');
  }
  
  // Agregar evento de clic a los botones de la parte superior
  $('.step-btn-1').click(function(e) {
    e.preventDefault();
    hideStep(actualStep);
    actualStep = 0;
    showStep(actualStep);
  });
  
  $('.step-btn-2').click(function(e) {
    e.preventDefault();
    hideStep(actualStep);
    actualStep = 1;
    showStep(actualStep);
  });
  
  $('.step-btn-3').click(function(e) {
    e.preventDefault();
    hideStep(actualStep);
    actualStep = 2;
    showStep(actualStep);
  });
  
  $('.step-btn-4').click(function(e) {
    e.preventDefault();
    hideStep(actualStep);
    actualStep = 3;
    showStep(actualStep);
  });

  function hideStep(stepIndex) {
    steps.eq(stepIndex).hide();
  }

  $('#tipoParticipacion').change(function() {
    var tipoSeleccionado = $(this).val();
    
    // Ocultar todos los inputs
    $('#inputsContainer > div').hide();
    
    // Mostrar los inputs correspondientes al tipo seleccionado
     if (tipoSeleccionado === '2' || tipoSeleccionado === '3') {
      $('#inputsTipo0').show();
    } else if (tipoSeleccionado === '4') {
      $('#inputsTipo1').show();
    }
  });

  // Stepp de los parametros de la campaña segun esta una etapa
  $('#add-step-btn').click(function() {
    getDepartamento();
    getTransaccion();
    getPremio();
    addStep(`<div class="form-step ">
    <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Parametros de Etapa</h4>
        <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="limiteParticipacion">Limite de Participaciones</label>
            <input type="number" id="limiteParticipacion" class="form-control" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="transaccion">Transacción</label>
            <select name="" id="transaccion" class="form-control">
                <option disabled selected>Selecciona una opción</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="valorMinimo">Valor Minimo</label>
            <input type="number" id="valorMinimo" class="form-control" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="valorMaximo">Valor Maximo</label>
            <input type="number" id="valorMaximo" class="form-control" />
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="limiteDia">Limite Diario</label>
            <input type="number" id="limiteDia" class="form-control" />
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-12">
          <div class="btn-crear d-flex justify-content-end mt-2">
            <button type="button" class="btn btn-outline-primary" id="addParamas">Agregar</button>
          </div>
        </div>
    </div>
    <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametros">
      <thead>
        <tr>
          <th>#</th>
          <th>Transaccion</th>
          <th>Valor Minimo</th>
          <th>Valor Maximo</th>
          <th>Accion</th>
        </tr>
      </thead>
    </table>
    <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Presupuesto</h4>
        <small class="text-muted">Ingresa los datos basicos del presupuesto.</small>
    </div>
    <div class="row">
    <div class="form-group col-md-6">
        <label class="form-label" for="departamento">Departamento</label>
        <select name="" id="departamento" aria-describedby="departamentoError" required class="form-control">
            <option disabled selected>Selecciona una opción</option>
        </select>
        <div id="departamentoError" class="invalid-feedback departamento-error"></div>
    </div>
    <div class="form-group col-md-6">
        <label class="form-label" for="municipio">Municipio</label>
        <select name="municipio" id="municipio" aria-describedby="municipioError" required class="form-control">
            <option disabled selected>Selecciona una opción</option>
        </select>
        <div id="municipioError" class="invalid-feedback municipio-error"></div>
    </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="limiteGanador">Limite de Ganadores</label>
            <input type="text" id="limiteGanador" aria-describedby="limiteGanadorError" required class="form-control" />
            <div id="limiteGanadorError" class="invalid-feedback limiteGanador-error"></div>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="presupuesto">Presupuesto</label>
            <input type="text" id="presupuesto" aria-describedby="presupuestoError" required class="form-control" />
            <div id="presupuestoError" class="invalid-feedback presupuesto-error"></div>

            <div class="btn-crear d-flex justify-content-end mt-1" >
                <button type="button" class="btn btn-outline-primary" id="addLocalidad">Agregar</button>
            </div>
        </div>
    </div>
    <!--Tabla-->
    <table class="datatables-basic table mb-3 mt-2 stepper-table" id="tableLocalidad">
        <thead>
            <tr>
                <th>#</th>
                <th>DEPARTAMENTO</th>
                <th>MUNICIPIO</th>
                <th>LIMITE</th>
                <th>PRESUPUESTO</th>
                <th>Accion</th>
            </tr>
        </thead>
    </table>
    <div class="form-step ">
        <div class="content-header mt-2 mb-1">
            <h4 class="mb-0">Configuración de Premio</h4>
            <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label class="form-label" for="tipoPremio">Tipo de Premio</label>
                <select name="tipoPremio" aria-describedby="tipoPremioError"  id="tipoPremio" class="form-control">
                    <option disabled selected>Selecciona una opción</option>
                    <option value="0">Unico Premio</option>
                    <option value="1">Premio Random</option>
                    <option value="2">Todos los Premios</option>
                </select>
                <div id="tipoPremioError" class="invalid-feedback tipoPremio-error"></div>
            </div>
            <div class="form-group col-md-6">
                <label class="form-label" for="linkPremio">Links de Premio</label>
                <select name="linkPremio" aria-describedby="linkPremioError"  id="linkPremio" class="form-control">
                    <option disabled selected>Selecciona una opción</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                </select>
                <div id="linkPremioError" class="invalid-feedback linkPremio-error"></div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label class="form-label" for="premio">Premio</label>
                <select name="premio" id="premio" aria-describedby="premioError"  class="form-control">
                    <option disabled selected>Selecciona una opción</option>
                </select>
                <div id="premioError" class="invalid-feedback premio-error"></div>
            </div>
            <div class="form-group col-md-6">
                <label class="form-label" for="valor">Valor</label>
                <input type="number" id="valor" aria-describedby="valorError"  class="form-control" />
                <div id="valorError" class="invalid-feedback valor-error"></div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label class="form-label" for="porcentajePremio">Porcentaje de Premio</label>
                <input type="number" id="porcentajePremio" aria-describedby="porcentajePremioError"  class="form-control" />
                <div id="porcentajePremioError" class="invalid-feedback porcentajePremio-error"></div>
            </div>
            <div class="form-group col-md-6">
                <div class="btn-crear d-flex justify-content-end mt-2" >
                    <button type="button" class="btn btn-outline-primary" id="addPremio">Agregar</button>
                </div>
            </div>
        </div>
        <!--Tabla-->
        <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaPremio">
            <thead>
                <tr>
                    <th>#</th>
                    <th>PREMIO</th>
                    <th>VALOR</th>
                    <th>PORCENTAJE</th>
                    <th>Accion</th>
                </tr>
            </thead>
        </table>  
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" id="removeStepp" >Borrar</button>
            <button type="button" id="GuardarEtapa" class="btn btn-primary" >Guardar</button>
        </div>
      </div>`);

      var NombreEtapa = $('#NombreEtapa').val();
      var orden = $('#orden').val();
      var descripcionEtapa = $('#descripcionEtapa').val();
      var tipoParticipacion = $('#tipoParticipacion').val();
    

      if( NombreEtapa && orden  && descripcionEtapa && tipoParticipacion){
        var nuevo ={
          nombre: NombreEtapa,
          descripcion: descripcionEtapa,
          orden: orden,
          tipoParticipacion: tipoParticipacion,
          //datos sin explicacion(Intestigar)
          intervalo: 0,
          periodo: 0,
          valorAcumulado: null,
          estado: 1,
        }
        TEMP.push(nuevo);
        //muestraEtapa.push(TEMP)
    
        $('#NombreEtapa').val('');
        $('#orden').val('');
        $('#descripcionEtapa').val('');
        $('#tipoParticipacion').val('');
    
       
        console.log(nuevoPremio);
        
      }else{
        //Colocar una alerta 
      }
  });
  
  function addStep(content) {
    var newStep = $(`<div class="step"></div>`).html(content);
    $('#stepper').append(newStep);
    totalSteps++;
    var previousStep = actualStep; // Guardar el valor actual de actualStep
    hideStep(actualStep);
    actualStep = totalSteps - 1;
    showStep(actualStep);

    // // Deshabilitar y ocultar los botones de la barra
    // $('.step-button').prop('disabled', true);
    //     //borrar los arreglos para su reutilizacion
    //     datosTablaParametro = [];
    //     datosTablaLocalidad = [];
    //     datosTablaPremio = [];
    // Agregar evento de clic al botón "Borrar" del nuevo paso
    newStep.find('#removeStepp').click(function(e) {
      e.preventDefault();
      if (totalSteps > 1) {
        hideStep(actualStep);
        actualStep = previousStep; // Establecer actualStep al valor guardado
        showStep(actualStep);
        newStep.html('');
        stepData = null;
      // Habilitar los botones de la barra
      $('.step-buttons button').prop('disabled', false);
      }
    });

    newStep.find('#transaccion').click(function(e){
      e.preventDefault();
      $(this).off(e);  
    });

    newStep.find('#GuardarEtapa').click(function(e){
      e.preventDefault();
      var stepData = {
        etapa: [...TEMP], 
        parametros: datosTablaParametro,
        presupuesto: datosTablaLocalidad,
        premio: datosTablaPremio
      };
      // Guardar los datos de la etapa en el objeto correspondiente
      DataEtapa.push(stepData);
      getEtapasData() 
      console.log(getEtapasData() );
      mostrarDatosTabla('#TablaEtapa');
        // Limpiar los datos de la etapa actual
        TEMP = [];
        datosTablaParametro = [];
        datosTablaLocalidad = [];
        datosTablaPremio = [];


      //Funciones del stepp
      hideStep(actualStep);
      actualStep = previousStep; // Establecer actualStep al valor guardado
      showStep(actualStep);
      newStep.html('');
      stepData = null;
      
      // // Habilitar los botones de la barra
      // $('.step-buttons button').prop('disabled', false);
    });
  

    $('#addParamas').click(function(){
      var limiteParticipacion = parseInt($('#limiteParticipacion').val());
      var totalMinimo = parseInt($('#totalMinimo').val());
      var Transaccion = parseInt($('#transaccion').val());
      var limiteDiario = $('#limiteDia').val();
      var ValorMinimo = parseFloat($('#valorMinimo').val());
      var ValorMaximo = parseFloat($('#valorMaximo').val());
      var RangoDias = $('#RangoDias').val();
      
      var fields = ['limiteParticipacion', 'transaccion', 'limiteDia', 'valorMinimo', 'valorMaximo'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });

      if( limiteDiario && ValorMinimo && ValorMaximo ){
            
        var nuevoParametro= {
          limiteParticipacion: limiteParticipacion,
          idTransaccion: Transaccion,
          //tipo de transaccion Que es?
          tipoTransaccion: 0,
          ValorMinimo: ValorMinimo,
          //limiteDiario: limiteDiario,
          ValorMaximo: ValorMaximo,
          valorAnterior: 0,
          //rangoDias: RangoDias 
          estado: 1
        }
    
        datosTablaParametro.push(nuevoParametro);
        console.log(datosTablaParametro);
        $('#limiteParticipacion').val('');
        $('#totalMinimo').val('');
        $('#transaccion').val('');
        $('#limiteDia').val('');
        $('#valorMinimo').val('');
        $('#valorMaximo').val('');
        $('#RangoDias').val('');
        
        mostrarDatosParametro('#TablaParametros');

       
      }
      
      return isValid;
    
    });

    $('#addLocalidad').click(function() {
      // Obtener los valores de los campos de entrada
      var departamento = parseInt($('#departamento').val());
      var municipio = parseInt($('#municipio').val());
      var limiteGanador = parseInt($('#limiteGanador').val());
      var presupuesto = parseFloat($('#presupuesto').val());

      var fields = ['departamento', 'municipio', 'limiteGanador', 'presupuesto'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });

      // Validar que los campos no estén vacíos
      if (departamento && municipio && limiteGanador && presupuesto) {
        // Crear un objeto con los datos
        var nuevoDato = {
          idDepartamento: departamento,
          idMunicipio: municipio,
          limiteGanadores: limiteGanador,
          valor: presupuesto,
          estado: 1
        };
    
        // Agregar el nuevo dato al arreglo
        datosTablaLocalidad.push(nuevoDato);
        console.log(datosTablaLocalidad)
        // Limpiar los campos de entrada
        $('#departamento').val('');
        $('#municipio').val('');
        $('#limiteGanador').val('');
        $('#presupuesto').val('');
    
        // Mostrar los datos en la tabla
        mostrarDatosParametro('#tableLocalidad');
  
      }    
      
      return isValid;
    });
    
    $('#addPremio').click(function(){
      var tipoPremio = $('#tipoPremio').val();
      var linkPremio = parseInt($('#linkPremio').val());
      var premio = parseInt($('#premio').val());
      var valor = parseFloat($('#valor').val());
      //var porcentaje = $('#porcentajePremio').val();

      var fields = ['tipoPremio', 'linkPremio', 'premio', 'valor'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });
    
      if( tipoPremio && valor  ){
        var nuevoPremio ={
          idPremio : premio,
          linkPremio: linkPremio, 
          //premio: premio,
          valor: valor,
          estado: 1
          //porcentajePremio : porcentaje
        }

        console.log(tipoPremio)
        datosTablaPremio.push(nuevoPremio);
        console.log(datosTablaPremio)
        $('#tipoPremio').val('');
        $('#linkPremio').val('');
        $('#premio').val('');
        $('#valor').val('');
        $('#porcentajePremio').val('');
    
        mostrarDatosParametro('#TablaPremio');
        
      }
      return isValid;
    });

    function mostrarDatosParametro(tabla) {
      switch(tabla)
      {
        case '#tableLocalidad':
            // Limpiar la tabla antes de insertar nuevas filas
          $('#tableLocalidad').DataTable().clear().destroy();
    
          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#tableLocalidad').DataTable({
            searching: false,
            paging: false,
            data: datosTablaLocalidad,
            columns: [
              {
                render: function(data, type, row, meta) {
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idDepartamento',
                render: function (data) {
                  var departamento = $('#departamento option[value="' + data + '"]').text();
                  return departamento;
                },
                width: '25%'
              },
              {
            
                data: 'idMunicipio',
                render: function (data, row) {
                  var municipio = $('#municipio option[value="' + data + '"]').text();
                  if (!municipio) {
                    // Si no se encuentra el nombre del municipio, buscarlo en el arreglo datosTablaLocalidad
                    var registro = datosTablaLocalidad.find(function(item) {
                      return item.idMunicipio === data;
                    });
                    if (registro) {
                      municipio = registro.nombreMunicipio;
                    }
                  }
                  return municipio;
                },
                width: '25%'
              },
              {
                data: 'limiteGanadores',
                width: '15%'
              },
              {
                data: 'valor',
                width: '15%'
              },
              {
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item" onclick="eliminarDato(${'#tableLocalidad'}, ${meta.row})">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} 
                    </a>
                  `;
                  return opcDelete;
                },
                width: '15%'
              }
            ]
          });
        break;

        case'#TablaParametros':
          // Limpiar la tabla antes de insertar nuevas filas
          $('#TablaParametros').DataTable().clear().destroy();
        
          // Inicializar el DataTables con los datos de datosTablaParametro
          $('#TablaParametros').DataTable({
            data: datosTablaParametro,
            searching: false, // Deshabilitar la funcionalidad de búsqueda
            paging: false,
            columns: [
              { 
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%' 
              },
              {
                data: 'idTransaccion',
                render: function (data) {
                  var transaccion = $('#transaccion option[value="' + data + '"]').text();
                  return transaccion;
                },
                width: '30%'
              },
              { data: 'ValorMinimo', width: '20%' },
              { data: 'ValorMaximo', width: '20%' },
              {      
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item" id="EliminarDato"  onclick="eliminarDato(${'#tableLocalidad'}, ${meta.row})">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} 
                    </a>
                  `;
                  return opcDelete;
                },
                width: '25%'
              }
            ]
          });
        break;
    
        case '#TablaPremio':
           // Limpiar la tabla antes de insertar nuevas filas
           $('#TablaPremio').DataTable().clear().destroy();
    
           // Inicializar el DataTables con los datos de datosTablaLocalidad
           $('#TablaPremio').DataTable({
             searching: false, // Deshabilitar la funcionalidad de búsqueda
             paging: false,
             data: datosTablaPremio,
             columns: [
               { 
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'  
              },
              {
                data: 'idPremio',
                render: function (data) {
                  var premio = $('#premio option[value="' + data + '"]').text();
                  return premio;
                },
                width: '30%'
              },
              { data: 'valor', width: '30%' },
              {
                data: 'linkPremio',
                render: function (data) {
                  return data === 1 ? 'Sí' : 'No';
                },
                width: '30%'
              },
              {
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item"  onclick="eliminarDato(${'#tableLocalidad'}, ${meta.row})">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })}
                    </a>
                  `;
                  return opcDelete;
                }
              }
             ]
           });
        break;
    
        default:
          break;
      }

    }

    $('#EliminarDato').click(function(){
      
    })

    function eliminarDato(tabla, index) {
      switch (tabla) {
        case '#tableLocalidad':
          datosTablaLocalidad.splice(index, 1);
          break;
        case '#TablaParametros':
          datosTablaParametro.splice(index, 1);
          break;
        case '#TablaPremio':
          datosTablaPremio.splice(index, 1);
          break;
        default:
          break;
      }
      mostrarDatosTabla(tabla);
    }
  }

}

//editar
function initStepperEdit() {
  var actualStepEdit = 0;
  var stepsEdit = $('#stepperEdit').children();
  var totalStepsEdit = stepsEdit.length;
  showStepEdit(actualStepEdit);
  
  $('.next-btn-edit').click(function(e) {
    e.preventDefault();

    if (actualStepEdit < totalStepsEdit - 1) {
      hideStepEdit(actualStepEdit);
      actualStepEdit++;
      showStepEdit(actualStepEdit);
    }
  });


  $('.prev-btn-edit').click(function(e) {
    e.preventDefault();

    if (actualStepEdit > 0) {
      hideStepEdit(actualStepEdit);
      actualStepEdit--;
      showStepEdit(actualStepEdit);
    }
  });


  function showStepEdit(stepIndex) {
    stepsEdit.eq(stepIndex).show();
  }

  $('.step-btn-1').click(function(e) {
    e.preventDefault();
    hideStepEdit(actualStepEdit);
    actualStepEdit = 0;
    showStepEdit(actualStepEdit);
  });

  $('.step-btn-2').click(function(e) {
    e.preventDefault();
    hideStepEdit(actualStepEdit);
    actualStepEdit = 1;
    showStepEdit(actualStepEdit);
  });

  $('.step-btn-3').click(function(e) {
    e.preventDefault();
    hideStepEdit(actualStepEdit);
    actualStepEdit = 2;
    showStepEdit(actualStepEdit);
  });

  $('.step-btn-4').click(function(e) {
    e.preventDefault();
    hideStepEdit(actualStepEdit);
    actualStepEdit = 3;
    showStepEdit(actualStepEdit);
  });

  function hideStepEdit(stepIndex) {
    stepsEdit.eq(stepIndex).hide();
  }

  $('#TablaEtapaEdit').on('click', '.btn_edit', function() {
    var id = $(this).data('id');
    editarEtapa(id);
  });

  const stepEditEtapaContent = `
    <div class="form-step">
      <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Etapa registradas</h4>
        <small class="text-muted">Etapas registradas en esta campaña.</small>
      </div>
      <div class="row">
        <div class="form-group col-md-6">
            <input id="idEtapa" type="hidden">
            <label class="form-label" for="NombreEtapaEdit">Nombre</label>
            <input type="text" id="NombreEtapaEdit" aria-describedby="NombreEtapaErrorEdit"  class="form-control" />
            <div id="NombreEtapaErrorEdit" class="invalid-feedback NombreEtapa-errorEdit"></div>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="ordenEdit">Orden</label>
            <input type="text" id="ordenEdit" class="form-control" aria-describedby="ordenErrorEdit"  />
            <div id="ordenErrorEdit" class="invalid-feedback orden-errorEdit"></div>
        </div>
      </div>
      <div class="row">
        <div class="form-group  col-md-6">
            <label class="form-label" for="descripcionEtapaEdit">Descripcion de las Etapas</label>
            <textarea type="text" id="descripcionEtapaEdit" aria-describedby="descripcionEtapaErrorEdit"  class="form-control" placeholder="Ingrese la descripcion" rows="2"></textarea>
            <div id="descripcionEtapaErrorEdit" class="invalid-feedback descripcionEtapa-errorEdit"></div>
        </div>

        <div class="form-group col-md-6">
            <label class="form-label" for="tipoParticipacionEdit">Tipo de Participación</label>
            <select name="tipoParticipacionEdit" aria-describedby="tipoParticipacionErrorEdit"  id="tipoParticipacionEdit" class="form-control" onchange="userValidator(event, 'totalMinimo-container')">
                <option disabled selected>Selecciona una opción</option>
                <option value="0">Transacciones</option>
                <option value="1">Recurrentes</option>
                <option value="2">Acumular Transacciones</option>
                <option value="3">Acumular Transacciones Recurrentes</option>
                <option value="4">Acumular Valor</option>
                <option value="5">Combinar Transacciones</option>
            </select>
            <div id="tipoParticipacionErrorEdit" class="invalid-feedback tipoParticipacion-errorEdit"></div>
            <div class="btn-crear d-flex justify-content-end mt-2" >
                <button type="button" class="btn btn-outline-primary" id="add-step-btn-edit">Crear</button>
            </div>
        </div>
    </div>
  `;

  const stepEditParametrosContent = `
    <div class="form-step">
      <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Parametros de Etapa</h4>
        <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
      </div>
        <div class="row">
          <div class="form-group col-md-6">
              <input id="idParemetros" type="hidden">
              <label class="form-label" for="limiteParticipacionEdit">Limite de Participaciones</label>
              <input type="number" id="limiteParticipacionEdit" class="form-control" />
          </div>
          <div class="form-group col-md-6" id="totalMinimo-container">
              <label class="form-label" for="totalMinimoEdit">Total Minimo</label>
              <input type="number" id="totalMinimoEdit" class="form-control"/>
          </div>
      </div>
      <div class="row">
          <div class="form-group col-md-6">
              <label class="form-label" for="transaccionEdit">Transacción</label>
              <select name="" id="transaccionEdit" class="form-control">
                  <option disabled selected>Selecciona una opción</option>
              </select>
          </div>
          <div class="form-group col-md-6">
              <label class="form-label" for="limiteDiaEdit">Limite Diario</label>
              <input type="number" id="limiteDiaEdit" class="form-control" />
          </div>
      </div>
      <div class="row">
          <div class="form-group col-md-6">
              <label class="form-label" for="valorMinimoEdit">Valor Minimo</label>
              <input type="number" id="valorMinimoEdit" class="form-control" />
          </div>
          <div class="form-group col-md-6">
              <label class="form-label" for="valorMaximoEdit">Valor Maximo</label>
              <input type="number" id="valorMaximoEdit" class="form-control" />
          </div>
      </div>
      <div class="row">
          <div class="form-group col-md-6">
              <label class="form-label" for="RangoDiasEdit">Rango de Días</label>
              <input type="number" id="RangoDiasEdit" class="form-control" />
          </div>
          <div class="form-group col-md-6">
            <div class="btn-crear d-flex justify-content-end mt-2" >
              <button type="button" class="btn btn-outline-primary" id="addParamas">Agregar</button>
            </div>
          </div>
      </div>
      <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametrosEdit">
        <thead>
          <tr>
            <th>#</th>
            <th>Transaccion</th>
            <th>Valor Minimo</th>
            <th>Valor Maximo</th>
            <th>Accion</th>
          </tr>
        </thead>
      </table>
    </div>
  `;

  const stepEditPresupuestoContent = `
    <div class="form-step">
      <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Presupuesto</h4>
        <small class="text-muted">Ingresa los datos basicos del presupuesto.</small>
      </div>
      <div class="row">
      <div class="form-group col-md-6">
          <input id="idPresupuesto" type="hidden">
          <label class="form-label" for="departamentoEdit">Departamento</label>
          <select name="" id="departamentoEdit" aria-describedby="departamentoError" required class="form-control">
              <option disabled selected>Selecciona una opción</option>
          </select>
          <div id="departamentoError" class="invalid-feedback departamento-error"></div>
      </div>
      <div class="form-group col-md-6">
          <label class="form-label" for="municipioEdit">Municipio</label>
          <select name="municipioEdit" id="municipioEdit" aria-describedby="municipioError" required class="form-control">
              <option disabled selected>Selecciona una opción</option>
          </select>
          <div id="municipioError" class="invalid-feedback municipio-error"></div>
      </div>
      </div>
      <div class="row">
          <div class="form-group col-md-6">
              <label class="form-label" for="limiteGanadorEdit">Limite de Ganadores</label>
              <input type="text" id="limiteGanadorEdit" aria-describedby="limiteGanadorError" required class="form-control" />
              <div id="limiteGanadorErrorEdit" class="invalid-feedback limiteGanador-error"></div>
          </div>
          <div class="form-group col-md-6">
              <label class="form-label" for="presupuestoEdit">Presupuesto</label>
              <input type="text" id="presupuesto" aria-describedby="presupuestoError" required class="form-control" />
              <div id="presupuestoError" class="invalid-feedback presupuesto-error"></div>
  
              <div class="btn-crear d-flex justify-content-end mt-1" >
                  <button type="button" class="btn btn-outline-primary" id="addLocalidad">Agregar</button>
              </div>
          </div>
      </div>
      <!--Tabla-->
      <table class="datatables-basic table mb-3 mt-2 stepper-table" id="tableLocalidadEdit">
          <thead>
              <tr>
                  <th>#</th>
                  <th>DEPARTAMENTO</th>
                  <th>MUNICIPIO</th>
                  <th>LIMITE</th>
                  <th>PRESUPUESTO</th>
                  <th>Accion</th>
              </tr>
          </thead>
      </table>
      
    </div>
  `;

  const stepEditPremioContent = `
    <div class="form-step">
      <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Premio</h4>
        <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
      </div>
          <div class="row">
              <div class="form-group col-md-6">
                  <input id="idPremio" type="hidden">
                  <label class="form-label" for="tipoPremioEdit">Tipo de Premio</label>
                  <select name="tipoPremioEdit" aria-describedby="tipoPremioError"  id="tipoPremio" class="form-control">
                      <option disabled selected>Selecciona una opción</option>
                      <option value="0">Unico Premio</option>
                      <option value="1">Premio Random</option>
                      <option value="2">Todos los Premios</option>
                  </select>
                  <div id="tipoPremioErrorEdit" class="invalid-feedback tipoPremio-error"></div>
              </div>
              <div class="form-group col-md-6">
                  <label class="form-label" for="linkPremioEdit">Links de Premio</label>
                  <select name="linkPremioEdit" aria-describedby="linkPremioError"  id="linkPremio" class="form-control">
                      <option disabled selected>Selecciona una opción</option>
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                  </select>
                  <div id="linkPremioErrorEdit" class="invalid-feedback linkPremio-error"></div>
              </div>
          </div>
          <div class="row">
              <div class="form-group col-md-6">
                  <label class="form-label" for="premio">Premio</label>
                  <select name="premioEdit" id="premioEdit" aria-describedby="premioError"  class="form-control">
                      <option disabled selected>Selecciona una opción</option>
                  </select>
                  <div id="premioErrorEdit" class="invalid-feedback premio-error"></div>
              </div>
              <div class="form-group col-md-6">
                  <label class="form-label" for="valor">Valor</label>
                  <input type="number" id="valorEdit" aria-describedby="valorError"  class="form-control" />
                  <div id="valorErrorEdit" class="invalid-feedback valor-error"></div>
              </div>
          </div>
          <div class="row">
              <div class="form-group col-md-6">
                  <label class="form-label" for="porcentajePremioEdit">Porcentaje de Premio</label>
                  <input type="number" id="porcentajePremioEdit" aria-describedby="porcentajePremioError"  class="form-control" />
                  <div id="porcentajePremioError" class="invalid-feedback porcentajePremio-error"></div>
              </div>
              <div class="form-group col-md-6">
                  <div class="btn-crear d-flex justify-content-end mt-2" >
                      <button type="button" class="btn btn-outline-primary" id="addPremio">Agregar</button>
                  </div>
              </div>
          </div>
          <!--Tabla-->
          <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaPremioEdit">
              <thead>
                  <tr>
                      <th>#</th>
                      <th>PREMIO</th>
                      <th>VALOR</th>
                      <th>PORCENTAJE</th>
                      <th>Accion</th>
                  </tr>
              </thead>
          </table>  
    </div>
  `;

  const stepButtonsContent = `<div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" id="removeStepp" >Cancelar</button>
      <button type="button" id="GuardarEtapa" class="btn btn-primary" >Guardar</button>
    </div>`;

  $('#TablaEtapaEdit').on('click', '.btn_edit', function(event) {
    var id = $(this).data('id');
    editarEtapa(id);
    event.stopPropagation();
  });

  function addStepEdit(content) {
    var newStep = $(`<div class="step"></div>`).html(content);
    $('#stepperEdit').append(newStep);
    totalStepsEdit++;
    var previousStep = actualStepEdit;
    hideStepEdit(actualStepEdit);
    actualStepEdit = totalStepsEdit - 1;
    showStepEdit(actualStepEdit);
  }
  
  function createStepEditEtapa() {
    addStepEdit(stepEditEtapaContent);
  }
  
  function createStepEditParametros() {
    addStepEdit(stepEditParametrosContent);
  }
  
  function createStepEditPresupuesto() {
    addStepEdit(stepEditPresupuestoContent);
  }
  
  function createStepEditPremio() {
    addStepEdit(stepEditPremioContent);
  }
  function createStepButtons() {
    addStepEdit(stepButtonsContent);
  }
  // Función para editar una etapa
  function editarEtapa(id) {
    var etapa = dataEditEtapa.find(function(item) {
      return item.id === id;
    });
  
    if (etapa) {
      console.log(etapa, 'la etapa es')
      // Limpiar el stepper de edición antes de agregar nuevos pasos
      $('#stepperEdit').empty();
      totalStepsEdit = 0;
      actualStepEdit = 0;
  
      // Crear los pasos de edición
      createStepEditEtapa();
      createStepEditParametros();
      createStepEditPresupuesto();
      createStepEditPremio();
      createStepButtons();
  
      // Asignar los valores de la etapa a los campos de edición
      $('#idEtapa').val(etapa.id);
      $('#NombreEtapaEdit').val(etapa.nombre);
      $('#ordenEdit').val(etapa.orden);
      $('#descripcionEtapaEdit').val(etapa.descripcion);
      $('#tipoParticipacionEdit').val(etapa.tipoParticipacion);
      $('#idParemetros').val(etapa.parametros.id);
      //Mostrar los datos en las tablas correspondientes
      mostrarDatosEdit('#TablaParametrosEdit')
      mostrarDatosEdit('#tableLocalidadEdit')
      mostrarDatosEdit('#TablaPremioEdit')
      
      
     
    }
    
    function mostrarDatosEdit(tabla) {
      switch(tabla)
      {
        case '#tableLocalidadEdit':
            // Limpiar la tabla antes de insertar nuevas filas
          $('#tableLocalidadEdit').DataTable().clear().destroy();
    
          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#tableLocalidadEdit').DataTable({
            searching: false,
            paging: false,
            data: etapa.presupuestos,
            columns: [
              {
                render: function(data, type, row, meta) {
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idDepartamento',
                // render: function (data) {
                //   var departamento = $('#departamento option[value="' + data + '"]').text();
                //   return departamento;
                // },
                width: '25%'
              },
              {
            
                data: 'idMunicipio',
                // render: function (data, row) {
                //   var municipio = $('#municipio option[value="' + data + '"]').text();
                //   if (!municipio) {
                //     // Si no se encuentra el nombre del municipio, buscarlo en el arreglo datosTablaLocalidad
                //     var registro = datosTablaLocalidad.find(function(item) {
                //       return item.idMunicipio === data;
                //     });
                //     if (registro) {
                //       municipio = registro.nombreMunicipio;
                //     }
                //   }
                //   return municipio;
                // },
                width: '25%'
              },
              {
                data: 'limiteGanadores',
                width: '15%'
              },
              {
                data: 'valor',
                width: '15%'
              },
              {
                data: "id",
                render: function (data) {
                  return '<div class="btn-group">' +
                    '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                    feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                    '</a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    '<a href="#" data-id="' + data + '" class="btn_edit_localidad dropdown-item">' +
                    feather.icons['edit'].toSvg({ class: 'font-small-4 mr-50' }) + ' Editar' +
                    '</a>' +
                    '</div>' +
                    '</div>';
                },
                width: '15%'
              }
            ]
          });
        break;
  
        case'#TablaParametrosEdit':
          // Limpiar la tabla antes de insertar nuevas filas
          $('#TablaParametrosEdit').DataTable().clear().destroy();
        
          // Inicializar el DataTables con los datos de datosTablaParametro
          $('#TablaParametrosEdit').DataTable({
            data: etapa.parametros,
            searching: false, // Deshabilitar la funcionalidad de búsqueda
            paging: false,
            columns: [
              { 
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%' 
              },
              {
                data: 'idTransaccion',
                // render: function (data) {
                //   var transaccion = $('#transaccion option[value="' + data + '"]').text();
                //   return transaccion;
                // },
                width: '30%'
              },
              { data: 'ValorMinimo', width: '20%' },
              { data: 'ValorMaximo', width: '20%' },
              {
                data: "id",
                render: function (data) {
                  return '<div class="btn-group">' +
                    '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                    feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                    '</a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    '<a href="#" data-id="' + data + '" class="btn_edit_parametro dropdown-item">' +
                    feather.icons['edit'].toSvg({ class: 'font-small-4 mr-50' }) + ' Editar' +
                    '</a>' +
                    '</div>' +
                    '</div>';
                },
                width: '25%'
              }
            ]
          });
        break;
    
        case '#TablaPremioEdit':
           // Limpiar la tabla antes de insertar nuevas filas
           $('#TablaPremioEdit').DataTable().clear().destroy();
    
           // Inicializar el DataTables con los datos de datosTablaLocalidad
           $('#TablaPremioEdit').DataTable({
             searching: false, // Deshabilitar la funcionalidad de búsqueda
             paging: false,
             data: etapa.premiocampania,
             columns: [
               { 
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'  
              },
              {
                data: 'idPremio',
                // render: function (data) {
                //   var premio = $('#premio option[value="' + data + '"]').text();
                //   return premio;
                // },
                width: '30%'
              },
              { data: 'valor', width: '30%' },
              {
                data: 'linkPremio',
                // render: function (data) {
                //   return data === 1 ? 'Sí' : 'No';
                // },
                width: '30%'
              },
              {
                data: "id",
                render: function (data) {
                  return '<div class="btn-group">' +
                    '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                    feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                    '</a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    '<a href="#" data-id="' + data + '" class="btn_edit_premio dropdown-item">' +
                    feather.icons['edit'].toSvg({ class: 'font-small-4 mr-50' }) + ' Editar' +
                    '</a>' +
                    '</div>' +
                    '</div>';
                },
                width: '15%'
              }
             ]
           });
        break;
    
        default:
          break;
      }
  
    }

    $('#tableLocalidadEdit').on('click', '.btn_edit_localidad', function(event) {
      event.preventDefault();
      var id = $(this).data('id');
      editarLocalidad(id);
    });
  
    $('#TablaParametrosEdit').on('click', '.btn_edit_parametro', function(event) {
      event.preventDefault();
      var id = $(this).data('id');
      editarParametro(id);
    });
  
    $('#TablaPremioEdit').on('click', '.btn_edit_premio', function(event) {
      event.preventDefault();
      var id = $(this).data('id');
      editarPremio(id);
      console.log(id)
    });

    function editarLocalidad(id) {
      var presupuesto = etapa.presupuestos.find(function(item) {
        return item.id === id;
      });
    
      console.log(presupuesto)
      if(presupuesto){
        $('#idPresupuesto').val(presupuesto.id);
        $('#departamentoEdit').val(presupuesto.idDepartamento);
        $('#municipioEdit').val(presupuesto.idMunicipio);
        $('#limiteGanadorEdit').val(presupuesto.limiteGanadores);
        $('#presupuesto').val(presupuesto.valor);
        // Asignar otros campos según corresponda
      }
    }
    
    function editarParametro(id) {
    
    }
    
    function editarPremio(id) {
   
    }

  }



    // Evento de clic para el botón de guardar
  $('#stepperEdit').on('click', '#guardarEdicion', function() {
    // Obtener los valores actualizados de los campos de edición
    var id = $('#idEtapa').val();
    var nombre = $('#NombreEtapaEdit').val();
    // Obtener los demás valores actualizados de los campos de edición

    // Buscar la etapa en el arreglo dataEditEtapa y actualizarla
    var etapaIndex = dataEditEtapa.findIndex(function(item) {
      return item.id === id;
    });

    if (etapaIndex !== -1) {
      dataEditEtapa[etapaIndex].nombre = nombre;
      // Actualizar los demás valores de la etapa en el arreglo

      // Cerrar el modal de edición
      $('#modalEdit').modal('hide');

      // Actualizar la tabla de etapas
      mostrarDatosTabla("#TablaEtapaEdit");
    }
  });
    // Evento de clic para el botón de cancelar
  $('#stepperEdit').on('click', '#cancelarEdicion', function() {
    // Cerrar el modal de edición sin realizar ninguna acción adicional
    $('#modalEdit').modal('hide');
  });
}


// Modificar la función getEtapasData para recorrer el objeto de etapas
function getEtapasData() {
  const etapas = DataEtapa.map((stepData) => {
    return {
      ...stepData.etapa[0],
      parametros: stepData.parametros || [],
      presupuesto: stepData.presupuesto || [],
      premio: stepData.premio || []
    };
  });

  return etapas;
}

// Función para agregar datos a la tabla y al arreglo
$('#addBloqueo').click(function(){
  var usuarioBloqueo = $('#usuarioBloqueo').val();

  if(usuarioBloqueo){
    var block ={
      numero: usuarioBloqueo
    }

    bloqueadosUsuarios.push(block);
    $('#usuarioBloqueo').val("");
  }
});

// Función para cargar usuarios bloqueados desde un archivo XLSX
$('#Archivo').change(function(e) {
  var inputFile = e.target;
  var extPermitidas = /(.xlsx)$/;
  var restriccion = $('#restriccionUsuarios').val();

  if (!extPermitidas.exec(inputFile.value)) {
    Alert("El archivo debe ser un excel", "error");
    inputFile.value = "";
  } else {

    if(restriccion === 1 || restriccion === '1'){
        
      readXlsxFile(inputFile.files[0]).then(function(data) {
        data.map((row, indexP) => {
          var permitido = {
            numero: row[0],
            estado: 1
          };
  
          permitidoUsuario.push(permitido);
        });
        console.log(permitidoUsuario);
      });
    }else if(restriccion === 2 || restriccion === '2'){
        
      readXlsxFile(inputFile.files[0]).then(function(data) {
        data.map((row, indexP) => {
          var block = {
            numero: row[0],
            estado: 1
          };
  
          bloqueadosUsuarios.push(block);
        });
  
      });
    }else{
      bloqueadosUsuarios=[];
      permitidoUsuario =[];
    }
  }
});

$('#mostrar').click(function(){
  mostrarDatosTabla('#tablaBloqueo');
})

function mostrarDatosTabla(tabla) {

  switch(tabla)
  {
    case '#TablaEtapa':
        // Limpiar la tabla antes de insertar nuevas filas
      $('#TablaEtapa').DataTable().clear().destroy();

      // Inicializar el DataTables con los datos de datosTablaLocalidad
      $('#TablaEtapa').DataTable({
        searching: false, // Deshabilitar la funcionalidad de búsqueda
        paging: false,
        data: TEMP,
        columns: [
          { 
            render: function(data, type, row, meta) {
            // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
            return meta.row + 1;
            } 
          },
          { data: 'nombre' },
          { data: 'descripcion' },
          {
            render: function(data, type, row, meta) {
              var opcDelete = `
                <a href="#" class="dropdown-item" onclick="eliminarDato('${tabla}', ${meta.row})">
                  ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
                </a>
              `;
              return opcDelete;
            }
          }
        ]
    });


    case '#tablaBloqueo':
        // Limpiar la tabla antes de insertar nuevas filas
        $('#tablaBloqueo').DataTable().clear().destroy();
      
        // Inicializar el DataTables con los datos de datosTablaLocalidad
        $('#tablaBloqueo').DataTable({
          searching: false, // Deshabilitar la funcionalidad de búsqueda
          paging: false,
          data: bloqueadosUsuarios,
          columns: [
            {         
              render: function(data, type, row, meta) {
                // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                return meta.row + 1;
              } 
            },
            { data: 'numero' },
            {
              render: function(data, type, row, meta) {
                var opcDelete = `
                  <a href="#" class="dropdown-item"onclick="eliminarDato('${tabla}', ${meta.row}, event)">
                    ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
                  </a>
                `;
                return opcDelete;
              }
            }
          ]
        });
    break;

    case '#TablaEtapaEdit':
      // Limpiar la tabla antes de insertar nuevas filas
      $('#TablaEtapaEdit').DataTable().clear().destroy();

      // Inicializar el DataTables con los datos de dataEditEtapa
      $('#TablaEtapaEdit').DataTable({
        searching: false,
        paging: false,
        data: dataEditEtapa,
        columns: [
          {
            render: function (data, type, row, meta) {
              return meta.row + 1;
            }
          },
          { data: 'nombre' },
          { data: 'descripcion' },
          {
            data: "id",
            render: function (data) {
              return '<div class="btn-group">' +
                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                '</a>' +
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<a href="#" data-id="' + data + '" class="btn_edit dropdown-item">' +
                feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + ' Actualizar' +
                '</a>' +
                '<a href="#" onclick="OpenDelete(' + data + ')" class="btn_delete dropdown-item">' +
                feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + ' Inhabilitar' +
                '</a>' +
                '</div>' +
                '</div>';
            }
          }
        ]
      });
      break;

      default:
      break;
  }


}

function eliminarDato(tabla, index, event) {
  event.preventDefault(); 

  switch (tabla) {
    case '#tablaBloqueo':
      bloqueadosUsuarios.splice(index, 1);
      break;
    case '#TablaEtapa':
      TEMP.splice(index, 1);
      break;
    case '#tableLocalidad':
      datosTablaLocalidad.splice(index, 1);
      break;
    case '#TablaParametros':
      datosTablaParametro.splice(index, 1);
      break;
    case '#TablaPremio':
      datosTablaPremio.splice(index, 1);
      break;
    case '#TablaEtapaEdit':
      dataEditEtapa.splice(index, 1);
      mostrarDatosTabla(tabla);
      break;
    default:
      break;
  }

  // Retrasar la llamada a mostrarDatosTabla para que ocurra después de que se complete la operación de eliminación
  setTimeout(function() {
    mostrarDatosTabla(tabla);
  }, 0);
}

function previewImage(event, textImg, textContent) {
  const input = event.target;
  const preview = document.getElementById(textImg);
  let imgCampania = document.getElementById(textContent);
  
  if (imgCampania) {
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
      imgCampania.style.display = 'block';
    }
    
    // Agregar evento de clic al preview
    preview.parentElement.addEventListener('click', function() {
      input.click();
    });
  } else {
    console.error('Elemento con ID ' + textContent + ' no encontrado en el documento.');
  }
}

//Funcion para validar la restriccion de usuarios (Primeros cambios)
function userValidator(event, container) {
  const input = event.target;
  const containerArchivo = document.getElementById(container);
  const containerBloqueo = document.getElementById('Bloqueo');
  
  if (input.value === '0' || input.value === 0 || input.value === null) {
    containerArchivo.style.display = 'none';
    containerBloqueo.style.display = 'none';
    $('#Archivo').val('');
    
  } else {
    containerArchivo.style.display = 'block';
    containerBloqueo.style.display = 'none';
    $('#Archivo').val('');
    if(input.value === 2 || input.value === '2'){
      containerBloqueo.style.display = 'flex';
      $('#Archivo').val('');
    } 
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
        $('#proyectoEdit').append(opc);
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

      var selectDepartamento = document.getElementById('departamento');

      selectDepartamento.addEventListener('change', function() {
          var selectedId = this.value; 
          getMunicipioByDepto(selectedId); 
      });
    })
    .catch(err => console.log('error', err));
    return false;
}


const getMunicipioByDepto = (idDepartamento) => {
  $('#municipio').empty();
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: { "Authorization": token }
  };


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
      });
    })
    .catch(err => console.log('error', err));

  return false;
};

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

//Funcion para traer los Premios
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

//ver funcionalidad 
function Calendar () {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var selectedDateBegin = null;
  var selectedDateEnd = null;
  //var selectDateMiddle = null;

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
      //var isSelectedMiddle = selectDateMiddle == dateString;
      var isSelected = selectedDateBegin === dateString;
      isSelected += selectedDateEnd === dateString;
      calendar += '<div class="calendar-day' + (isSelected  ? ' selected' : '') + '" data-date="' + dateString + '">' + i + '</div>';
      
    }

    $('#calendar-days').html(calendar);
    $('.calendar-day').click(function() {
      var date = $(this).data('date');
  
      // Si el input de fecha de inicio está vacío
      if ($('#FechaIniRecordatorio').val() === '') {
        $('#FechaIniRecordatorio').val(date);
        selectedDateBegin = date;
  
        // Limpiar el input de fecha de fin
        $('#FechaFinRecordatorio').val('');
        selectedDateEnd = null;
      }
      // Si el input de fecha de inicio no está vacío
      else {
        // Si la fecha seleccionada es menor o igual a la fecha de inicio
        if (date <= $('#FechaIniRecordatorio').val()) {
          $('#FechaIniRecordatorio').val(date);
          selectedDateBegin = date;
  
          // Limpiar el input de fecha de fin
          $('#FechaFinRecordatorio').val('');
          selectedDateEnd = null;
        }
        // Si la fecha seleccionada es mayor a la fecha de inicio
        else {
          $('#FechaFinRecordatorio').val(date);
          selectedDateEnd = date;
        }
      }
  
      generateCalendar(currentYear, currentMonth);
      console.log(date, 'Fecha');
    });
  
    $('#FechaIniRecordatorio, #FechaFinRecordatorio').change(function() {
      selectedDateBegin = $('#FechaIniRecordatorio').val();
      selectedDateEnd = $('#FechaFinRecordatorio').val();
      generateCalendar(currentYear, currentMonth);
      console.log($(this).val(), 'Fecha');
    });
  }

  function getMonthName(month) {
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[month];
  }

  $('#prev-month').click(function(e) {
    e.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  });

  $('#next-month').click(function(e) {
    e.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  });

  generateCalendar(currentYear, currentMonth);
};


//Validacion de form
function validarCamposStep(stepIndex) {
  var config = `step${stepIndex+1}`;
  console.log(config)

  switch(config){
    case 'step1':{
      var fields = ['imgCampania', 'imgNotificacion', 'restriccionUsuarios', 'proyecto', 'tercerosCampania'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });
      
      return isValid;
    }

    case 'step2':{
      var fields = [
        'campania', 
        'notificacion', 
        'descripcionCampania', 
        'descripcionNotificacion',
        'Observaciones',
        'terminosCondiciones',
        'fechaRegistro',
        'usuarioPermitido',
        'fechaInicial',
        'fechaFinal',
        'edadInicial',
        'edadFinal',
        'tipoUsuarios',
        'sexo',
        'maximoParticipantes'
      ];

      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });

      var edadInicial = parseInt($('#edadInicial').val());
      var edadFinal = parseInt($('#edadFinal').val());
      if (edadInicial > edadFinal) {
        $('#edadInicial').addClass('is-invalid');
        $('#edadFinal').addClass('is-invalid');
        isValid = false;
      }
    
      // Validar que la fecha inicial no sea mayor que la fecha fin
      var fechaInicial = new Date($('#fechaInicial').val());
      var fechaFinal = new Date($('#fechaFinal').val());
      if (fechaInicial > fechaFinal) {
        $('#fechaInicial').addClass('is-invalid');
        $('#fechaFinal').addClass('is-invalid');
        isValid = false;
      }

      return isValid;
    }

    case 'step3':{
      var isValid = true;
      return isValid;

    }



    case 'step4':
    {
      var fields = [
        'FechaIniRecordatorio', 
        'FechaFinRecordatorio', 
        'HoraRecordatorio',
        'correo'
      ];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });
      
      return isValid;
    }
  }
  

}


function limpiarFormulario() {
 
  $('#campania').val('');
  $('#descripcionCampania').val('');
  $('#fechaRegistro').val('');
  $('#fechaInicial').val('');
  $('#fechaFinal').val('');
  $('#HoraRecordatorio').val('');
  $('#correo').val('');
  $('#edadInicial').val('');
  $('#edadFinal').val('');
  $('#sexo').val('');
  $('#tipoUsuarios').val('');
  $('#notificacion').val('');
  $('#descripcionNotificacion').val('');
  $('#imgCampania').val('');
  $('#imgNotificacion').val('');
  $('#maximoParticipantes').val('');
  $('#tercerosCampania').val('');
  $('#allday').prop('checked', false);
  $('#repeat').prop('checked', false);
  $('#FechaIniRecordatorio').val('');
  $('#FechaFinRecordatorio').val('');
  $('#terminosCondiciones').val('');
  $('#Observaciones').val('');
  $('#proyecto').val('');
  $('#restriccionUsuarios').val('');
  $('#Archivo').val('');
  $('#usuarioBloqueo').val('');

  // Limpiar las tablas
  $('#TablaEtapa').DataTable().clear().destroy();
  $('#tablaBloqueo').DataTable().clear().destroy();


  $('#campaniaEdit').val('');
  $('#descripcionCampaniaEdit').val('');
  $('#fechaRegistroEdit').val('');
  $('#fechaInicialEdit').val('');
  $('#fechaFinalEdit').val('');
  $('#HoraRecordatorioEdit').val('');
  $('#correoEdit').val('');
  $('#edadInicialEdit').val('');
  $('#edadFinalEdit').val('');
  $('#sexoEdit').val('');
  $('#tipoUsuariosEdit').val('');
  $('#notificacionEdit').val('');
  $('#descripcionNotificacionEdit').val('');
  $('#imgCampaniaEdit').val('');
  $('#imgNotificacionEdit').val('');
  $('#maximoParticipantesEdit').val('');
  $('#tercerosCampaniaEdit').val('');
  $('#alldayEdit').prop('checked', false);
  $('#repeatEdit').prop('checked', false);
  $('#FechaIniRecordatorioEdit').val('');
  $('#FechaFinRecordatorioEdit').val('');
  $('#terminosCondicionesEdit').val('');
  $('#ObservacionesEdit').val('');
  $('#proyectoEdit').val('');
  $('#restriccionUsuariosEdit').val('');
  $('#ArchivoEdit').val('');
  $('#usuarioBloqueoEdit').val('');

  // Limpiar las tablas
  $('#TablaEtapaEdit').DataTable().clear().destroy();
  $('#tablaBloqueoEdit').DataTable().clear().destroy();

  // Limpiar los arreglos
  TEMP = [];
  DataEtapa = [];
  bloqueadosUsuarios = [];
  dataEditEtapa=[]

}

const OpenEdit = (id) => {
  limpiarFormulario();
  console.log(id)
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Campania/${id}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Asignar los datos del registro a los campos del formulario
      $('#idCampania').val(id);
      $('#campaniaEdit').val(result.nombre);
      $('#descripcionCampaniaEdit').val(result.descripcion);
      $('#fechaRegistroEdit').val(result.fechaRegistro);
      $('#fechaInicialEdit').val(result.fechaInicio);
      $('#fechaFinalEdit').val(result.fechaFin);
      $('#HoraRecordatorioEdit').val(result.horaReporte);
      $('#correoEdit').val(result.emails);
      $('#edadInicialEdit').val(result.edadInicial);
      $('#edadFinalEdit').val(result.edadFinal);
      $('#sexoEdit').val(result.sexo);
      $('#tipoUsuariosEdit').val(result.tipoUsuario);
      $('#notificacionEdit').val(result.tituloNotificacion);
       $('#descripcionNotificacionEdit').val(result.descripcionNotificacion);
      //Asignar las imágenes si existen
      // if (result.imgPush) {
      //   $('#previewImgEdit').attr('src', `ruta/a/la/imagen/${result.imgPush}`);
      //   $('#previewImgEdit').show();
      // }
      // if (result.imgAkisi) {
      //   $('#previewNotificacionEdit').attr('src', `ruta/a/la/imagen/${result.imgAkisi}`);
      //   $('#previewNotificacionEdit').show();
      // }

      $('#maximoParticipanteEdits').val(result.maximoParticipaciones);
      $('#tercerosCampaniaEdit').val(result.campaniaTerceros);
      $('#alldayEdit').prop('checked', result.allDay === 1);
      $('#repeatEdit').prop('checked', result.repetir === 1);
      $('#FechaIniRecordatorioEdit').val(result.fechaRecordatorioIni);
      $('#FechaFinRecordatorioEdit').val(result.fechaRecordatorioFin);
      $('#terminosCondicionesEdit').val(result.terminosCondiciones);
      $('#ObservacionesEdit').val(result.observaciones);
      $('#proyectoEdit').val(result.idProyecto);
      dataEditEtapa = result.etapas;
      console.log(dataEditEtapa, "asignacion")

      // Mostrar las etapas en la tabla
      mostrarDatosTabla("#TablaEtapaEdit");
      // Mostrar el modal
      $('#modalEdit').modal('toggle');


    })
    .catch(error => console.log('error', error));
};


const getAllCampanias = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: { "Authorization": token }
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      table("tableTodas", result);
      $("#textTodas").text(result.length);

      let activas = result.filter((x) => x.estado == 1);
      $("#textActivas").text(activas.length);
      table("tableActivas", activas);

      let pausadas = result.filter((x) => x.estado == 2);
      $("#textPausadas").text(pausadas.length);
      table("tablePausada", pausadas);

      let borrador = result.filter((x) => x.estado == 3);
      $("#textBorrador").text(borrador.length);
      table("tableBorrador", borrador);

      let archivo = result.filter((x) => x.estado == 4);
      $("#textArchivo").text(archivo.length);
      table("tableArchivo", archivo);
    })
    .catch((error) => console.log("error", error));
};


//Funcion para la visualizacion de las tablas (Ver funcionalidad de Archivadas)
const table = (table, data) => {

  $("#" + table).dataTable({
    destroy: true,
    data,
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
              case 4:
                return `Archivadas`;
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
              opcAdd += `<a href="#"  class="btn_pausar dropdown-item">
              ${feather.icons["pause-circle"].toSvg({
                class: "font-small-4 mr-50",
              })} Pausar
            </a>`;
              break;
            case 2:
              opcAdd += `<a href="#"  class="btn_activar dropdown-item">
                ${feather.icons["play"].toSvg({
                class: "font-small-4 mr-50",
              })} Activar
              </a>`;
              break;
          }
      
          if (row.estado != 0) {
            opcAdd += `<a href="#" class="btn_edit dropdown-item"  onclick="OpenEdit(${data})" data-toggle="modal" data-target="#modalEdit">
            ${feather.icons["archive"].toSvg({
              class: "font-small-4 mr-50",
            })} Actualizar
            </a>  
            <a href="#" onclick="eliminarFila(${data})" class="btn_delete dropdown-item">
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
      ">t" +
      '<"d-flex justify-content-between mx-2 row mb-1"' +
      '<"col-sm-12 col-md-6"i>' +
      '<"col-sm-12 col-md-6"p>' +
      ">",
    language: {
      sLengthMenu: "Show _MENU_",
      search: "Buscar",
      searchPlaceholder: "Buscar...",
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
        }
      },
    ],
  });
};

