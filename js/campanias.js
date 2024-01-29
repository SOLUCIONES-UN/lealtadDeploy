const url = "http://localhost:3000/";
let codigos = [];
let premios = [];
let etapas = [];
let parametros = [];
let participantes = [];
let bloqueados = [];
let arrayPresupuesto = [];
let idData = 1;
let index = 1;
let indexB = 1;
var isAddLimited = true;
var bsStepper = document.querySelectorAll(".bs-stepper"),
  select = $(".select2"),
  verticalWizard = document.querySelector(".vertical-wizard-example");

var numConfigButtons = 4;
const inputFile = document.getElementById('formFile');
const inputFileBloqueados = document.getElementById('formFileBloqueados');
let token = localStorage.getItem("token");

//var stepper = new Stepper(document.querySelector('.bs-stepper'))
// stepper.to(3)

$(function () {
  loadMenu();
  ("use strict");
  ChangePanel(1);
  getAllCampanias();
  $("#formFile").hide();
  $("#tableParticipantes").hide();
  $("#btnActualizarParametros").hide();
  $("#btnActualizarPremios").hide();
  $("#btnActualizarPresupuesto").hide();

  Usuario();

  //Inicializacion de Navs
  $("#NavsOpc button").on("click", function (event) {
    let data = $(this).attr("data-bs-target");
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });

  $(".BtnBottador").click(function () {
    var data = {
      nombre: $("#nombre").val(),
      descripcion: $("#descripcion").val(),
      imgSuccess: "test.png",
      imgFail: "test.png",
      fechaInicio: $("#fechaInicio").val(),
      fechaFin: $("#fechaFin").val(),
      fechaCreacion: $("#fechaRegistro").val(),
      estado: 3,
    };
    saveData(data);
    Limpiar();
  });

  $("#submitData").click(function () {
    var data = {
      nombre: $("#nombre").val(),
      descripcion: $("#descripcionCamania").val(),
      tituloNotificacion: $("#tituloNotificacion").val(),
      fechaRegistro: $("#fechaRegistro").val(),
      fechaInicio: $("#fechaInicio").val(),
      fechaFin: $("#fechaFin").val(),
      edadInicial: $("#edadIni").val(),
      edadFinal: $("#edadFini").val(),
      sexo: $("#sexo option:selected").val(),
      tipoUsuario: $("#tipoUsuario option:selected").val(),
      descripcionNotificacion: $("#descripcionNotificacion").val(),
      imgPush: "",
      imgAkisi: "",
      etapas: etapas,
      Participacion: participantes,
      Bloqueados: bloqueados,
      maximoParticipaciones: $("#limiteParticipacion").val(),
    };
    console.log(data);
    saveData(data);
    $("#addConfig").html(null);
    $("#addFormConfig").html(null);
  });

  $("#btnAddEtapa").click(function () {
    var nombre = $("#nombreEtapa");
    var orden = $("#ordenEtapa");
    var descripcion = $("#descEtapa");
    var tipoTransaccion = $("#TipoTransaccion option:selected");
    var intervalo;
    $("#intervalo") ? (intervalo = $("#intervalo").val()) : (intervalo = "");
    var periodo;
    $("#periodo") ? (periodo = $("#periodo").val()) : (periodo = "");
    var valor;
    $("#valor") ? (valor = $("#valor").val()) : (valor = "");

    var nombreParticipacion;

    etapas.push({
      nombre: nombre.val(),
      orden: orden.val(),
      descripcion: descripcion.val(),
      tipoParticipacion: tipoTransaccion.val(),
      intervalo: typeof intervalo != "undefined" ? intervalo : "",
      periodo: typeof periodo != "undefined" ? periodo : "",
      valorAcumulado: typeof valor != "undefined" ? valor : "",

      estado: 1,
      premios: "",
      parametros: "",
      presupuestos: "",
    });

    console.log(etapas);

    $("#tbetapas").html(null);
    $(".etapaSelect").html(null);
    $("#descEtapa").html(null);

    addConfig(index++, nombre.val());

    etapas.forEach((element, index) => {
      console.log(element.tipoParticipacion);
      var opc = `<option>${element.nombre}</option>`;

      if (element.tipoParticipacion == 1) {
        nombreParticipacion = "Por Transaccion";
      } else if (element.tipoParticipacion == 2) {
        nombreParticipacion = "Recurrente";
      } else if (element.tipoParticipacion == 3) {
        nombreParticipacion = "Acumular Transacciones";
      } else if (element.tipoParticipacion == 4) {
        nombreParticipacion = "Acumular Recurrente";
      } else if (element.tipoParticipacion == 5) {
        nombreParticipacion = "Acumular Valor";
      } else if (element.tipoParticipacion == 6) {
        nombreParticipacion = "Combinar Transacciones";
      }

      var tr = `<tr id='fila${index + 1}'>
          <th>${index + 1}</th>
          <th>${element.nombre}</th>
          <th>${nombreParticipacion}</th>
          <th><div class="btn-group">
          <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
              ${feather.icons["more-vertical"].toSvg({ class: "font-small-4" })}
          </a>
          <div class="dropdown-menu dropdown-menu-right">
              <a href="#" class="btn_edit dropdown-item">
                  ${feather.icons["archive"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Actualizar
              </a>
          
          <div class="dropdown-menu dropdown-menu-right">
              <a href="#" onclick="eliminarEtapa(${
                index + 1
              })" class="btn_delete dropdown-item">
                ${feather.icons["trash-2"].toSvg({
                  class: "font-small-4 mr-50",
                })} Inhabilitar
              </a>
          </div>
          </div>
        </div> </th>
      </tr>`;

      $("#tbetapas").append(tr);
      //console.log(index);
      $(".etapaSelect").append(opc);
      //$('#EtapaPremio').append(opc);
    });

    nombre.val(null);
    orden.val(null);
    descripcion.val(null);
    $("#TipoTransaccion").val(0);
    $("#intervalo").val(0);
  });
});

