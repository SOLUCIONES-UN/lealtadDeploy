const url = 'http://localhost:3000/'

$(function () {
    getRols()
    getMenus()
    getPaginas()

})


const getRols = () =>{

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Rol`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#Rols').append(opc);
      });
    })
    .catch(error => console.log('error', error));

}

const getMenus = () =>{

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Menu`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#menu').append(opc);
      });
    })
    .catch(error => console.log('error', error));

}

$('#menu').on('change', function(){

    $('#contenedor-izquierdo').html(null)
    const idMenu = $('#menu option:selected').val();
    console.log(idMenu)

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Menu/${idMenu}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
      result.paginas.forEach(element => {
        var opc = `<div class="form-check form-switch pl-5 pt-3">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label label-success" for="flexSwitchCheckDefault" style="font-size: 1rem;">${element.descripcion}</label>
            </div>`;
        $('#contenedor-izquierdo').append(opc);
      });
    })
    .catch(error => console.log('error', error));
})

const getPaginas = () => {

    

    /*var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Pagina`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#menu').append(opc);
      });
    })
    .catch(error => console.log('error', error));*/
}