const customGridOptions = {
    headerClass: 'text-center',
    cellStyle: {
        textAlign: 'center',
    },
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
    },
    rowGroupPanelShow: 'always',
    rowSelection: 'multiple',
    statusBar: {
        items: [
            { component: 'agAggregationComponent' }
        ]
    },
    sideBar: true,
    pagination: true,
    enableSorting: true,
    enableFilter: true,
    floatingFilter: true,
    paginationPageSize: 20,
    paginationAutoPageSize: true,
    paginationPageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
    enableRangeSelection: true,
    suppressCellSelection: false,
    suppressContextMenu: false,
    enableCharts: true,
    suppressDragLeaveHidesColumns: false,
    animateRows: true,
    deltaRowDataMode: true,
    groupDefaultExpanded: 1,
    getRowNodeId: (data) => data.id,
    onGridReady: (event) => console.log('Grid is ready'),
    components: {
        rowNodeIdRenderer: function (params) {
            return params.node.id + 1;
        }
    },
    localeText: {

        page: 'Pagina',
        more: 'Más',
        to: 'a',
        of: 'de',
        next: 'Siguente',
        last: 'Último',
        first: 'Primero',
        previous: 'Anteror',
        loadingOoo: 'Cargando...',

        selectAll: 'Seleccionar Todo',
        searchOoo: 'Buscar...',
        blanks: 'En blanco',

        filterOoo: 'Filtrar',
        applyFilter: 'Aplicar Filtro...',
        equals: 'Igual',
        notEqual: 'No Igual',

        lessThan: 'Menos que',
        greaterThan: 'Mayor que',
        lessThanOrEqual: 'Menos o igual que',
        greaterThanOrEqual: 'Mayor o igual que',
        inRange: 'En rango de',

        contains: 'Contiene',
        notContains: 'No contiene',
        startsWith: 'Empieza con',
        endsWith: 'Termina con',

        andCondition: 'Y',
        orCondition: 'O',

        group: 'Grupo',

        columns: 'Columnas',
        filters: 'Filtros',
        valueColumns: 'Valos de las Columnas',
        pivotMode: 'Modo Pivote',
        groups: 'Grupos',
        values: 'Valores',
        pivots: 'Pivotes',
        toolPanelButton: 'BotonDelPanelDeHerramientas',

        noRowsToShow: 'No hay filas para mostrar',

        pinColumn: 'Columna Pin',
        valueAggregation: 'Agregar valor',
        autosizeThiscolumn: 'Autoajustar esta columna',
        autosizeAllColumns: 'Ajustar todas las columnas',
        groupBy: 'agrupar',
        ungroupBy: 'desagrupar',
        resetColumns: 'Reiniciar Columnas',
        expandAll: 'Expandir todo',
        collapseAll: 'Colapsar todo',
        toolPanel: 'Panel de Herramientas',
        export: 'Exportar',
        csvExport: 'Exportar a CSV',
        excelExport: 'Exportar a Excel (.xlsx)',
        excelXmlExport: 'Exportar a Excel (.xml)',

        pinLeft: 'Pin Izquierdo',
        pinRight: 'Pin Derecho',

        sum: 'Suman',
        min: 'Minimo',
        max: 'Maximo',
        none: 'nada',
        count: 'contar',
        average: 'promedio',

        copy: 'Copiar',
        copyWithHeaders: 'Copiar con cabeceras',
        paste: 'Pegar'

    }
}

//export { customGridOptions };