$("#TipoTransaccion").on("change", function () {
  var addConfig;
  let val = $("#TipoTransaccion").val();
  console.log(val);

  if (val == 3 || val == 4) {
    addConfig = `
      <label class="form-label" for="intervalo">Intervalo</label>
      <select class="form-control" id="intervalo">
      <option value="0" default selected disabled>Seleccione Un Intervalo</option>
      <option value="1">Diario</option>
      <option value="2">Semanal</option>
      <option value="3">Mensual</option>
      <option value="4">Anual</option>
      </select>
    `;

    addPeriodo = `
      <label for="periodo">Periodo</label>
      <input class="form-control" id="periodo"/>
    `;

    $("#transaccionesDinamicas").html(addConfig);
    $("#Periodo").html(addPeriodo);

    isAddLimited = false;
  } else if (val == 5) {
    addConfig = `
      <label class="form-label" for="valor">Valor</label>
      <input class="form-control" id="valor" />
    
    `;

    $("#transaccionesDinamicas").html(addConfig);
    isAddLimited = false;
  } else if (val == 2) {
    addConfig = `
      <label class="form-label" for="valor">Valor</label>
      <input class="form-control" id="valor" />
      
    `;
    $("#transaccionesDinamicas").html(addConfig);
    isAddLimited = true;
  } else {
    $("#transaccionesDinamicas").html(null);
    $("#Periodo").html(null);
    isAddLimited = true;
  }
});

const Usuario = () => {

  let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
  console.log(usuario.nombre)
  $('.user-name').text(usuario.nombre);
  $('.user-status').text(usuario.rol.descripcion);
}

function loadMenu(isEtapa) {
  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener("show.bs-stepper", function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find(".step").length - 1;
        var line = $(event.target).find(".step");
        console.log(line);
        // The first for loop is for increasing the steps,
        // the second is for turning them off when going back
        // and the third with the if statement because the last line
        // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

        for (var i = 0; i < index; i++) {
          line[i].classList.add("crossed");

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove("crossed");
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove("crossed");
          }
          line[0].classList.remove("crossed");
        }
      });
    }
  }

  // select2
  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: "Select value",
      dropdownParent: $this.parent(),
    });
  });

  // Vertical Wizard
  // --------------------------------------------------------------------
  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false,
    });
    $(verticalWizard)
      .find(".btn-next")
      .on("click", function () {
        verticalStepper.next();
      });
    $(verticalWizard)
      .find(".btn-prev")
      .on("click", function () {
        verticalStepper.previous();
      });

    $(verticalWizard)
      .find(".btn-submit")
      .on("click", function () {
        Alert("Campaña Creada con Exito", "success");
        ChangePanel(1);
      });
  }

  if (isEtapa) {
    verticalStepper.reset();
    verticalStepper.to(3);
  }
}

