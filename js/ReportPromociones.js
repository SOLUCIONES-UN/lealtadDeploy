const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  getPromociones();

  $("#ConsultarPromo").on("click", function () {
    if (
      $("#selectpromo").val() !== "0" &&
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      getReport();
    } else {
      Alert("Debe llenar todos los campos", "error");
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
      console.log("Promociones obtenidas:", result); // Agregar console.log para ver las promociones obtenidas
      $("#selectpromo").html(
        "<option disabled selected value='0'>Elige una promoción</option>"
      );

      result.forEach((element) => {
        $("#selectpromo").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
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
      mostrarDatosEnTabla(result);
    })
    .catch((error) => alert(error, "error"));
};

document.getElementById("btnDescargarExcel").addEventListener("click", function () {
  const table = document.getElementById("TablaReportePromo");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });
  XLSX.writeFile(wb, "reporte_promociones.xlsx");
});

function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos); 
  $("#TablaReportePromo").empty(); 
  datos.forEach((element) => {
    const fechaAcreditacion = formatearFechaHora(element.fecha);
    const { cupon, esPremio, descripcion } =
      element.detallepromocion.premiopromocion;
    const monto = parseFloat(
      element.detallepromocion.premiopromocion.valor
    ).toFixed(2);
    const montoTransaccion =
      element.detallepromocion.premiopromocion.cantidad * monto;

    const fila = `
      <tr> 
        <td>${fechaAcreditacion}</td>
        <td>${element.numeroTelefono}</td>
        <td>${descripcion}</td>
        <td>${element.id}</td>
        <td>${cupon}</td>
        <td>${esPremio === 1 ? "SI" : "NO"}</td>
        <td>${monto}</td>
        <td>${cupon}</td>
        <td>${montoTransaccion}</td>
        <td>${element.fechaInicial}</td>
      </tr>
    `;
    $("#TablaReportePromo").append(fila);
  });
}

// Función para formatear la fecha y hora
function formatearFechaHora(fechaHora) {
  const fecha = new Date(fechaHora);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
}

const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};
