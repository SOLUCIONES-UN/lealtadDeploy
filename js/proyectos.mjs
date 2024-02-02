const url = 'http://localhost:3000/'

document.addEventListener('DOMContentLoaded', async () => {

    let token = localStorage.getItem("token");

    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };

    let gridOptions;
    let myGrid;
    let data = [{}];

    const myGridElement = document.querySelector('#myGrid');

    const Alert = function (message, status) {
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
        });
    }

    const searchBar = document.querySelector('#ag-search-bar');
    searchBar.addEventListener('input', () => myGrid.setGridOption('quickFilterText', searchBar.value))

    await fetch(`${url}projects`, {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                Alert('Error al obtener los proyectos.', 'error');
                throw new Error('Failed to fetch data');
            }
            if (response.status === 200) {
                return response.json();
            } else {
                Alert('Error al obtener los proyectos.', 'error');
                throw new Error('Unexpected status code: ' + response.status);
            }
        })
        .then(result => {
            data = result.map(item => ({
                ...item,
                estado: item.estado === 1 ? true : false
            }));
        })
        .catch(error => {
            console.error('Error:', error);
            Alert('Error al obtener los proyectos.', 'error');
        });


    gridOptions = {
        columnDefs: [
            { headerName: "No.", field: "id", /* type: 'numericColumn', */ filter: 'agNumberColumnFilter', autoHeight: true, width: .10 * myGridElement.clientWidth },
            {
                headerName: "Descripción", field: "descripcion", filter: 'agTextColumnFilter', autoHeight: true, editable: true, width: .595 * myGridElement.clientWidth
            },
            {
                headerName: "Estado", field: "estado", autoHeight: true, editable: true, /* cellEditor: 'booleanEditor', cellRenderer: params => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.disabled = true;
                    checkbox.checked = params.value;
                    return checkbox;
                } ,*/ width: .10 * myGridElement.clientWidth
            },
            {
                headerName: "Acciones", field: "actions", autoHeight: true, cellRenderer: params => {
                    const button = document.createElement('button');
                    button.classList = 'btn-sm btn-primary mt-50 waves-effect waves-float waves-light';
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';
                    button.style = 'margin: .5rem 0 .35rem 0;';
                    button.addEventListener('click', async () => await fetch(`${url}projects/${params.data.id}`, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({ "descripcion": params.data.descripcion, "estado": params.data.estado === true ? 1 : 0 }),
                        redirect: 'follow',
                    })
                        .then(response => {
                            if (!response.ok) {
                                Alert('Error al actualizar el proyecto.', 'error');
                                throw new Error('Failed to fetch data');
                            }
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                Alert('Error al actualizar el proyecto.', 'error');
                                throw new Error('Unexpected status code: ' + response.status);
                            }
                        })
                        .then(result => {
                            Alert('Proyecto actualizado exitosamente.', 'success');
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Alert('Error al actualizar el proyecto.', 'error');
                        }));
                    return button;
                }, width: .20 * myGridElement.clientWidth
            },
            //{ headerName: "Ruta", field: "route", /* type: 'rightAligned', */ autoHeight: true, width: 500 },
            //{ headerName: "Estado", field: "status", enableRowGroup: true, enablePivot: true, enableValue: true, pivot: true, autoHeight: true, width: 100 }
        ],
        rowData: data,

        //rowHeight: 30,
        //headerHeight: 40,

    };

    for (let key in customGridOptions) {
        if (customGridOptions.hasOwnProperty(key)) {
            gridOptions[key] = customGridOptions[key]
        }
    }

    myGrid = agGrid.createGrid(myGridElement, gridOptions);

    const paginationPageSizeOptions = customGridOptions.paginationPageSizeOptions;
    const selectPaginationSize = document.querySelector('#tableData_length select');
    //document.querySelector('.ag-wrapper.ag-picker-field-wrapper.ag-picker-collapsed').focus();
    //const selectPaginationSizeAG = document.querySelector('.ag-list.ag-select-list.ag-ltr.ag-popup-child.ag-popup-positioned-under');
    //selectPaginationSizeAG.innerHTML = '';

    selectPaginationSize.addEventListener('change', () => {
        //myGrid.setPaginationPageSize(selectPaginationSize.value);
        myGrid.gos.gridOptions.paginationPageSize = Number(selectPaginationSize.value)
        gridOptions.paginationPageSize = Number(selectPaginationSize.value)
    })

    for (let key in paginationPageSizeOptions) {
        if (paginationPageSizeOptions.hasOwnProperty(key)) {
            let option = document.createElement('option');
            option.value = paginationPageSizeOptions[key];
            var t = document.createTextNode(paginationPageSizeOptions[key]);
            option.appendChild(t);
            selectPaginationSize.appendChild(option);




            /*         `<div role="option" class="ag-list-item ag-select-list-item" tabindex="-1" aria-posinset="1" aria-setsize="4" aria-selected="false"><span></span></div>` */

        }
    }

});