function addConfig(id, nombreEtapa) {
  console.log(isAddLimited);

  var configbuttons = `<div id="opc${id}" class="step" data-target="#social-links-vertical-${id}">
    <button type="button" class="step-trigger">
        <span class="bs-stepper-box">${numConfigButtons + 1}</span>
        <span class="bs-stepper-label">
            <span class="bs-stepper-title">${nombreEtapa}</span>
            <span class="bs-stepper-subtitle">Configuracion de la Etapa No. ${id}</span>
        </span>
    </button>
  </div>`;

  var configForm = `<div id="social-links-vertical-${id}" class="content" style="height: auto;">
  <div class="content-header">
      <h5 class="mb-0">Parametros De La Campaña</h5>
      <small></small>
  </div>
  <div class="row">
      <div class="form-group col-md-6">
          <label class="form-label" for="TipoTransaccion${id}">Tipo Transaccion</label>
          <select class="form-control" id="TipoTransaccion${id}" onchange="tipoDeTransaccion(${id})">
            <option value="0" selected disabled>Seleccione Un Tipo De Transaccion</option>
            <option value="t">Transaccion</option>
            <option value="c">Categoria</option>
          </select>
      </div>
      <div class="form-group col-md-6">
          <label class="form-label" for="Transacciones">Transacciones</label>
          <select class="form-control" id="Transacciones${id}">
              <option value="0" selected disabled>Seleccione Una Transaccion</option>
          </select>
      </div>
  </div>
  <div class="row">
      <div class="form-group col-md-6">
          <label class="form-label" for="vMinimo">Valor Minimo</label>
          <input type="number" id="vMinimo${id}" class="form-control" />
      </div>
      <div class="form-group col-md-6">
          <label class="form-label" for="vMaximo">Valor Maximo</label>
          <input type="number" id="vMaximo${id}" class="form-control" />
      </div>
  </div>
  <div class="row">
      <div class="form-group col-md-6">
          <label class="form-label" for="vAnterior${id}">Valor Anterior</label>
          <input type="number" id="vAnterior${id}" class="form-control" />
      </div>
      ${
        isAddLimited
          ? `<div class="form-group col-md-6">
                          <label class="form-label" for="limiteParticipacion${id}">Limite
                              Participacion</label>
                          <input type="number" id="limiteParticipacion${id}" class="form-control" />
                       </div>`
          : ""
      }
      
  </div>
  <div class="row">
      <div class="col-md-12">
          <button class="btn btn-success" type="button" id="btnAddParametro${id}"
              style="float: right;">
              <span class="align-middle d-sm-inline-block d-none">AGREGAR</span>
          </button>
          <br />
      </div>
  </div>
  <div class="row">
      <table class="datatables-basic table mt-3">
          <thead>
              <tr>
                  <td>Etapa</td>
                  <td>Transaccion</td>
                  <td>valor Minimo</td>
                  <td>valor Maximo</td>
                  <td>&nbsp;</td>
              </tr>
          </thead>
          <tbody id="tbParametros${id}">
  
          </tbody>
      </table>
  </div>
  <div class="content-header mt-5">
                                        <h5 class="mb-0">Premios De La Camapaña</h5>
                                        <small></small>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label class="form-label" for="Premios">Premios</label>
                                            <select class="form-control" id="Premios${id}">
                                                <option>Seleccione Un Premio</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-5">
                                            <label class="form-label" for="valor">Valor</label>
                                            <input type="number" class="form-control" id="valorP${id}">
                                        </div>
                                    </div>
                                    <div class="row">
                                        
                                        <div class="col-md-12">
                                            <button class="btn btn-success" type="button" id="btnAddPremio${id}"
                                            style="float: right;">
                                            <span class="align-middle d-sm-inline-block d-none">AGREGAR</span>
                                            </button>
                                        </div>
                                        <br />
                                    </div>
                                    <div class="row">
                                        
                                        
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <table class="datatables-basic table mt-3">
                                                <thead>
                                                    <tr>
                                                        <td>Etapa</td>
                                                        <td>Premio</td>
                                                        <td>valor</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbPremio${id}">
    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="content-header mt-5">
                                        <h5 class="mb-0">Presupuesto</h5>
                                        <small>Configuracion Del Presupuesto </small>
                                    </div>
                                    <!--Configuracion Presuouesto-->
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label class="form-label" for="departamento">Departamento</label>
                                            <select class="form-control" id="departamento${id}">
                                                <option value="0">Todos los departamentos</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label class="form-label" for="municipio">Municipio</label>
                                            <select class="form-control" id="municipio${id}">
                                                <option value="0">Todos los Municipios</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label class="form-label" for="limiteGanadores">Limite De Ganadores</label>
                                            <input type="number" id="limiteGanadores${id}" class="form-control" />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label class="form-label" for="Presupuesto">Presupuesto</label>
                                            <input type="number" id="Presupuesto${id}" class="form-control" />
                                        </div>

                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-success" type="button" id="btnAddPresupuesto${id}"
                                            style="float: right;">
                                            <span class="align-middle d-sm-inline-block d-none">AGREGAR</span>
                                        </button>
                                        <br />
                                    </div>
                                    <div class="row">
                                        <table class="datatables-basic table mt-3">
                                            <thead>
                                                <tr>
                                                    <td>Departamento</td>
                                                    <td>Municipio</td>
                                                    <td>Limite</td>
                                                    <td>Presupuesto</td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tbPresupuesto${id}">

                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="d-flex justify-content-between mt-5">
                                        <button class="btn btn-primary btn-prev">
                                            <i data-feather="arrow-left" class="align-middle mr-sm-25 mr-0"></i>
                                            <span class="align-middle d-sm-inline-block d-none">Atras</span>
                                        </button>
                                        <button class="btn btn-primary btn-next">
                                            <span class="align-middle d-sm-inline-block d-none">Siguiente</span>
                                            <i data-feather="arrow-right" class="align-middle ml-sm-25 ml-0"></i>
                                        </button>
                                    </div>
  </div>
  `;

  //$('#presupuesto').after(configbuttons);

  //$('#address-step-vertical').after(configForm);

  $("#addConfig").append(configbuttons);
  $("#addFormConfig").append(configForm);

  $("#btnAddParametro" + id).click(function () {
    var etapa = $("#Etapa" + id)
      .children("option:selected")
      .text();
    var Transacciones = $("#Transacciones" + id)
      .children("option:selected")
      .text();
    var idTransaccion = $("#Transacciones" + id)
      .children("option:selected")
      .val();
    var tipoTransaccion = $("#TipoTransaccion" + id)
      .children("option:selected")
      .val();
    var ValorMinimo = $("#vMinimo" + id).val();
    var limiteParticipacion = $("#limiteParticipacion" + id).val();
    var ValorMaximo = $("#vMaximo" + id).val();
    var valorAnterior = $("#vAnterior" + id).val();

    var tr = `<tr>
        <th>${id}</th>
        <th>${Transacciones}</th>
        <th>${ValorMinimo}</th>
        <th>${ValorMaximo}</th>
        <th></th>
    </tr>`;

    parametros.push({
      idTransaccion,
      tipoTransaccion,
      ValorMinimo,
      ValorMaximo,
      valorAnterior,
      limiteParticipacion,
      estado: 1,
    });

    $("#Etapa" + id).val(0);
    $("#TipoTransaccion" + id).val(0);
    $("#Transacciones" + id).html(null);
    $("#Transacciones" + id).append(
      `<option value="0" selected disabled>Seleccione Una Transaccion</option>`
    );
    $("#vMinimo" + id).val(null);
    $("#vMaximo" + id).val(null);
    $("#limiteParticipacion" + id).val(null);
    $("#vAnterior" + id).val(null);
    $("#tbParametros" + id).append(tr);
  });

  $("#btnAddPremio" + id).click(function () {
    var etapa = $("#EtapaPremio" + id)
      .children("option:selected")
      .text();
    var Premios = $("#Premios" + id)
      .children("option:selected")
      .text();
    var idPremio = $("#Premios" + id)
      .children("option:selected")
      .val();
    var valor = $("#valorP" + id).val();

    var tr = `<tr>
      <th>${id}</th>
      <th>${Premios}</th>
      <th>${valor}</th>
      <th></th>
    </tr>`;

    premios.push({
      valor,
      estado: 1,
      idPremio,
    });

    $("#tbPremio" + id).append(tr);
    $("#EtapaPremio" + id).val(0);
    $("#Premios" + id).val(0);
    $("#valorP" + id).val(null);
  });

  $("#btnAddPresupuesto" + id).click(function () {
    var departamento = $("#departamento" + id)
      .children("option:selected")
      .text();
    var idDepartamento = $("#departamento" + id)
      .children("option:selected")
      .val();
    var municipio = $("#municipio" + id)
      .children("option:selected")
      .text();
    var idMunicipio = $("#municipio" + id)
      .children("option:selected")
      .val();
    var limiteGanadores = $("#limiteGanadores" + id).val();
    var presupuesto = $("#Presupuesto" + id).val();
    var tr = `<tr>
          <th>${departamento}</th>
          <th>${municipio}</th>
          <th>${limiteGanadores}</th>
          <th>${presupuesto}</th>
          <th></th>
    </tr>`;

    arrayPresupuesto.push({
      idDepartamento,
      idMunicipio,
      limiteGanadores,
      valor: presupuesto,
      estado: 1,
    });

    $("#tbPresupuesto" + id).append(tr);
    $("#limiteGanadores" + id).val(null);
    $("#Presupuesto" + id).val(null);
    $("#departamento" + id).val(0);
    $("#municipio" + id).val(0);

    etapas[id - 1].parametros = parametros;
    etapas[id - 1].premios = premios;
    etapas[id - 1].presupuestos = arrayPresupuesto;

    parametros = [];
    premios = [];
    arrayPresupuesto = [];
  });

  getTransacciones(id);
  getPremios(id);
  getDepartamentos(id);
  getMunicipios(id);
  loadMenu(true);
}

