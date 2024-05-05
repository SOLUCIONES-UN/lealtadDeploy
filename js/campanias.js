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
    console.log(data,'data tab')
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });

  $('#btnSubmitEdit').click(function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del clic
  
    // Enviar el formulario
    $('#formEdit').submit();
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
          getAllCampanias();
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
    console.log('entro a el form edit')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    $("#btnSubmitEdit").attr("disabled", true);

    const id = $('#idCampania').val();
    const valor = $('#tipoUsuariosEdit').val();
    console.log(id, 'idCampaña')
    var raw = JSON.stringify({
      id :$('#idCampaniaEdit').val(),
      nombre: $('#campaniaEdit').val(),
      descripcion: $('#descripcionCampaniaEdit').val(),
      fechaCreacion: "2024-03-05",
      fechaRegistro: $("#fechaRegistroEdit").val(),
      fechaInicio: $("#fechaInicialEdit").val(),
      fechaFin: $("#fechaFinalEdit").val(),
      diaReporte: 3,
      horaReporte: $('#HoraRecordatorioEdit').val(),
      emails: $('#correoEdit').val(),
      edadInicial:parseInt($('#edadInicialEdit').val()),
      edadFinal: parseInt($('#edadFinalEdit').val()),
      sexo: parseInt($('#sexoEdit').val()),
      tipoUsuario: valor,
      tituloNotificacion: $('#notificacionEdit').val() ,
      descripcionNotificacion:  $('#descripcionNotificacionEdit').val(),
      imgPush: "dato.png",
      imgAkisi: "dato2.png",
      estado: 1,
      maximoParticipaciones:  parseInt($('#maximoParticipantesEdit').val()),
      campaniaTerceros: parseInt($('#tercerosCampaniaEdit').val()),
      allDay: parseInt($('#alldayEdit').val()),
      repetir: parseInt($('#repeatEdit').val()),
      fechaRecordatorioIni: $('#FechaIniRecordatorioEdit').val(),
      fechaRecordatorioFin: $('#FechaFinRecordatorioEdit').val(),
      terminosCondiciones: $('#terminosCondicionesEdit').val(),
      observaciones: $('#ObservacionesEdit').val(),
      esArchivada: 0, //verificar por lo del boton
      restriccionUser: parseInt($('#restriccionUsuariosEdit').val()),
      idProyecto: parseInt($('#proyectoEdit').val()),
      etapas: dataEditEtapa, //cambiar
      bloqueados: bloqueadosUsuarios, //ver funcionalidad
      participacion:permitidoUsuario //ver funcionalidad
    });

    console.log(raw, 'raw')

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
                getAllCampanias();
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
    console.log('Entra a DELETE')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);


    const id = $('#idDelete').val();

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`${url}Campania/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                limpiarFormulario();
                console.log('Elimino')
                getAllCampanias();
                $('#modalDelete').modal('toggle');
                Alert(result.message, 'success');
            } else {
                Alert(result.message, 'error');
            }

        })
        .catch(error => { Alert(error.errors, 'error') });            
  })
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
      console.log()
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
                    <a href="#" class="dropdown-item" id="btnEliminar" onclick="eliminarDato('${tabla}', ${meta.row}, event)">
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
                    <a href="#" class="dropdown-item" id="EliminarDato"  onclick="eliminarDato('${tabla}', ${meta.row}, event)">
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
                    <a href="#" class="dropdown-item"  onclick="eliminarDato('${tabla}', ${meta.row}, event)">
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

    // function eliminarDato( index) {
    //   console.log('Eliminar dato')
    //   // switch (tabla) {
    //   //   case '#tableLocalidad':
    //   //     datosTablaLocalidad.splice(index, 1);
    //   //     break;
    //   //   case '#TablaParametros':
    //   //     datosTablaParametro.splice(index, 1);
    //   //     break;
    //   //   case '#TablaPremio':
    //   //     datosTablaPremio.splice(index, 1);
    //   //     break;
    //   //   default:
    //   //     break;
    //   // }
    //   // mostrarDatosTabla(tabla);
    // }
  }

}


//Función del stepper
function initStepperEdit() {
  let actualStepEdit = 0;
  var stepsEdits = $('#stepperEdit').children(); // Obtener todos los elementos hijos del contenedor #stepper
  var totalStepsEdits = stepsEdits.length;
  Calendar();

  showStep(actualStepEdit);

  $('.next-btn-edit').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado

    if (actualStepEdit < totalStepsEdits - 1) {
      hideStep(actualStepEdit);
      actualStepEdit++;
      showStep(actualStepEdit);
      console.log(actualStepEdit);
    }
  });

  $('.prev-btn-edit').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado

    if (actualStepEdit > 0) {
      hideStep(actualStepEdit);
      actualStepEdit--;
      showStep(actualStepEdit);
    }
  });

  function showStep(stepIndex) {
    stepsEdits.eq(stepIndex).show();

    // Cambiar el color del botón correspondiente al paso actual
    $('.step-progress-edit').removeClass('active');
    $('.step-btn-' + (stepIndex + 1) + 'edit').addClass('active');
  }

  // Agregar evento de clic a los botones de la parte superior
  $('.step-btn-1-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 0;
    showStep(actualStepEdit);
  });

  $('.step-btn-2-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 1;
    showStep(actualStepEdit);
  });

  $('.step-btn-3-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 2;
    showStep(actualStepEdit);
  });

  $('.step-btn-4-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 3;
    showStep(actualStepEdit);
  });

  function hideStep(stepIndex) {
    stepsEdits.eq(stepIndex).hide();
  }

  var previousStep
  var newStep
 $('#TablaEtapaEdit').on('click', '.btn_edit', function(event) {
   var id = $(this).data('id');
   console.log('entra aqui')
   getDepartamento();
   getTransaccion();
   getPremio();
   addStepEdit(`
   <div class="form-step">
     <div class="content-header mt-2 mb-1">
       <h4 class="mb-0">Configuración de Etapa</h4>
       <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
     </div>
     <div class="row">
       <div class="form-group col-md-6">
         <input id="idEtapa" type="hidden">
         <label class="form-label" for="NombreEtapaEdit">Nombre</label>
         <input type="text" id="NombreEtapaEdit" aria-describedby="NombreEtapaError" class="form-control" />
         <div id="NombreEtapaError" class="invalid-feedback NombreEtapa-error"></div>
       </div>
       <div class="form-group col-md-6">
         <label class="form-label" for="ordenEdit">Orden</label>
         <input type="number" id="ordenEdit" class="form-control" aria-describedby="ordenError" />
         <div id="ordenError" class="invalid-feedback orden-error"></div>
       </div>
     </div>
     <div class="row">
       <div class="form-group col-md-6">
         <label class="form-label" for="descripcionEtapaEdit">Descripción de las Etapas</label>
         <textarea type="text" id="descripcionEtapaEdit" aria-describedby="descripcionEtapaError" class="form-control" placeholder="Ingrese la descripción" rows="2"></textarea>
         <div id="descripcionEtapaError" class="invalid-feedback descripcionEtapa-error"></div>
       </div>
       <div class="form-group col-md-6">
         <label class="form-label" for="tipoParticipacionEdit">Tipo de Participación</label>
         <select name="tipoParticipacionEdit" aria-describedby="tipoParticipacionError" id="tipoParticipacion" class="form-control">
           <option disabled selected>Selecciona una opción</option>
           <option value="0">Transacciones</option>
           <option value="1">Recurrentes</option>
           <option value="2">Acumular Transacciones</option>
           <option value="3">Acumular Transacciones Recurrentes</option>
           <option value="4">Acumular Valor</option>
           <option value="5">Combinar Transacciones</option>
         </select>
         <div id="tipoParticipacionError" class="invalid-feedback tipoParticipacion-error"></div>
       </div>
     </div>
     <div class="row">
       <div class="form-group col-md-6">
         <label class="form-label" for="RangoTiempoEdit">Tipo de Participación</label>
         <select name="RangoTiempoEdit" aria-describedby="RangoTiempoError" id="RangoTiempo" class="form-control">
           <option disabled selected>Selecciona una opción</option>
           <option value="0">Diaria</option>
           <option value="1">Semanal</option>
           <option value="2">Anual</option>
         </select>
         <div id="RangoTiempoError" class="invalid-feedback RangoTiempo-error"></div>
       </div>
       <div class="form-group col-md-6">
         <label class="form-label" for="intervaloEdit">Intervalo de tiempo</label>
         <input type="number" id="intervaloEdit" class="form-control" aria-describedby="intervaloError" />
         <div id="intervaloError" class="invalid-feedback intervalo-error"></div>
       </div>
     </div>
     <div class="row">
       <div class="col-md-12">
         <div id="inputsContainer">
           <div id="inputsTipo0" style="display: none;">
             <!-- Inputs para Acumuladas -->
             <div class="row">
               <div class="form-group col-md-6">
                 <label class="form-label" for="minimoTransaccionEdit">Mínimo Transacción</label>
                 <input type="text" id="minimoTransaccion" class="form-control" />
               </div>
             </div>
           </div>

           <div id="inputsTipo1" style="display: none;">
             <!-- Inputs para Acumuladas -->
             <div class="row">
               <div class="form-group col-md-6">
                 <label class="form-label" for="TotalMinimo">Total Mínimo</label>
                 <input type="text" id="TotalMinimo" class="form-control" />
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Edición de Parámetros de Etapa</h4>
         <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <input id="idParametros" type="hidden">
           <label class="form-label" for="limiteParticipacionEdit">Límite de Participaciones</label>
           <input type="number" id="limiteParticipacionEdit" class="form-control" />
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="transaccionEdit">Transacción</label>
           <select name="" id="transaccionEdit" class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="valorMinimoEdit">Valor Mínimo</label>
           <input type="number" id="valorMinimoEdit" class="form-control" />
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="valorMaximoEdit">Valor Máximo</label>
           <input type="number" id="valorMaximoEdit" class="form-control" />
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="limiteDiaEdit">Límite Diario</label>
           <input type="number" id="limiteDiaEdit" class="form-control" />
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-12">
           <div class="btn-crear d-flex justify-content-end mt-2">
             <button type="button" class="btn btn-outline-primary" id="addParamasEdit">Agregar</button>
           </div>
         </div>
       </div>
       <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametrosEdit">
         <thead>
           <tr>
             <th>#</th>
             <th>Transacción</th>
             <th>Valor Mínimo</th>
             <th>Valor Máximo</th>
             <th>Acción</th>
           </tr>
         </thead>
       </table>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Configuración de Presupuesto</h4>
         <small class="text-muted">Ingresa los datos básicos del presupuesto.</small>
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
           <label class="form-label" for="limiteGanadorEdit">Límite de Ganadores</label>
           <input type="text" id="limiteGanadorEdit" aria-describedby="limiteGanadorError" required class="form-control" />
           <div id="limiteGanadorErrorEdit" class="invalid-feedback limiteGanador-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="presupuestoEdit">Presupuesto</label>
           <input type="text" id="presupuestoEdit" aria-describedby="presupuestoError" required class="form-control" />
           <div id="presupuestoError" class="invalid-feedback presupuesto-error"></div>

           <div class="btn-crear d-flex justify-content-end mt-1">
             <button type="button" class="btn btn-outline-primary" id="addLocalidadEdit">Agregar</button>
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
             <th>LÍMITE</th>
             <th>PRESUPUESTO</th>
             <th>Acción</th>
           </tr>
         </thead>
       </table>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Configuración de Premio</h4>
         <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <input id="idPremio" type="hidden">
           <label class="form-label" for="tipoPremioEdit">Tipo de Premio</label>
           <select name="tipoPremioEdit" aria-describedby="tipoPremioError" id="tipoPremio" class="form-control">
             <option disabled selected>Selecciona una opción</option>
             <option value="0">Único Premio</option>
             <option value="1">Premio Random</option>
             <option value="2">Todos los Premios</option>
           </select>
           <div id="tipoPremioErrorEdit" class="invalid-feedback tipoPremio-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="linkPremioEdit">Links de Premio</label>
           <select name="linkPremioEdit" aria-describedby="linkPremioError" id="linkPremioEdit" class="form-control">
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
           <select name="premioEdit" id="premioEdit" aria-describedby="premioError" class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
           <div id="premioErrorEdit" class="invalid-feedback premio-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="valorEdit">Valor</label>
           <input type="number" id="valorEdit"
           aria-describedby="valorError" class="form-control" />
          <div id="valorErrorEdit" class="invalid-feedback valor-error"></div>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-md-6">
          <label class="form-label" for="porcentajePremioEdit">Porcentaje de Premio</label>
          <input type="number" id="porcentajePremioEdit" aria-describedby="porcentajePremioError" class="form-control" />
          <div id="porcentajePremioError" class="invalid-feedback porcentajePremio-error"></div>
        </div>
        <div class="form-group col-md-6">
          <div class="btn-crear d-flex justify-content-end mt-2">
            <button type="button" class="btn btn-outline-primary" id="addPremioEdit">Agregar</button>
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
            <th>LINK</th>
            <th>Acción</th>
          </tr>
        </thead>
      </table>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" id="removeSteppEdit">Cancelar</button>
        <button type="button" id="GuardarEtapaEdit" class="btn btn-primary">Guardar</button>
      </div>
    </div>
    `, id);
   editarEtapa(id);
   event.stopPropagation();
 });

 function addStepEdit(content) {
  console.log('id add')
    newStep = $(`<div class="step"></div>`).html(content);
   $('#stepperEdit').append(newStep);
   totalStepsEdits++;
    previousStep = actualStepEdit; // Guardar el valor actual de actualStepEdit
   hideStep(actualStepEdit);
   actualStepEdit = totalStepsEdits - 1;
   showStep(actualStepEdit);
 }

   // Función para editar una etapa
   function editarEtapa(id) {
    var etapa = dataEditEtapa.find(function(item) {
      return item.id === id;
    });

    if (etapa) {
      console.log(etapa, 'la etapa es')

   
    newStep.find('#removeSteppEdit').click(function(e) {
      e.preventDefault();
      hideStep(actualStepEdit);
      actualStepEdit = previousStep; // Establecer actualStep al valor guardado
      showStep(actualStepEdit);
      newStep.html('');
      stepData = null;
      
    });

      $('#GuardarEtapaEdit').off('click').on('click', function(e) {
        e.preventDefault();
  
        // Obtener los datos actualizados de la etapa desde los campos de entrada
        var nombre = $('#NombreEtapaEdit').val();
        var orden = $('#ordenEdit').val();
        var descripcion = $('#descripcionEtapaEdit').val();
        var tipoParticipacion = $('#tipoParticipacionEdit').val();
  
        // Actualizar los datos de la etapa
        etapa.nombre = nombre;
        etapa.orden = orden;
        etapa.descripcion = descripcion;
        etapa.tipoParticipacion = tipoParticipacion;
  
        // Buscar la etapa editada en el arreglo dataEditEtapa
        var etapaIndex = dataEditEtapa.findIndex(function(item) {
          return item.id === id;
        });
  
        if (etapaIndex !== -1) {
          // Actualizar la etapa editada en el arreglo dataEditEtapa
          dataEditEtapa[etapaIndex] = etapa;
  
          console.log(dataEditEtapa, 'data pasando');
          //Funciones del stepp
          hideStep(actualStepEdit);
          actualStepEdit = previousStep; // Establecer actualStep al valor guardado
          showStep(actualStepEdit);
          newStep.html('');
           stepData = null;
          Alert('Etapa actualizada correctamente', 'success');
        } else {
          Alert('No se pudo encontrar la etapa editada', 'error');
        }
      });


      // Asignar los valores de la etapa a los campos de edición
      $('#idEtapa').val(etapa.id);
      $('#NombreEtapaEdit').val(etapa.nombre);
      $('#ordenEdit').val(etapa.orden);
      $('#descripcionEtapaEdit').val(etapa.descripcion);
      $('#tipoParticipacionEdit').val(etapa.tipoParticipacion);
      console.log('tipo participacion', etapa.tipoParticipacion)
      $('#idParemetros').val(etapa.parametros.id);
      //Mostrar los datos en las tablas correspondientes
      mostrarDatosEdit('#TablaParametrosEdit', etapa);
      mostrarDatosEdit('#tableLocalidadEdit', etapa);
      mostrarDatosEdit('#TablaPremioEdit', etapa);


      // Event listeners para los botones de editar y eliminar de la tabla
      $('#TablaParametrosEdit tbody').on('click', '.btn_edit_parametro', function () {
        var id = $(this).data('id');
        console.log(id, 'edit Parametros')
        editarParametro(id, etapa); // Pasar etapa como argumento
      });

      $('#TablaParametrosEdit tbody').on('click', '.btn_delete_parametro', function() {
        var id = $(this).data('id');
        console.log(id, 'delete Parametros')
        eliminarParametro(id, etapa);
      });

      $('#tableLocalidadEdit tbody').on('click', '.btn_edit_localidad', function() {
        //event.preventDefault();
        var id = $(this).data('id');
        console.log(id, 'edit localidades')
        editarLocalidad(id);
      });

      $('#tableLocalidadEdit tbody').on('click', '.btn_delete_localidad', function() {
        //event.preventDefault();
        var id = $(this).data('id');
        console.log(id, 'delete localidades')
        eliminarLocalidad(id);
      });

      $('#TablaPremioEdit tbody').on('click', '.btn_edit_premio', function() {
        // event.preventDefault();
        var id = $(this).data('id');
        editarPremio(id);
      });

      $('#TablaPremioEdit tbody').on('click', '.btn_delete_premio', function() {
        // event.preventDefault();
        var id = $(this).data('id');
        eliminarPremio(id);
      });
    }

    function editarParametro(id) {
      if (etapa) {
        var parametroIndex = etapa.parametros.findIndex(function(item) {
          return item.id === id;
        });
    
        if (parametroIndex !== -1) {
          var parametro = etapa.parametros[parametroIndex];
    
          // Eliminar el registro del arreglo datosTablaParametro
          etapa.parametros.splice(parametroIndex, 1);
    
          // Mostrar los datos del registro seleccionado en los inputs
          $('#idParemetros').val(parametro.id);
          $('#limiteParticipacionEdit').val(parametro.limiteParticipacion);
          $('#transaccionEdit').val(parametro.idTransaccion);
          $('#valorMinimoEdit').val(parametro.ValorMinimo);
          $('#valorMaximoEdit').val(parametro.ValorMaximo);
    
          // Actualizar la tabla de parámetros
          mostrarDatosEdit('#TablaParametrosEdit', etapa);
        }
      }
    }
    
    // Evento de clic para el botón de guardar parámetro editado
    $('#addParamasEdit').click(function() {
      var id = $('#idParemetros').val();
      var limiteParticipacion = $('#limiteParticipacionEdit').val();
      var idTransaccion = $('#transaccionEdit').val();
      var ValorMinimo = $('#valorMinimoEdit').val();
      var ValorMaximo = $('#valorMaximoEdit').val();
    
      // Crear un nuevo objeto con los valores actualizados
      var parametroActualizado = {
        id: id,
        limiteParticipacion: limiteParticipacion,
        idTransaccion: idTransaccion,
        tipoTransaccion: 0,
        ValorMinimo: ValorMinimo,
        ValorMaximo: ValorMaximo,
        valorAnterior: 0,
        estado:1
      };
    
      // Agregar el parámetro actualizado al arreglo datosTablaParametro
      etapa.parametros.push(parametroActualizado);
      console.log(etapa.parametros, 'actualizacion')
      console.log(etapa)
      // Actualizar la tabla de parámetros
      mostrarDatosEdit('#TablaParametrosEdit', etapa);
    
      // Limpiar los inputs después de guardar
      $('#idParemetros').val('');
      $('#limiteParticipacionEdit').val('');
      $('#transaccionEdit').val('');
      $('#valorMinimoEdit').val('');
      $('#valorMaximoEdit').val('');
    });

    //Funcion asociada
    function editarLocalidad(id) {
      if (etapa) {
        var presupuestosIndex = etapa.presupuestos.findIndex(function(item) {
          return item.id === id;
        });

        console.log(presupuestosIndex, 'valor');

        if (presupuestosIndex !== -1) {
          var presupuesto = etapa.presupuestos[presupuestosIndex];

          // Eliminar el registro del arreglo datosTablaParametro
          etapa.presupuestos.splice(presupuestosIndex, 1);

          console.log(etapa.presupuestos, 'presupuesto INDEX')

          // Mostrar los datos del registro seleccionado en los inputs
          $('#idPresupuesto').val(presupuesto.id);
          $('#departamentoEdit').val(presupuesto.idDepartamento);
          getMunicipioByDepto(presupuesto.idDepartamento)
          $('#limiteGanadorEdit').val(presupuesto.limiteGanadores);
          $('#presupuestoEdit').val(presupuesto.valor);

          $('#GuardarEtapaEdit').click(function(e) {
            e.preventDefault();
      
            // Obtener los datos actualizados de la etapa desde los campos de entrada
            var nombre = $('#NombreEtapaEdit').val();
            var orden = $('#ordenEdit').val();
            var descripcion = $('#descripcionEtapaEdit').val();
            var tipoParticipacion = $('#tipoParticipacionEdit').val();
      
            // Actualizar los datos de la etapa
            etapa.nombre = nombre;
            etapa.orden = orden;
            etapa.descripcion = descripcion;
            etapa.tipoParticipacion = tipoParticipacion;
      
            // Buscar la etapa editada en el arreglo dataEditEtapa
            var etapaIndex = dataEditEtapa.findIndex(function(item) {
              return item.id === id;
            });
      
            if (etapaIndex !== -1) {
              // Actualizar la etapa editada en el arreglo dataEditEtapa
              dataEditEtapa[etapaIndex] = etapa;
      
              console.log(dataEditEtapa, 'data pasando');
              volver();
              Alert('Etapa actualizada correctamente', 'success');
            } else {
              Alert('No se pudo encontrar la etapa editada', 'error');
            }
          })

          // Actualizar la tabla de parámetros
          mostrarDatosEdit('#tableLocalidadEdit', etapa);
        }
      }
    }

    // Evento de clic para el botón de guardar presupuesto editado
    $('#addLocalidadEdit').click(function() {
      var id = $('#idPresupuesto').val();
      var idDepartamento = $('#departamentoEdit').val();
      var idMunicipio = $('#municipioEdit').val();
      var limiteGanadores = $('#limiteGanadorEdit').val();
      var valor = $('#presupuestoEdit').val();

      // Crear un nuevo objeto con los valores actualizados
      var presupuestoActualizado = {
        id: id,
        idDepartamento: idDepartamento,
        idMunicipio: idMunicipio,
        limiteGanadores: limiteGanadores,
        valor: valor,
        estado: 1,
      };

      // Agregar el presupuesto actualizado al arreglo etapa.presupuestos
      etapa.presupuestos.push(presupuestoActualizado);
      console.log(etapa.presupuestos, 'actualizacion')
      console.log(etapa)

      // Actualizar la tabla de presupuestos
      mostrarDatosEdit('#tableLocalidadEdit', etapa);

      // Limpiar los inputs después de guardar
      $('#idPresupuesto').val('');
      $('#departamentoEdit').val('');
      $('#municipioEdit').val('');
      $('#limiteGanadorEdit').val('');
      $('#presupuestoEdit').val('');
    });    
    //Funcion asociada
    function editarPremio(id) {
      if (etapa) {
        var premioIndex = etapa.premiocampania.findIndex(function(item) {
          return item.id === id;
        });
    
        if (premioIndex !== -1) {
          var premio = etapa.premiocampania[premioIndex];
    
          // Eliminar el registro del arreglo datosTablaParametro
          etapa.premiocampania.splice(premioIndex, 1);
    
          // Mostrar los datos del registro seleccionado en los inputs
          $('#idPremio').val(premio.id);
          $('#valorEdit').val(premio.valor);
          $('#linkPremioEdit').val(premio.linkPremio);
          $('#premioEdit').val(premio.idPremio); // Asignar el valor del premio al select
          $('#porcentajePremioEdit').val(); //verificar si se va a poner
    
          // Actualizar la tabla de parámetros
          mostrarDatosEdit('#TablaPremioEdit', etapa);
        }
      }
    }    
    // Evento de clic para el botón de guardar parámetro editado
    $('#addPremioEdit').click(function() {
      var id = $('#idPremio').val();
      var valor = $('#valorEdit').val();
      var linkPremio = $('#linkPremioEdit').val();
      var idPremio = $('#premioEdit').val();
      var porcentaje = $('#porcentajePremioEdit').val();
    
      // Crear un nuevo objeto con los valores actualizados
      var premioActualizado = {
        id: id,
        valor: valor,
        linkPremio: linkPremio,
        idPremio: idPremio,
        estado: 1
      };
    
      // Agregar el parámetro actualizado al arreglo datosTablaParametro
      etapa.premiocampania.push(premioActualizado);
      console.log(etapa.premioActualizado, 'actualizacion')
      console.log(etapa)
      // Actualizar la tabla de parámetros
      mostrarDatosEdit('#TablaPremioEdit', etapa);
    
      // Limpiar los inputs después de guardar
      $('#idPremio').val('');
      $('#valorEdit').val('');
      $('#linkPremioEdit').val('');
      $('#tipoPremioEdit').val(''); // Asignar el valor del premio al select
      $('#porcentajePremioEdit').val(''); 
    });


    function eliminarLocalidad(id) {
      if (etapa) {
        var presupuestoIndex = etapa.presupuestos.findIndex(function(item) {
          return item.id === id;
        });
        
        if (presupuestoIndex !== -1) {
          etapa.presupuestos[presupuestoIndex].estado = 0; // Cambiar el estado a 0
          mostrarDatosEdit('#tableLocalidadEdit', etapa); // Actualizar la tabla
        }
      }
    }
  
    function eliminarParametro(id) {
      if (etapa) {
        var parametroIndex = etapa.parametros.findIndex(function(item) {
          return item.id === id;
        });
        console.log(parametroIndex)
        if (parametroIndex !== -1) {
          etapa.parametros[parametroIndex].estado = 0; // Cambiar el estado a 0
          mostrarDatosEdit('#TablaParametrosEdit', etapa); // Actualizar la tabla
        }
      }
    }
  
    function eliminarPremio(id) {
      if (etapa) {
        var premioIndex = etapa.premiocampania.findIndex(function(item) {
          return item.id === id;
        });
    
        if (premioIndex !== -1) {
          etapa.premiocampania[premioIndex].estado = 0; // Cambiar el estado a 0
          mostrarDatosEdit('#TablaPremioEdit', etapa); // Actualizar la tabla
        }
      }
    }

    function mostrarDatosEdit(tabla, etapa) {
      switch(tabla)
      {
        case '#tableLocalidadEdit':
          //filtro
          const presupuestosActivos = etapa.presupuestos.filter(item => item.estado === 1);

          // Limpiar la tabla antes de insertar nuevas filas
          $('#tableLocalidadEdit').DataTable().clear().destroy();
  
          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#tableLocalidadEdit').DataTable({
            searching: false,
            paging: false,
            data: presupuestosActivos,
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
                  var departamento = $('#departamentoEdit option[value="' + data + '"]').text();
                  return departamento;
                },
                width: '25%'
            },
            {
  
              data: 'idMunicipio',
              render: function (data, row) {
                  var municipio = $('#municipioEdit option[value="' + data + '"]').text();
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
              data: "id",
              render: function (data) {
                return `<div>
                  <a href="#" data-id="${data}" class="btn_edit_localidad dropdown-item">
                  ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
                  </a>
                  <a href="#"  data-id="${data}" class="btn_delete_localidad dropdown-item">
                    ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                  </a> 
                </div>`;
              },
              width: '15%'           
            }
          ]
        });
      break;
  
      case'#TablaParametrosEdit':
        const parametro = etapa.parametros.filter(item => item.estado === 1);
        // Limpiar la tabla antes de insertar nuevas filas
        $('#TablaParametrosEdit').DataTable().clear().destroy();
  
        // Inicializar el DataTables con los datos de datosTablaParametro
        $('#TablaParametrosEdit').DataTable({
          data: parametro,
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
                var transaccion = $('#transaccionEdit option[value="' + data + '"]').text();
                return transaccion;
              },
              width: '30%'
            },
            { data: 'ValorMinimo', width: '20%' },
            { data: 'ValorMaximo', width: '20%' },
            {
              data: "id",
              render: function (data) {
                console.log(data, 'data')
                return `<div >
                  <a href="#" data-id="${data}" class="btn_edit_parametro dropdown-item">
                  ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
                  </a>
                  <a href="#"  data-id="${data}" class="btn_delete_parametro dropdown-item">
                    ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                  </a> 
                </div>`;
              },
              width: '15%'
            }
          ]
        });
        
        
      break;
  
      case '#TablaPremioEdit':

        const premiosActivos = etapa.premiocampania.filter(item => item.estado === 1);
        
        // Limpiar la tabla antes de insertar nuevas filas
        $('#TablaPremioEdit').DataTable().clear().destroy();
  
        // Inicializar el DataTables con los datos de datosTablaLocalidad
        $('#TablaPremioEdit').DataTable({
          searching: false, // Deshabilitar la funcionalidad de búsqueda
          paging: false,
          data: premiosActivos,
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
                var premio = $('#premioEdit option[value="' + data + '"]').text();
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
              data: "id",
              render: function (data) {
                return `<div>
                  <a href="#" data-id="${data}" class="btn_edit_premio dropdown-item">
                    ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
                  </a>
                  <a href="#"  data-id="${data}" class="btn_delete_premio dropdown-item">
                    ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                  </a> 
                </div>`;
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

  }
 
}






// //editar
// function initStepperEdit() {
//   var actualStepEdit = 0;
//   var stepsEdit = $('#stepperEdit').children();
//   var totalStepsEdit = stepsEdit.length;
//   showStepEdit(actualStepEdit);
//   Calendar ();

//   // Guardar el contenido HTML original del stepperEdit
//   originalStepperHTML = $('#stepperEdit').html();

//   const containerArchivo = document.getElementById('containerArchivo');
//   if (containerArchivo) {
//     containerArchivo.style.display = 'none';
//   }

//   // Ocultar el contenedor de bloqueo
//   const containerBloqueo = document.querySelector('#Bloqueo');
//   if (containerBloqueo) {
//     containerBloqueo.style.display = 'none';
//   }

//   $('.next-btn-edit').click(function(e) {
//     e.preventDefault();

//     if (actualStepEdit < totalStepsEdit - 1) {
//       hideStepEdit(actualStepEdit);
//       actualStepEdit++;
//       showStepEdit(actualStepEdit);
//       console.log(actualStepEdit)
//     }
//   });


//   $('.prev-btn-edit').click(function(e) {
//     e.preventDefault();

//     if (actualStepEdit > 0) {
//       hideStepEdit(actualStepEdit);
//       actualStepEdit--;
//       showStepEdit(actualStepEdit);
//     }
//   });



//   function showStepEdit(stepIndex) {
//     stepsEdit.eq(stepIndex).show();
//   }

//   $('.step-btn-1-edit').click(function(e) {
//     e.preventDefault();
//     hideStepEdit(actualStepEdit);
//     actualStepEdit = 0;
//     showStepEdit(actualStepEdit);
//   });

//   $('.step-btn-2-edit').click(function(e) {
//     e.preventDefault();
//     hideStepEdit(actualStepEdit);
//     actualStepEdit = 1;
//     showStepEdit(actualStepEdit);
//   });

//   $('.step-btn-3-edit').click(function(e) {
//     e.preventDefault();
//     hideStepEdit(actualStepEdit);
//     actualStepEdit = 2;
//     showStepEdit(actualStepEdit);
//   });

//   $('.step-btn-4-edit').click(function(e) {
//     e.preventDefault();
//     hideStepEdit(actualStepEdit);
//     actualStepEdit = 3;
//     showStepEdit(actualStepEdit);
//   });

//   function hideStepEdit(stepIndex) {
//     stepsEdit.eq(stepIndex).hide();
//   }

//   const stepEditEtapaContent = `
//    <div class="form-step ">
//     <div class="content-header mt-2 mb-1">
//         <h4 class="mb-0">Configuración de Etapa</h4>
//         <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
//     </div>
//     <div class="row">
//         <div class="form-group col-md-6">
//         <input id="idEtapa" type="hidden">
//             <label class="form-label" for="NombreEtapaEdit">Nombre</label>
//             <input type="text" id="NombreEtapaEdit" aria-describedby="NombreEtapaError"  class="form-control" />
//             <div id="NombreEtapaError" class="invalid-feedback NombreEtapa-error"></div>
//         </div>
//         <div class="form-group col-md-6">
//             <label class="form-label" for="ordenEdit">Orden</label>
//             <input type="number" id="ordenEdit" class="form-control" aria-describedby="ordenError"  />
//             <div id="ordenError" class="invalid-feedback orden-error"></div>
//         </div>
//     </div>
//     <div class="row">
//         <div class="form-group col-md-6">
//             <label class="form-label" for="descripcionEtapaEdit">Descripcion de las Etapas</label>
//             <textarea type="text" id="descripcionEtapaEdit" aria-describedby="descripcionEtapaError" class="form-control" placeholder="Ingrese la descripcion" rows="2"></textarea>
//             <div id="descripcionEtapaError" class="invalid-feedback descripcionEtapa-error"></div>
//         </div>
//         <div class="form-group col-md-6">
//             <label class="form-label" for="tipoParticipacionEdit">Tipo de Participación</label>
//             <select name="tipoParticipacionEdit" aria-describedby="tipoParticipacionError" id="tipoParticipacion" class="form-control">
//                 <option disabled selected>Selecciona una opción</option>
//                 <option value="0">Transacciones</option>
//                 <option value="1">Recurrentes</option>
//                 <option value="2">Acumular Transacciones</option>
//                 <option value="3">Acumular Transacciones Recurrentes</option>
//                 <option value="4">Acumular Valor</option>
//                 <option value="5">Combinar Transacciones</option>
//             </select>
//             <div id="tipoParticipacionError" class="invalid-feedback tipoParticipacion-error"></div>
//         </div>
//     </div>
//     <div class="row">
//         <div class="form-group col-md-6">
//             <label class="form-label" for="RangoTiempoEdit">Tipo de Participación</label>
//             <select name="RangoTiempoEdit" aria-describedby="RangoTiempoError" id="RangoTiempo" class="form-control">
//                 <option disabled selected>Selecciona una opción</option>
//                 <option value="0">Diaria</option>
//                 <option value="1">Semanal</option>
//                 <option value="2">Anual</option>
//             </select>
//             <div id="RangoTiempoError" class="invalid-feedback RangoTiempo-error"></div>
//         </div>
//         <div class="form-group col-md-6">
//             <label class="form-label" for="intervaloEdit">Intervalo de tiempo</label>
//             <input type="number" id="intervaloEdit" class="form-control" aria-describedby="intervaloError"  />
//             <div id="intervaloError" class="invalid-feedback intervalo-error"></div>
//         </div>
//     </div>
//     <div class="row">
//         <div class="col-md-12">
//             <div id="inputsContainer">
//                 <div id="inputsTipo0" style="display: none;">
//                     <!-- Inputs para Aculadas -->
//                     <div class="row">
//                         <div class="form-group col-md-6">
//                             <label class="form-label" for="minimoTransaccionEdit">Minimo Transaccion</label>
//                             <input type="text" id="minimoTransaccion" class="form-control" />
//                         </div>
//                     </div>
//                 </div>
    
