const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};


$(function () {
  obtenerData();
  
  Usuario();

  
});



  $("#swFacebook").change(function () {
    chechFacebook();
  });
  $("#swInstagram").change(function () {
    chechInstagram();
  });
  $("#swWhatsapp").change(function () {
    chechWhatsApp();
  });
  $("#swMensaje").change(function () {
    chechMensajes();
  });
  $("#swPantalla").change(function () {
    chechPantalla();
  });

  //guardar texto
  $("#btnFacebook").click(function () {
    updateConfigReferidos(1, $(textFacebook).val());
  });
  $("#btnInstagram").click(function () {
    updateConfigReferidos(2, $(textInstagram).val());
  });
  $("#btnWhatsapp").click(function () {
    updateConfigReferidos(3, $(textWhatsapp).val());
  });
  $("#btnMensaje").click(function () {
    updateConfigReferidos(4, $(textMensaje).val());
  });
  $("#btnPantalla").click(function () {
    updateConfigReferidos(5, $(textPantalla).val());
  });


const Usuario = () => {
  let usuario = JSON.parse(localStorage.getItem("infoUsuario"));
  console.log(usuario.nombre);
  $(".user-name").text(usuario.nombre);
  $(".user-status").text(usuario.rol.descripcion);
};

const chechFacebook = () => {
  if ($("#swFacebook").prop("checked")) {
    $("#facebookxxx").prop("disabled", false);
    $("#btnFacebook").prop("disabled", false);
    $("#btnFacebook").removeClass("btn-secondary");
    $("#btnFacebook").addClass("btn-info");
    $("#pnFacebook").removeClass("bg-secondary");
    $("#pnFacebook").addClass("bg-info");
  } else {
    $("#facebookxxx").prop("disabled", true);
    $("#btnFacebook").prop("disabled", true);
    $("#btnFacebook").removeClass("btn-info");
    $("#btnFacebook").addClass("btn-secondary");
    $("#pnFacebook").removeClass("bg-info");
    $("#pnFacebook").addClass("bg-secondary");
  }
};

const chechInstagram = () => {
  if ($("#swInstagram").prop("checked")) {
    $("#instagramxxx").prop("disabled", false);
    $("#btnInstagram").prop("disabled", false);
    $("#btnInstagram").removeClass("btn-secondary");
    $("#btnInstagram").addClass("btn-danger");
    $("#pnInstagram").removeClass("bg-secondary");
    $("#pnInstagram").addClass("bg-danger");
  } else {
    $("#instagramxxx").prop("disabled", true);
    $("#btnInstagram").prop("disabled", true);
    $("#btnInstagram").removeClass("btn-danger");
    $("#btnInstagram").addClass("btn-secondary");
    $("#pnInstagram").removeClass("bg-danger");
    $("#pnInstagram").addClass("bg-secondary");
  }
};

const chechWhatsApp = () => {
  if ($("#swWhatsapp").prop("checked")) {
    $("#textWhatsapp").prop("disabled", false);
    $("#btnWhatsapp").prop("disabled", false);
    $("#btnWhatsapp").removeClass("btn-secondary");
    $("#btnWhatsapp").addClass("btn-success");
    $("#pnWhatsapp").removeClass("bg-secondary");
    $("#pnWhatsapp").addClass("bg-success");
  } else {
    $("#textWhatsapp").prop("disabled", true);
    $("#btnWhatsapp").prop("disabled", true);
    $("#btnWhatsapp").removeClass("btn-success");
    $("#btnWhatsapp").addClass("btn-secondary");
    $("#pnWhatsapp").removeClass("bg-success");
    $("#pnWhatsapp").addClass("bg-secondary");
  }
};

const chechMensajes = () => {
  if ($("#swMensaje").prop("checked")) {
    $("#textMensaje").prop("disabled", false);
    $("#btnMensaje").prop("disabled", false);
    $("#btnMensaje").removeClass("btn-secondary");
    $("#btnMensaje").addClass("btn-primary");
    $("#pnMensaje").removeClass("bg-secondary");
    $("#pnMensaje").addClass("bg-primary");
  } else {
    $("#textMensaje").prop("disabled", true);
    $("#btnMensaje").prop("disabled", true);
    $("#btnMensaje").removeClass("btn-primary");
    $("#btnMensaje").addClass("btn-secondary");
    $("#pnMensaje").removeClass("bg-primary");
    $("#pnMensaje").addClass("bg-secondary");
  }
};

const chechPantalla = () => {
  if ($("#swPantalla").prop("checked")) {
    $("#textPantalla").prop("disabled", false);
    $("#btnPantalla").prop("disabled", false);
    $("#btnPantalla").removeClass("btn-secondary");
    $("#btnPantalla").addClass("btn-warning");
    $("#pnPantalla").removeClass("bg-secondary");
    $("#pnPantalla").addClass("bg-warning");
  } else {
    $("#textPantalla").prop("disabled", true);
    $("#btnPantalla").prop("disabled", true);
    $("#btnPantalla").removeClass("btn-warning");
    $("#btnPantalla").addClass("btn-secondary");
    $("#pnPantalla").removeClass("bg-warning");
    $("#pnPantalla").addClass("bg-secondary");
  }
};



