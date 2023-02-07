
$(function () {
    obtenerData();

    $('#swFacebook').change(function () {
        chechFacebook()
    })
    $('#swInstagram').change(function () {
        chechInstagram()
    })
    $('#swWhatsapp').change(function () {
        chechWhatsApp()
    })
    $('#swMensaje').change(function () {
        chechMensajes()
    })
    $('#swPantalla').change(function () {
        chechPantalla()
    })

    //guardar texto
    $('#btnFacebook').click(function () {
        updateReferido(1,$(textFacebook).val())
    })
    $('#btnInstagram').click(function () {
        updateReferido(2,$(textInstagram).val())
    })
    $('#btnWhatsapp').click(function () {
        updateReferido(3,$(textWhatsapp).val())
    })
    $('#btnMensaje').click(function () {
        updateReferido(4,$(textMensaje).val())
    })
    $('#btnPantalla').click(function () {
        updateReferido(5,$(textPantalla).val())
    })
});

const chechFacebook = () => {
    if ($('#swFacebook').prop('checked')) {
        $('#textFacebook').prop('disabled', false);
        $('#btnFacebook').prop('disabled', false);
        $('#btnFacebook').removeClass('btn-secondary')
        $('#btnFacebook').addClass('btn-info')
        $('#pnFacebook').removeClass('bg-secondary')
        $('#pnFacebook').addClass('bg-info')
    } else {
        $('#textFacebook').prop('disabled', true);
        $('#btnFacebook').prop('disabled', true);
        $('#btnFacebook').removeClass('btn-info')
        $('#btnFacebook').addClass('btn-secondary')
        $('#pnFacebook').removeClass('bg-info')
        $('#pnFacebook').addClass('bg-secondary')
    }
}

const chechInstagram = () => {
    if ($('#swInstagram').prop('checked')) {
        $('#textInstagram').prop('disabled', false);
        $('#btnInstagram').prop('disabled', false);
        $('#btnInstagram').removeClass('btn-secondary')
        $('#btnInstagram').addClass('btn-danger')
        $('#pnInstagram').removeClass('bg-secondary')
        $('#pnInstagram').addClass('bg-danger')
    } else {
        $('#textInstagram').prop('disabled', true);
        $('#btnInstagram').prop('disabled', true);
        $('#btnInstagram').removeClass('btn-danger')
        $('#btnInstagram').addClass('btn-secondary')
        $('#pnInstagram').removeClass('bg-danger')
        $('#pnInstagram').addClass('bg-secondary')
    }
}

const chechWhatsApp = () => {
    if ($('#swWhatsapp').prop('checked')) {
        $('#textWhatsapp').prop('disabled', false);
        $('#btnWhatsapp').prop('disabled', false);
        $('#btnWhatsapp').removeClass('btn-secondary')
        $('#btnWhatsapp').addClass('btn-success')
        $('#pnWhatsapp').removeClass('bg-secondary')
        $('#pnWhatsapp').addClass('bg-success')
    } else {
        $('#textWhatsapp').prop('disabled', true);
        $('#btnWhatsapp').prop('disabled', true);
        $('#btnWhatsapp').removeClass('btn-success')
        $('#btnWhatsapp').addClass('btn-secondary')
        $('#pnWhatsapp').removeClass('bg-success')
        $('#pnWhatsapp').addClass('bg-secondary')
    }
}

const chechMensajes = () => {
    if ($('#swMensaje').prop('checked')) {
        $('#textMensaje').prop('disabled', false);
        $('#btnMensaje').prop('disabled', false);
        $('#btnMensaje').removeClass('btn-secondary')
        $('#btnMensaje').addClass('btn-primary')
        $('#pnMensaje').removeClass('bg-secondary')
        $('#pnMensaje').addClass('bg-primary')
    } else {
        $('#textMensaje').prop('disabled', true);
        $('#btnMensaje').prop('disabled', true);
        $('#btnMensaje').removeClass('btn-primary')
        $('#btnMensaje').addClass('btn-secondary')
        $('#pnMensaje').removeClass('bg-primary')
        $('#pnMensaje').addClass('bg-secondary')
    }
}

const chechPantalla = () => {
    if ($('#swPantalla').prop('checked')) {
        $('#textPantalla').prop('disabled', false);
        $('#btnPantalla').prop('disabled', false);
        $('#btnPantalla').removeClass('btn-secondary')
        $('#btnPantalla').addClass('btn-warning')
        $('#pnPantalla').removeClass('bg-secondary')
        $('#pnPantalla').addClass('bg-warning')
    } else {
        $('#textPantalla').prop('disabled', true);
        $('#btnPantalla').prop('disabled', true);
        $('#btnPantalla').removeClass('btn-warning')
        $('#btnPantalla').addClass('btn-secondary')
        $('#pnPantalla').removeClass('bg-warning')
        $('#pnPantalla').addClass('bg-secondary')
    }
}

const obtenerData = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/ConfigReferidos", requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                switch (element.id) {
                    case 1:
                        $('#textFacebook').val(element.descripcion)
                        $('#swFacebook').prop("checked", element.estado == 0 ? false : true);

                        break;
                    case 2:
                        $('#textInstagram').val(element.descripcion)
                        $('#swInstagram').prop("checked", element.estado == 0 ? false : true);
                        break;
                    case 3:
                        $('#textWhatsapp').val(element.descripcion)
                        $('#swWhatsapp').prop("checked", element.estado == 0 ? false : true);
                        break;
                    case 4:
                        $('#textMensaje').val(element.descripcion)
                        $('#swMensaje').prop("checked", element.estado == 0 ? false : true);
                        break;
                    case 5:
                        $('#textPantalla').val(element.descripcion)
                        $('#swPantalla').prop("checked", element.estado == 0 ? false : true);
                        break;
                    default:
                        break;
                }
                chechFacebook();
                chechInstagram();
                chechWhatsApp();
                chechMensajes();
                chechPantalla();
            });
        })
        .catch(error => console.log('error', error));
}


const updateReferido = (id,descripcion) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "descripcion": descripcion
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    fetch("http://localhost:3000/ConfigReferidos/"+id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                Alert(result.message, 'success')
            } else{
                console.log('error', error)
            }
        })
        .catch(error => console.log('error', error))
}

const Alert = function (message, status) // si se proceso correctamente la solicitud
{
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false
    });
}