//                 <div id="inputsTipo1" style="display: none;">
//                     <!-- Inputs para Acumuladas -->
//                     <div class="row">
//                         <div class="form-group col-md-6">
//                             <label class="form-label" for="TotalMinimo">Total Minimo</label>
//                             <input type="text" id="TotalMinimo" class="form-control" />
//                         </div>  
//                     </div>
//                 </div> 
//             </div>
//         </div>   
//     </div>
//     `;

//   const stepEditParametrosContent = `
//     <div class="form-step">
//       <div class="content-header mt-2 mb-1">
//       <h4 class="mb-0">Edición de Parametros de Etapa</h4>
//       <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
//       </div>
//       <div class="row">
//           <div class="form-group col-md-6">
//             <input id="idParametros" type="hidden">
//               <label class="form-label" for="limiteParticipacionEdit">Limite de Participaciones</label>
//               <input type="number" id="limiteParticipacionEdit" class="form-control" />
//           </div>
//           <div class="form-group col-md-6">
//               <label class="form-label" for="transaccionEdit">Transacción</label>
//               <select name="" id="transaccionEdit" class="form-control">
//                   <option disabled selected>Selecciona una opción</option>
//               </select>
//           </div>
//       </div>
//       <div class="row">
//           <div class="form-group col-md-6">
//               <label class="form-label" for="valorMinimoEdit">Valor Minimo</label>
//               <input type="number" id="valorMinimoEdit" class="form-control" />
//           </div>
//           <div class="form-group col-md-6">
//               <label class="form-label" for="valorMaximoEdit">Valor Maximo</label>
//               <input type="number" id="valorMaximoEdit" class="form-control" />
//           </div>
//       </div>
//       <div class="row">
//           <div class="form-group col-md-6">
//               <label class="form-label" for="limiteDiaEdit">Limite Diario</label>
//               <input type="number" id="limiteDiaEdit" class="form-control" />
//           </div>
//       </div>
//       <div class="row">
//           <div class="form-group col-md-12">
//             <div class="btn-crear d-flex justify-content-end mt-2">
//               <button type="button" class="btn btn-outline-primary" id="addParamasEdit">Agregar</button>
//             </div>
//           </div>
//       </div>
//       <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametrosEdit">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Transaccion</th>
//             <th>Valor Minimo</th>
//             <th>Valor Maximo</th>
//             <th>Accion</th>
//           </tr>
//         </thead>
//       </table>
//     </div>
//   `;

