$(function () {
  $("#container1").hide();
});

$("#btnConsultar").click(function () {
 
  let phone= $("#phone").val();
  if(phone !== ""){


  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    phone:phone,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}codigoReferidos/getCodigoReferidoByPhone`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let { id, codigo} = result[0];

      $("#id").val(id);
      $("#codigo").val(codigo);
      
      $("#container1").show("fast");
    })
    .catch((error) => {
      Alert(error, "error");
    });

  return false;
  }else{
    
    Alert("Telefono es requerido", "error");
  }
});

$("#btnCancelar").click(function () {
  $("#container1").hide("fast");
});

$("#formNew").submit(function () {

  const id = $("#id").val();
  const codigo = $("#codigo").val();

  $("#btnSubmit").attr("disabled", true);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    codigo: codigo,
    id: id,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}codigoReferidos/actualizarCodigoReferido`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#container1").hide("fast");
        Alert(result.message, "success");
      } else {
        Alert(result.errors, "error");
      }

      $("#btnSubmit").attr("disabled", false);
    })
    .catch((error) => {
      Alert(error.errors, "error");
      $("#btnSubmit").attr("disabled", false);
    });

  return false;
});
