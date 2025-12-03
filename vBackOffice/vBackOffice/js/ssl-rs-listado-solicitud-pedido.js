/**
 * JavaScript específico para el Listado de Solicitudes de Pedido
 * SSL v4.0
 */

// Variables globales
let vistaActual = 'tabla';
let paginaActual = 1;
let itemsPorPagina = 10;
let solicitudesData = [];
let solicitudesFiltradas = [];

// Datos de ejemplo
const solicitudesEjemplo = [
    {
        numero: 'SOL-2025-0001',
        version: '1',
        clienteId: '76123456-K',
        cliente: 'CONSTRUCTORA ALMAGRO S.A.',
        obraId: '1',
        obra: 'EDIFICIO PACIFIC BLUE',
        docReferencia: 'SOLPED-2025-001',
        subclasificacion: 'PEP',
        fechaRecepcion: '2025-05-20',
        monto: 1250000,
        estado: 'cotizada',
        fechaEstado: '2025-05-22'
    },
    {
        numero: 'SOL-2025-0002',
        version: '2',
        clienteId: '76234567-8',
        cliente: 'INMOBILIARIA INGEVEC',
        obraId: '3',
        obra: 'CONDOMINIO VISTA MAR',
        docReferencia: 'SOLPED-2025-002',
        subclasificacion: 'CC',
        fechaRecepcion: '2025-05-21',
        monto: 2850000,
        estado: 'aprobada',
        fechaEstado: '2025-05-23'
    },
    {
        numero: 'SOL-2025-0003',
        version: '1',
        clienteId: '76345678-9',
        cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
        obraId: '5',
        obra: 'EDIFICIO CENTRAL PARK',
        docReferencia: 'SOLPED-2025-003',
        subclasificacion: null,
        fechaRecepcion: '2025-05-22',
        monto: 980500,
        estado: 'cotizando',
        fechaEstado: '2025-05-22'
    },
    {
        numero: 'SOL-2025-0004',
        version: '1',
        clienteId: '76456789-0',
        cliente: 'CONSTRUCTORA SOCOVESA',
        obraId: '6',
        obra: 'PROYECTO LAS CONDES',
        docReferencia: 'SOLPED-2025-004',
        subclasificacion: 'CO',
        fechaRecepcion: '2025-05-23',
        monto: 3450000,
        estado: 'nuevo',
        fechaEstado: '2025-05-23'
    },
    {
        numero: 'SOL-2025-0005',
        version: '3',
        clienteId: '76123456-K',
        cliente: 'CONSTRUCTORA ALMAGRO S.A.',
        obraId: '2',
        obra: 'TORRE ALMAGRO',
        docReferencia: 'SOLPED-2025-005',
        subclasificacion: 'PEP',
        fechaRecepcion: '2025-05-24',
        monto: 5670000,
        estado: 'oc-generada',
        fechaEstado: '2025-05-26'
    }
];

// Inicialización de la página
function initializePage() {
    // Cargar datos
    solicitudesData = [...solicitudesEjemplo];
    solicitudesFiltradas = [...solicitudesData];
    
    // Cargar datos en la tabla
    cargarDatos();
    
    // Eventos de filtros
    document.getElementById('filterCliente').addEventListener('change', cargarObrasPorCliente);
    
    // Set fecha por defecto
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    document.getElementById('filterFechaDesde').value = hace30Dias.toISOString().split('T')[0];
}

// Cargar obras por cliente
function cargarObrasPorCliente() {
    const clienteId = document.getElementById('filterCliente').value;
    const obraSelect = document.getElementById('filterObra');
    
    obraSelect.innerHTML = '<option value="">Todas las obras</option>';
    
    if (!clienteId) return;
    
    // Simulación de obras por cliente
    const obrasPorCliente = {
        '76123456-K': [
            { id: '1', nombre: 'EDIFICIO PACIFIC BLUE' },
            { id: '2', nombre: 'TORRE ALMAGRO' }
        ],
        '76234567-8': [
            { id: '3', nombre: 'CONDOMINIO VISTA MAR' },
            { id: '4', nombre: 'EDIFICIO PARK TOWER' }
        ],
        '76345678-9': [
            { id: '5', nombre: 'EDIFICIO CENTRAL PARK' }
        ],
        '76456789-0': [
            { id: '6', nombre: 'PROYECTO LAS CONDES' }
        ]
    };
    
    if (obrasPorCliente[clienteId]) {
        obrasPorCliente[clienteId].forEach(obra => {
            const option = document.createElement('option');
            option.value = obra.id;
            option.textContent = obra.nombre;
            obraSelect.appendChild(option);
        });
    }
}