//   const stepEditPresupuestoContent = `
//     <div class="form-step">
//       <div class="content-header mt-2 mb-1">
//         <h4 class="mb-0">Configuración de Presupuesto</h4>
//         <small class="text-muted">Ingresa los datos basicos del presupuesto.</small>
//       </div>
//       <div class="row">
//       <div class="form-group col-md-6">
//           <input id="idPresupuesto" type="hidden">
//           <label class="form-label" for="departamentoEdit">Departamento</label>
//           <select name="" id="departamentoEdit" aria-describedby="departamentoError" required class="form-control">
//               <option disabled selected>Selecciona una opción</option>
//           </select>
//           <div id="departamentoError" class="invalid-feedback departamento-error"></div>
//       </div>
//       <div class="form-group col-md-6">
//           <label class="form-label" for="municipioEdit">Municipio</label>
//           <select name="municipioEdit" id="municipioEdit" aria-describedby="municipioError" required class="form-control">
//               <option disabled selected>Selecciona una opción</option>
//           </select>
//           <div id="municipioError" class="invalid-feedback municipio-error"></div>
//       </div>
//       </div>
//       <div class="row">
//           <div class="form-group col-md-6">
//               <label class="form-label" for="limiteGanadorEdit">Limite de Ganadores</label>
//               <input type="text" id="limiteGanadorEdit" aria-describedby="limiteGanadorError" required class="form-control" />
//               <div id="limiteGanadorErrorEdit" class="invalid-feedback limiteGanador-error"></div>
//           </div>
//           <div class="form-group col-md-6">
//               <label class="form-label" for="presupuestoEdit">Presupuesto</label>
//               <input type="text" id="presupuestoEdit" aria-describedby="presupuestoError" required class="form-control" />
//               <div id="presupuestoError" class="invalid-feedback presupuesto-error"></div>

