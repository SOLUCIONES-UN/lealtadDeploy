const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  getColumnas();
  GetProjects();
  getTablaDB();
  let tabla = getTransaccions();
  Usuario();

  function validarNombreYDescripcion(descripcion) {
    const descripcionValida = /^[^\d\s][a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*[^\d\s]$/.test(
      descripcion.trim()
    );
    if (!descripcionValida) {
      $(".descripcion").addClass("is-invalid");
      $(".descripcion-error")
        .text(
          "La descripción solo debe contener letras sin espacios en blanco ni números"
        )
        .addClass("text-danger");
      return false;
    }
    $(".descripcion").removeClass("is-invalid");
    $(".descripcion-error").empty().removeClass("text-danger");
    return true;
  }

  
  $("#modalNew, #modalEdit").on("show.bs.modal", function () {
    limpiarForm();
  });

  $("#modalNew, #modalEdit").on("hidden.bs.modal", function () {
    limpiarForm();
  });

  $("#modalNew, #modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarForm();
    });

  
  $("#formNew").submit(function () {
    const descripcion = $("#descripcion").val().trim();

    if (!validarNombreYDescripcion(descripcion)) {
      return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      descripcion: descripcion,
      descripcion: $("#descripcion").val().trim(),
      puntos: $("#puntos").val(),
      columna: $("#columna").val(),
      proyecto: $("#proyecto").val(),
      botton: $("#botton").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Transaccion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
          $("#modalNew").modal("toggle");
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
    const descripcion = $("#descripcionEdit").val().trim();
    const columna = $("columnaEdit").val();

    if (!validarNombreYDescripcion(descripcion)) {
      return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#id").val();

    var raw = JSON.stringify({
      descripcion: $("#descripcionEdit").val().trim(),
      puntos: $("#puntosEdit").val(),
      columna: $("#columnaEdit").val(),
      proyecto: $("#proyectoEdit").val(),
      botton: $("#bottonEdit").val(),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Transaccion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
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

  $("#BtnDelete").click(function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${url}Transaccion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
          $("#modalDelete").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        Alert(error.errors, "error");
      });
  });
});

// Obtiene las Transaccs
const getTransaccions = () => {
  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Transaccion`,
      type: "GET",
      datatype: "json",
      dataSrc: "Transaccion",
      headers: { Authorization: token },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          if (type === "display") {
            return meta.row + 1;
          }
          return meta.row + 1;
        },
      },
      { data: "descripcion" },

      {
        data: "id",
        render: function (data) {
          return (
            '<div class="btn-group">' +
            '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
            feather.icons["more-vertical"].toSvg({ class: "font-small-4" }) +
            "</a>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<a href="#" onclick="OpenEdit(' +
            data +
            ')" class="btn_edit dropdown-item">' +
            feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" }) +
            " Actualizar" +
            "</a>" +
            '<a href="#" onclick="OpenDelete(' +
            data +
            ')" class="btn_delete dropdown-item">' +
            feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" }) +
            " Inhabilitar" +
            "</a>" +
            "</div>" +
            "</div>"
          );
        },
      },
    ],
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
      sLengthMenu: "Mostrar _MENU_",
      search: "Buscar",
      searchPlaceholder: "Buscar...",
    },
    buttons: [
      {
        text: "Nuevo",
        className: "add-new btn btn-primary mt-50",
        attr: {
          "data-toggle": "modal",
          "data-target": "#modalNew",
        },
        init: function (api, node, config) {
          $(node).removeClass("btn-secondary");
        },
      },
    ],
  });
};

const limpiarForm = () => {

  $(".descripcion-error").empty().removeClass("text-danger");

  $("#descripcionEdit").removeClass("is-invalid");
};

const Alert = function (message, status) {
  toastr[status](message, status, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};

const OpenEdit = (id) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(`${url}Transaccion/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Llena todos los campos con los datos del resultado
      $("#id").val(id);
      $("#descripcionEdit").val(result.descripcion);
      $("#proyectoEdit").val(result.columna.idProyectos);
      $("#tablaEdit").val(result.columna.idTablas);
      $("#columnaEdit").val(result.columna);

     
      GetProjects(true);

      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

const GetProjects = (isEdit = false) => {
  $("#proyecto").html(null);
  $("#proyectoEdit").html(null);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  $("#proyecto").html(
    '<option value="0" selected disabled>Selecciona una Opcion</option>'
  );
  fetch(`${url}projects`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var option = `<option value="${element.id}">${element.descripcion}</option>`;
        $("#proyecto").append(option);
        $("#proyectoEdit").append(option);
      });
      var selectProyecto = document.getElementById("proyecto");
      var selectProyectoEdit = document.getElementById("proyectoEdit");

      if (isEdit) {
        var currentProjectId = $("#proyectoEdit").val();
        getTablaDB(currentProjectId, true);
      } else {
        selectProyecto.addEventListener("change", function () {
          var selectedId = this.value;
          getTablaDB(selectedId);
        });

        selectProyectoEdit.addEventListener("change", function () {
          var selectedId = this.value;
          getTablaDB(selectedId);
        });
      }
    })
    .catch((err) => console.log("error", err));
};
const getTablaDB = (id, isEdith = false) => {
  $("#tabla").html(null);
  $("#tablaEdit").html(null);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  $("#tabla").empty();
  $("#tabla").append(
    '<option value="0" selected disabled>Selecciona una Opción</option>'
  );

  fetch(`${url}tabla/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.nombre_tabla}</option>`;
        $("#tabla").append(opc);
        $("#tablaEdit").append(opc);
      });
      var selectTablaDb = document.getElementById("tabla");
      var selectTablaDbEdit = document.getElementById("tablaEdit");

      if (isEdith) getColumnas(selectTablaDbEdit.value);

      selectTablaDb.addEventListener("change", function () {
        var selectedId2 = this.value;
        getColumnas(selectedId2);
      });

      selectTablaDbEdit.addEventListener("change", function () {
        var selectedId2 = this.value;
        getColumnas(selectedId2);
      });
    })
    .catch((err) => console.log("error", err));
};

const getColumnas = (idTabla) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  // Verificar si ya hay opciones en el select
  if ($("#columnaEdit option").length > 1) {
    return; // No hace falta volver a cargar las opciones
  }

  fetch(`${url}Columna/bytablas/${idTabla}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      var opc = '';
      result.forEach((element) => {
         opc += `<option value="${element.id}">${element.nombre}</option>`;
      });

      // Agregar las opciones al select
      $("#columnaEdit").append(opc);
    })
    .catch((error) => console.log("error", error));
};