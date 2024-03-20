const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  getPromociones();

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

//Obtener las promociones para mostrar
$('#ExportarInfo').click(function () {
		$('#ConsultarPromo').hide();
		$("#ExportarInfo").attr("disabled", true);
    	$("#ExportarInfo").text("Generando...");
		//$('#btnPantallaInfo').hide();
		const wb = XLSX.utils.book_new();
		let row1 = [
			{ v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
			{ v: 'REPORTE DE PARTICIPACIONES - PROMOCIONES', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'left' } } },
		];
		let row2 = [
			{ v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
			{ v: 'Participantes', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'left' } } },
		];
		let row3 = [''];
		let row4 = [
			'',
			{ v: 'FECHA ACREDITACION', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'TELEFONO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'NOMBRE', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'MONTO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'TRANSACCION', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'CODIGO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'MONTO TRANSACCION', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
			{ v: 'FECHA PARTICIPACIÓN', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
		];
		let infoFinal = [row1, row2, row3, row4];
		var contador = 1;
		// var longitud1 = 0;
		// var longitud2 = 0;
		// var longitud3 = 0;
		// var longitud4 = 0;
		// var longitud5 = 0;
		infoExportar.forEach(function (informacion) {
			// if (longitud1 < String(contador).length)
			// 	longitud1 = String(contador).length;

			// if (longitud2 < String(informacion.promocion).length)
			// 	longitud2 = String(informacion.promocion).length;

			// if (longitud3 < String(informacion.fecha_participacion).length)
			// 	longitud3 = String(informacion.fecha_participacion).length;

			// if (longitud4 < String(informacion.id_participante).length)
			// 	longitud4 = String(informacion.id_participante).length;

			// if (longitud5 < String(informacion.premio).length)
			// 	longitud4 = String(informacion.premio).length;

			let rowInfo = [
				'',
				{ v: informacion.fecha_participacion, t: 's' },
				{ v: informacion.telefono_participante, t: 's' },
				{ v: informacion.nombre, t: 's' },
				{ v: informacion.promocion, t: 's' },
				{ v: informacion.premio, t: 's' },
				{ v: informacion.total_amount, t: 's' },
				{ v: '', t: 's' },
				{ v: informacion.cupon, t: 's' },
				{ v: '-', t: 's' },
				{ v: informacion.fecha_participacion, t: 's' },
			];
			infoFinal.push(rowInfo);
			contador += 1;
		});
		const ws = XLSX.utils.aoa_to_sheet(infoFinal);
		// ws['!cols'] = [
		// 	{ width: 15 },
		// 	{ width: longitud1 + 2 },
		// 	{ width: longitud2 + 2 },
		// 	{ width: longitud3 + 2 },
		// 	{ width: longitud4 + 2 }
		// ]
		// console.log(ws['!cols'])
		// ws['!merges'] = [
		// 	{ s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
		// 	{ s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }
		// ]
		const ws2 = XLSX.utils.aoa_to_sheet([row4]);
		XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
		XLSX.writeFile(wb, "reporte-participantes-promocion.xlsx");
		$('#ConsultarPromo').show();
		$("#ExportarInfo").attr("disabled", false);
    	$("#ExportarInfo").text("Descargar Excel");
		$('#PantallaInfo').show();
	});
	$('#PantallaInfo').click(function () {
		$('#TablaReportePromo').show();
		$('#ConsultarPromo').hide();
		$('#ExportarInfo').hide();
		$("#PantallaInfo").attr("disabled", true);
		$("#PantallaInfo").text("Generando...");
		$('#TablaReportePromo').show();
		$('#TablaReportePromo').empty();
		$('#TablaReportePromo').dataTable().fnDeleteRow();
		$('#TablaReportePromo').dataTable().fnUpdate();
		$('#TablaReportePromo').dataTable().fnDestroy();
		var tds = "";
		var count = 1;
		$.each(infoExportar, function () {
			console.log(this);
			tds += `
			<tr>
				<td>${this.fecha_participacion}</td>
				<td>${this.telefono_participante}</td>
				<td>${this.nombre}</td>
				<td >${this.promocion}</td>
				<td>${this.premio}</td>
				<td>${this.total_amount}</td>
				<td></td>
				<td>${this.cupon}</td>
				<td>-</td>
				<td>${this.fecha_participacion}</td>
			</tr>
			`; count++;
		});
		$('#tbParticipantes').html(tds);
		$('#tablaDetalleParticipantes').dataTable({
			responsive: true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
			},
			scrollY: true,
			"info": false,
			"lengthChange": false,
			"pageLength": 100,
			language: {
				searchPlaceholder: "Buscar",
				search: "",
			},
			"dom": '<"pull-left"f>tip'
		});
		$('#ConsultarPromo').show();
		$('#btnExportarInfo').show();
		$("#btnPantallaInfo").attr("disabled", false);
		$("#btnPantallaInfo").text("Mostrar en Pantalla");
	});
	$('#ConsultarPromo').click(function () {
		var infosel = '';
		$(".selected").each(function (index) {
			if (this.children[0].children[0]) {
				if (this.children[0].children[0].value > 0) {
					infosel = infosel + this.children[0].children[0].value + '-';
				}
			}
		});
		if (infosel != '') {
			infosel = infosel.slice(0, -1);
			$.ajax({
				type: 'GET',
				url: `../index.php/Promociones/obtenerReporteParticipantes/${$('#FechaInicio').val()}/${$('#FechaFin').val()}/${infosel}`,
				data: '',
				contentType: "application/json; charset=utf-8",
				datetype: 'json',
				beforeSend: function () {
					$("#ConsultarPromo").attr("disabled", true);
    			$("#ConsultarPromo").text("Consultado...");
					$('#ExportarInfo').hide();
					$('#PantallaInfo').hide();
					//$('#tbParticipantes').empty();
					$('#tableData').dataTable().fnDeleteRow();
					$('#tableData').dataTable().fnUpdate();
					$('#tableData').dataTable().fnDestroy();
					$('#tableData').hide();
				},
				success: function (msg) {
					infoExportar = msg.data;
					$('.botonExportar').fadeIn();
					$("#ConsultarPromo").attr("disabled", false);
    				$("#ConsultarPromo").text("Consultar");
					$('#ExportarInfo').show();
					$('#PantallaInfo').show();
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$("#ConsultarPromo").attr("disabled", false);
    				$("#ConsultarPromo").text("Consultar");
					let res = XMLHttpRequest.responseJSON;
					if (res) {
						alert(res.message);
					}
					else {
						alert(res.message || "Error al obtener los datos");
					}
				}

			});

		} else {
			alert('No selecciono Campañas');
		}


	});