//               <div class="btn-crear d-flex justify-content-end mt-1" >
//                   <button type="button" class="btn btn-outline-primary" id="addLocalidadEdit">Agregar</button>
//               </div>
//           </div>
//       </div>
//       <!--Tabla-->
//       <table class="datatables-basic table mb-3 mt-2 stepper-table" id="tableLocalidadEdit">
//           <thead>
//               <tr>
//                   <th>#</th>
//                   <th>DEPARTAMENTO</th>
//                   <th>MUNICIPIO</th>
//                   <th>LIMITE</th>
//                   <th>PRESUPUESTO</th>
//                   <th>Accion</th>
//               </tr>
//           </thead>
//       </table>

//     </div>
//   `;

//   const stepEditPremioContent = `
//     <div class="form-step">
//       <div class="content-header mt-2 mb-1">
//         <h4 class="mb-0">Configuración de Premio</h4>
//         <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
//       </div>
//           <div class="row">
//               <div class="form-group col-md-6">
//                   <input id="idPremio" type="hidden">
//                   <label class="form-label" for="tipoPremioEdit">Tipo de Premio</label>
//                   <select name="tipoPremioEdit" aria-describedby="tipoPremioError"  id="tipoPremio" class="form-control">
//                       <option disabled selected>Selecciona una opción</option>
//                       <option value="0">Unico Premio</option>
//                       <option value="1">Premio Random</option>
//                       <option value="2">Todos los Premios</option>
//                   </select>
//                   <div id="tipoPremioErrorEdit" class="invalid-feedback tipoPremio-error"></div>
//               </div>
//               <div class="form-group col-md-6">
//                   <label class="form-label" for="linkPremioEdit">Links de Premio</label>
//                   <select name="linkPremioEdit" aria-describedby="linkPremioError"  id="linkPremioEdit" class="form-control">
//                       <option disabled selected>Selecciona una opción</option>
//                       <option value="1">Sí</option>
//                       <option value="0">No</option>
//                   </select>
//                   <div id="linkPremioErrorEdit" class="invalid-feedback linkPremio-error"></div>
//               </div>
//           </div>
//           <div class="row">
//               <div class="form-group col-md-6">
//                   <label class="form-label" for="premio">Premio</label>
//                   <select name="premioEdit" id="premioEdit" aria-describedby="premioError"  class="form-control">
//                       <option disabled selected>Selecciona una opción</option>
//                   </select>
//                   <div id="premioErrorEdit" class="invalid-feedback premio-error"></div>
//               </div>
//               <div class="form-group col-md-6">
//                   <label class="form-label" for="valorEdit">Valor</label>
//                   <input type="number" id="valorEdit" aria-describedby="valorError"  class="form-control" />
//                   <div id="valorErrorEdit" class="invalid-feedback valor-error"></div>
//               </div>
//           </div>
//           <div class="row">
//               <div class="form-group col-md-6">
//                   <label class="form-label" for="porcentajePremioEdit">Porcentaje de Premio</label>
//                   <input type="number" id="porcentajePremioEdit" aria-describedby="porcentajePremioError"  class="form-control" />
//                   <div id="porcentajePremioError" class="invalid-feedback porcentajePremio-error"></div>
//               </div>
//               <div class="form-group col-md-6">
//                   <div class="btn-crear d-flex justify-content-end mt-2" >
//                       <button type="button" class="btn btn-outline-primary" id="addPremioEdit">Agregar</button>
//                   </div>
//               </div>
//           </div>
//           <!--Tabla-->
//           <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaPremioEdit">
//               <thead>
//                   <tr>
//                       <th>#</th>
//                       <th>PREMIO</th>
//                       <th>VALOR</th>
//                       <th>LINK</th>
//                       <th>Accion</th>
//                   </tr>
//               </thead>
//           </table>
//     </div>
//   `;

