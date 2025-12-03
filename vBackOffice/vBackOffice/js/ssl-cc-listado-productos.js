/**
 * ssl-listado-productos.js
 * Funcionalidad del Catálogo Maestro de Productos
 */

window.ProductCatalog = {
    // Estado de la aplicación
    state: {
        currentPage: 1,
        totalPages: 156,
        itemsPerPage: 8,
        totalItems: 1245,
        modoEdicion: false,
        currentProductId: null,
        filters: {
            codigo: '',
            nombre: '',
            clasificacion: '',
            estado: ''
        }
    },

    // Base de datos simulada de productos
    productos: [
        {
            codigo: 'EL-1245',
            nombre: 'Cable eléctrico NYY 3x10mm2 0.6/1kV',
            unidadMedida: 'MT',
            clasificacion: 'electrico',
            descripcion: 'Cable de energía con conductor de cobre, aislamiento de PVC, cubierta exterior de PVC. Tensión nominal 0.6/1kV. Temperatura máxima de operación 70°C.',
            precioMin: 420,
            precioMax: 485,
            cantidadVendida: 15250,
            estado: 'vigente',
            fechaIngreso: '2022-03-15'
        },
        {
            codigo: 'EL-0876',
            nombre: 'Tubo Conduit PVC 25mm',
            unidadMedida: 'UN',
            clasificacion: 'electrico',
            descripcion: 'Tubo conduit de PVC rígido, diámetro 25mm (1"), largo 3 metros. Resistente a impactos, autoextinguible.',
            precioMin: 780,
            precioMax: 920,
            cantidadVendida: 8450,
            estado: 'vigente',
            fechaIngreso: '2022-01-20'
        },
        {
            codigo: 'MD-2341',
            nombre: 'Terciado estructural 18mm 1.22x2.44m',
            unidadMedida: 'PL',
            clasificacion: 'madera',
            descripcion: 'Tablero contrachapado estructural de pino radiata, espesor 18mm, dimensiones 1.22x2.44m.',
            precioMin: 18500,
            precioMax: 22800,
            cantidadVendida: 3200,
            estado: 'vigente',
            fechaIngreso: '2022-02-10'
        },
        {
            codigo: 'SN-0145',
            nombre: 'WC One Piece Elongado Dual Flush',
            unidadMedida: 'UN',
            clasificacion: 'sanitarios',
            descripcion: 'Inodoro de una pieza con diseño elongado, sistema dual flush 3/6 litros, incluye asiento con cierre suave.',
            precioMin: 65000,
            precioMax: 85000,
            cantidadVendida: 450,
            estado: 'vigente',
            fechaIngreso: '2022-04-05'
        },
        {
            codigo: 'PT-0567',
            nombre: 'Pintura látex interior blanco 4L',
            unidadMedida: 'GL',
            clasificacion: 'pinturas',
            descripcion: 'Pintura látex acrílica para interiores, color blanco, acabado mate, rendimiento 10-12 m²/L.',
            precioMin: 8900,
            precioMax: 12500,
            cantidadVendida: 5680,
            estado: 'vigente',
            fechaIngreso: '2022-01-15'
        },
        {
            codigo: 'FE-1234',
            nombre: 'Clavo corriente 3"',
            unidadMedida: 'KG',
            clasificacion: 'ferreteria',
            descripcion: 'Clavo de acero con cabeza, 3 pulgadas de largo, para construcción general.',
            precioMin: 980,
            precioMax: 1250,
            cantidadVendida: 12400,
            estado: 'vigente',
            fechaIngreso: '2021-12-01'
        },
        {
            codigo: 'CN-0789',
            nombre: 'Cemento Portland tipo I 25kg',
            unidadMedida: 'SC',
            clasificacion: 'construccion',
            descripcion: 'Cemento Portland tipo I, saco de 25kg, para uso general en construcción.',
            precioMin: 4200,
            precioMax: 4800,
            cantidadVendida: 28500,
            estado: 'vigente',
            fechaIngreso: '2021-11-20'
        },
        {
            codigo: 'MB-0234',
            nombre: 'Escritorio ejecutivo 1.50x0.75m (DESCONTINUADO)',
            unidadMedida: 'UN',
            clasificacion: 'muebles',
            descripcion: 'Escritorio ejecutivo con superficie melamina, estructura metálica, cajonera incluida.',
            precioMin: 145000,
            precioMax: 180000,
            cantidadVendida: 0,
            estado: 'no-vigente',
            fechaIngreso: '2021-10-15'
        }
    ],

    // Inicialización
    init: function() {
        this.renderProductTable();
        this.setupEventListeners();
        this.updatePaginationInfo();
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Tabs del modal
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Form submit
        const form = document.getElementById('formProducto');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarProducto();
            });
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
            // Ctrl + N para nuevo producto
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.abrirModalNuevoProducto();
            }
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('modalProducto');
            if (e.target === modal) {
                this.cerrarModal();
            }
        });

        // Autocompletado de búsqueda
        const searchNombre = document.getElementById('searchNombre');
        if (searchNombre) {
            searchNombre.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
        }
    },

    // Renderizar tabla de productos
    renderProductTable: function() {
        const tbody = document.getElementById('productTableBody');
        if (!tbody) return;

        let html = '';
        this.productos.forEach(producto => {
            html += this.createProductRow(producto);
        });

        tbody.innerHTML = html;
    },

    // Crear fila de producto
    createProductRow: function(producto) {
        const clasificacionText = this.getClasificacionText(producto.clasificacion);
        const statusClass = producto.estado === 'vigente' ? 'status-vigente' : 'status-no-vigente';
        const statusText = producto.estado === 'vigente' ? 'Vigente' : 'No Vigente';

        return `
            <tr onclick="ProductCatalog.verDetalleProducto('${producto.codigo}')">
                <td><strong>${producto.codigo}</strong></td>
                <td>${producto.nombre}</td>
                <td>${producto.unidadMedida}</td>
                <td><span class="clasificacion-badge">${clasificacionText}</span></td>
                <td>$${this.formatNumber(producto.precioMin)}</td>
                <td>$${this.formatNumber(producto.precioMax)}</td>
                <td>${this.formatNumber(producto.cantidadVendida)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); ProductCatalog.verDetalleProducto('${producto.codigo}')" title="Ver detalle">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); ProductCatalog.editarProducto('${producto.codigo}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // Obtener texto de clasificación
    getClasificacionText: function(clasificacion) {
        const clasificaciones = {
            'electrico': 'Eléctrico',
            'madera': 'Madera',
            'muebles': 'Muebles',
            'planchas': 'Planchas',
            'pinturas': 'Pinturas',
            'sanitarios': 'Sanitarios',
            'ferreteria': 'Ferretería',
            'construccion': 'Construcción'
        };
        return clasificaciones[clasificacion] || clasificacion;
    },

    // Formatear números
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Ver detalle del producto
    verDetalleProducto: function(codigo) {
        this.state.modoEdicion = false;
        this.state.currentProductId = codigo;
        
        document.getElementById('modalTitulo').textContent = 'Detalle del Producto';
        document.getElementById('btnGuardar').style.display = 'none';
        
        // Deshabilitar campos en modo visualización
        this.setFieldsEnabled(false);
        
        this.cargarDatosProducto(codigo);
        this.cargarCorrelaciones(codigo);
        this.cargarVentas(codigo);
        
        document.getElementById('modalProducto').style.display = 'block';
    },

    // Editar producto
    editarProducto: function(codigo) {
        this.state.modoEdicion = true;
        this.state.currentProductId = codigo;
        
        document.getElementById('modalTitulo').textContent = 'Editar Producto';
        document.getElementById('btnGuardar').style.display = 'inline-flex';
        
        // Habilitar campos en modo edición
        this.setFieldsEnabled(true);
        
        this.cargarDatosProducto(codigo);
        this.cargarCorrelaciones(codigo);
        this.cargarVentas(codigo);
        
        document.getElementById('modalProducto').style.display = 'block';
    },

    // Abrir modal nuevo producto
    abrirModalNuevoProducto: function() {
        this.state.modoEdicion = true;
        this.state.currentProductId = null;
        
        document.getElementById('modalTitulo').textContent = 'Nuevo Producto';
        document.getElementById('btnGuardar').style.display = 'inline-flex';
        
        // Limpiar formulario
        document.getElementById('formProducto').reset();
        
        // Habilitar campos
        this.setFieldsEnabled(true);
        
        // Establecer fecha actual
        document.getElementById('fechaIngreso').value = new Date().toISOString().split('T')[0];
        
        // Limpiar tablas
        this.limpiarTablas();
        
        // Resetear estadísticas
        this.resetearEstadisticas();
        
        // Activar primera pestaña
        this.switchTab('informacion');
        
        document.getElementById('modalProducto').style.display = 'block';
    },

    // Habilitar/deshabilitar campos
    setFieldsEnabled: function(enabled) {
        const fields = document.querySelectorAll('#formProducto input:not([readonly]), #formProducto select, #formProducto textarea');
        fields.forEach(field => {
            field.disabled = !enabled;
        });
    },

    // Cargar datos del producto
    cargarDatosProducto: function(codigo) {
        const producto = this.productos.find(p => p.codigo === codigo);
        if (!producto) return;
        
        document.getElementById('codigoSSL').value = producto.codigo;
        document.getElementById('nombreSSL').value = producto.nombre;
        document.getElementById('unidadMedida').value = producto.unidadMedida;
        document.getElementById('clasificacion').value = producto.clasificacion;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precioMin').value = producto.precioMin;
        document.getElementById('precioMax').value = producto.precioMax;
        document.getElementById('cantidadVendida').value = producto.cantidadVendida;
        document.getElementById('estado').value = producto.estado;
        document.getElementById('fechaIngreso').value = producto.fechaIngreso;
        
        // Actualizar estadísticas
        document.getElementById('statVentasTotal').textContent = '$4.58M';
        document.getElementById('statProveedores').textContent = '5';
        document.getElementById('statClientes').textContent = '4';
        document.getElementById('statMargen').textContent = '13.8%';
    },

    // Cargar correlaciones
    cargarCorrelaciones: function(codigo) {
        const tbody = document.getElementById('tablaCorrelaciones');
        if (!tbody) return;

        // Datos simulados de correlaciones
        const correlaciones = [
            { codigo: 'CLI-001', descripcion: 'Cable eléctrico 3x10 cliente', um: 'UN', factor: 1.0, nombre: 'CONSTRUCTORA ALMAGRO / 76.123.456-K', tipo: 'Cliente', precio: 485, cantidad: 2450, fecha: '24/05/2025' },
            { codigo: 'PROV-ELC-3X10', descripcion: 'Cable NYY 3x10mm2 CENTELSA', um: 'MT', factor: 1.0, nombre: 'ELECTROCOM LTDA. / 76.234.567-8', tipo: 'Proveedor', precio: 420, cantidad: 5200, fecha: '25/05/2025' }
        ];

        let html = '';
        correlaciones.forEach(corr => {
            html += `
                <tr>
                    <td>${corr.codigo}</td>
                    <td>${corr.descripcion}</td>
                    <td>${corr.um}</td>
                    <td>${corr.factor}</td>
                    <td>${corr.nombre}</td>
                    <td><span class="clasificacion-badge">${corr.tipo}</span></td>
                    <td>$${this.formatNumber(corr.precio)}</td>
                    <td>${this.formatNumber(corr.cantidad)}</td>
                    <td>${corr.fecha}</td>
                    <td><span class="status-badge status-vigente">Activo</span></td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="ProductCatalog.editarCorrelacion('${corr.codigo}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html || '<tr><td colspan="11" style="text-align: center; color: #666;">No hay correlaciones registradas</td></tr>';
    },

    // Cargar historial de ventas
    cargarVentas: function(codigo) {
        const tbody = document.getElementById('tablaVentas');
        if (!tbody) return;

        // Datos simulados de ventas
        const ventas = [
            { fecha: '25/05/2025', ocCliente: 'OC-CLI-2025-0156', cliente: 'CONSTRUCTORA ALMAGRO S.A.', ocProveedor: 'OC-PROV-2025-0234', proveedor: 'ELECTROCOM LTDA.', cantidad: '500 MT', valorCompra: 210000, valorVenta: 242500, margen: 15.5 },
            { fecha: '22/05/2025', ocCliente: 'OC-CLI-2025-0145', cliente: 'INMOBILIARIA INGEVEC', ocProveedor: 'OC-PROV-2025-0228', proveedor: 'IMPORTADORA TÉCNICA S.A.', cantidad: '300 MT', valorCompra: 128400, valorVenta: 142500, margen: 10.9 },
            { fecha: '20/05/2025', ocCliente: 'OC-CLI-2025-0138', cliente: 'CONSTRUCTORA MOLLER', ocProveedor: 'OC-PROV-2025-0221', proveedor: 'DISTRIB. ELÉCTRICA NAC.', cantidad: '750 MT', valorCompra: 318750, valorVenta: 360000, margen: 12.9 }
        ];

        let html = '';
        ventas.forEach(venta => {
            html += `
                <tr>
                    <td>${venta.fecha}</td>
                    <td>${venta.ocCliente}</td>
                    <td>${venta.cliente}</td>
                    <td>${venta.ocProveedor}</td>
                    <td>${venta.proveedor}</td>
                    <td>${venta.cantidad}</td>
                    <td>$${this.formatNumber(venta.valorCompra)}</td>
                    <td>$${this.formatNumber(venta.valorVenta)}</td>
                    <td style="color: var(--success-color); font-weight: bold;">${venta.margen}%</td>
                </tr>
            `;
        });

        tbody.innerHTML = html || '<tr><td colspan="9" style="text-align: center; color: #666;">No hay ventas registradas</td></tr>';
    },

    // Cerrar modal
    cerrarModal: function() {
        document.getElementById('modalProducto').style.display = 'none';
        
        // Resetear a la primera pestaña
        this.switchTab('informacion');
    },

    // Cambiar pestaña
    switchTab: function(tabId) {
        // Remover clase activa de todos los botones y contenidos
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Activar botón y contenido seleccionado
        const button = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const content = document.getElementById(tabId);
        
        if (button) button.classList.add('active');
        if (content) content.classList.add('active');
    },

    // Guardar producto
    guardarProducto: function() {
        if (confirm('¿Está seguro de guardar los cambios?')) {
            // Aquí iría la lógica para guardar en el servidor
            console.log('Guardando producto...');
            
            // Simular guardado exitoso
            setTimeout(() => {
                alert('Producto guardado exitosamente');
                this.cerrarModal();
                this.renderProductTable(); // Refrescar tabla
            }, 500);
        }
    },

    // Buscar productos
    buscarProductos: function() {
        this.state.filters.codigo = document.getElementById('searchCodigo').value;
        this.state.filters.nombre = document.getElementById('searchNombre').value;
        this.state.filters.clasificacion = document.getElementById('searchClasificacion').value;
        this.state.filters.estado = document.getElementById('searchEstado').value;
        
        console.log('Buscando productos con filtros:', this.state.filters);
        
        // Aquí iría la lógica de búsqueda real
        // Por ahora solo mostramos un mensaje
        this.renderProductTable(); // Actualizar tabla con resultados filtrados
    },

    // Limpiar búsqueda
    limpiarBusqueda: function() {
        document.getElementById('searchCodigo').value = '';
        document.getElementById('searchNombre').value = '';
        document.getElementById('searchClasificacion').value = '';
        document.getElementById('searchEstado').value = '';
        
        this.state.filters = {
            codigo: '',
            nombre: '',
            clasificacion: '',
            estado: ''
        };
        
        this.renderProductTable();
    },

    // Exportar a Excel
    exportarExcel: function() {
        console.log('Exportando catálogo a Excel...');
        // Aquí iría la lógica real de exportación
        
        // Simular descarga
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'catalogo_productos_' + new Date().toISOString().split('T')[0] + '.xlsx';
        alert('Iniciando descarga del catálogo de productos...');
    },

    // Exportar ventas
    exportarVentas: function() {
        console.log('Exportando historial de ventas...');
        // Aquí iría la lógica real de exportación
        
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'ventas_producto_' + this.state.currentProductId + '_' + new Date().toISOString().split('T')[0] + '.xlsx';
        alert('Iniciando descarga del historial de ventas...');
    },

    // Agregar correlación
    agregarCorrelacion: function() {
        alert('Abriendo formulario para agregar nueva correlación...');
        // Aquí abriría un modal secundario para agregar correlación
    },

    // Editar correlación
    editarCorrelacion: function(codigo) {
        alert('Editando correlación: ' + codigo);
        // Aquí abriría el formulario de edición de correlación
    },

    // Cambiar página
    changePage: function(action) {
        const currentPage = this.state.currentPage;
        const totalPages = this.state.totalPages;
        
        switch(action) {
            case 'first':
                this.state.currentPage = 1;
                break;
            case 'prev':
                if (currentPage > 1) this.state.currentPage--;
                break;
            case 'next':
                if (currentPage < totalPages) this.state.currentPage++;
                break;
            case 'last':
                this.state.currentPage = totalPages;
                break;
        }
        
        this.updatePaginationInfo();
        this.renderProductTable(); // Cargar nuevos datos
    },

    // Actualizar información de paginación
    updatePaginationInfo: function() {
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        
        if (currentPageEl) currentPageEl.textContent = this.state.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = this.state.totalPages;
    },

    // Manejar entrada de búsqueda (autocompletado)
    handleSearchInput: function(value) {
        // Aquí se implementaría el autocompletado
        console.log('Buscando productos que contengan:', value);
        
        // Simular sugerencias de autocompletado
        if (value.length > 2) {
            const suggestions = this.productos
                .filter(p => p.nombre.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);
            
            if (suggestions.length > 0) {
                console.log('Sugerencias:', suggestions.map(s => s.nombre));
            }
        }
    },

    // Limpiar tablas
    limpiarTablas: function() {
        const tablaCorrelaciones = document.getElementById('tablaCorrelaciones');
        const tablaVentas = document.getElementById('tablaVentas');
        
        if (tablaCorrelaciones) {
            tablaCorrelaciones.innerHTML = '<tr><td colspan="11" style="text-align: center; color: #666;">No hay correlaciones registradas</td></tr>';
        }
        
        if (tablaVentas) {
            tablaVentas.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #666;">No hay ventas registradas</td></tr>';
        }
    },

    // Resetear estadísticas
    resetearEstadisticas: function() {
        document.getElementById('statVentasTotal').textContent = '$0';
        document.getElementById('statProveedores').textContent = '0';
        document.getElementById('statClientes').textContent = '0';
        document.getElementById('statMargen').textContent = '0%';
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    ProductCatalog.init();
});