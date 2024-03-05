let usuario = JSON.parse(localStorage.getItem("infoUsuario"));

$(function () {
  getMenuAccesible();
  verifyToken();
});

document.addEventListener('DOMContentLoaded', () => {
  validateSesion();
});

const verifyToken = () => {
  var token = localStorage.getItem('token');

  if (token == null) {
    window.location.href = 'login.html';
  } else {
    const partes = token.split('.');
    if (partes.length !== 3) {
      window.location.href = 'login.html';
    }
  }
}

const updateProgressBar = (elementId, value) => {
  const progressBar = document.getElementById(elementId);
  if (progressBar) {
      const percentage = value; 
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute('aria-valuenow', percentage);
  }
};


const getAllParticipaciones = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Participacion`, requestOptions)
    .then((response) => response.json())
    .then((participaciones) => {
      // Obtén la fecha de hoy
      const today = new Date();
      // Calcula la fecha de hace 6 días (última semana)
      const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

      // Filtra las participaciones que ocurrieron en la última semana
      const participacionesUltimaSemana = participaciones.filter((participacion) => {
        const fechaParticipacion = new Date(participacion.fecha);
        return fechaParticipacion >= lastWeekStart && fechaParticipacion <= today;
      });

      // Lógica para contar las transacciones por cliente y sumar los valores
      const transaccionesPorCliente = {};
      let totalClientes = 0;
      let totalValorClientes = 0;
      let totalTransacciones = 0;

      participacionesUltimaSemana.forEach((participacion) => {
        const clienteId = participacion.customerId;
        transaccionesPorCliente[clienteId] = (transaccionesPorCliente[clienteId] || 0) + 1;
        totalClientes++;
        totalValorClientes += parseFloat(participacion.valor) || 0;

        // incrementar la cantidad total de transacciones si hay un idTransaccion
        if (participacion.idTransaccion) {
          totalTransacciones++;
        }
      });

      const clientesOrdenados = Object.keys(transaccionesPorCliente).sort((a, b) => transaccionesPorCliente[b] - transaccionesPorCliente[a]);

      const clienteConMasTransacciones = clientesOrdenados[0];
      console.log("Cliente con más transacciones ID:", clienteConMasTransacciones);

      const nombreClienteConMasTransacciones = participacionesUltimaSemana.find(participacion => participacion.customerId === clienteConMasTransacciones)?.customerName || 'Nombre no encontrado';
      console.log("Cliente con más transacciones Nombre:", nombreClienteConMasTransacciones);

      const top5Clientes = clientesOrdenados.slice(0, 5);
      console.log("Top 5 clientes con más transacciones:", top5Clientes);

      const nombresTop5Clientes = top5Clientes.map(clienteId => participacionesUltimaSemana.find(participacion => participacion.customerId === clienteId)?.customerName || 'Nombre no encontrado');
      console.log("Nombres Top 5 clientes con más transacciones:", nombresTop5Clientes);

      console.log("Cantidad de clientes que más han transaccionado:", clientesOrdenados.length);
      console.log("Cantidad total de clientes:", totalClientes);
      console.log("Cantidad total de todas las transacciones:", totalValorClientes.toLocaleString());

      const totalValorClientesFormateado = `Q${totalValorClientes.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;

      console.log("Total del valor de todas las transacciones:", totalValorClientesFormateado);
      console.log("Cantidad total de transacciones:", totalTransacciones);

      const elementoNumeroTransacciones = document.getElementById("numeroTransacciones");
      if (elementoNumeroTransacciones) {
        elementoNumeroTransacciones.textContent = transaccionesPorCliente[clienteConMasTransacciones];
      }

      const elementoNombreCliente = document.getElementById("nombreCliente");
      if (elementoNombreCliente) {
        elementoNombreCliente.textContent = nombreClienteConMasTransacciones;
      }

      // Top clientes que más han transaccionado
      const elementoTop5Clientes = document.getElementById("top5Clientes");
      if (elementoTop5Clientes) {
        elementoTop5Clientes.innerHTML = nombresTop5Clientes.map(nombre => `<li>${nombre}</li>`).join('');
      }

      const elementoCantidadClientesTransacciones = document.getElementById("cantidadClientesTransacciones");
      if (elementoCantidadClientesTransacciones) {
        elementoCantidadClientesTransacciones.textContent = clientesOrdenados.length;
      }

      const elementoTotalClientes = document.getElementById("totalClientes");
      if (elementoTotalClientes) {
        elementoTotalClientes.textContent = totalClientes;
        updateProgressBar('progressBarValorTransacciones', totalClientes);
      }

      const elementoTotalValorTransacciones = document.getElementById("totalValorTransacciones");
      if (elementoTotalValorTransacciones) {
        elementoTotalValorTransacciones.textContent = totalValorClientesFormateado;
        updateProgressBar('progressBarValorTransacciones', participacionesUltimaSemana.length);
      }

      const elementoCantidadTotalTransacciones = document.getElementById("cantidadTotalTransacciones");
      if (elementoCantidadTotalTransacciones) {
        elementoCantidadTotalTransacciones.textContent = totalTransacciones;
      }
    })
    .catch((error) => console.log("Error al obtener participaciones:", error));
};

