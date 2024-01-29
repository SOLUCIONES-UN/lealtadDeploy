const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
    const gridOptions = {
        headerClass: 'text-center',
        cellStyle: {
            textAlign: 'center',
        },
        rowData: [
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        ],
        columnDefs: [
            { field: "make" },
            { field: "model" },
            { field: "price" },
            { field: "electric" }
        ]
    };
    const myGridElement = document.querySelector('#myGrid');
    agGrid.createGrid(myGridElement, gridOptions);
});