const url = 'http://localhost:3000/'

$(function () {
    getCampaniasActivas();



    $('#btnTestear').click(function () {

        var id = $('#campania option:selected').val();

        if(id !== "0"){
            getCampaniasActivasbyId(id);
            

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
    
            fetch(`${url}Campania/TestearSimple`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    var html = `
                            <li class="list-group-item">
                            <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                          </svg></span>
                            <span class="pl-1"> Usuario Bloqueado (<span class="text-success">NO, Permitido</span>) </span> 
                        
                            
                            </li>
                            <li class="list-group-item">
                                <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                              </svg></span>
                                <span class="pl-1">MAXIMO DE PARTICIPACIONES POR ETAPA(<span  class="text-success">1</span>)</span>
                            </li>
                        
                        `;
    
                    const { result, RegistroValidacion, edadValidacion, sexoValidacion, etapasValidacion, tipoUsuarioValidacion, validacionParametros, validacionPresupuesto } = data;
    
    
                    let registroAccion = RegistroValidacion.validacion === 1 ? 'success' : 'danger';
    
                    html += `
                    <li class="list-group-item">
                        <span class="text-${registroAccion}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                        <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                      </svg></i></span>
                        <span class="pl-1"> Fecha de Registro minima ${RegistroValidacion.fechaRegistroC} (<span class="text-${registroAccion}"> ${RegistroValidacion.fechaRegistroU}</span>)</span>
                    </li>`;
    
                    let edadAccion = edadValidacion.validacion === 1 ? 'success' : 'danger';
    
    
                    html += `
                    <li class="list-group-item">
                        <span class="text-${edadAccion}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                      </svg></span>
                        <span class="pl-1"> Edad entre ${edadValidacion.inicial} a ${edadValidacion.final} (<span class="text-${edadAccion}"> ${edadValidacion.edad} años</span>)</span>
                    </li>`;
    
    
                    let sexoAccion = sexoValidacion.validacion === 1 ? 'success' : 'danger';
                    let sexoCampania = sexoValidacion.sexoCampania === 1 ? 'Masculino' : 'Femenino'
                    let sexoU = sexoValidacion.sexo === 1 ? 'Masculino' : 'Femenino';
    
                    html += `
                        <li class="list-group-item">
                            <span class="text-${sexoAccion}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-gender-ambiguous" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1H11.5zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"/>
                          </svg></i></span>
                            <span class="pl-1"> Sexo ${sexoCampania} (<span class="text-${sexoAccion}">${sexoU}</span>)</span>
                        </li>`;
    
    
                    html += ` 
                        <li class="list-group-item">
                            <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-grid" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                          </svg></i></span>
                            <span class="pl-1">Etapas ${etapasValidacion.etapasTotales} Actual ${etapasValidacion.etapaActual} (<span class="text-success">VALIDA</span>)</span>
                        </li>`;
    
    
                    let tipoUAccion = tipoUsuarioValidacion.validacion === 1 ? 'success' : 'danger';
                    let tipoUtext = tipoUsuarioValidacion.tipoU === 1 ? 'Final' : 'Otro';
                    let tipoUCampania = tipoUsuarioValidacion.tipoUC === 0 ? 'Todos' : 'Final';
                    html += `
                    <li class="list-group-item">
                        <span class="text-${tipoUAccion}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill-dash" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1Zm0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                      </svg></i></span>
                        <span class="pl-1"> Tipo de Usuarios: ${tipoUCampania} (<span class="text-${tipoUAccion}">${tipoUtext}</span>)</span>
                    </li>`;
    
    
    
                    let validacionParametro = validacionParametros.validacion === 1 ? 'success' : 'danger';
    
                    html += ` 
                    <li class="list-group-item">
                        <span class="text-${validacionParametro}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg></i></span>
                        <span class="pl-1"> Transaccion Valida (<span class="text-${validacionParametro}">SI</span>)</span>
                    </li>`;
    
    
                    html += `
                    
                        <li class="list-group-item">
                            <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                          </svg></i></span>
                            <span class="pl-1"> Presupuesto Q ${validacionPresupuesto.presupuesto} (<span  class="text-success"> ${validacionPresupuesto.presupuesto} - 5.00</span>)</span>
                        </li>
                    
                        <li class="list-group-item">
                            <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-align-end" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M14.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"/>
                            <path d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/>
                          </svg></i></span>
                            <span class="pl-1"> Limite de Participacion ${validacionPresupuesto.limiteGanadores} (<span class="text-success"> ${validacionPresupuesto.limiteGanadores} -1</span>)</span>
                        </li>`;
    
    
                    if (result) {
                        html += ` <button class="btn btn-success" type="button" id="btnTestear">ENVIAR PREMIO</button></div>`
                    }
    
                    $('#PnResumen').html(html);
    
                    if (feather) {
                        feather.replace({ width: 14, height: 14 });
                    }
                })
                .catch(error => console.log('error', error));
        } 
        
        


    }) 
});

const getCampaniasActivasbyId = (id) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`${url}Campania/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {

            var card = `
                    <div class="card mb-2">
                    <div class="card-info card-body p-0">
                    <div class="container d-flex justify-content-between">
                        <div class="info-camp row col-md-3">
                            <h5 >${result.nombre}</h5>
                            <p>${result.descripcion}</p>
                        </div>
                        
                        <div class="bar-info row col-md-4">
                            <h5>Presupuesto</h5>
                            <div class="progress p-0" style="width: 90%; height: 20%">
                                <div class="progress-bar" role="progressbar" style="width: 25%; " aria-valuemax="${result.presupuesto}"></div>
                                <div class="progress-bar" role="progressbar" style="width: 35%; background-color: chartreuse;" aria-valuemax="${result.presupuesto}"></div>
                            </div>
                        </div>

                        <div class="bar-info row col-md-4">
                            <h5>Limite Participantes</h5>
                            <div class="progress p-0" style="width: 90%; height: 20%">
                                <div class="progress-bar" role="progressbar" style="width: 10%;"></div>
                                <div class="progress-bar" role="progressbar" style="width: 35%; background-color:darkviolet;"></div>
                            </div>
                        </div>

                    </div>
                    
                    </div>

                    

                </div>
            `

            $('#container-card').html(card);
        })
        .catch(error => console.log('error', error));
}


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