//   const stepButtonsContent = `<div class="modal-footer">
//       <button type="button" class="btn btn-outline-secondary" id="removeStepp" >Cancelar</button>
//       <button type="button" id="GuardarEtapaEdit" class="btn btn-primary" >Guardar</button>
//   </div>`;

//   $('#TablaEtapaEdit').on('click', '.btn_edit', function(event) {
//     var id = $(this).data('id');
//     getDepartamento();
//     getTransaccion();
//     getPremio();
//     editarEtapa(id);
//     event.stopPropagation();
//   });

//   function addStepEdit(content) {
//     var newStep = $(`<div class="step"></div>`).html(content);
//     $('#stepperEdit').append(newStep);
//     totalStepsEdit++;
//     var previousStep = actualStepEdit;
//     hideStepEdit(actualStepEdit);
//     actualStepEdit = totalStepsEdit - 1;
//     showStepEdit(actualStepEdit);

//   }

//   function volver(val) {
//     document.getElementById('stepperEdit').innerHTML = val;
//     // // Restaurar el valor de actualStepEdit al paso anterior
//     // actualStepEdit = Math.max(0, actualStepEdit - 4);
//     showStepEdit(actualStepEdit);
    
//     // Actualizar la tabla de etapas editadas
//     mostrarDatosTabla('#TablaEtapaEdit');

//     showStepEdit(actualStepEdit);  
//   }

//   function createStepEditEtapa() {
//     totalStepsEdit--;
//     addStepEdit(stepEditEtapaContent);
//   }

//   function createStepEditParametros() {
//     totalStepsEdit--;
//     addStepEdit(stepEditParametrosContent);
//   }

//   function createStepEditPresupuesto() {
//     totalStepsEdit--
//     addStepEdit(stepEditPresupuestoContent);
//   }

//   function createStepEditPremio() {
//     totalStepsEdit--
//     addStepEdit(stepEditPremioContent);
//   }

//   function createStepButtons() {
//     totalStepsEdit--
//     addStepEdit(stepButtonsContent);
//   }

//   // Función para editar una etapa
//   function editarEtapa(id) {
//     var etapa = dataEditEtapa.find(function(item) {
//       return item.id === id;
//     });

//     if (etapa) {
//       console.log(etapa, 'la etapa es')

//       // Limpiar los pasos existentes
//       var contenidoDivHola = document.getElementById('stepperEdit').innerHTML;
//       console.log(contenidoDivHola)
//       $('#stepperEdit').empty()

//       // Crear los pasos de edición
//       createStepEditEtapa();
//       createStepEditParametros();
//       createStepEditPresupuesto();
//       createStepEditPremio();
//       createStepButtons();

//       $('#GuardarEtapaEdit').off('click').on('click', function(e) {
//         e.preventDefault();
  
//         // Obtener los datos actualizados de la etapa desde los campos de entrada
//         var nombre = $('#NombreEtapaEdit').val();
//         var orden = $('#ordenEdit').val();
//         var descripcion = $('#descripcionEtapaEdit').val();
//         var tipoParticipacion = $('#tipoParticipacionEdit').val();
  
