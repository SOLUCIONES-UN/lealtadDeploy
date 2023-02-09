const url = "http://localhost:3000/";

$(function () {
  getPromociones();
});

//funcion para llenar las promociones
const getPromociones = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(url + "Promocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#selectpromo").html(
        "<option disabled selected>Elige una promocion</option>"
      );

      result.forEach((element) => {
        $("#selectpromo").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
    })
    .catch((error) => console.log("error", error));
};



$("#ConsultarPromo").on("click", function () {
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
  $("#TablaReportePromo").html(null)
  fetch(url + "reportePromocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      
      result.forEach((element) => {
        let fecha = element.fecha.split("T");
        let fecha2 = fecha[0].split("-");
        let hora = fecha[1].split(":");
        const { cupon, esPremio } = element.detallePromocion;
        const {descripcion} = element.detallePromocion.premioPromocion.premio;
        var listado = `
        <tr> 
          <th> 
          ${element.id}
          </th>
          <th>
          ${cupon}
          </th>
          <th>
          ${fecha2[2]}/${fecha2[1]}/${fecha2[0]} ${hora[0]}:${hora[1]}
          </th>
          <th>
          ${element.numeroTelefono}
          </th>
          <th>
          ${esPremio === 1 ? 'SI': 'NO'}
          </th>
          <th>
          ${descripcion}
          </th>
        </tr>
        `;
        $("#TablaReportePromo").append(listado);
      });
    })

    .catch((error) => console.log("error", error));
});
