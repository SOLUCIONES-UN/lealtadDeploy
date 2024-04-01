const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {


  $("#ConsultarPromo").on("click", function () {
    if (
      $("#selectpromo").val() !== 0 &&
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      GetReport();
    } else {
      Alert("Debe de llenar todos los campos", "error");
    }
  });
});








// const GetNumeroById = (telno) => {
//   // Definimos los datos de la solicitud
//   var requestOptions = {
//       method: "GET",
//       headers: {
//           "Authorization": token
//       }
//   };

//   // Hacemos la solicitud al backend
//   fetch(`${url}ConsultaNumber/${telno}`, requestOptions)
//       .then((response) => {
//           if (!response.ok) {
//               throw new Error('Error al obtener el numero.');
//           }
//           return response.json();
//       })
//       .then((numero) => {
//           // Agregar la campaña obtenida a la tabla
//           const row = `
//               <tr>
//                   <td>${numero.id}</td>
//                   <td>${numero.campaign.nombre}</td>
//               </tr>`;
//           $("#TablaReportePromo").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
//       })
//       .catch((error) => {
//           console.error('Error en la solicitud:', error);
//           // Manejar el error si ocurre
//           Alert('Ha ocurrido un error al obtener el número.', 'error');
//       });
// };

// const Alert = function (
// message,
// status // si se proceso correctamente la solicitud
// ) {
// toastr[`${status}`](message, `${status}`, {
//   closeButton: true,
//   tapToDismiss: false,
//   positionClass: "toast-top-right",
//   rtl: false,
// });
// };


// $("#ConsultaNUmber").click(function() {
//   const telno = $("#numero").val().trim();
//   if (telno !== '') {
//       GetNumeroById(telno);
//   } else {
//       console.error('Por favor, ingrese un número de teléfono válido.');
     
//   }
// });













const GetNumeroById = (telefono) => {
    // Definimos los datos de la solicitud
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    // Hacemos la solicitud al backend
    fetch(`${url}ConsultaNumber/${telefono}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener el numero.');
            }
            return response.json();
        })
        .then((numero) => {
            // Agregar la campaña obtenida a la tabla
            const row = `
                <tr>
                    <td>${numero.id}</td>
                    <td>${numero.campaign.nombre}</td>
                </tr>`;
            $("#TablaReportePromo").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
        })
        .catch((error) => {
            console.error('Error en la solicitud:', error);
            // Manejar el error si ocurre
            Alert('Ha ocurrido un error al obtener el número.', 'error');
        });
};

const Alert = function (
  message,
  status // si se proceso correctamente la solicitud
) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};


$("#ConsultaNUmber").click(function() {
    const telefono = $("#numero").val().trim();
    if (telefono !== '') {
        GetNumeroById(telefono);
    } else {
        console.error('Por favor, ingrese un número de teléfono válido.');
       
    }
});













// const generaCampanasUsuarios = (referens) => {
//   // Definimos los datos de la solicitud
//   var requestOptions = {
//       method: "GET",
//       headers: {
//           "Authorization": token
//       }
//   };

//   // Hacemos la solicitud al backend
//   fetch(`${url}ConsultaNumber/${referens}`, requestOptions)
//       .then((response) => {
//           if (!response.ok) {
//               throw new Error('Error al obtener el numero.');
//           }
//           return response.json();
//       })
//       .then((numero) => {
//           // Agregar la campaña obtenida a la tabla
//           const row = `
//               <tr>
//                   <td>${numero.id}</td>
//                   <td>${numero.campaign.nombre}</td>
//               </tr>`;
//           $("#TablaReportePromo").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
//       })
//       .catch((error) => {
//           console.error('Error en la solicitud:', error);
//           // Manejar el error si ocurre
//           Alert('Ha ocurrido un error al obtener el número.', 'error');
//       });
// };

// const Alert = function (
// message,
// status // si se proceso correctamente la solicitud
// ) {
// toastr[`${status}`](message, `${status}`, {
//   closeButton: true,
//   tapToDismiss: false,
//   positionClass: "toast-top-right",
//   rtl: false,
// });
// };


$("#ConsultaNUmber").click(function() {
  const referens = $("#numero").val().trim();
  if (referens !== '') {
    generaCampanasUsuarios(referens);
  } else {
      console.error('Por favor, ingrese un número de teléfono válido.');
     
  }
});