//         // Actualizar los datos de la etapa
//         etapa.nombre = nombre;
//         etapa.orden = orden;
//         etapa.descripcion = descripcion;
//         etapa.tipoParticipacion = tipoParticipacion;
  
//         // Buscar la etapa editada en el arreglo dataEditEtapa
//         var etapaIndex = dataEditEtapa.findIndex(function(item) {
//           return item.id === id;
//         });
  
//         if (etapaIndex !== -1) {
//           // Actualizar la etapa editada en el arreglo dataEditEtapa
//           dataEditEtapa[etapaIndex] = etapa;
  
//           console.log(dataEditEtapa, 'data pasando');
//           $('#stepperEdit').empty()
//           volver(contenidoDivHola);
//           Alert('Etapa actualizada correctamente', 'success');
//         } else {
//           Alert('No se pudo encontrar la etapa editada', 'error');
//         }
//       });


//       // Asignar los valores de la etapa a los campos de edición
//       $('#idEtapa').val(etapa.id);
//       $('#NombreEtapaEdit').val(etapa.nombre);
//       $('#ordenEdit').val(etapa.orden);
//       $('#descripcionEtapaEdit').val(etapa.descripcion);
//       $('#tipoParticipacionEdit').val(etapa.tipoParticipacion);
//       console.log('tipo participacion', etapa.tipoParticipacion)
//       $('#idParemetros').val(etapa.parametros.id);
//       //Mostrar los datos en las tablas correspondientes
//       mostrarDatosEdit('#TablaParametrosEdit', etapa);
//       mostrarDatosEdit('#tableLocalidadEdit', etapa);
//       mostrarDatosEdit('#TablaPremioEdit', etapa);


//       // Event listeners para los botones de editar y eliminar de la tabla
//       $('#TablaParametrosEdit tbody').on('click', '.btn_edit_parametro', function () {
//         var id = $(this).data('id');
//         console.log(id, 'edit Parametros')
//         editarParametro(id, etapa); // Pasar etapa como argumento
//       });

//       $('#TablaParametrosEdit tbody').on('click', '.btn_delete_parametro', function() {
//         var id = $(this).data('id');
//         console.log(id, 'delete Parametros')
//         eliminarParametro(id, etapa);
//       });

//       $('#tableLocalidadEdit tbody').on('click', '.btn_edit_localidad', function() {
//         //event.preventDefault();
//         var id = $(this).data('id');
//         console.log(id, 'edit localidades')
//         editarLocalidad(id);
//       });

//       $('#tableLocalidadEdit tbody').on('click', '.btn_delete_localidad', function() {
//         //event.preventDefault();
//         var id = $(this).data('id');
//         console.log(id, 'delete localidades')
//         eliminarLocalidad(id);
//       });

//       $('#TablaPremioEdit tbody').on('click', '.btn_edit_premio', function() {
//         // event.preventDefault();
//         var id = $(this).data('id');
//         editarPremio(id);
//       });

//       $('#TablaPremioEdit tbody').on('click', '.btn_delete_premio', function() {
//         // event.preventDefault();
//         var id = $(this).data('id');
//         eliminarPremio(id);
//       });
//     }

//     function editarParametro(id) {
//       if (etapa) {
//         var parametroIndex = etapa.parametros.findIndex(function(item) {
//           return item.id === id;
//         });
    
//         if (parametroIndex !== -1) {
//           var parametro = etapa.parametros[parametroIndex];
    
//           // Eliminar el registro del arreglo datosTablaParametro
//           etapa.parametros.splice(parametroIndex, 1);
    
//           // Mostrar los datos del registro seleccionado en los inputs
//           $('#idParemetros').val(parametro.id);
//           $('#limiteParticipacionEdit').val(parametro.limiteParticipacion);
//           $('#transaccionEdit').val(parametro.idTransaccion);
//           $('#valorMinimoEdit').val(parametro.ValorMinimo);
//           $('#valorMaximoEdit').val(parametro.ValorMaximo);
    
//           // Actualizar la tabla de parámetros
//           mostrarDatosEdit('#TablaParametrosEdit', etapa);
//         }
//       }
//     }
    
//     // Evento de clic para el botón de guardar parámetro editado
//     $('#addParamasEdit').click(function() {
//       var id = $('#idParemetros').val();
//       var limiteParticipacion = $('#limiteParticipacionEdit').val();
//       var idTransaccion = $('#transaccionEdit').val();
//       var ValorMinimo = $('#valorMinimoEdit').val();
//       var ValorMaximo = $('#valorMaximoEdit').val();
    
//       // Crear un nuevo objeto con los valores actualizados
//       var parametroActualizado = {
//         id: id,
//         limiteParticipacion: limiteParticipacion,
//         idTransaccion: idTransaccion,
//         tipoTransaccion: 0,
//         ValorMinimo: ValorMinimo,
//         ValorMaximo: ValorMaximo,
//         valorAnterior: 0,
//         estado:1
//       };
    
//       // Agregar el parámetro actualizado al arreglo datosTablaParametro
//       etapa.parametros.push(parametroActualizado);
//       console.log(etapa.parametros, 'actualizacion')
//       console.log(etapa)
//       // Actualizar la tabla de parámetros
//       mostrarDatosEdit('#TablaParametrosEdit', etapa);
    
//       // Limpiar los inputs después de guardar
//       $('#idParemetros').val('');
//       $('#limiteParticipacionEdit').val('');
//       $('#transaccionEdit').val('');
//       $('#valorMinimoEdit').val('');
//       $('#valorMaximoEdit').val('');
//     });

//     //Funcion asociada
//     function editarLocalidad(id) {
//       if (etapa) {
//         var presupuestosIndex = etapa.presupuestos.findIndex(function(item) {
//           return item.id === id;
//         });

//         console.log(presupuestosIndex, 'valor');

//         if (presupuestosIndex !== -1) {
//           var presupuesto = etapa.presupuestos[presupuestosIndex];

//           // Eliminar el registro del arreglo datosTablaParametro
//           etapa.presupuestos.splice(presupuestosIndex, 1);

//           console.log(etapa.presupuestos, 'presupuesto INDEX')

//           // Mostrar los datos del registro seleccionado en los inputs
//           $('#idPresupuesto').val(presupuesto.id);
//           $('#departamentoEdit').val(presupuesto.idDepartamento);
//           getMunicipioByDepto(presupuesto.idDepartamento).then(function() {
//             $('#municipioEdit').val(presupuesto.idMunicipio);
//           });
//           $('#limiteGanadorEdit').val(presupuesto.limiteGanadores);
//           $('#presupuestoEdit').val(presupuesto.valor);

//           $('#GuardarEtapaEdit').click(function(e) {
//             e.preventDefault();
      
//             // Obtener los datos actualizados de la etapa desde los campos de entrada
//             var nombre = $('#NombreEtapaEdit').val();
//             var orden = $('#ordenEdit').val();
//             var descripcion = $('#descripcionEtapaEdit').val();
//             var tipoParticipacion = $('#tipoParticipacionEdit').val();
      
//             // Actualizar los datos de la etapa
//             etapa.nombre = nombre;
//             etapa.orden = orden;
//             etapa.descripcion = descripcion;
//             etapa.tipoParticipacion = tipoParticipacion;
      
//             // Buscar la etapa editada en el arreglo dataEditEtapa
//             var etapaIndex = dataEditEtapa.findIndex(function(item) {
//               return item.id === id;
//             });
      
//             if (etapaIndex !== -1) {
//               // Actualizar la etapa editada en el arreglo dataEditEtapa
//               dataEditEtapa[etapaIndex] = etapa;
      
//               console.log(dataEditEtapa, 'data pasando');
//               volver();
//               Alert('Etapa actualizada correctamente', 'success');
//             } else {
//               Alert('No se pudo encontrar la etapa editada', 'error');
//             }
//           })

//           // Actualizar la tabla de parámetros
//           mostrarDatosEdit('#tableLocalidadEdit', etapa);
//         }
//       }
//     }

//     // Evento de clic para el botón de guardar presupuesto editado
//     $('#addLocalidadEdit').click(function() {
//       var id = $('#idPresupuesto').val();
//       var idDepartamento = $('#departamentoEdit').val();
//       var idMunicipio = $('#municipioEdit').val();
//       var limiteGanadores = $('#limiteGanadorEdit').val();
//       var valor = $('#presupuestoEdit').val();

//       // Crear un nuevo objeto con los valores actualizados
//       var presupuestoActualizado = {
//         id: id,
//         idDepartamento: idDepartamento,
//         idMunicipio: idMunicipio,
//         limiteGanadores: limiteGanadores,
//         valor: valor,
//         estado: 1,
//       };

//       // Agregar el presupuesto actualizado al arreglo etapa.presupuestos
//       etapa.presupuestos.push(presupuestoActualizado);
//       console.log(etapa.presupuestos, 'actualizacion')
//       console.log(etapa)

//       // Actualizar la tabla de presupuestos
//       mostrarDatosEdit('#tableLocalidadEdit', etapa);

//       // Limpiar los inputs después de guardar
//       $('#idPresupuesto').val('');
//       $('#departamentoEdit').val('');
//       $('#municipioEdit').val('');
//       $('#limiteGanadorEdit').val('');
//       $('#presupuestoEdit').val('');
//     });    
//     //Funcion asociada
//     function editarPremio(id) {
//       if (etapa) {
//         var premioIndex = etapa.premiocampania.findIndex(function(item) {
//           return item.id === id;
//         });
    
