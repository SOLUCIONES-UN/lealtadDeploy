const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");

import {customGridOptions} from '../js/ag-grid_es.mjs';

document.addEventListener('DOMContentLoaded', () => {
    
    let gridOptions = {
        columnDefs: [
            { headerName: "#", field: "idp" },
            { headerName: "Descripción", field: "description" },
            { headerName: "Ruta", field: "route" },
            { headerName: "Estado", field: "status" }
        ],
        rowData: [
            { idp: "Tesla", description: "description Y", route: 64950, status: true },
            { idp: "Ford", description: "F-Series", route: 33850, status: false },
            { idp: "Toyota", description: "Corolla", route: 29600, status: false },
        ],
        
        //rowHeight: 30,
        //headerHeight: 40,

    };

    for (let [key, value] of customGridOptions) {
        gridOptions.set(key, value)
    }
    
    const myGridElement = document.querySelector('#myGrid');
    agGrid.createGrid(myGridElement, gridOptions);
});