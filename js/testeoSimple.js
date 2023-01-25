const url = 'http://localhost:3000/'

$(function () {
    getCampaniasActivas();



    $('#btnTestear').click(function () {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${url}Campania/TestearSimple`, requestOptions)
            .then(response => response.json())
            .then(data => {

                var html = ` <div class="col-md-12">
                    <h4>
                        <span class="text-success"><i data-feather="check-circle"></i></span>
                        <span> Usuario Bloqueado (<span class="text-success">NO, Permitido</span>)</span>
                    </h4>
                    <hr/>
                </div>
                <div class="col-md-12">
                    <h4>
                        <span class="text-success"><i data-feather="check-circle"></i></span>
                        <span>MAXIMO DE PARTICIPACIONES POR ETAPA(<span  class="text-success">1</span>)</span>
                    </h4>
                    <hr/>
                </div>`;

                const { result, RegistroValidacion, edadValidacion, sexoValidacion, etapasValidacion, tipoUsuarioValidacion, validacionParametros, validacionPresupuesto } = data;


                let registroAccion = RegistroValidacion.validacion === 1 ? 'success' : 'danger';

                html += `<div class="col-md-12">
                <h4>
                    <span class="text-${registroAccion}"><i data-feather="check-circle"></i></span>
                    <span> Fecha de Registro minima ${RegistroValidacion.fechaRegistroC} (<span class="text-${registroAccion}"> ${RegistroValidacion.fechaRegistroU}</span>)</span>
                </h4>
                <hr/>
            </div>`;

                let edadAccion = edadValidacion.validacion === 1 ? 'success' : 'danger';


                html += `<div class="col-md-12">
                <h4>
                    <span class="text-${edadAccion}"><i data-feather="check-circle"></i></span>
                    <span> Edad entre ${edadValidacion.inicial} a ${edadValidacion.final} (<span class="text-${edadAccion}"> ${edadValidacion.edad} años</span>)</span>
                </h4>
                <hr/>
            </div>`;


                let sexoAccion = sexoValidacion.validacion === 1 ? 'success' : 'danger';
                let sexoCampania = sexoValidacion.sexoCampania === 1 ? 'Masculino' : 'Femenino'
                let sexoU = sexoValidacion.sexo === 1 ? 'Masculino' : 'Femenino';

                html += `<div class="col-md-12">
                    <h4>
                        <span class="text-${sexoAccion}"><i data-feather="check-circle"></i></span>
                        <span> Sexo ${sexoCampania} (<span class="text-${sexoAccion}">${sexoU}</span>)</span>
                    </h4>
                    <hr/>
                </div>`;


                html += ` <div class="col-md-12">
                    <h4>
                        <span class="text-success"><i data-feather="check-circle"></i></span>
                        <span>Etapas ${etapasValidacion.etapasTotales} Actual ${etapasValidacion.etapaActual} (<span class="text-success">VALIDA</span>)</span>
                    </h4>
                    <hr/>
                </div>`;


                let tipoUAccion = tipoUsuarioValidacion.validacion === 1 ? 'success' : 'danger';
                let tipoUtext = tipoUsuarioValidacion.tipoU === 1 ? 'Final' : 'Otro';
                let tipoUCampania = tipoUsuarioValidacion.tipoUC === 0 ? 'Todos' : 'Final';
                html += `<div class="col-md-12">
                <h4>
                    <span class="text-${tipoUAccion}"><i data-feather="check-circle"></i></span>
                    <span> Tipo de Usuarios: ${tipoUCampania} (<span class="text-${tipoUAccion}">${tipoUtext}</span>)</span>
                </h4>
                <hr/>
            </div>`;



                let validacionParametro = validacionParametros.validacion === 1 ? 'success' : 'danger';

                html += ` <div class="col-md-12">
                <h4>
                    <span class="text-${validacionParametro}"><i data-feather="check-circle"></i></span>
                    <span> Transaccion Valida (<span class="text-${validacionParametro}">SI</span>)</span>
                </h4>
                <hr/>
            </div>`;


                html += `
                <div class="col-md-12">
                    <h4>
                        <span class="text-success"><i data-feather="check-circle"></i></span>
                        <span> Presupuesto Q ${validacionPresupuesto.presupuesto} (<span  class="text-success"> ${validacionPresupuesto.presupuesto} - 5.00</span>)</span>
                    </h4>
                    <hr/>
                </div>
                <div class="col-md-12">
                    <h4>
                        <span class="text-success"><i data-feather="check-circle"></i></span>
                        <span> Limite de Participacion ${validacionPresupuesto.limiteGanadores} (<span class="text-success"> ${validacionPresupuesto.limiteGanadores} -1</span>)</span>
                    </h4>
                    <hr/>
                </div>`;


                if (result) {
                    html += `<div class="col-md-12"> <button class="btn btn-success" type="button" id="btnTestear">ENVIAR PREMIO</button></div>`
                }

                $('#PnResumen').html(html);

                if (feather) {
                    feather.replace({ width: 14, height: 14 });
                }
            })
            .catch(error => console.log('error', error));


    })
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
                $('#campania').append('<option value="' + element.id + '">' + element.nombre + '</option>');
            });
        })
        .catch(error => console.log('error', error));
}