const getDepartamentos = (id, isEdith = false) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  if (isEdith) {
    fetch(`${url}Departamento`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#departamentoEdit").append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else {
    fetch(`${url}Departamento`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#departamento" + id).append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  }
};

const getMunicipios = (id, isEdit = false) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  if (isEdit) {
    fetch(`${url}Municipio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#municipioEdit").append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else {
    fetch(`${url}Municipio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#municipio" + id).append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  }
};

const getTransacciones = (id, isEdit = false) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  if (isEdit) {
    fetch(`${url}Transaccion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#TransaccionesEdit").append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else {
    fetch(`${url}Transaccion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#Transacciones" + id).append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  }
};

function tipoParticipante() {
  let valor = $("#tipoParticipante").val();

  if (valor == 2) {
    $("#formFile").show();
    $("#tableParticipantes").show();
  } else {
    $("#formFile").hide();
    $("#tableParticipantes").hide();
    $("#detalleParticipantes").html(null);
    $("#formFile").val("");
  }
}

inputFile.addEventListener("change", function () {
  const extPermitidas = /(.xlsx)$/;

  if (!extPermitidas.exec($("#formFile").val())) {
    Alert("El archivo debe ser un excel", "error");

    $("#formFile").val("");
  } else {
    readXlsxFile(inputFile.files[0]).then(function (data) {
      data.map((row, indexP) => {
        var tr = `<tr id="fila${indexP}">
        <td >${indexP + 1}</td>
        <td>${row[0]}</td>
        <td >
            <div class="btn-group">
              <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                  ${feather.icons["more-vertical"].toSvg({
                    class: "font-small-4",
                  })}
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                  <a href="#" onclick="eliminarFila(${indexP})" id="delete" class="btn_delete dropdown-item">
                    ${feather.icons["trash-2"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Inhabilitar
                  </a>
              </div>
            </div>
        </td>
        </tr>`;

        $("#detalleParticipantes").append(tr);
        participantes.push({ numero: row[0], estado: 1 });
      });

      console.log(participantes);
    });
  }
});

function eliminarFila(id) {
  $("#fila" + id).remove();
  console.log(id);
}

function eliminarEtapa(id) {
  console.log("voy a eliminar");
  $("#fila" + id).remove();
  $("#social-links-vertical-" + id).remove();
  $("#opc" + id).remove();
}

inputFileBloqueados.addEventListener("change", function () {
  const extPermitidas = /(.xlsx)$/;

  if (!extPermitidas.exec($("#formFileBloqueados").val())) {
    Alert("El archivo debe ser un excel", "error");

    $("#formFile").val("");
  } else {
    readXlsxFile(inputFileBloqueados.files[0]).then(function (data) {
      data.map((row) => {
        var tr = `<tr id="fila${indexB}">
        <td>${indexB++}</td>
        <td>${row[0]}</td>
        <td>
            <div class="btn-group">
              <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                  ${feather.icons["more-vertical"].toSvg({
                    class: "font-small-4",
                  })}
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                  <a href="#" onclick="eliminarFila(${indexB})" class="btn_edit dropdown-item">
                      ${feather.icons["archive"].toSvg({
                        class: "font-small-4 mr-50",
                      })} Actualizar
                  </a>
              
              <div class="dropdown-menu dropdown-menu-right">
                  <a href="#" onclick="eliminarFila(${indexB})" class="btn_delete dropdown-item">
                    ${feather.icons["trash-2"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Inhabilitar
                  </a>
              </div>
              </div>
            </div>
        </td>
        </tr>`;

        $("#detalleParticipantesBloqueados").append(tr);

        bloqueados.push({ numero: row[0], estado: 1 });
      });
    });
  }
});

function agregarUsuarioBloqueado() {
  let usuario = $("#numeroBloqueado").val();

  var tr = `<tr>
  <td>${indexB++}</td>
  <td>${usuario}</td>
  <td>
            <div class="btn-group">
              <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                  ${feather.icons["more-vertical"].toSvg({
                    class: "font-small-4",
                  })}
              </a>
              
              <div class="dropdown-menu dropdown-menu-right">
                  <a href="#" onclick="eliminarFila(${indexB})" class="btn_delete dropdown-item">
                    ${feather.icons["trash-2"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Inhabilitar
                  </a>
              </div>
            </div>
        </td>
  </tr>`;

  $("#detalleParticipantesBloqueados").append(tr);
  $("#numeroBloqueado").val("");

  bloqueados.push({ numero: parseInt(usuario), estado: 1 });
  console.log(bloqueados);
}

const getAllCampanias = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
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

      console.log(pausadas);

      let borrador = result.filter((x) => x.estado == 3);
      $("#textBorrador").text(borrador.length);
      table("tableBorrador", borrador);
    })
    .catch((error) => console.log("error", error));
};
const table = (table, data) => {
  

  $("#" + table).dataTable({
    destroy: true,
    data,
    columns: [
      { data: null, render: function (data, type, row, meta) {

        if (type === 'display') {
            return meta.row + 1;
        }
        return meta.row + 1; 
    }},
    
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

          if (row.estado != 0) {
            opcAdd += `<a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
            ${feather.icons["archive"].toSvg({
              class: "font-small-4 mr-50",
            })} Actualizar
            </a><a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
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
        text: "Nuevo",
        className: "btn btn-primary mt-50",
        action: function (e, dt, node, config) {
          ChangePanel(2);
        },
        init: function (api, node, config) {
          $(node).removeClass("btn-secondary");
          //Metodo para agregar un nuevo usuario
        },
      },
    ],
  });
};

const ChangePanel = (estado) => {
  if (estado === 1) {
    $("#panelCreacion").hide();
    $("#panelListado").show();
  } else {
    $("#panelListado").hide();
    $("#panelCreacion").show();
  }
};

function saveLocal() {
  let campañasArray = JSON.parse(localStorage.getItem("Camapañas")) || [];
  const data = {
    id: idData,
    campaña: $("#nombre").val(),
    Inicio: $("#fechaInicio").val(),
    Fin: $("#fechaFin").val(),
    Estado: 1,
  };

  campañasArray.push(data);
  console.log(campañasArray);

  localStorage.setItem("Camapañas", JSON.stringify(campañasArray));

  idData + 1;
}

const saveData = (data) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        Alert(result.message, "warning");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Alert(error, "error");
    });
};

const Alert = function (
  message,
  status // si se proceso correctamente la solicitud
) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};
const Limpiar = (isEdith) => {
  if (isEdith) {
    $("#PreviewEtapsEdit").html(null);
  } else {
    $("#descripcionCamania").val(null);
    $("#nombre").val(null);
    $("#tituloNotificacion").val(null);
    $("#descripcionNotificacion").val(null);
    $("#limiteParticipacion").val(null);
    $("#fechaInicio").val(null);
    $("#fechaFin").val(null);
    $("#fechaRegistro").val(null);
    $("#edadIni").val(null);
    $("#sexo").val(0);
    $("#tipoUsuario").val(0);
    ChangePanel(1);
  }
};

const getPremios = (id, isEdit = false) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  if (isEdit) {
    fetch(`${url}Premio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#PremiosEdit").append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else {
    $("#premio").html(
      '<option value="0" selected disabled>Selecciona una opcion</option>'
    );
    fetch(`${url}Premio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#Premios" + id).append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  }
};

const loadMenuEdit = (isEdit = false) => {
  if (isEdit) {
    var bsStepper = document.querySelectorAll(".bs-stepper"),
      select = $(".select2"),
      verticalWizard = document.querySelector(
        ".vertical-wizard-example-Etapas"
      );
  } else {
    var bsStepper = document.querySelectorAll(".bs-stepper"),
      select = $(".select2"),
      verticalWizard = document.querySelector(".vertical-wizard-example-Edit");
  }

  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener("show.bs-stepper", function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find(".step").length - 1;
        var line = $(event.target).find(".step");
        console.log(numberOfSteps);
        // The first for loop is for increasing the steps,
        // the second is for turning them off when going back
        // and the third with the if statement because the last line
        // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

        for (var i = 0; i < index; i++) {
          line[i].classList.add("crossed");

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove("crossed");
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove("crossed");
          }
          line[0].classList.remove("crossed");
        }
      });
    }
  }

  // select2
  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: "Select value",
      dropdownParent: $this.parent(),
    });
  });

  // Vertical Wizard
  // --------------------------------------------------------------------
  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false,
    });
    /*$(verticalWizard)
      .find('.btn-next')
      .on('click', function () {
        $('#text-nemonico').text($('#nemonico').val());
        $('#text-nombre').text($('#nombre').val());
        $('#text-descripcion').text($('#descripcion').val());
        $('#text-success').text($('#successaMessage').val());
        $('#text-fail').text($('#failMessage').val());
        $('#text-fechaInicio').text($('#fechaInicio').val());
        $('#text-fechaFin').text($('#fechaFin').val());
        verticalStepper.next();
      });
    $(verticalWizard)
      .find('.btn-prev')
      .on('click', function () {
        verticalStepper.previous();
      });*/
  }
};

const getParametros = (idEtapa) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}parametros/${idEtapa}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var tipoTran;

        if (element.tipoTransaccion == "c") {
          tipoTran = "Categoria";
        } else if (element.tipoTransaccion == "t") {
          tipoTran = "Transaccion";
        }

        var opcTableParametros = `<tr>
        <td>${element.id}</td>
        <td>${tipoTran}</td>
        <td>${element.ValorMinimo}</td>
        <td>${element.ValorMaximo}</td>
        <td>
          <div class="btn-group">
            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons["more-vertical"].toSvg({
                  class: "font-small-4",
                })}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="cargarDatos(${
                  element.id
                }, ${1})" class="borrar btn_edit dropdown-item">
                    ${feather.icons["archive"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Actualizar
                </a>
            
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="OpenDelete(${
                  element.id
                })" class="btn_delete dropdown-item">
                  ${feather.icons["trash-2"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Inhabilitar
                </a>
            </div>
            </div>
          </div> 
        </td>
        </tr>`;

        $("#parametrosTable").append(opcTableParametros);
      });
    });
};

const getPremiosEtapa = (idEtapa) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}premios/${idEtapa}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opcTablePremios = `<tr>
        <td>${element.id}</td>
        <td>${element.valor}</td>
        <td>
          <div class="btn-group">
            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons["more-vertical"].toSvg({
                  class: "font-small-4",
                })}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="cargarDatos(${
                  element.id
                }, ${2})" class="borrar btn_edit dropdown-item">
                    ${feather.icons["archive"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Actualizar
                </a>
            
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="OpenDelete(${
                  element.id
                })" class="btn_delete dropdown-item">
                  ${feather.icons["trash-2"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Inhabilitar
                </a>
            </div>
            </div>
          </div> 
        </td>
        </tr>`;

        $("#PremiosTable").append(opcTablePremios);
      });
    });
};

const getPresupuesto = (idEtapa) => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}presupuesto/${idEtapa}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opcTablePresupuesto = `<tr>
        <td>${element.id}</td>
        <td>${element.valor}</td>
        <td>${element.limiteGanadores}</td>
        <td>
          <div class="btn-group">
            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons["more-vertical"].toSvg({
                  class: "font-small-4",
                })}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="cargarDatos(${
                  element.id
                }, ${3})" class="borrar btn_edit dropdown-item">
                    ${feather.icons["archive"].toSvg({
                      class: "font-small-4 mr-50",
                    })} Actualizar
                </a>
            
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="OpenDelete(${
                  element.id
                })" class="btn_delete dropdown-item">
                  ${feather.icons["trash-2"].toSvg({
                    class: "font-small-4 mr-50",
                  })} Inhabilitar
                </a>
            </div>
            </div>
          </div> 
        </td>
        </tr>`;

        $("#PresupuestoTable").append(opcTablePresupuesto);
      });
    });
};

const getEtapas = (id) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  console.log("ID de la camapaña" + id);
  fetch(`${url}Campania/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.etapas.forEach((element, index) => {
        console.log(index);
        var opcTableEtapas = `<tr>
              <td>${index + 1}</td>
              <td>${element.nombre}</td>
              <td>${element.descripcion}</td>
              <td>
                <div class="btn-group">
                  <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                      ${feather.icons["more-vertical"].toSvg({
                        class: "font-small-4",
                      })}
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="OpenEdit(${id}, ${index}, ${
          element.id
        } , ${true})" class="borrar btn_edit dropdown-item">
                          ${feather.icons["archive"].toSvg({
                            class: "font-small-4 mr-50",
                          })} Actualizar
                      </a>
                  
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="OpenDelete(${index})" class="btn_delete dropdown-item">
                        ${feather.icons["trash-2"].toSvg({
                          class: "font-small-4 mr-50",
                        })} Inhabilitar
                      </a>
                  </div>
                  </div>
                </div> 
              </td>
              </tr>`;

        $("#PreviewEtapsEdit").append(opcTableEtapas);
      });
    })
    .catch((error) => console.log("error", error));
};