//         if (premioIndex !== -1) {
//           var premio = etapa.premiocampania[premioIndex];
    
//           // Eliminar el registro del arreglo datosTablaParametro
//           etapa.premiocampania.splice(premioIndex, 1);
    
//           // Mostrar los datos del registro seleccionado en los inputs
//           $('#idPremio').val(premio.id);
//           $('#valorEdit').val(premio.valor);
//           $('#linkPremioEdit').val(premio.linkPremio);
//           $('#premioEdit').val(premio.idPremio); // Asignar el valor del premio al select
//           $('#porcentajePremioEdit').val(); //verificar si se va a poner
    
//           // Actualizar la tabla de parámetros
//           mostrarDatosEdit('#TablaPremioEdit', etapa);
//         }
//       }
//     }    
//     // Evento de clic para el botón de guardar parámetro editado
//     $('#addPremioEdit').click(function() {
//       var id = $('#idPremio').val();
//       var valor = $('#valorEdit').val();
//       var linkPremio = $('#linkPremioEdit').val();
//       var idPremio = $('#premioEdit').val();
//       var porcentaje = $('#porcentajePremioEdit').val();
    
//       // Crear un nuevo objeto con los valores actualizados
//       var premioActualizado = {
//         id: id,
//         valor: valor,
//         linkPremio: linkPremio,
//         idPremio: idPremio,
//         estado: 1
//       };
    
//       // Agregar el parámetro actualizado al arreglo datosTablaParametro
//       etapa.premiocampania.push(premioActualizado);
//       console.log(etapa.premioActualizado, 'actualizacion')
//       console.log(etapa)
//       // Actualizar la tabla de parámetros
//       mostrarDatosEdit('#TablaPremioEdit', etapa);
    
//       // Limpiar los inputs después de guardar
//       $('#idPremio').val('');
//       $('#valorEdit').val('');
//       $('#linkPremioEdit').val('');
//       $('#tipoPremioEdit').val(''); // Asignar el valor del premio al select
//       $('#porcentajePremioEdit').val(''); 
//     });


//     function eliminarLocalidad(id) {
//       if (etapa) {
//         var presupuestoIndex = etapa.presupuestos.findIndex(function(item) {
//           return item.id === id;
//         });
        
//         if (presupuestoIndex !== -1) {
//           etapa.presupuestos[presupuestoIndex].estado = 0; // Cambiar el estado a 0
//           mostrarDatosEdit('#tableLocalidadEdit', etapa); // Actualizar la tabla
//         }
//       }
//     }
  
//     function eliminarParametro(id) {
//       if (etapa) {
//         var parametroIndex = etapa.parametros.findIndex(function(item) {
//           return item.id === id;
//         });
//         console.log(parametroIndex)
//         if (parametroIndex !== -1) {
//           etapa.parametros[parametroIndex].estado = 0; // Cambiar el estado a 0
//           mostrarDatosEdit('#TablaParametrosEdit', etapa); // Actualizar la tabla
//         }
//       }
//     }
  
//     function eliminarPremio(id) {
//       if (etapa) {
//         var premioIndex = etapa.premiocampania.findIndex(function(item) {
//           return item.id === id;
//         });
    
//         if (premioIndex !== -1) {
//           etapa.premiocampania[premioIndex].estado = 0; // Cambiar el estado a 0
//           mostrarDatosEdit('#TablaPremioEdit', etapa); // Actualizar la tabla
//         }
//       }
//     }

//     function mostrarDatosEdit(tabla, etapa) {
//       switch(tabla)
//       {
//         case '#tableLocalidadEdit':
//           //filtro
//           const presupuestosActivos = etapa.presupuestos.filter(item => item.estado === 1);

//           // Limpiar la tabla antes de insertar nuevas filas
//           $('#tableLocalidadEdit').DataTable().clear().destroy();
  
//           // Inicializar el DataTables con los datos de datosTablaLocalidad
//           $('#tableLocalidadEdit').DataTable({
//             searching: false,
//             paging: false,
//             data: presupuestosActivos,
//             columns: [
//             {
//                 render: function(data, type, row, meta) {
//                   return meta.row + 1;
//                 },
//                 width: '5%'
//             },
//             {
//               data: 'idDepartamento',
//               render: function (data) {
//                   var departamento = $('#departamentoEdit option[value="' + data + '"]').text();
//                   return departamento;
//                 },
//                 width: '25%'
//             },
//             {
  
//               data: 'idMunicipio',
//               render: function (data, row) {
//                   var municipio = $('#municipioEdit option[value="' + data + '"]').text();
//                   if (!municipio) {
//                       // Si no se encuentra el nombre del municipio, buscarlo en el arreglo datosTablaLocalidad
//                   var registro = datosTablaLocalidad.find(function(item) {
//                     return item.idMunicipio === data;
//                   });
//                   if (registro) {
//                       municipio = registro.nombreMunicipio;
//                     }
//                   }
//                   return municipio;
//                 },
//               width: '25%'
//             },
//             {
//               data: 'limiteGanadores',
//               width: '15%'
//             },
//             {
//               data: 'valor',
//               width: '15%'
//             },
//             {
//               data: "id",
//               render: function (data) {
//                 return `<div>
//                   <a href="#" data-id="${data}" class="btn_edit_localidad dropdown-item">
//                   ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
//                   </a>
//                   <a href="#"  data-id="${data}" class="btn_delete_localidad dropdown-item">
//                     ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
//                   </a> 
//                 </div>`;
//               },
//               width: '15%'           
//             }
//           ]
//         });
//       break;
  
//       case'#TablaParametrosEdit':
//         const parametro = etapa.parametros.filter(item => item.estado === 1);
//         // Limpiar la tabla antes de insertar nuevas filas
//         $('#TablaParametrosEdit').DataTable().clear().destroy();
  
//         // Inicializar el DataTables con los datos de datosTablaParametro
//         $('#TablaParametrosEdit').DataTable({
//           data: parametro,
//           searching: false, // Deshabilitar la funcionalidad de búsqueda
//           paging: false,
//           columns: [
//             {
//               render: function(data, type, row, meta) {
//                 // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
//                 return meta.row + 1;
//               },
//               width: '5%'
//             },
//             {
//               data: 'idTransaccion',
//               render: function (data) {
//                 var transaccion = $('#transaccionEdit option[value="' + data + '"]').text();
//                 return transaccion;
//               },
//               width: '30%'
//             },
//             { data: 'ValorMinimo', width: '20%' },
//             { data: 'ValorMaximo', width: '20%' },
//             {
//               data: "id",
//               render: function (data) {
//                 console.log(data, 'data')
//                 return `<div >
//                   <a href="#" data-id="${data}" class="btn_edit_parametro dropdown-item">
//                   ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
//                   </a>
//                   <a href="#"  data-id="${data}" class="btn_delete_parametro dropdown-item">
//                     ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
//                   </a> 
//                 </div>`;
//               },
//               width: '15%'
//             }
//           ]
//         });
        
        
//       break;
  
//       case '#TablaPremioEdit':

//         const premiosActivos = etapa.premiocampania.filter(item => item.estado === 1);
        
//         // Limpiar la tabla antes de insertar nuevas filas
//         $('#TablaPremioEdit').DataTable().clear().destroy();
  
//         // Inicializar el DataTables con los datos de datosTablaLocalidad
//         $('#TablaPremioEdit').DataTable({
//           searching: false, // Deshabilitar la funcionalidad de búsqueda
//           paging: false,
//           data: premiosActivos,
//           columns: [
//             {
//               render: function(data, type, row, meta) {
//                 // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
//                 return meta.row + 1;
//               },
//               width: '5%'
//             },
//             {
//               data: 'idPremio',
//               render: function (data) {
//                   var premio = $('#premioEdit option[value="' + data + '"]').text();
//                 return premio;
//               },
//               width: '30%'
//             },
//             { data: 'valor', width: '30%' },
//             {
//               data: 'linkPremio',
//               render: function (data) {
//                 return data === 1 ? 'Sí' : 'No';
//               },
//               width: '30%'
//             },
//             {
//               data: "id",
//               render: function (data) {
//                 return `<div>
//                   <a href="#" data-id="${data}" class="btn_edit_premio dropdown-item">
//                     ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" })} 
//                   </a>
//                   <a href="#"  data-id="${data}" class="btn_delete_premio dropdown-item">
//                     ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
//                   </a> 
//                 </div>`;
//               },
//               width: '15%'
//             }
//           ]
//         });
//       break;
  
//       default:
  
//         break;
//     }
  
//     }


//   }
 
//   // Evento de clic para el botón de cancelar
//   $('#stepperEdit').on('click', '#cancelarEdicion', function() {
//     // Cerrar el modal de edición sin realizar ninguna acción adicional
//     $('#modalEdit').modal('hide');
//   });

// }

//   // Modificar la función getEtapasData para recorrer el objeto de etapas
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

