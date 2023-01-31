
$(function (){
    chechFacebook();
    chechInstagram();
    chechWhatsApp();
    chechMensajes();
    chechPantalla();

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
        alert($(textFacebook).val())
    })
    $('#btnInstagram').click(function () {
        alert($(textInstagram).val())
    })
    $('#btnWhatsapp').click(function () {
        alert($(textWhatsapp).val())
    })
    $('#btnMensaje').click(function () {
        alert($(textMensaje).val())
    })
    $('#btnPantalla').click(function () {
        alert($(textPantalla).val())
    })


});

const chechFacebook = () => {
    if($('#swFacebook').prop('checked') ) {
        $('#textFacebook').prop('disabled',false);
        $('#btnFacebook').prop('disabled',false);
        $('#btnFacebook').removeClass('btn-secondary')
        $('#btnFacebook').addClass('btn-info')
        $('#pnFacebook').removeClass('bg-secondary')
        $('#pnFacebook').addClass('bg-info')
    }else{
        $('#textFacebook').prop('disabled',true);
        $('#btnFacebook').prop('disabled', true);
        $('#btnFacebook').removeClass('btn-info')
        $('#btnFacebook').addClass('btn-secondary')
        $('#pnFacebook').removeClass('bg-info')
        $('#pnFacebook').addClass('bg-secondary')
        
    }
}

const chechInstagram = () => {
    if($('#swInstagram').prop('checked') ) {
        $('#textInstagram').prop('disabled',false);
        $('#btnInstagram').prop('disabled',false);
        $('#btnInstagram').removeClass('btn-secondary')
        $('#btnInstagram').addClass('btn-danger')
        $('#pnInstagram').removeClass('bg-secondary')
        $('#pnInstagram').addClass('bg-danger')
    }else{
        $('#textInstagram').prop('disabled',true);
        $('#btnInstagram').prop('disabled', true);
        $('#btnInstagram').removeClass('btn-danger')
        $('#btnInstagram').addClass('btn-secondary')
        $('#pnInstagram').removeClass('bg-danger')
        $('#pnInstagram').addClass('bg-secondary')
    }
}

const chechWhatsApp = () => {
    if($('#swWhatsapp').prop('checked') ) {
        $('#textWhatsapp').prop('disabled',false);
        $('#btnWhatsapp').prop('disabled',false);
        $('#btnWhatsapp').removeClass('btn-secondary')
        $('#btnWhatsapp').addClass('btn-success')
        $('#pnWhatsapp').removeClass('bg-secondary')
        $('#pnWhatsapp').addClass('bg-success')
    }else{
        $('#textWhatsapp').prop('disabled',true);
        $('#btnWhatsapp').prop('disabled', true);
        $('#btnWhatsapp').removeClass('btn-success')
        $('#btnWhatsapp').addClass('btn-secondary')
        $('#pnWhatsapp').removeClass('bg-success')
        $('#pnWhatsapp').addClass('bg-secondary')
    }
}

const chechMensajes = () => {
    if($('#swMensaje').prop('checked') ) {
        $('#textMensaje').prop('disabled',false);
        $('#btnMensaje').prop('disabled',false);
        $('#btnMensaje').removeClass('btn-secondary')
        $('#btnMensaje').addClass('btn-primary')
        $('#pnMensaje').removeClass('bg-secondary')
        $('#pnMensaje').addClass('bg-primary')
    }else{
        $('#textMensaje').prop('disabled',true);
        $('#btnMensaje').prop('disabled', true);
        $('#btnMensaje').removeClass('btn-primary')
        $('#btnMensaje').addClass('btn-secondary')
        $('#pnMensaje').removeClass('bg-primary')
        $('#pnMensaje').addClass('bg-secondary')   
    }
}

const chechPantalla = () => {
    if($('#swPantalla').prop('checked') ) {
        $('#textPantalla').prop('disabled',false);
        $('#btnPantalla').prop('disabled',false);
        $('#btnPantalla').removeClass('btn-secondary')
        $('#btnPantalla').addClass('btn-warning')
        $('#pnPantalla').removeClass('bg-secondary')
        $('#pnPantalla').addClass('bg-warning')
    }else{
        $('#textPantalla').prop('disabled',true);
        $('#btnPantalla').prop('disabled', true);
        $('#btnPantalla').removeClass('btn-warning')
        $('#btnPantalla').addClass('btn-secondary')
        $('#pnPantalla').removeClass('bg-warning')
        $('#pnPantalla').addClass('bg-secondary')   
    }
}



const clickBtnFacbook = () => {
    if($('#textFacebook').val('checked') ) {}
}