const OpenEdit = (id, index, idEtapa, isEtapa = false) => {
  if (isEtapa) {
    console.log("aca ira el formulario de etapas " + id, idEtapa);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    console.log(id);
    fetch(`${url}Campania/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.index);
        $("#idEtapa").val(result.etapas[index].id);
        $("#nombreEtapaEdith").val(result.etapas[index].nombre);
        $("#ordenEtapaEdith").val(result.etapas[index].orden);
        $("#descEtapaEdith").val(result.etapas[index].descripcion);
        $("#TipoTransaccionEdith").val(result.etapas[index].tipoParticipacion);

        getParametros(idEtapa);
        getPremiosEtapa(idEtapa);
        getPresupuesto(idEtapa);
        getPremios(0, true);
        getDepartamentos(0, true);
        getMunicipios(0, true);

        $("#modalEditEtapas").modal("toggle");
      })
      .catch((error) => console.log("error", error));

    loadMenuEdit(true);
  } else {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${url}Campania/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $("#id").val(id);
        $("#nombreEdith").val(result.nombre);
        $("#descripcionCamaniaEdith").val(result.descripcion);
        $("#tituloNotificacionEdith").val(result.tituloNotificacion);
        $("#descripcionNotificacionEdith").val(result.descripcionNotificacion);
        $("#limiteParticipacionEdith").val(result.maximoParticipaciones);
        $("#fechaInicioEdith").val(result.fechaInicio);
        $("#fechaFinEdith").val(result.fechaFin);
        $("#fechaRegistroEdith").val(result.fechaRegistro);
        $("#edadIniEdith").val(result.edadInicial);
        $("#edadFiniEdith").val(result.edadFinal);
        $("#tipoUsuarioEdith").val(result.tipoUsuario);
        $("#sexoEdith").val(result.sexo);

        getEtapas(id);
        getParticipantes(id);
        getBloqueados(id);

        $("#modalEdit").modal("toggle");
      })
      .catch((error) => console.log("error", error));
    loadMenuEdit();
  }
};

const tipoDeTransaccion = (id) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let tipoTrans = $("#TipoTransaccion" + id).val();

  console.log(tipoTrans);

  if (tipoTrans == "c") {
    $("#Transacciones" + id).html(null);

      $('#Transacciones'+id).html(null);
      
      fetch(`${url}categoria`, requestOptions)
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#Transacciones" + id).append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else if (tipoTrans == "t") {
    $("#Transacciones" + id).html(null);
    getTransacciones(id);
  }
};

$("#TipoTransaccionEdit").on("change", function () {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let tipoTrans = $("#TipoTransaccionEdit").val();

  console.log(tipoTrans);

  if (tipoTrans == "c") {
    $("#TransaccionesEdit").html(null);

      $('#TransaccionesEdit').html(null);
      
      fetch(`${url}categoria`, requestOptions)
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $("#TransaccionesEdit").append(opc);
        });
      })
      .catch((error) => console.log("error", error));
  } else if (tipoTrans == "t") {
    $("#TransaccionesEdit").html(null);
    getTransacciones(0, true);
  }
});

const cargarDatos = (id, opc) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  switch (opc) {
    case 1:
      $("#btnAgregarParametros").hide();
      getTransacciones(0, true);

      fetch(`${url}parametros/edith/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          $("#idParametro").val(result.id);
          $("#TipoTransaccionEdit").val(result.tipoTransaccion);
          $("#TransaccionesEdit").val(result.idTransaccion);
          $("#vMinimoEdit").val(result.ValorMinimo);
          $("#vMaximoEdit").val(result.ValorMaximo);
          $("#vAnteriorEdit").val(result.valorAnterior);
          $("#limiteParticipacionEdit").val(result.limiteParticipacion);
        });

      $("#btnActualizarParametros").show();

      break;

    case 2:
      $("#btnAgregarPremios").hide();
      getPremios(0, true);

      fetch(`${url}premios/edith/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          $("#idPremio").val(result.id);
          $("#PremiosEdit").val(result.idPremio);
          $("#valorPEdit").val(result.valor);
        });

      $("#btnActualizarPremios").show();

      break;

    case 3:
      $("#btnAgregarPresupuesto").hide();
      getDepartamentos(0, true);
      getMunicipios(0, true);

      fetch(`${url}presupuesto/edith/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          $("#idPresupuesto").val(result.id);
          $("#departamentoEdit").val(result.idDepartamento);
          $("#municipioEdit").val(result.idMunicipio);
          $("#limiteGanadoresEdit").val(result.limiteGanadores);
          $("#PresupuestoEdit").val(result.valor);
        });

      $("#btnActualizarPresupuesto").show();

      break;
  }
};

