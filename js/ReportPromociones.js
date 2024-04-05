const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos

$(function () {
  $("#btnDescargarExcel, #PantallaInfo").hide(); // Ocultar botones al inicio

  // Inicializar el plugin multiple-select
  $('#selectpromo').multipleSelect({
    filter: true,
    selectAll: true, // Habilitar la opción de seleccionar todos los elementos
    //placeholder: "Elige una promoción",

  });

  getPromociones();

  $("#ConsultarPromo").on("click", function () {
    if (
      $("#selectpromo").val() !== null && // Verificar si se ha seleccionado al menos una opción
      $("#selectpromo").val().length > 0 && // Verificar si se ha seleccionado al menos una opción
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      getReport();
    } else {
      Alert("Debe llenar todos los campos", "error");
    }
  });

  $("#PantallaInfo").on("click", function () {
    if (datosObtenidos) {
      mostrarDatosEnTabla(datosObtenidos);
    } else {
      Alert("Primero debes obtener los datos", "error");
    }
  });
});

const getPromociones = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(url + "Promocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Promociones obtenidas:", result);
      // Limpiar el select antes de agregar opciones
      $("#selectpromo").empty();
      // Agregar la opción por defecto
      $("#selectpromo").append(
        "<option disabled selected value='0'>Elige una promoción</option>"
      );

      result.forEach((element) => {
        // Agregar opciones al select
        $("#selectpromo").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
      // Actualizar el select múltiple después de agregar opciones
      $('#selectpromo').multipleSelect('refresh');
    })
    .catch((error) => alert(error, "error"));
};

const getReport = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    promocion: $("#selectpromo").val(),
    fechaInicial: $("#FechaInicio").val(),
    fechaFinal: $("#FechaFin").val(),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(url + "reportePromocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Datos del informe de promociones:", result);
      datosObtenidos = result;
      $("#btnDescargarExcel, #PantallaInfo").show(); // Mostrar botones después de obtener los datos
    })
    .catch((error) => alert(error, "error"));
};

function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos);
  $("#TablaReportePromo").empty();
  datos.forEach((element) => {
    const fecha = formatearFechaHora(element.fecha);
    const { cupon, esPremio, descripcion } =
      element.detallepromocion.premiopromocion;
    const monto = parseFloat(
      element.detallepromocion.premiopromocion.valor
    ).toFixed(2);
    const montoTransaccion =
      element.detallepromocion.premiopromocion.cantidad * monto;

    const fila = `
      <tr> 
        <td>${element.fecha}</td>
        <td>${element.numeroTelefono}</td>
        <td>${element.descripcion}</td>
        <td>${element.id}</td>
        <td>${element.detallepromocion.premiopromocion.premio.descripcion}</td>
        <td>${monto}</td>
        <td>${element.detallepromocion.premiopromocion.idPromocion}</td>
        <td>${element.detallepromocion.cupon}</td>
        <td>${montoTransaccion}</td>
        <td>${fecha}</td>
      </tr>
    `;
    $("#TablaReportePromo").append(fila);
  });
}

document.getElementById("btnDescargarExcel").addEventListener("click", function () {
  const table = document.getElementById("tableData"); // Obtener la tabla
  const wb = XLSX.utils.book_new(); // Crear un nuevo libro de Excel

  // Obtener los datos de la tabla
  const data = [];
  const headers = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      if (i === 0) {
        // Obtener los nombres de las columnas de la primera fila
        headers.push(table.rows[i].cells[j].innerText);
      } else {
        row.push(table.rows[i].cells[j].innerText);
      }
    }
    if (i !== 0) {
      // Insertar una celda vacía al principio del array para iniciar desde la columna "A"
      row.unshift("");
      data.push(row);
    }
  }

  // Agregar el encabezado
  const headerRow1 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
    { v: 'REPORTE DE PROMOCIONES', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow2 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
    { v: '', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow3 = [''];
  const headerRow4 = [
    '',
    { v: 'Fecha Acreditacion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Telefono', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Nombre', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Campaña', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Premio', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Monto Premio', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Codigo', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Monto Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Fecha Participacion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
  ];
  data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);
  

  // Agregar los datos y los nombres de las columnas a una hoja
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "reporte_promociones.xlsx");
});

function formatearFechaHora(fechaHora) {
  const fecha = new Date(fechaHora);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año}`;
}

const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};