getAllParticipaciones();



const displayNumPromociones = (numPromociones) => {
  const numPromocionesElement = document.getElementById("num-promociones");
  numPromocionesElement.textContent = numPromociones;
};

const getAllPromocionesActivas = () => {
  const token = localStorage.getItem('token');

  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Promocion`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const promocionesActivas = result.filter(promocion => promocion.estado === 1);
      console.log(promocionesActivas);
      displayNumPromociones(promocionesActivas.length);
    })
    .catch((error) => console.log("error", error));
};

document.addEventListener('DOMContentLoaded', () => {
  getAllPromocionesActivas();
});

const displayNumCampanas = (numCampanas) => {
  const numCampanasElement = document.getElementById("num-campanas");
  numCampanasElement.textContent = numCampanas;
};

const getAllCampanasActivas = () => {
  const token = localStorage.getItem('token');

  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const campanasActivas = result.filter(campana => campana.estado === 1);
      console.log(campanasActivas);
      displayNumCampanas(campanasActivas.length);
    })
    .catch((error) => console.log("error", error));
};

document.addEventListener('DOMContentLoaded', () => {
  getAllCampanasActivas();
});

const displayNumReferidos = (numReferidos) => {
  const numReferidosElement = document.getElementById("num-referidos");
  numReferidosElement.textContent = numReferidos;
};

// const getAllReferidosLastWeek = () => {
//     const token = localStorage.getItem('token');
//     const today = new Date();
//     const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
//     const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

//     const headers = {
//         'Authorization': token,
//         'Content-Type': 'application/json'
//     };

//     var requestOptions = {
//         method: "GET",
//         headers: headers,
//         redirect: "follow"
//     };

//     fetch(`${url}Referidos`, requestOptions)
//         .then((response) => response.json())
//         .then((result) => {
//             const referidosLastWeek = result.filter(referido => new Date(referido.fechaCreacion) >= lastWeekStart && new Date(referido.fechaCreacion) <= lastWeekEnd);
//             console.log("Referidos de la última semana:", referidosLastWeek);
//             displayNumReferidos(referidosLastWeek.length);
//         })
//         .catch((error) => console.log("error", error));
// };

// document.addEventListener('DOMContentLoaded', () => {
//     getAllReferidosLastWeek();
// });


const displayNumCampanasLastWeek = (numCampanas) => {
  const numCampanasElement = document.getElementById("num-campanas-last-week");
  numCampanasElement.textContent = numCampanas;
};

const getAllCampanasActivasLastWeek = () => {
  const token = localStorage.getItem('token');
  const today = new Date();
  const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const campanasActivasLastWeek = result.filter(campana => campana.estado === 1 && new Date(campana.fechaCreacion) >= lastWeekStart && new Date(campana.fechaCreacion) <= lastWeekEnd);
      console.log("Campañas activas de la última semana:", campanasActivasLastWeek);
      displayNumCampanasLastWeek(campanasActivasLastWeek.length);
    })
    .catch((error) => console.log("error", error));
};

document.addEventListener('DOMContentLoaded', () => {
  getAllCampanasActivasLastWeek();
});


const displayNumPromocionesLastWeek = (numPromociones) => {
  const numPromocionesElement = document.getElementById("num-promociones-last-week");
  numPromocionesElement.textContent = numPromociones;
};

const getAllPromocionesActivasLastWeek = () => {
  const token = localStorage.getItem('token');
  const today = new Date();
  const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Promocion`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const promocionesActivasLastWeek = result.filter(promocion => promocion.estado === 1 && new Date(promocion.fechaCreacion) >= lastWeekStart && new Date(promocion.fechaCreacion) <= lastWeekEnd);
      console.log("Promociones activas de la última semana:", promocionesActivasLastWeek);
      displayNumPromocionesLastWeek(promocionesActivasLastWeek.length);
    })
    .catch((error) => console.log("error", error));
};

document.addEventListener('DOMContentLoaded', () => {
  getAllPromocionesActivasLastWeek();
});

//grafica
document.getElementById("ver-detalles-btn").addEventListener("click", function () {
  var myModal = new bootstrap.Modal(document.getElementById('graficaModal'));
  myModal.show();
});
// Función para obtener y mostrar la gráfica de campañas
// function mostrarGraficaCampañas() {
//   const canvas = document.getElementById('graficaCampañas');
//   const token = localStorage.getItem('token');
//   const headers = {
//     'Authorization': token,
//     'Content-Type': 'application/json'
//   };

//   var requestOptions = {
//     method: "GET",
//     headers: headers,
//     redirect: "follow"
//   };

//   fetch(`${url}Campania`, requestOptions)
//     .then(response => response.json())
//     .then(data => {
//       console.log("Datos de campañas:", data);