const updateCampaña = (opc) => {
  let id;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const idEtapa = $("#idEtapa").val();

  switch (opc) {
    case 1: //Parametros Update
      id = $("#idParametro").val();

      var raw = JSON.stringify({
        limiteParticipacion: $("#limiteParticipacionEdit").val(),
        idTransaccion: $("#TransaccionesEdit option:selected").val(),
        tipoTransaccion: $("#TipoTransaccionEdit option:selected").val(),
        ValorMinimo: $("#vMinimoEdit").val(),
        ValorMaximo: $("#vMaximoEdit").val(),
        valorAnterior: $("#vAnteriorEdit").val(),
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${url}parametros/update/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.code == "ok") {
            $("#parametrosTable").html(null);
            getParametros(idEtapa);
            Alert(result.message, "success");
          } else {
            Alert(result.message, "error");
          }
        })
        .catch((error) => {
          Alert(error, "error");
        });

      $("#limiteParticipacionEdit").val("");
      $("#TransaccionesEdit").val(0);
      $("#TipoTransaccionEdit").val(0);
      $("#vMinimoEdit").val("");
      $("#vMaximoEdit").val("");
      $("#vAnteriorEdit").val("");
      $("#btnActualizarParametros").hide();
      $("#btnAgregarParametros").show();

      break;

    case 2: //Preemio Update
      id = $("#idPremio").val();

      var raw = JSON.stringify({
        valor: $("#valorPEdit").val(),
        idPremio: $("#PremiosEdit option:selected").val(),
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${url}premios/update/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.code == "ok") {
            $("#PremiosTable").html(null);
            getPremiosEtapa(idEtapa);
            Alert(result.message, "success");
          } else {
            Alert(result.message, "error");
          }
        })
        .catch((error) => {
          Alert(error, "error");
        });

      $("#valorPEdit").val("");
      $("#PremiosEdit").val(0);
      $("#btnActualizarPremios").hide();
      $("#btnAgregarPremios").show();
      break;

    case 3: //Presupuesto Update
      id = $("#idPresupuesto").val();

      var raw = JSON.stringify({
        idDepartamento: $("#departamentoEdit option:selected").val(),
        idMunicipio: $("#municipioEdit option:selected").val(),
        limiteGanadores: $("#limiteGanadoresEdit").val(),
        valor: $("#PresupuestoEdit").val(),
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${url}presupuesto/update/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.code == "ok") {
            $("#PresupuestoTable").html(null);
            getPresupuesto(idEtapa);
            Alert(result.message, "success");
          } else {
            Alert(result.message, "error");
          }
        })
        .catch((error) => {
          Alert(error, "error");
        });

      $("#departamentoEdit").val(0);
      $("#municipioEdit").val(0);
      $("#limiteGanadoresEdit").val("");
      $("#PresupuestoEdit").val("");
      $("#btnActualizarPresupuesto").hide();
      $("#btnAgregarPresupuesto").show();

      break;
  }
};

