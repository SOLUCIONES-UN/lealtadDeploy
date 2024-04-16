//verify if the user is logged in and has a valid token
const verifyLogin = () => {

    var token = localStorage.getItem('token');

    if (token == null) {
        window.location.href = 'login.html';
    }else{

        const partes = token.split('.');

        // Decodificar el payload (parte intermedia en base64)
        const payloadBase64 = partes[1];
        const payload = JSON.parse(atob(payloadBase64));

        // La fecha de expiración está en el campo "exp"
        if (payload.exp) {
            const expiracion = new Date(payload.exp * 1000); // El tiempo está en segundos, convertir a milisegundos
            const currentTime = new Date(); //obtenemos la fecha y hora actual

            let tiempoRestante = ((expiracion - currentTime) / 1000) / 60; //obtenemos la diferencia en minutos entre la fecha de expiración y la fecha actual

            if (tiempoRestante <= 0) { //si el tiempo restante es menor o igual a 0 (token expiro), la sesión ha caducado

                Alert('Session Caducada', 'error');

                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }, 1000 * 5);
            }else{
                console.log('El token es válido');
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

const Alert = function (message, status) {
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false
    });
}