//       const labels = data.map(campaña => campaña.nombre);
//       const numClientes = data.map(campaña => campaña.numero_clientes);

//       // Seleccionar el contenedor SVG
//       const svg = d3.select(canvas);

//       // Configurar el ancho y alto del gráfico
//       const width = 400;
//       const height = 300;

//       // Crear escalas para los ejes X e Y
//       const xScale = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
//       const yScale = d3.scaleLinear().domain([0, d3.max(numClientes)]).range([height, 0]);

//       // Crear el contenedor principal del gráfico
//       const chart = svg.append('g')
//         .attr('width', width)
//         .attr('height', height);

//       // Crear las barras del gráfico
//       chart.selectAll('rect')
//         .data(data)
//         .enter().append('rect')
//         .attr('x', d => xScale(d.nombre))
//         .attr('y', d => yScale(d.numero_clientes))
//         .attr('width', xScale.bandwidth())
//         .attr('height', d => height - yScale(d.numero_clientes))
//         .attr('fill', 'rgba(54, 162, 235, 0.2)');

//       // Agregar ejes X e Y
//       chart.append('g')
//         .attr('transform', `translate(0, ${height})`)
//         .call(d3.axisBottom(xScale));

//       chart.append('g')
//         .call(d3.axisLeft(yScale));

//     })
//     .catch(error => console.error('Error al obtener datos de campañas:', error));
// }

// document.getElementById("ver-detalles-btn").addEventListener("click", function () {
//   var myModal = new bootstrap.Modal(document.getElementById('graficaModal'));
//   myModal.show();
//   mostrarGraficaCampañas();
// });

// const cerrarModalBtn = document.getElementById('cerrar-modal-btn');
// cerrarModalBtn.addEventListener('click', () => {
//   console.log('Botón de cerrar modal clickeado');
//   const modalInstance = new bootstrap.Modal(document.getElementById('graficaModal'));
//   modalInstance.hide();
// });




function mostrarGraficaCampañas() {
  const data = [10, 20, 30, 40];

  const pie = d3.pie();
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(100);

  const svg = d3.select("#graficaCampañas")
      .append('svg')
      .attr('width', 200)
      .attr('height', 200)
      .append('g')
      .attr('transform', 'translate(100, 100)');

  svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => d3.schemeCategory10[i]);
}

// Función para mostrar la gráfica de clientes
function mostrarGraficaCampañas() {
  const data = [30, 20, 50];
  mostrarGrafica('graficaCampañas', data, ['Lila', 'Morado', 'Celeste'], ['#8a2be2', '#800080', '#87ceeb']);
}

function mostrarGraficaClientes() {
  const data = [45, 35, 20];
  mostrarGrafica('graficaClientes', data, ['Lila', 'Morado', 'Celeste'], ['#8a2be2', '#800080', '#87ceeb']);
}

function mostrarGrafica(id, data, labels, colors) {
  const pie = d3.pie();
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(150);

  const svg = d3.select(`#${id}`)
      .append('svg')
      .attr('width', 300)
      .attr('height', 300)
      .append('g')
      .attr('transform', 'translate(150, 150)');

  svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => colors[i])
      .attr('transform', 'rotate(-180)')
      .transition().duration(1000)
      .attr('transform', 'rotate(0)');
}

document.getElementById("ver-detalles-btn").addEventListener("click", function () {
  var myModal = new bootstrap.Modal(document.getElementById('graficaModal'));
  myModal.show();
  mostrarGraficaCampañas();
  mostrarGraficaClientes();
});

const cerrarModalBtn = document.getElementById('cerrar-modal-btn');
cerrarModalBtn.addEventListener('click', () => {
  console.log('Botón de cerrar modal clickeado');
  const modalInstance = new bootstrap.Modal(document.getElementById('graficaModal'));
  modalInstance.hide();
});



const getMenuAccesible = () => {
  let menu;
  let pagina;
  let token = localStorage.getItem("token");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { "Authorization": token }
  };

  fetch(`${url}permisosUsuario/${usuario.username}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        menu = `
                    <li class=" navigation-header" id="administracion-li"><span data-i18n="Apps &amp; Pages">${element.descripcion}</span><i
                    data-feather="more-horizontal"></i>
                    </li>
                `;

        $("#main-menu-navigation").append(menu);

        element.paginas.forEach((element) => {
          var URLactual = window.location.href;
          var url = URLactual.split("/");
          var add = url[url.length - 1] === element.path ? "active" : "";
          pagina = `
                        <li class="nav-item pl-1 ${add}">
                            <a class="d-flex align-items-center" href="${element.path}">
                            <i class="feather-20" data-feather="${element.icono}"></i><span class="menu-title text-truncate"
                                data-i18n="${element.descripcion}">${element.descripcion}</span></a>
                        </li>
                    `;

          $("#main-menu-navigation").append(pagina);
        });

        if (feather) {
          feather.replace();
        }
      });
    })
    .catch((error) => console.log("error", error));
};
