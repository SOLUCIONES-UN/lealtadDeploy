let usuario = JSON.parse(sessionStorage.getItem("infoUsuario"));
$(function () {
  getMenuAccesible();
});


const getMenuAccesible = () => {
  let menu;
  let pagina;
  let token = sessionStorage.getItem("token");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {"Authorization": token}
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
          // console.log(element)
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