//funcion para llenar las promociones
const getPromociones = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {"Authorization": token}
  };

  fetch(url + "Promocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#selectpromo").html(
        "<option disabled selected value='0'>Elige una promocion</option>"
      );

      result.forEach((element) => {
        $("#selectpromo").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
    })
    .catch((error) => Alert(error, "error"));
};

const GetReport = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    promocion: $("#selectpromo").val(),
    fechaInicial: $("#FechaInicio").val(),
    fechaFinal: $("#FechaFin").val(),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  $("#TablaReportePromo").html(null);
  fetch(url + "reportePromocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      result.forEach((element) => {
        let fecha = element.fecha.split("T");
        let fecha2 = fecha[0].split("-");
        let hora = fecha[1].split(":");
        const { cupon, esPremio } = element.detallePromocion;
        const { descripcion } = element.detallePromocion.premioPromocion.premio;
        var listado = `
        <tr> 
          <th> 
          ${element.id}
          </th>
          <th>
          ${cupon}
          </th>
          <th>
          ${fecha2[2]}/${fecha2[1]}/${fecha2[0]} ${hora[0]}:${hora[1]}
          </th>
          <th>
          ${element.numeroTelefono}
          </th>
          <th>
          ${esPremio === 1 ? "SI" : "NO"}
          </th>
          <th>
          ${descripcion}
          </th>
        </tr>
        `;
        $("#TablaReportePromo").append(listado);
      });
    })
    .catch((error) => Alert(error, "error"));
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


