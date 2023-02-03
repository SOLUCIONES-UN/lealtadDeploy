let username = 'JEstivenA';

$(function(){
    getMenuAccesible();
})

const getMenuAccesible = () => {
    let menu;
    let pagina;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}permisosUsuario/${username}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        console.log(element);

        switch(element.descripcion.toLowerCase()){

            case 'administracion':
                menu = `
                    <li class=" navigation-header" id="administracion-li"><span data-i18n="Apps &amp; Pages">${element.descripcion}</span><i
                        data-feather="more-horizontal"></i>
                    </li>
                `

                $('#administracion').append(menu);

                element.paginas.forEach(element => {
                    console.log(element)
                    
                    pagina = `
                        <li class="nav-item">
                            <a class="d-flex align-items-center" href="${element.path}">
                            <i class="feather-20" data-feather="award"></i><span class="menu-title text-truncate"
                                data-i18n="${element.descripcion}">${element.descripcion}</span></a>
                        </li>
                    `

                    $('#administracion-li').after(pagina);
                })
            break;

            case 'seguridad':
                menu = `
                    <li class=" navigation-header" id="seguridad-li"><span data-i18n="Apps &amp; Pages">${element.descripcion}</span><i
                        data-feather="more-horizontal"></i>
                    </li>
                `

                $('#seguridad').append(menu);

                element.paginas.forEach(element => {
                    console.log(element)
                    
                    pagina = `
                        <li class="nav-item">
                            <a class="d-flex align-items-center" href="${element.path}">
                            <i class="feather-20" data-feather="award"></i><span class="menu-title text-truncate"
                                data-i18n="${element.descripcion}">${element.descripcion}</span></a>
                        </li>
                    `

                    $('#seguridad-li').after(pagina);
                })
            break;

            case 'configuracion':
                menu = `
                    <li class=" navigation-header" id="configuracion-li"><span data-i18n="Apps &amp; Pages">${element.descripcion}</span><i
                        data-feather="more-horizontal"></i>
                    </li>
                `

                $('#configuracion').append(menu);

                element.paginas.forEach(element => {
                    console.log(element)
                    
                    pagina = `
                        <li class="nav-item">
                            <a class="d-flex align-items-center" href="${element.path}">
                            <i class="feather-20" data-feather="award"></i><span class="menu-title text-truncate"
                                data-i18n="${element.descripcion}">${element.descripcion}</span></a>
                        </li>
                    `

                    $('#configuracion-li').after(pagina);
                })
            break;
        }

        
        
        if (feather) {
            feather.replace();
        }
        

      });
    })
    .catch(error => console.log('error', error));
}