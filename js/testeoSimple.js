const url = 'http://localhost:3000/'

$(function () {
    getCampaniasActivas();
});





const getCampaniasActivas = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`${url}Campania`, requestOptions)
        .then(response => response.json())
        .then(result => {
            $('#campania').html('<option value="0">Seleccione Una Opcion</option>');

            result.forEach(element => {
                $('#campania').append('<option value="'+ element.id +'">'+ element.nombre  +'</option>');
            });
        })
        .catch(error => console.log('error', error));
}