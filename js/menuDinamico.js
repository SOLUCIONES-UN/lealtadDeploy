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

function mostrarGraficaCampañas() {
  // Obtener el canvas
  const canvas = document.getElementById('graficaCampañas');


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
    .then(response => response.json())
    .then(data => {

      const labels = data.map(campaña => campaña.nombre);
      const numClientes = data.map(campaña => campaña.numero_clientes);


      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Número de clientes',
          data: numClientes,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };


      const chartOptions = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };


      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
    })
    .catch(error => console.error('Error al obtener datos de campañas:', error));
}


document.getElementById("ver-detalles-btn").addEventListener("click", function () {

  var myModal = new bootstrap.Modal(document.getElementById('graficaModal'));
  myModal.show();


  mostrarGraficaCampañas();
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