$("#formEditEtapas").submit(function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const id = $("#idEtapa").val();
  const idCamp = $("#id").val();

  var raw = JSON.stringify({
    nombre: $("#nombreEtapaEdith").val(),
    descripcion: $("#descEtapaEdith").val(),
    orden: $("#ordenEtapaEdith").val(),
    tipoParticipacion: $("#TipoTransaccionEdith option:selected").val(),
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}etapa/update/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#PreviewEtapsEdit").html(null);
        getEtapas(idCamp);
        $("#modalEditEtapas").modal("toggle");
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      Alert(error.errors, "error");
    });
  return false;
});

$("#formEdit").submit(function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const idCamp = $("#id").val();
  console.log(idCamp);

  var raw = JSON.stringify({
    fechaRegistro: $("#fechaRegistroEdith").val(),
    fechaInicio: $("#fechaInicioEdith").val(),
    fechaFin: $("#fechaFinEdith").val(),
    nombre: $("#nombreEdith").val(),
    descripcion: $("#descripcionCamaniaEdith").val(),
    edadInicial: $("#edadIniEdith").val(),
    edadFinal: $("#edadFiniEdith").val(),
    sexo: $("#sexoEdith option:selected").val(),
    tipoUsuario: $("#tipoUsuarioEdith option:selected").val(),
    tituloNotificacion: $("#tituloNotificacionEdith").val(),
    descripcionNotificacion: $("#descripcionNotificacionEdith").val(),
    imgPush: "",
    imgAkisi: "",
    maximoParticipaciones: $("#limiteParticipacionEdith").val(),
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}Campania/${idCamp}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        getAllCampanias();
        $("#modalEdit").modal("toggle");
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      Alert(error.errors, "error");
    });
  return false;
});