const obtenerData = () => {

  var requestOptions = { 
    method: "GET",
    headers: {
      'Authorization': token,
    },
    redirect: "follow",
  };

  fetch(`${url}ConfigReferidos`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        switch (element.id) {
          case 1:
            $("#textFacebook").val(element.descripcion);
            $("#swFacebook").prop(
              "checked",
              element.estado == 0 ? false : true,
            
            );
            break;
          case 2:      
          $("#textInstagram").val(element.descripcion);
            $("#swInstagram").prop(
              "checked",
              element.estado == 0 ? false : true
            );
            break;
          case 3:
            $("#textWhatsapp").val(element.descripcion);
            $("#swWhatsapp").prop(
              "checked",
              element.estado == 0 ? false : true
            );
            break;
          case 4:
            $("#textMensaje").val(element.descripcion);
            $("#swMensaje").prop("checked", element.estado == 0 ? false : true);
            break;
          case 5:
            $("#textPantalla").val(element.descripcion);
            $("#swPantalla").prop(
              "checked",
              element.estado == 0 ? false : true
            );
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
    .catch((error) => console.log("error", error))

  };
  const updateConfigReferidos = (id, descripcion, estado,duracion) => {
    const boton = $("#tuBotonId");
    
    // Si el botón está deshabilitado, significa que la solicitud está en progreso
    if (boton.prop("disabled")) {
      return;
    }
  
    boton.prop("disabled", true); // Deshabilitar el botón para evitar clics múltiples
  
    console.log("Valid",id);
    $("#tuBotonId").prop("disabled", true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    
      redirect: "follow",
    };
  
    fetch( `${url}ConfigReferidos/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (!result) {
        console.log("Resultado",result);
        CreateConfigReferidos(descripcion,id,duracion);
        obtenerData();
  
      } else {
        console.log("",result);
        CreateConfigReferidos(id, descripcion, duracion, result.estado);  // Utiliza result.message en lugar de error
      }
    })
    .catch((error) => console.log("error", error))
    .finally(()=> {
      $("#tuBotonId").prop("disabled", false);
    });
  /*const id = $('#id').val();*/

      var raw = JSON.stringify({
      descripcion: descripcion,
      estado : estado, 
      duracion: duracion,
    });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
      body: raw,
        redirect: "follow",
      };
      fetch( `${url}ConfigReferidos/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        if (result.code === "ok") {
       Alert(result.message, "success");
    } else {
       console.log("error", result);  // Utiliza result.message en lugar de error
    }
  })
  boton.prop("disabled", false); 
}
 
 function Alert(message,
  status // si se proceso correctamente la solicitud
) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });



}

    const CreateConfigReferidos=(descripcion, estado, duracion)=>{

      const myHeaders = new Headers();
       myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
       
       var raw = JSON.stringify({
        descripcion: descripcion,
        estado : estado,
        duracion: duracion 
      
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
       };
          
      fetch( `${url}ConfigReferidos`, requestOptions)
      .then((response) => response.json())
       .then((result) => {
         if (result.code === "ok") {
          Alert(result.message, "Exitoso");
        } else {
           console.log("error", result);  // Utiliza result.message en lugar de error
         }
       })
      .catch((error) => console.log("error", error));
    
    }
    const DeleteConfigReferidos=(estado)=>{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
       myHeaders.append("Authorization", token);
       
      var raw = JSON.stringify({
        estado: estado,
      });

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
          
      fetch( `${url}ConfigReferido`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code === "ok") {
          Alert(result.message, "Exitoso");
        } else {
          console.log("error", result);  // Utiliza result.message en lugar de error
        }
      })
      .catch((error) => console.log("error", error));

    }
    $(document).ready(function() {
      // Evento de clic en la tarjeta de Facebook
      $("#pnFacebook").click(function() {
          // Cambiar el estado del switch al contrario del estado actual
          $("#swFacebook").prop("checked", !$("#swFacebook").prop("checked"));
          // Llamar a la función para ajustar el estado visual
          chechFacebook();
      });
  });
  $(document).ready(function() {
    // Evento de clic en la tarjeta de Facebook
    $("#textFacebook").click(function() {
        // Cambiar el estado del switch al contrario del estado actual
        $("#swFacebook").prop("checked", !$("#swFacebook").prop("checked"));
        // Llamar a la función para ajustar el estado visual
        chechFacebook();
    });
});

$(document).ready(function() {
  // Evento de clic en la tarjeta de Facebook
  $("#textInstagram").click(function() {
      // Cambiar el estado del switch al contrario del estado actual
      $("#swInstagram").prop("checked", !$("#swInstagram").prop("checked"));
      // Llamar a la función para ajustar el estado visual
      chechInstagram();
  });
});