// Cambiar vista
function cambiarVista(vista) {
    vistaActual = vista;
    
    // Actualizar botones
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('button').classList.add('active');
    
    // Mostrar/ocultar vistas
    if (vista === 'tabla') {
        document.getElementById('tablaView').style.display = 'block';
        document.getElementById('tarjetasView').style.display = 'none';
    } else {
        document.getElementById('tablaView').style.display = 'none';
        document.getElementById('tarjetasView').style.display = 'grid';
    }
    
    cargarDatos();
}

// Cargar datos según la vista actual
function cargarDatos() {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const datosPagina = solicitudesFiltradas.slice(inicio, fin);
    
    if (solicitudesFiltradas.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('tablaView').style.display = 'none';
        document.getElementById('tarjetasView').style.display = 'none';
        document.getElementById('paginacion').style.display = 'none';
        return;
    } else {
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('paginacion').style.display = 'flex';
    }
    
    if (vistaActual === 'tabla') {
        cargarTabla(datosPagina);
    } else {
        cargarTarjetas(datosPagina);
    }
    
    actualizarPaginacion();
}

// Cargar tabla
function cargarTabla(datos) {
    const tbody = document.getElementById('tablaSolicitudes');
    tbody.innerHTML = '';
    
    datos.forEach(solicitud => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${solicitud.numero}</strong></td>
            <td>${solicitud.version}</td>
            <td>${solicitud.cliente}</td>
            <td>${solicitud.obra}</td>
            <td>${solicitud.docReferencia}${solicitud.subclasificacion ? ' - ' + solicitud.subclasificacion : ''}</td>
            <td>${formatearFecha(solicitud.fechaRecepcion)}</td>
            <td>$${formatearMonto(solicitud.monto)}</td>
            <td>${getEstadoBadge(solicitud.estado)}</td>
            <td>${formatearFecha(solicitud.fechaEstado)}</td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-icon btn-primary" onclick="verSolicitud('${solicitud.numero}')" title="Ver">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline" onclick="editarSolicitud('${solicitud.numero}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-success" onclick="nuevaVersion('${solicitud.numero}')" title="Nueva versión">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Cargar tarjetas
function cargarTarjetas(datos) {
    const container = document.getElementById('tarjetasView');
    container.innerHTML = '';
    
    datos.forEach(solicitud => {
        const card = document.createElement('div');
        card.className = 'solicitud-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-number">${solicitud.numero}</div>
                    <div class="card-version">Versión ${solicitud.version}</div>
                </div>
                ${getEstadoBadge(solicitud.estado)}
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-field-label">Cliente:</span>
                    <span class="card-field-value">${solicitud.cliente}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Obra:</span>
                    <span class="card-field-value">${solicitud.obra}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Doc. Referencia:</span>
                    <span class="card-field-value">${solicitud.docReferencia}${solicitud.subclasificacion ? ' - ' + solicitud.subclasificacion : ''}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Fecha Recepción:</span>
                    <span class="card-field-value">${formatearFecha(solicitud.fechaRecepcion)}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Monto:</span>
                    <span class="card-field-value" style="color: var(--success-color); font-weight: 600;">$${formatearMonto(solicitud.monto)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-primary" onclick="verSolicitud('${solicitud.numero}')">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn btn-sm btn-outline" onclick="editarSolicitud('${solicitud.numero}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-success" onclick="nuevaVersion('${solicitud.numero}')">
                    <i class="fas fa-copy"></i> Nueva versión
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Obtener badge de estado
function getEstadoBadge(estado) {
    const estados = {
        'nuevo': { class: 'status-nuevo', text: 'Nuevo' },
        'cotizando': { class: 'status-cotizando', text: 'Cotizando' },
        'cotizada': { class: 'status-cotizada', text: 'Cotizada' },
        'aprobada': { class: 'status-aprobada', text: 'Aprobada' },
        'rechazada': { class: 'status-rechazada', text: 'Rechazada' },
        'oc-generada': { class: 'status-oc-generada', text: 'OC Generada' }
    };
    
    const estadoInfo = estados[estado] || { class: '', text: estado };
    return `<span class="status-badge ${estadoInfo.class}">${estadoInfo.text}</span>`;
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL');
}

// Formatear monto
function formatearMonto(monto) {
    return monto.toLocaleString('es-CL');
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(solicitudesFiltradas.length / itemsPorPagina);
    document.getElementById('paginaActual').textContent = paginaActual;
    document.getElementById('totalPaginas').textContent = totalPaginas;
    
    // Habilitar/deshabilitar botones
    const botones = document.querySelectorAll('.pagination button');
    botones[0].disabled = paginaActual === 1;
    botones[1].disabled = paginaActual === 1;
    botones[2].disabled = paginaActual === totalPaginas;
    botones[3].disabled = paginaActual === totalPaginas;
}

// Cambiar página
function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(solicitudesFiltradas.length / itemsPorPagina);
    
    switch(direccion) {
        case 'primera':
            paginaActual = 1;
            break;
        case 'anterior':
            if (paginaActual > 1) paginaActual--;
            break;
        case 'siguiente':
            if (paginaActual < totalPaginas) paginaActual++;
            break;
        case 'ultima':
            paginaActual = totalPaginas;
            break;
    }
    
    cargarDatos();
}

// Aplicar filtros
function aplicarFiltros() {
    const docRef = document.getElementById('filterDocRef').value.toLowerCase();
    const cliente = document.getElementById('filterCliente').value;
    const obra = document.getElementById('filterObra').value;
    const estado = document.getElementById('filterEstado').value;
    const fechaDesde = document.getElementById('filterFechaDesde').value;
    
    solicitudesFiltradas = solicitudesData.filter(solicitud => {
        let cumpleFiltros = true;
        
        if (docRef && !solicitud.docReferencia.toLowerCase().includes(docRef)) {
            cumpleFiltros = false;
        }
        
        if (cliente && solicitud.clienteId !== cliente) {
            cumpleFiltros = false;
        }
        
        if (obra && solicitud.obraId !== obra) {
            cumpleFiltros = false;
        }
        
        if (estado && solicitud.estado !== estado) {
            cumpleFiltros = false;
        }
        
        if (fechaDesde && new Date(solicitud.fechaRecepcion) < new Date(fechaDesde)) {
            cumpleFiltros = false;
        }
        
        return cumpleFiltros;
    });
    
    paginaActual = 1;
    cargarDatos();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filterDocRef').value = '';
    document.getElementById('filterCliente').value = '';
    document.getElementById('filterObra').value = '';
    document.getElementById('filterEstado').value = '';
    
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    document.getElementById('filterFechaDesde').value = hace30Dias.toISOString().split('T')[0];
    
    solicitudesFiltradas = [...solicitudesData];
    paginaActual = 1;
    cargarDatos();
}

// Exportar datos
function exportarDatos() {
    alert('Exportando datos a Excel...\nEsta funcionalidad se implementará próximamente.');
}

// Nueva solicitud
function nuevaSolicitud() {
    window.location.href = 'ssl_rs_detalle_solicitud_pedido.html';
}

// Ver solicitud
function verSolicitud(numero) {
    window.location.href = `ssl_rs_detalle_solicitud_pedido.html?modo=ver&numero=${numero}`;
}

// Editar solicitud
function editarSolicitud(numero) {
    window.location.href = `ssl_rs_detalle_solicitud_pedido.html?modo=editar&numero=${numero}`;
}

// Nueva versión
function nuevaVersion(numero) {
    if (confirm(`¿Está seguro de crear una nueva versión de la solicitud ${numero}?`)) {
        window.location.href = `ssl_rs_detalle_solicitud_pedido.html?modo=nueva-version&numero=${numero}`;
    }
}
// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});