const pausarActualizarCampania = (id, type) => {
  var requestOptions = {
    method: "PUT",
    redirect: "follow",
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

const getParticipantes = (idCampania) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`${url}participantes/${idCampania}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element, index) => {
        var opcTableEtapas = `<tr>
              <td>${index + 1}</td>
              <td>${element.numero}</td>
              <td>
                <div class="btn-group">
                  <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                      ${feather.icons["more-vertical"].toSvg({
                        class: "font-small-4",
                      })}
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="" class="borrar btn_edit dropdown-item">
                          ${feather.icons["archive"].toSvg({
                            class: "font-small-4 mr-50",
                          })} Actualizar
                      </a>
                  
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="OpenDelete(${index})" class="btn_delete dropdown-item">
                        ${feather.icons["trash-2"].toSvg({
                          class: "font-small-4 mr-50",
                        })} Inhabilitar
                      </a>
                  </div>
                  </div>
                </div> 
              </td>
              </tr>`;

        $("#PreviewParticipantesEdit").append(opcTableEtapas);
      });
    })
    .catch((error) => console.log("error", error));
};

const getBloqueados = (idCampania) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`${url}Bloqueados/${idCampania}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element, index) => {
        var opcTableEtapas = `<tr>
              <td>${index + 1}</td>
              <td>${element.numero}</td>
              <td>
                <div class="btn-group">
                  <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                      ${feather.icons["more-vertical"].toSvg({
                        class: "font-small-4",
                      })}
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="" class="borrar btn_edit dropdown-item">
                          ${feather.icons["archive"].toSvg({
                            class: "font-small-4 mr-50",
                          })} Actualizar
                      </a>
                  
                  <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" onclick="OpenDelete(${index})" class="btn_delete dropdown-item">
                        ${feather.icons["trash-2"].toSvg({
                          class: "font-small-4 mr-50",
                        })} Inhabilitar
                      </a>
                  </div>
                  </div>
                </div> 
              </td>
              </tr>`;

        $("#PreviewBloqueadosEdit").append(opcTableEtapas);
      });
    })
    .catch((error) => console.log("error", error));
};

const limpiarTablas = () => {
  $("#parametrosTable").html(null);
  $("#PremiosTable").html(null);
  $("#PresupuestoTable").html(null);
};

$("#btnAgregarParametros").on("click", function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let idEtapa = $("#idEtapa").val();
  console.log(id);

  var raw = JSON.stringify({
    limiteParticipacion: $("#limiteParticipacionEdit").val(),
    idTransaccion: $("#TransaccionesEdit option:selected").val(),
    tipoTransaccion: $("#TipoTransaccionEdit option:selected").val(),
    ValorMinimo: $("#vMinimoEdit").val(),
    ValorMaximo: $("#vMaximoEdit").val(),
    valorAnterior: $("#vAnteriorEdit").val(),
    idEtapa: idEtapa,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}parametros`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#parametrosTable").html(null);
        getParametros(idEtapa);
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      Alert(error, "error");
    });

  $("#limiteParticipacionEdit").val("");
  $("#TransaccionesEdit").val(0);
  $("#TipoTransaccionEdit").val(0);
  $("#vMinimoEdit").val("");
  $("#vMaximoEdit").val("");
  $("#vAnteriorEdit").val("");
  $("#btnActualizarParametros").hide();
});

$("#btnAgregarPremios").on("click", function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let idEtapa = $("#idEtapa").val();

  var raw = JSON.stringify({
    valor: $("#valorPEdit").val(),
    idPremio: $("#PremiosEdit option:selected").val(),
    idEtapa: idEtapa,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}premios`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#PremiosTable").html(null);
        getPremiosEtapa(idEtapa);
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      Alert(error, "error");
    });

  $("#valorPEdit").val("");
  $("#PremiosEdit").val(0);
  $("#btnActualizarPremios").hide();
  $("#btnAgregarPremios").show();
});

$("#btnAgregarPresupuesto").on("click", function () {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let idEtapa = $("#idEtapa").val();

  var raw = JSON.stringify({
    idDepartamento: $("#departamentoEdit option:selected").val(),
    idMunicipio: $("#municipioEdit option:selected").val(),
    limiteGanadores: $("#limiteGanadoresEdit").val(),
    valor: $("#PresupuestoEdit").val(),
    idEtapa: idEtapa,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}presupuesto`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#PresupuestoTable").html(null);
        getPresupuesto(idEtapa);
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      Alert(error, "error");
    });

  $("#departamentoEdit").val(0);
  $("#municipioEdit").val(0);
  $("#limiteGanadoresEdit").val("");
  $("#PresupuestoEdit").val("");
  $("#btnActualizarPresupuesto").hide();
  $("#btnAgregarPresupuesto").show();
});

/*const  removePremio = (index) => {
  premios.splice(index,1);
  DrawPremios()
}*/