$('#CrearEtapaBtn').click(function(e){
  e.preventDefault();
  const containerEtapa = document.getElementById('CrearEtapa');
  containerEtapa.style.display = 'block';
})

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
                  <a href="#" class="dropdown-item" onclick="eliminarDato('${tabla}', ${meta.row}, event)">
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
        console.log('esta aqui')
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
  console.log('tabla:', tabla, 'row', index)
  switch (tabla) {
    case '#tablaBloqueo':
      bloqueadosUsuarios.splice(index, 1);
      break;
    case '#TablaEtapa':
      TEMP.splice(index, 1);
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
const getDepartamento = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: { "Authorization": token }
  };

  fetch(`${url}Departamento`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.nombre}</option>`;
        $('#departamento').append(opc);
        $('#departamentoEdit').append(opc);
      });

      var selectDepartamento = document.getElementById('departamento');

      if (selectDepartamento) {
        selectDepartamento.addEventListener('change', function () {
          var selectedId = this.value;
          getMunicipioByDepto(selectedId);
        });
      }
    })
    .catch(err => console.log('error', err));
  return false;
};


const getMunicipioByDepto = (idDepartamento) => {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: { "Authorization": token }
    };

    // Eliminar todas las opciones del select #municipio excepto la opción seleccionada por defecto
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
  });
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
        $('#transaccionEdit').append(opc);
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
        $('#premioEdit').append(opc);
      });
    })
}

//ver funcionalidad
function Calendar() {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var selectedDateBegin = null;
  var selectedDateEnd = null;

  function generateCalendar(year, month) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    var calendar = '';

    // Actualizar el mes y año en el encabezado
    $('#current-month-year').text(getMonthName(month) + ' ' + year);

    // Generar días vacíos antes del primer día del mes
    for (var i = 0; i < firstDayOfMonth; i++) {
      calendar += '<div class="calendar-day empty"></div>';
    }

    // Generar días del mes
    for (var i = 1; i <= daysInMonth; i++) {
      var date = new Date(year, month, i);
      var dateString = date.toISOString().slice(0, 10);
      var isSelected = selectedDateBegin === dateString || selectedDateEnd === dateString;
      var className = 'calendar-day' + (isSelected ? ' selected' : '');
      calendar += '<div class="' + className + '" data-date="' + dateString + '">' + i + '</div>';
    }

    // Insertar los días generados en el contenedor
    $('#calendar-days').html(calendar);

    // Agregar evento click a los días
    $('.calendar-day').click(handleDayClick);
  }

  function handleDayClick(e) {
    var date = $(this).data('date');
    // Si el input de fecha de inicio está vacío
    if ($('#FechaIniRecordatorio').val() === '' || $('#FechaIniRecordatorioEdit').val() === '') {
      $('#FechaIniRecordatorio').val(date);
      $('#FechaIniRecordatorioEdit').val(date);
      selectedDateBegin = date;
      // Limpiar el input de fecha de fin
      $('#FechaFinRecordatorio').val('');
      $('#FechaFinRecordatorioEdit').val('');
      selectedDateEnd = null;
    } else {
      // Si la fecha seleccionada es menor o igual a la fecha de inicio
      if (date <= $('#FechaIniRecordatorio').val() || date <= $('#FechaIniRecordatorioEdit').val()) {
        $('#FechaIniRecordatorio').val(date);
        $('#FechaIniRecordatorioEdit').val(date);
        selectedDateBegin = date;
        // Limpiar el input de fecha de fin
        $('#FechaFinRecordatorio').val('');
        $('#FechaFinRecordatorioEdit').val('');
        selectedDateEnd = null;
      } else {
        // Si la fecha seleccionada es mayor a la fecha de inicio
        $('#FechaFinRecordatorio').val(date);
        $('#FechaFinRecordatorioEdit').val(date);
        selectedDateEnd = date;
      }
    }
    generateCalendar(currentYear, currentMonth);
    console.log(date, 'Fecha');
  }

  function getMonthName(month) {
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
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
}

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
        var errorDiv = $('#' + field + 'Error');

        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
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
        var errorDiv = $('#' + field + 'Error');
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
          isValid = true;
        }
      });

      //Validar que la edad inicial no sea menor a la edad final
      var edadInicial = parseInt($('#edadInicial').val());
      var edadFinal = parseInt($('#edadFinal').val());
      var errorEdadIni = $('#edadInicialError');
      var errorEdadFin = $('#edadFinalError');

      if (edadInicial > edadFinal) {
        $('#edadInicial').addClass('is-invalid');
        $('#edadFinal').addClass('is-invalid');
        errorEdadIni.text('La edad inicial debe ser menor a la edad final.');
        errorEdadFin.text('La edad inicial debe ser menor a la edad final.');

        isValid = false;
      }

      // Validar que la fecha inicial no sea mayor que la fecha fin
      var fechaInicial = new Date($('#fechaInicial').val());
      var fechaFinal = new Date($('#fechaFinal').val());
      var errorfechaIni = $('#fechaInicialError');
      var errorfechaFinal = $('#fechaFinalError');
      if (fechaInicial > fechaFinal) {
        $('#fechaInicial').addClass('is-invalid');
        $('#fechaFinal').addClass('is-invalid');
        errorfechaIni.text('Fecha inicial debe ser menor a fecha fin.');
        errorfechaFinal.text('Fecha inicial debe ser menor a fecha fin.');

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

//limpiar el form
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

//abre la edicion
const OpenEdit = (id) => {
  bloqueadosUsuarios = []
  permitidoUsuario = []
  dataEditEtapa = []
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

      $('#maximoParticipantesEdit').val(result.maximoParticipaciones);
      $('#tercerosCampaniaEdit').val(result.campaniaTerceros);
      $('#alldayEdit').prop('checked', result.allDay === 1);
      $('#repeatEdit').prop('checked', result.repetir === 1);
      $('#FechaIniRecordatorioEdit').val(result.fechaRecordatorioIni);
      $('#FechaFinRecordatorioEdit').val(result.fechaRecordatorioFin);
      $('#terminosCondicionesEdit').val(result.terminosCondiciones);
      $('#ObservacionesEdit').val(result.observaciones);
      $('#proyectoEdit').val(result.idProyecto);
      $('#restriccionUsuariosEdit').val(result.restriccionUser);
      $('#correoEdit').val(result.correo)
      bloqueadosUsuarios = result.bloqueados
      permitidoUsuario = result.participantes
      dataEditEtapa = result.etapas;
      console.log(dataEditEtapa, "asignacion")
      Calendar();
      // Mostrar las etapas en la tabla
      mostrarDatosTabla("#TablaEtapaEdit");
      // Mostrar el modal
      $('#modalEdit').modal('toggle');


    })
    .catch(error => console.log('error', error));
};

//Abre el delete
const OpenDelete = (id) =>{
  limpiarFormulario();
  console.log(id, 'idDelete')
  $('#idDelete').val(id);
  $('#modalDelete').modal('toggle');
}

//actualiza y pausa una campaña
const pausarActualizarCampania = (id, type) => {
  console.log('type', type)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(
    `${url}Campania/${type == 1 ? "activar" : "pausar"}/${id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        getAllCampanias();
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Alert(error, "error");
    });
};

//obtiene todas las campañas
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

      let activas = result.filter((x) => x.estado == 1 && x.esArchivada === 0);
      $("#textActivas").text(activas.length);
      table("tableActivas", activas);

      let pausadas = result.filter((x) => x.estado == 2 && x.esArchivada === 0);
      $("#textPausadas").text(pausadas.length);
      table("tablePausada", pausadas);

      let borrador = result.filter((x) => x.estado == 3 && x.esArchivada === 0);
      $("#textBorrador").text(borrador.length);
      table("tableBorrador", borrador);

      let archivo = result.filter((x) => x.esArchivada === 1); 
      $("#textArchivo").text(archivo.length);
      table("tableArchivo", archivo);
    })
    .catch((error) => console.log("error", error));
};


//tablas de campaña
const table = (table, data) => {
  console.log('table archivo', table, 'data', data)
  $("#" + table).dataTable({
    destroy: true,
    data,
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
      { data: "nombre" },
      {
        data: "esArchivada",
        render: function(data, type, row) {
          if (data === 1) {
            return "Archivada";
          } else {
            return renderEstado(row.estado);
          }
        }
      },
      { data: "fechaInicio" },
      { data: "fechaFin" },
      {
        data: "id",
        render: function (data, type, row) {
          var opcAdd = ``;
          switch (row.estado) {
            case 1:
              opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},2)" class="btn_pausar dropdown-item"> ${feather.icons["pause-circle"].toSvg({ class: "font-small-4 mr-50", })} Pausar </a>`;
              break;
            case 2:
              opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},1)" class="btn_activar dropdown-item"> ${feather.icons["play"].toSvg({ class: "font-small-4 mr-50", })} Activar </a>`;
              break;
          }
          if (row.estado != 0) {
            opcAdd += `<a href="#" class="btn_edit dropdown-item" onclick="OpenEdit(${data})" data-toggle="modal" data-target="#modalEdit"> ${feather.icons["archive"].toSvg({ class: "font-small-4 mr-50", })} Actualizar </a> <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item"> ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50", })} Inhabilitar </a>`;
          }
          return ` <div class="btn-group"> <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown"> ${feather.icons["more-vertical"].toSvg({ class: "font-small-4", })} </a> <div class="dropdown-menu dropdown-menu-right"> ${opcAdd} </div> </div> `;
        },
      },
    ],
    // order: [[1, 'asc']],
    dom: '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
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

//render para el estado de la campaña 
function renderEstado(estado) {
  switch (estado) {
    case 1: return `Activa`;
    case 2: return `Pausada`;
    case 3: return `Borrador`;
    default: return ``;
  }
}
