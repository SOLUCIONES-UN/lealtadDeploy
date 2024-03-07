let usuario = JSON.parse(localStorage.getItem("infoUsuario"));

$(function () {
  getMenuAccesible();
  verifyToken();
  validateSesion();
});

// document.addEventListener('DOMContentLoaded', () => {
//   validateSesion();
// });

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


const verifyLogin = () => {

  var token = localStorage.getItem('token');

  if (token == null) {
    window.location.href = 'login.html';
  } 
  else{

    const partes = token.split('.');

    // Decodificar el payload (parte intermedia en base64)
    const payloadBase64 = partes[1];
    const payload = JSON.parse(atob(payloadBase64));

    // La fecha de expiración está en el campo "exp"
    if (payload.exp) {
      const expiracion = new Date(payload.exp * 1000); // El tiempo está en segundos, convertir a milisegundos
      const currentTime = new Date();

      let tiempoRestante = ((expiracion - currentTime) / 1000) / 60;

      if (tiempoRestante <= 1) {

        AlertSession('Session Caducada', 'error');

        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = 'login.html';
        }, 1000 * 3);
      }else{
        return;
      }
    } else {
      throw new Error('El token no tiene una fecha de expiración');
    }
  }

}




const validateSesion = () => {

  setInterval(() => {
      verifyLogin();
  }, 1000 * 10); 

}

const AlertSession = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
      closeButton: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right',
      rtl: false
  });
}





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
