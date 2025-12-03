// js/ssl-listado-solicitudes-cotizar.js - Lógica específica para Listado de Solicitudes para Cotizar

// Variables globales
let currentView = 'table';
let currentPage = 1;
let totalPages = 1;
let solicitudesData = [];

// Datos de ejemplo para simular solicitudes
const datosSolicitudes = [
    {
        numero: 'SOL-2025-0001',
        version: 1,
        cliente: 'CONSTRUCTORA ALMAGRO S.A.',
        obra: 'EDIFICIO PACIFIC BLUE',
        docReferencia: 'SOLPED-2025-001',
        fechaRecepcion: '15/05/2025',
        solEnviadas: 2,
        solRecibidas: 1,
        montoReferencial: 15750000,
        estado: 'parcial',
        estadoTexto: 'Cotización Parcial',
        fechaEstado: '20/05/2025'
    },
    {
        numero: 'SOL-2025-0002',
        version: 1,
        cliente: 'INMOBILIARIA INGEVEC',
        obra: 'CONDOMINIO VISTA MAR',
        docReferencia: 'SOLPED-2025-002',
        fechaRecepcion: '16/05/2025',
        solEnviadas: 0,
        solRecibidas: 0,
        montoReferencial: 8320000,
        estado: 'pendiente',
        estadoTexto: 'Pendiente de Cotización',
        fechaEstado: '16/05/2025'
    },
    {
        numero: 'SOL-2025-0003',
        version: 2,
        cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
        obra: 'EDIFICIO CENTRAL PARK',
        docReferencia: 'SOLPED-2025-003',
        fechaRecepcion: '17/05/2025',
        solEnviadas: 3,
        solRecibidas: 3,
        montoReferencial: 22450000,
        estado: 'completa',
        estadoTexto: 'Cotización Completa',
        fechaEstado: '22/05/2025'
    },
    {
        numero: 'SOL-2025-0004',
        version: 1,
        cliente: 'CONSTRUCTORA SOCOVESA',
        obra: 'PROYECTO LAS CONDES',
        docReferencia: 'SOLPED-2025-004',
        fechaRecepcion: '18/05/2025',
        solEnviadas: 1,
        solRecibidas: 1,
        montoReferencial: 12890000,
        estado: 'completa',
        estadoTexto: 'Cotización Completa',
        fechaEstado: '23/05/2025'
    },
    {
        numero: 'SOL-2025-0005',
        version: 3,
        cliente: 'CONSTRUCTORA ALMAGRO S.A.',
        obra: 'TORRE ALMAGRO',
        docReferencia: 'SOLPED-2025-005',
        fechaRecepcion: '19/05/2025',
        solEnviadas: 2,
        solRecibidas: 0,
        montoReferencial: 18500000,
        estado: 'pendiente',
        estadoTexto: 'Pendiente de Cotización',
        fechaEstado: '19/05/2025'
    },
    {
        numero: 'SOL-2025-0006',
        version: 1,
        cliente: 'INMOBILIARIA INGEVEC',
        obra: 'EDIFICIO PARK TOWER',
        docReferencia: 'SOLPED-2025-006',
        fechaRecepcion: '20/05/2025',
        solEnviadas: 4,
        solRecibidas: 2,
        montoReferencial: 25670000,
        estado: 'parcial',
        estadoTexto: 'Cotización Parcial',
        fechaEstado: '24/05/2025'
    },
    {
        numero: 'SOL-2025-0007',
        version: 1,
        cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
        obra: 'EDIFICIO CENTRAL PARK',
        docReferencia: 'SOLPED-2025-007',
        fechaRecepcion: '21/05/2025',
        solEnviadas: 0,
        solRecibidas: 0,
        montoReferencial: 9450000,
        estado: 'anulada',
        estadoTexto: 'Anulada',
        fechaEstado: '22/05/2025'
    },
    {
        numero: 'SOL-2025-0008',
        version: 2,
        cliente: 'CONSTRUCTORA SOCOVESA',
        obra: 'PROYECTO LAS CONDES',
        docReferencia: 'SOLPED-2025-008',
        fechaRecepcion: '22/05/2025',
        solEnviadas: 3,
        solRecibidas: 3,
        montoReferencial: 31200000,
        estado: 'completa',
        estadoTexto: 'Cotización Completa',
        fechaEstado: '25/05/2025'
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha por defecto (30 días atrás)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    document.getElementById('fechaDesde').value = thirtyDaysAgo.toISOString().split('T')[0];
    
    // Cargar datos iniciales
    solicitudesData = [...datosSolicitudes];
    renderizarResultados();
    
    // Agregar eventos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// Switch View
function switchView(view) {
    currentView = view;
    
    // Update buttons
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show/hide views
    if (view === 'table') {
        document.getElementById('tableView').style.display = 'block';
        document.getElementById('cardView').style.display = 'none';
    } else {
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('cardView').style.display = 'grid';
    }
}

// Clear Filters
function limpiarFiltros() {
    document.getElementById('docReferencia').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('obra').value = '';
    document.getElementById('estado').value = '';
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    document.getElementById('fechaDesde').value = thirtyDaysAgo.toISOString().split('T')[0];
    
    buscarSolicitudes();
}

// Search
function buscarSolicitudes() {
    // Mostrar loading
    mostrarLoading(true);
    
    // Obtener valores de filtros
    const filtros = {
        docReferencia: document.getElementById('docReferencia').value.toLowerCase(),
        cliente: document.getElementById('cliente').value,
        obra: document.getElementById('obra').value,
        estado: document.getElementById('estado').value,
        fechaDesde: document.getElementById('fechaDesde').value
    };
    
    // Simular búsqueda con delay
    setTimeout(() => {
        // Filtrar datos
        let resultados = [...datosSolicitudes];
        
        if (filtros.docReferencia) {
            resultados = resultados.filter(s => 
                s.docReferencia.toLowerCase().includes(filtros.docReferencia)
            );
        }
        
        if (filtros.cliente) {
            resultados = resultados.filter(s => 
                s.cliente.includes(filtros.cliente.split('-')[0]) // Comparar por nombre parcial
            );
        }
        
        if (filtros.obra) {
            resultados = resultados.filter(s => 
                s.obra.includes(filtros.obra)
            );
        }
        
        if (filtros.estado) {
            resultados = resultados.filter(s => s.estado === filtros.estado);
        }
        
        if (filtros.fechaDesde) {
            // Convertir fecha string a Date para comparación
            const fechaFiltro = new Date(filtros.fechaDesde);
            resultados = resultados.filter(s => {
                const fechaSolicitud = convertirFechaStringADate(s.fechaRecepcion);
                return fechaSolicitud >= fechaFiltro;
            });
        }
        
        solicitudesData = resultados;
        renderizarResultados();
        mostrarLoading(false);
        
        // Actualizar contadores
        document.getElementById('resultCount').textContent = solicitudesData.length;
        document.getElementById('totalCount').textContent = datosSolicitudes.length;
        
    }, 500); // Simular delay de búsqueda
}

// Renderizar resultados
function renderizarResultados() {
    if (solicitudesData.length === 0) {
        mostrarEmptyState(true);
        return;
    }
    
    mostrarEmptyState(false);
    renderizarTabla();
    renderizarTarjetas();
}

// Renderizar tabla
function renderizarTabla() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    solicitudesData.forEach(solicitud => {
        const tr = document.createElement('tr');
        tr.onclick = () => verDetalleSolicitud(solicitud.numero);
        
        tr.innerHTML = `
            <td><strong>${solicitud.numero}</strong></td>
            <td><span class="card-version">V${solicitud.version}</span></td>
            <td>${solicitud.cliente}</td>
            <td>${solicitud.obra}</td>
            <td>${solicitud.docReferencia}</td>
            <td>${solicitud.fechaRecepcion}</td>
            <td>${solicitud.solEnviadas}</td>
            <td>${solicitud.solRecibidas}</td>
            <td>${formatearMonto(solicitud.montoReferencial)}</td>
            <td><span class="status-badge status-${solicitud.estado}">${solicitud.estadoTexto}</span></td>
            <td>${solicitud.fechaEstado}</td>
            <td onclick="event.stopPropagation()">
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm btn-icon" 
                            onclick="verDetalleSolicitud('${solicitud.numero}')" 
                            title="Ver detalle">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${solicitud.estado === 'pendiente' ? `
                        <button class="btn btn-success btn-sm btn-icon" 
                                onclick="generarCotizacion('${solicitud.numero}')" 
                                title="Generar cotización">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </button>
                    ` : ''}
                    ${solicitud.estado !== 'anulada' && solicitud.estado !== 'pendiente' ? `
                        <button class="btn btn-warning btn-sm btn-icon" 
                                onclick="agregarCotizacion('${solicitud.numero}')" 
                                title="Agregar cotización">
                            <i class="fas fa-plus"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Renderizar tarjetas
function renderizarTarjetas() {
    const cardView = document.getElementById('cardView');
    cardView.innerHTML = '';
    
    solicitudesData.forEach(solicitud => {
        const card = document.createElement('div');
        card.className = 'solicitud-card';
        card.onclick = () => verDetalleSolicitud(solicitud.numero);
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${solicitud.numero}</div>
                    <div style="margin-top: 5px;">
                        <span class="card-version">Versión ${solicitud.version}</span>
                    </div>
                </div>
                <span class="status-badge status-${solicitud.estado}">${solicitud.estadoTexto}</span>
            </div>
            
            <div class="card-info">
                <div class="card-info-item">
                    <i class="fas fa-building"></i>
                    <span>${solicitud.cliente}</span>
                </div>
                <div class="card-info-item">
                    <i class="fas fa-hard-hat"></i>
                    <span>${solicitud.obra}</span>
                </div>
                <div class="card-info-item">
                    <i class="fas fa-file-alt"></i>
                    <span>${solicitud.docReferencia}</span>
                </div>
                <div class="card-info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Recepción: ${solicitud.fechaRecepcion}</span>
                </div>
            </div>
            
            <div class="card-stats">
                <div class="stat-item">
                    <div class="stat-value">${solicitud.solEnviadas}</div>
                    <div class="stat-label">Sol. Enviadas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${solicitud.solRecibidas}</div>
                    <div class="stat-label">Sol. Recibidas</div>
                </div>
            </div>
            
            <div class="card-footer">
                <div>
                    <strong>${formatearMonto(solicitud.montoReferencial)}</strong>
                    <div class="stat-label">Monto Referencial</div>
                </div>
                <button class="btn btn-primary btn-sm" 
                        onclick="event.stopPropagation(); verDetalleSolicitud('${solicitud.numero}')">
                    <i class="fas fa-eye"></i> Ver Detalle
                </button>
            </div>
        `;
        
        cardView.appendChild(card);
    });
}

// Ver detalle de solicitud
function verDetalleSolicitud(numeroSolicitud) {
    // Buscar la solicitud para obtener el correlativo
    const solicitud = solicitudesData.find(s => s.numero === numeroSolicitud);
    
    // Determinar el correlativo basado en el estado
    let correlativo = '001'; // Por defecto
    if (solicitud) {
        if (solicitud.estado === 'completa') {
            correlativo = '003';
        } else if (solicitud.estado === 'parcial') {
            correlativo = '002';
        }
    }
    
    // Navegar a la página de detalle con modo view
    window.location.href = `ssl_cp_crear_solicitud_cotizacion.html?mode=view&solicitud=${numeroSolicitud}&correlativo=${correlativo}`;
}

// Generar cotización (nueva)
function generarCotizacion(numeroSolicitud) {
    event.stopPropagation();
    
    if (confirm(`¿Desea generar una nueva cotización para la solicitud ${numeroSolicitud}?`)) {
        // Navegar a crear solicitud con modo new
        window.location.href = `ssl_cp_crear_solicitud_cotizacion.html?mode=new&solicitud=${numeroSolicitud}`;
    }
}

// Agregar cotización a una solicitud existente
function agregarCotizacion(numeroSolicitud) {
    event.stopPropagation();
    
    if (confirm(`¿Desea agregar una cotización a la solicitud ${numeroSolicitud}?`)) {
        // Navegar a crear solicitud con modo edit
        const solicitud = solicitudesData.find(s => s.numero === numeroSolicitud);
        let correlativo = '001';
        if (solicitud && solicitud.estado === 'completa') {
            correlativo = '003';
        }
        
        window.location.href = `ssl_cp_crear_solicitud_cotizacion.html?mode=edit&solicitud=${numeroSolicitud}&correlativo=${correlativo}`;
    }
}

// Mostrar/ocultar loading
function mostrarLoading(show) {
    const loading = document.getElementById('loading');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (show) {
        loading.style.display = 'block';
        tableView.style.opacity = '0.5';
        cardView.style.opacity = '0.5';
    } else {
        loading.style.display = 'none';
        tableView.style.opacity = '1';
        cardView.style.opacity = '1';
    }
}

// Mostrar/ocultar empty state
function mostrarEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    
    if (show) {
        emptyState.style.display = 'block';
        tableView.style.display = 'none';
        cardView.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        if (currentView === 'table') {
            tableView.style.display = 'block';
            cardView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            cardView.style.display = 'grid';
        }
    }
}

// Formatear monto en pesos chilenos
function formatearMonto(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(monto);
}

// Convertir fecha string DD/MM/YYYY a Date
function convertirFechaStringADate(fechaString) {
    const [dia, mes, año] = fechaString.split('/');
    return new Date(año, mes - 1, dia);
}

// Exportar datos
function exportarDatos(formato) {
    let contenido = '';
    let nombreArchivo = `solicitudes_cotizar_${new Date().toISOString().split('T')[0]}`;
    
    if (formato === 'excel') {
        // Simular exportación a Excel
        alert('Exportando a Excel...\nEsta funcionalidad estará disponible próximamente.');
    } else if (formato === 'pdf') {
        // Simular exportación a PDF
        alert('Exportando a PDF...\nEsta funcionalidad estará disponible próximamente.');
    } else if (formato === 'csv') {
        // Generar CSV
        contenido = generarCSV();
        descargarArchivo(contenido, `${nombreArchivo}.csv`, 'text/csv');
    }
}

// Generar CSV
function generarCSV() {
    const headers = [
        'Número', 'Versión', 'Cliente', 'Obra', 'Doc. Referencia',
        'Fecha Recepción', 'Sol. Enviadas', 'Sol. Recibidas',
        'Monto Referencial', 'Estado', 'Fecha Estado'
    ];
    
    let csv = headers.join(',') + '\n';
    
    solicitudesData.forEach(s => {
        const row = [
            s.numero,
            s.version,
            `"${s.cliente}"`,
            `"${s.obra}"`,
            s.docReferencia,
            s.fechaRecepcion,
            s.solEnviadas,
            s.solRecibidas,
            s.montoReferencial,
            s.estadoTexto,
            s.fechaEstado
        ];
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

// Descargar archivo
function descargarArchivo(contenido, nombreArchivo, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl + F para enfocar en búsqueda
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('docReferencia').focus();
    }
    
    // Ctrl + N para nueva solicitud
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        window.location.href = 'ssl_cp_crear_solicitud_cotizacion.html?mode=new';
    }
    
    // Alt + V para cambiar vista
    if (e.altKey && e.key === 'v') {
        e.preventDefault();
        const newView = currentView === 'table' ? 'card' : 'table';
        switchView(newView);
        
        // Actualizar botones
        document.querySelectorAll('.view-toggle button').forEach(btn => {
            btn.classList.remove('active');
            if ((newView === 'table' && btn.querySelector('.fa-list')) ||
                (newView === 'card' && btn.querySelector('.fa-th-large'))) {
                btn.classList.add('active');
            }
        });
    }
}

// Hacer funciones globales
window.switchView = switchView;
window.limpiarFiltros = limpiarFiltros;
window.buscarSolicitudes = buscarSolicitudes;
window.verDetalleSolicitud = verDetalleSolicitud;
window.generarCotizacion = generarCotizacion;
window.agregarCotizacion = agregarCotizacion;
window.exportarDatos = exportarDatos;