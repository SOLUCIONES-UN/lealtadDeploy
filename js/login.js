const url = 'http://localhost:3000/';
let dataUsuario;
let pagina;

$(function () {

    $('#formLogin').on('submit',function(){

        let username = $('#login-username').val();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": $('#login-username').val(),
            "password" : $('#login-password').val()
        });

        console.log(raw);

        var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
        };

        fetch(`${url}loggin`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.code == "ok"){
                Alert(result.message, 'success');

                getMenuAccesible(username)

                setTimeout(function(){
                    $(location).attr('href', pagina);
                    sessionStorage.setItem('infoUsuario', JSON.stringify(result.info))
                }, 1500)

                

            } else{
               Alert(result.message, 'error');
            }
        })
        .catch(error => {Alert(error, 'error')
        });
    return false;
    })

    const Alert = function(message, status){
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
          });
    }
})

const getMenuAccesible = (username) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}permisosUsuario/${username}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        pagina = result[0].paginas[0].path
    })
    .catch(error => console.log('error', error));
}