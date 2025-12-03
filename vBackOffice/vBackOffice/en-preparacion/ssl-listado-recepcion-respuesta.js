/**
 * ssl_listado_recepcion_respuesta.js
 * Funcionalidad específica para la página de Recepción de Respuestas / Cotizaciones
 */

// Namespace para funciones de la página
const RecepcionRespuesta = {
    // Datos de ejemplo
    cotizacionesData: [
        {
            nroSolicitud: 'SC-2025-0042',
            proveedor: 'ELECTROCOM LTDA.',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'EDIFICIO PACIFIC BLUE',
            nroCotizacion: 'ELC-2025-0156',
            fechaRecepcion: '18/05/2025',
            fechaVencimiento: '01/06/2025',
            monto: '$742,500',
            items: 3,
            estado: 'recibida'
        },
        {
            nroSolicitud: 'SC-2025-0041',
            proveedor: 'IMPORTADORA TÉCNICA S.A.',
            cliente: 'INMOBILIARIA INGEVEC',
            obra: 'CONDOMINIO VISTA MAR',
            nroCotizacion: 'IT-2025-3421',
            fechaRecepcion: '17/05/2025',
            fechaVencimiento: '30/05/2025',
            monto: '$1,250,000',
            items: 5,
            estado: 'revisada'
        },
        {
            nroSolicitud: 'SC-2025-0040',
            proveedor: 'DISTRIBUIDORA ELÉCTRICA NACIONAL',
            cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
            obra: 'EDIFICIO CENTRAL PARK',
            nroCotizacion: 'DEN-2025-7890',
            fechaRecepcion: '16/05/2025',
            fechaVencimiento: '28/05/2025',
            monto: '$980,500',
            items: 4,
            estado: 'recibida'
        },
        {
            nroSolicitud: 'SC-2025-0039',
            proveedor: 'CABLES Y CONDUCTORES SpA',
            cliente: 'CONSTRUCTORA SOCOVESA',
            obra: 'PROYECTO LAS CONDES',
            nroCotizacion: 'CC-2025-1122',
            fechaRecepcion: '15/05/2025',
            fechaVencimiento: '25/05/2025',
            monto: '$1,850,000',
            items: 6,
            estado: 'vencida'
        },
        {
            nroSolicitud: 'SC-2025-0038',
            proveedor: 'MATERIALES CONSTRUCCIÓN S.A.',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'EDIFICIO PACIFIC BLUE',
            nroCotizacion: 'MC-2025-5566',
            fechaRecepcion: '14/05/2025',
            fechaVencimiento: '29/05/2025',
            monto: '$2,100,000',
            items: 8,
            estado: 'recibida'
        },
        {
            nroSolicitud: 'SC-2025-0037',
            proveedor: 'ELECTROCOM LTDA.',
            cliente: 'INMOBILIARIA INGEVEC',
            obra: 'CONDOMINIO VISTA MAR',
            nroCotizacion: '',
            fechaRecepcion: '',
            fechaVencimiento: '26/05/2025',
            monto: '-',
            items: 3,
            estado: 'pendiente'
        },
        {
            nroSolicitud: 'SC-2025-0036',
            proveedor: 'IMPORTADORA TÉCNICA S.A.',
            cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
            obra: 'EDIFICIO CENTRAL PARK',
            nroCotizacion: '',
            fechaRecepcion: '',
            fechaVencimiento: '27/05/2025',
            monto: '-',
            items: 7,
            estado: 'pendiente'
        },
        {
            nroSolicitud: 'SC-2025-0035',
            proveedor: 'DISTRIBUIDORA ELÉCTRICA NACIONAL',
            cliente: 'CONSTRUCTORA SOCOVESA',
            obra: 'PROYECTO LAS CONDES',
            nroCotizacion: 'DEN-2025-7891',
            fechaRecepcion: '13/05/2025',
            fechaVencimiento: '31/05/2025',
            monto: '$1,420,750',
            items: 5,
            estado: 'revisada'
        }
    ],

    // Inicialización
    init() {
        this.loadTable();
        this.setupEventListeners();
        this.setupDefaultDates();
    },

    // Cargar tabla con datos
    loadTable() {
        const tbody = document.getElementById('cotizaciones-tbody');
        tbody.innerHTML = '';
        
        this.cotizacionesData.forEach(cotizacion => {
            const row = this.createTableRow(cotizacion);
            tbody.appendChild(row);
        });
    },

    // Crear una fila de la tabla
    createTableRow(cotizacion) {
        const tr = document.createElement('tr');
        const hasData = cotizacion.estado !== 'pendiente';
        
        // Agregar evento click si tiene datos
        if (hasData) {
            tr.onclick = () => this.viewCotizacion(cotizacion.nroSolicitud, cotizacion.proveedor, cotizacion.nroCotizacion);
        }
        
        tr.innerHTML = `
            <td><strong>${cotizacion.nroSolicitud}</strong></td>
            <td class="proveedor-cell">${cotizacion.proveedor}</td>
            <td>${cotizacion.cliente}</td>
            <td>${cotizacion.obra}</td>
            <td>${cotizacion.nroCotizacion || '-'}</td>
            <td class="fecha-cell">${cotizacion.fechaRecepcion || '-'}</td>
            <td class="fecha-cell">${cotizacion.fechaVencimiento}</td>
            <td class="monto-cell">${cotizacion.monto}</td>
            <td class="center-text">${cotizacion.items}</td>
            <td>${this.getStatusBadge(cotizacion.estado)}</td>
            <td>${this.getActionButtons(cotizacion)}</td>
        `;
        
        return tr;
    },

    // Obtener badge de estado
    getStatusBadge(estado) {
        const estados = {
            'pendiente': 'PENDIENTE',
            'recibida': 'RECIBIDA',
            'revisada': 'REVISADA',
            'vencida': 'VENCIDA'
        };
        
        return `<span class="status-badge status-${estado}">${estados[estado]}</span>`;
    },

    // Obtener botones de acción
    getActionButtons(cotizacion) {
        const isPendiente = cotizacion.estado === 'pendiente';
        const isVencida = cotizacion.estado === 'vencida';
        
        return `
            <div class="action-buttons">
                <button class="btn btn-info btn-sm" 
                    onclick="event.stopPropagation(); RecepcionRespuesta.viewCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}', '${cotizacion.nroCotizacion}')"
                    ${isPendiente ? 'disabled' : ''}>
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" 
                    onclick="event.stopPropagation(); ${isPendiente ? 
                        `RecepcionRespuesta.sendReminder('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}')` : 
                        `RecepcionRespuesta.editCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}', '${cotizacion.nroCotizacion}')`}">
                    <i class="fas fa-${isPendiente ? 'bell' : 'edit'}"></i>
                </button>
                <button class="btn btn-success btn-sm" 
                    onclick="event.stopPropagation(); RecepcionRespuesta.approveCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}')"
                    ${isPendiente || isVencida ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;
    },

    // Configurar event listeners
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('nro-solicitud').focus();
            }
            
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.nuevaCotizacion();
            }
        });
    },

    // Configurar fechas por defecto
    setupDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fecha-hasta').value = today;
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        document.getElementById('fecha-desde').value = oneMonthAgo.toISOString().split('T')[0];
    },

    // Nueva cotización
    nuevaCotizacion() {
        window.location.href = 'ssl_crear_solicitud_cotizacion.html?mode=new';
    },

    // Ver cotización
    viewCotizacion(nroSolicitud, proveedor, nroCotizacion) {
        if (!nroCotizacion) return;
        window.location.href = `ssl_crear_solicitud_cotizacion.html?mode=view&solicitud=${nroSolicitud}&proveedor=${encodeURIComponent(proveedor)}&cotizacion=${nroCotizacion}`;
    },

    // Editar cotización
    editCotizacion(nroSolicitud, proveedor, nroCotizacion) {
        window.location.href = `ssl_crear_solicitud_cotizacion.html?mode=edit&solicitud=${nroSolicitud}&proveedor=${encodeURIComponent(proveedor)}&cotizacion=${nroCotizacion}`;
    },

    // Buscar cotizaciones
    searchCotizaciones() {
        const filters = {
            nroSolicitud: document.getElementById('nro-solicitud').value,
            proveedor: document.getElementById('proveedor').value,
            cliente: document.getElementById('cliente').value,
            estado: document.getElementById('estado').value,
            fechaDesde: document.getElementById('fecha-desde').value,
            fechaHasta: document.getElementById('fecha-hasta').value
        };
        
        console.log('Búsqueda con filtros:', filters);
        
        // Aquí se implementaría la lógica de filtrado real
        // Por ahora solo mostramos un mensaje
        alert('Búsqueda realizada. En una implementación real, esto actualizaría la tabla con los resultados filtrados.');
    },

    // Limpiar filtros
    clearFilters() {
        document.getElementById('nro-solicitud').value = '';
        document.getElementById('proveedor').value = '';
        document.getElementById('cliente').value = '';
        document.getElementById('estado').value = '';
        document.getElementById('fecha-desde').value = '';
        document.getElementById('fecha-hasta').value = '';
        
        // Recargar tabla con todos los datos
        this.loadTable();
    },

    // Aprobar cotización
    approveCotizacion(nroSolicitud, proveedor) {
        if (confirm(`¿Está seguro de aprobar la cotización ${nroSolicitud} de ${proveedor}?`)) {
            // Aquí se implementaría la lógica de aprobación
            alert(`Cotización ${nroSolicitud} de ${proveedor} aprobada exitosamente.`);
            
            // Actualizar el estado en los datos locales
            const cotizacion = this.cotizacionesData.find(c => 
                c.nroSolicitud === nroSolicitud && c.proveedor === proveedor
            );
            
            if (cotizacion) {
                cotizacion.estado = 'revisada';
                this.loadTable();
            }
        }
    },

    // Enviar recordatorio
    sendReminder(nroSolicitud, proveedor) {
        if (confirm(`¿Enviar recordatorio a ${proveedor} para la solicitud ${nroSolicitud}?`)) {
            // Aquí se implementaría la lógica de envío de recordatorio
            alert(`Recordatorio enviado a ${proveedor} exitosamente.`);
            
            // Simular actualización de fecha de recordatorio
            console.log(`Recordatorio enviado: ${new Date().toLocaleString()}`);
        }
    }
};

// Exportar para uso global
window.RecepcionRespuesta = RecepcionRespuesta;