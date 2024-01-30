const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

//import {customGridOptions} from '../js/ag-grid_es.mjs';
let gridOptions;
let myGrid;
let data = {};

document.addEventListener('DOMContentLoaded', () => {

    const Alert = function (message, status) {
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
        });
    }

    const searchBar = document.querySelector('#ag-search-bar');
    searchBar.addEventListener('input', () => customGridOptions.api.onFilterTextBoxChanged(searchBar.value))

    fetch(`${url}projects`, {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    })
        .then(response => response.json())
        .then(result => {
            //data = JSON.stringify(result[0]);
            data = result
            console.log(data)
            if (result.code == "ok") {
                Alert(result.message, 'success')
            } else {
                Alert(result.message, 'error');
            }
        })
        .catch(error => {
            Alert(error, 'error')
        });

    gridOptions = {
        columnDefs: [
            { headerName: "No.", field: "id", /* type: 'numericColumn', */ filter: 'agNumberColumnFilter', autoHeight: true, width: 300 },
            {
                headerName: "Descripción", field: "descripcion", filter: 'agTextColumnFilter', autoHeight: true, getQuickFilterText: (params) => params.colDef.hide ? '' : params.value.name, editable: true, width: 775
            },
            {
                headerName: "Estado", field: "estado", autoHeight: true, editable: true, width: 100
            },
            //{ headerName: "Acciones", field: "actions", autoHeight: true, width: 250 },
            //{ headerName: "Ruta", field: "route", /* type: 'rightAligned', */ autoHeight: true, width: 500 },
            //{ headerName: "Estado", field: "status", enableRowGroup: true, enablePivot: true, enableValue: true, pivot: true, autoHeight: true, width: 100 }
        ],
        rowData: [{
            id: 12,
            descripcion: "Billetera Electrónica",
            estado: 1
        }],

        //rowHeight: 30,
        //headerHeight: 40,

    };

    for (let key in customGridOptions) {
        if (customGridOptions.hasOwnProperty(key)) {
            gridOptions[key] = customGridOptions[key]
        }
    }

    const myGridElement = document.querySelector('#myGrid');
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