const url = "http://localhost:3000/";

$(function () {
  getAnios();
});

function getAnios() {
  fetch(`${url}ReporteParticipantes/aniosValidos`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos de años:", data);
      let options = `<option value="0">AÑO</option>`;
      data.forEach((d) => {
        options += `<option value="${d.anioValido}">${d.anioValido}</option>`;
      });

      $("#anoCampanas").html(options);
    })
    .catch((error) => console.error("Error al obtener los anios:", error));
}

function getMeses(event) {
  const headers = {
    "Content-Type": "application/json",
  };
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    anioValido: event.target.value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}ReporteParticipantes/mesesValidos`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos de aios:", data);
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    let options = `<option value="0">MES</option>`;
    data.forEach((d) => {
        const nombreMes = meses[d.mesValido - 1]; // Restamos 1 porque los índices de array comienzan en 0
        options += `<option value="${d.mesValido}">${nombreMes}</option>`;
    });

      $("#mesCampana").html(options);
    })
    .catch((error) => console.error("Error al obtener los anios:", error));
}
$("#btnConsultar").click(function () {
  const headers = {
    "Content-Type": "application/json",
  };

  var raw = JSON.stringify({
    anio: $("#anoCampanas").val(),
    mes: $("#mesCampana").val(),
  });

  if ($("#anoCampanas").val() == "0") {
    alert("Seleccione un año");
  } else if ($("#mesCampana").val() == "0") {
    alert("Seleccione un mes");
  } else {
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${url}ReporteParticipantes/ObtenerParticipacionesByFecha`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de campañas:", data);

        // Obtener el canvas y su contexto
        const canvas = document.getElementById("graficaParticipantes");
        const ctx = canvas.getContext("2d");

        // Destruir el gráfico existente si existe
        if (window.myChart) {
          window.myChart.destroy();
        }

        // Obtener datos para el gráfico
        const labels = data.map((c) => c.nombre);
        const participantes = data.map((c) => c.participantes);

        // Configuración del gráfico
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Participantes",
              data: participantes,
              backgroundColor:  
             [
                "rgba(41, 182, 246)",
                "rgba(129, 199, 132)",
                "rgba(21, 101, 192)",
                "rgba(165, 105, 189 )",
                "rgba(102, 102, 255)",
                "rgba(255, 159, 64, 0.2)",
            ],
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        const chartOptions = {
          scales: {
            y: {
              beginAtZero: true, // Empezar el eje Y desde cero
            },
          },
        };

        // Crear el gráfico
        window.myChart = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        });
      })
      .catch((error) =>
        console.error("Error al obtener los datos de las campañas:", error)
      );
  }
});
$("#btnGrafCircular").click(function () {
  if (window.myChart) {
      // Destruir el gráfico de barras existente
      window.myChart.destroy();

      // Obtener los datos para el gráfico circular
      const chartData = window.myChart.config.data;
      const labels = chartData.labels;
      const data = chartData.datasets[0].data;

      // Crear el gráfico circular
      const canvas = document.getElementById("graficaParticipantes");
      const ctx = canvas.getContext("2d");
      window.myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
              labels: labels,
              datasets: [
                  {
                      label: "Participantes",
                      data: data,
                      backgroundColor: [
                          "rgba(41, 182, 246)",
                          "rgba(129, 199, 132)",
                          "rgba(21, 101, 192)",
                          "rgba(165, 105, 189 )",
                          "rgba(102, 102, 255)",
                          "rgba(255, 159, 64, 0.2)",
                      ],
                      borderColor: [
                          "rgba(253, 254, 254)",
                          "rgba(253, 254, 254)",
                          "rgba(253, 254, 254)",
                          "rgba(253, 254, 254)",
                          "rgba(253, 254, 254)",
                          "rgba(255, 159, 64, 1)",
                      ],
                      borderWidth: 1,
                  },
              ],
          },
          options: {
              responsive: true,
          },
      });
  }
});