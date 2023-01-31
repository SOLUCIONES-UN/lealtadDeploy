
$(function (){
    chechFacebook();

    $('#swFacebook').change(function () {
        chechFacebook()
    })
    $('#swInstagram').change(function () {
        chechInstagram()
    })
    $('#swWhatsapp').change(function () {
        chechInstagram()
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
