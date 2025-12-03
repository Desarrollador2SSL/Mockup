/**
 * ssl-cuadro-comparativo.js
 * JavaScript específico para la página de Listado de Cuadros Comparativos
 */

const SSLCuadroComparativo = (function() {
    
    // Datos de ejemplo para la tabla
    const comparativosData = [
        {
            id: 1,
            solicitudPedido: 'SOLPED-2025-0847',
            fecha: '25/05/2025',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'EDIFICIO PACIFIC BLUE',
            numSolicitudes: 3,
            numProveedores: 8,
            cotizacionesRecibidas: 7,
            cotizacionesEsperadas: 8,
            estado: 'pending',
            montoTotal: 15750000,
            solicitudesCotizacion: [
                {
                    codigo: 'SOL-COT-2025-1234',
                    descripcion: 'Materiales Eléctricos',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'complete'
                },
                {
                    codigo: 'SOL-COT-2025-1235',
                    descripcion: 'Materiales Hidráulicos',
                    proveedores: 3,
                    cotizaciones: '2/3',
                    estado: 'incomplete'
                },
                {
                    codigo: 'SOL-COT-2025-1236',
                    descripcion: 'Ferretería General',
                    proveedores: 2,
                    cotizaciones: '2/2',
                    estado: 'complete'
                }
            ]
        },
        {
            id: 2,
            solicitudPedido: 'SOLPED-2025-0848',
            fecha: '24/05/2025',
            cliente: 'INMOBILIARIA INGEVEC',
            obra: 'CONDOMINIO VISTA MAR',
            numSolicitudes: 2,
            numProveedores: 5,
            cotizacionesRecibidas: 5,
            cotizacionesEsperadas: 5,
            estado: 'review',
            montoTotal: 8320000,
            solicitudesCotizacion: [
                {
                    codigo: 'SOL-COT-2025-1237',
                    descripcion: 'Cerámicos y Porcelanatos',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'complete'
                },
                {
                    codigo: 'SOL-COT-2025-1238',
                    descripcion: 'Pinturas y Revestimientos',
                    proveedores: 2,
                    cotizaciones: '2/2',
                    estado: 'complete'
                }
            ]
        },
        {
            id: 3,
            solicitudPedido: 'SOLPED-2025-0849',
            fecha: '24/05/2025',
            cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
            obra: 'EDIFICIO CENTRAL PARK',
            numSolicitudes: 1,
            numProveedores: 4,
            cotizacionesRecibidas: 3,
            cotizacionesEsperadas: 4,
            estado: 'incomplete',
            montoTotal: 12450000,
            solicitudesCotizacion: [
                {
                    codigo: 'SOL-COT-2025-1239',
                    descripcion: 'Estructuras Metálicas',
                    proveedores: 4,
                    cotizaciones: '3/4',
                    estado: 'incomplete'
                }
            ]
        },
        {
            id: 4,
            solicitudPedido: 'SOLPED-2025-0850',
            fecha: '23/05/2025',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'TORRE ALMAGRO',
            numSolicitudes: 4,
            numProveedores: 12,
            cotizacionesRecibidas: 12,
            cotizacionesEsperadas: 12,
            estado: 'approved',
            montoTotal: 45780000,
            solicitudesCotizacion: [
                {
                    codigo: 'SOL-COT-2025-1240',
                    descripcion: 'Hormigón y Áridos',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'approved'
                },
                {
                    codigo: 'SOL-COT-2025-1241',
                    descripcion: 'Acero Estructural',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'approved'
                },
                {
                    codigo: 'SOL-COT-2025-1242',
                    descripcion: 'Maderas y Molduras',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'approved'
                },
                {
                    codigo: 'SOL-COT-2025-1243',
                    descripcion: 'Vidrios y Cristales',
                    proveedores: 3,
                    cotizaciones: '3/3',
                    estado: 'approved'
                }
            ]
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredData = [...comparativosData];

    // Función de inicialización
    function init() {
        renderTable();
        renderPagination();
        initEventListeners();
        updateStats();
    }

    // Renderizar tabla
    function renderTable() {
        const tbody = document.getElementById('comparatives-tbody');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = pageData.map(item => {
            const progressPercent = (item.cotizacionesRecibidas / item.cotizacionesEsperadas * 100).toFixed(1);
            const statusBadge = getStatusBadge(item.estado);
            const actionButtons = getActionButtons(item.estado);

            return `
                <tr class="expandable-row" onclick="SSLCuadroComparativo.toggleRow(this, ${item.id})">
                    <td><i class="fas fa-chevron-right expand-icon"></i></td>
                    <td>
                        <strong>${item.solicitudPedido}</strong>
                        <br>
                        <span class="date-info">${item.fecha}</span>
                    </td>
                    <td>
                        <span class="client-info">${item.cliente}</span>
                        <br>
                        <span>${item.obra}</span>
                    </td>
                    <td>
                        <strong>${item.numSolicitudes}</strong> Solicitudes
                        <span class="provider-count">
                            <i class="fas fa-building"></i> ${item.numProveedores} proveedores
                        </span>
                    </td>
                    <td>
                        <div class="quote-progress">
                            <span>${item.cotizacionesRecibidas}/${item.cotizacionesEsperadas}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <span>${progressPercent}%</span>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${statusBadge.class}">${statusBadge.text}</span>
                    </td>
                    <td class="amount-info">$${formatNumber(item.montoTotal)}</td>
                    <td>
                        <div class="action-buttons">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
                <tr class="sub-table" id="sub-table-${item.id}">
                    <td colspan="8">
                        <div class="sub-table-content">
                            <div class="sub-table-row">
                                <strong>Solicitudes de Cotización:</strong>
                            </div>
                            ${item.solicitudesCotizacion.map(sol => `
                                <div class="sub-table-row">
                                    <span>${sol.codigo} - ${sol.descripcion}</span>
                                    <span>${sol.proveedores} proveedores | ${sol.cotizaciones} cotizaciones</span>
                                    ${getSubTableButton(sol.estado, sol.codigo)}
                                </div>
                            `).join('')}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Obtener badge de estado
    function getStatusBadge(estado) {
        const badges = {
            pending: { class: 'status-pending', text: 'PENDIENTE' },
            review: { class: 'status-review', text: 'EN REVISIÓN' },
            approved: { class: 'status-approved', text: 'APROBADO' },
            incomplete: { class: 'status-incomplete', text: 'INCOMPLETO' }
        };
        return badges[estado] || { class: '', text: '' };
    }

    // Obtener botones de acción
    function getActionButtons(estado) {
        if (estado === 'approved') {
            return `
                <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); SSLCuadroComparativo.viewApproved()" title="Ver Aprobado">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); SSLCuadroComparativo.viewHistory()" title="Historial">
                    <i class="fas fa-history"></i>
                </button>
            `;
        } else {
            return `
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); SSLCuadroComparativo.reviewComparative()" title="Revisar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); SSLCuadroComparativo.viewHistory()" title="Historial">
                    <i class="fas fa-history"></i>
                </button>
            `;
        }
    }

    // Obtener botón de sub-tabla
    function getSubTableButton(estado, codigo) {
        if (estado === 'approved') {
            return '<button class="btn btn-success btn-sm">Aprobado</button>';
        } else {
            return `<button class="btn btn-info btn-sm" onclick="event.stopPropagation(); SSLCuadroComparativo.viewCuadro('${codigo}')">Ver Cuadro</button>`;
        }
    }

    // Toggle row
    function toggleRow(row, id) {
        const subTable = document.getElementById(`sub-table-${id}`);
        if (!subTable) return;

        const isVisible = subTable.style.display === 'table-row';
        
        // Cerrar todas las sub-tablas
        document.querySelectorAll('.sub-table').forEach(table => {
            table.style.display = 'none';
        });
        
        // Remover clase expanded de todas las filas
        document.querySelectorAll('.expandable-row').forEach(r => {
            r.classList.remove('expanded');
        });

        if (!isVisible) {
            subTable.style.display = 'table-row';
            row.classList.add('expanded');
        }
    }

    // Ver cuadro comparativo
    function viewCuadro(codigo) {
        window.location.href = `ssl_cuadro_comparativo_detalle.html?codigo=${codigo}`;
    }

    // Revisar comparativo
    function reviewComparative() {
        window.location.href = 'ssl_cuadro_comparativo_detalle.html';
    }

    // Ver aprobado
    function viewApproved() {
        showNotification('info', 'Visualizando cuadro comparativo aprobado');
    }

    // Ver historial
    function viewHistory() {
        showNotification('info', 'Mostrando historial del cuadro comparativo');
    }

    // Renderizar paginación
    function renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        let html = '';

        // Botón anterior
        html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(${currentPage - 1})" 
                        ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>`;

        // Páginas
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                                onclick="SSLCuadroComparativo.goToPage(${i})">${i}</button>`;
            }
        } else {
            // Lógica para mostrar elipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                                    onclick="SSLCuadroComparativo.goToPage(${i})">${i}</button>`;
                }
                html += '<span class="pagination-dots">...</span>';
                html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(${totalPages})">${totalPages}</button>`;
            } else if (currentPage >= totalPages - 2) {
                html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(1)">1</button>`;
                html += '<span class="pagination-dots">...</span>';
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                                    onclick="SSLCuadroComparativo.goToPage(${i})">${i}</button>`;
                }
            } else {
                html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(1)">1</button>`;
                html += '<span class="pagination-dots">...</span>';
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                                    onclick="SSLCuadroComparativo.goToPage(${i})">${i}</button>`;
                }
                html += '<span class="pagination-dots">...</span>';
                html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(${totalPages})">${totalPages}</button>`;
            }
        }

        // Botón siguiente
        html += `<button class="pagination-btn" onclick="SSLCuadroComparativo.goToPage(${currentPage + 1})" 
                        ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>`;

        pagination.innerHTML = html;
    }

    // Ir a página
    function goToPage(page) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        currentPage = page;
        renderTable();
        renderPagination();
        
        // Scroll to top de la tabla
        document.querySelector('.main-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Aplicar filtros
    function applyFilters() {
        const cliente = document.getElementById('filter-cliente').value;
        const estado = document.getElementById('filter-estado').value;
        const fecha = document.getElementById('filter-fecha').value;
        const buscar = document.getElementById('filter-buscar').value.toLowerCase();

        filteredData = comparativosData.filter(item => {
            let match = true;

            if (cliente && !item.cliente.includes(cliente)) match = false;
            if (estado && item.estado !== estado) match = false;
            if (fecha && item.fecha !== formatDate(fecha)) match = false;
            if (buscar && !item.solicitudPedido.toLowerCase().includes(buscar)) match = false;

            return match;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
        updateStats();

        if (filteredData.length === 0) {
            showEmptyState();
        } else {
            showNotification('success', `Se encontraron ${filteredData.length} resultados`);
        }
    }

    // Limpiar filtros
    function clearFilters() {
        document.getElementById('filter-cliente').value = '';
        document.getElementById('filter-estado').value = '';
        document.getElementById('filter-fecha').value = '';
        document.getElementById('filter-buscar').value = '';

        filteredData = [...comparativosData];
        currentPage = 1;
        renderTable();
        renderPagination();
        updateStats();
        
        showNotification('info', 'Filtros limpiados');
    }

    // Actualizar estadísticas
    function updateStats() {
        const stats = {
            pending: filteredData.filter(item => item.estado === 'pending').length,
            review: filteredData.filter(item => item.estado === 'review').length,
            approved: filteredData.filter(item => item.estado === 'approved').length,
            incomplete: filteredData.filter(item => item.estado === 'incomplete').length
        };

        // Actualizar números en las tarjetas
        const cards = document.querySelectorAll('.stat-number');
        if (cards.length >= 4) {
            cards[0].textContent = stats.pending + stats.review;
            cards[1].textContent = stats.review;
            cards[2].textContent = stats.approved;
            cards[3].textContent = stats.incomplete;
        }
    }

    // Exportar datos
    function exportData() {
        showNotification('info', 'Preparando exportación de datos...');
        
        // Simular descarga
        setTimeout(() => {
            const dataStr = JSON.stringify(filteredData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `cuadros_comparativos_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('success', 'Datos exportados exitosamente');
        }, 1000);
    }

    // Mostrar estado vacío
    function showEmptyState() {
        const tbody = document.getElementById('comparatives-tbody');
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta ajustar los filtros de búsqueda</p>
                        <button class="btn btn-primary" onclick="SSLCuadroComparativo.clearFilters()">
                            Limpiar Filtros
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // Formatear número
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Formatear fecha
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Sistema de notificaciones
    function showNotification(type, message) {
        // Remover notificación existente si la hay
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // Agregar al body
        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Obtener icono para notificación
    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // Inicializar event listeners
    function initEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+F: Enfocar búsqueda
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('filter-buscar').focus();
            }
            
            // Escape: Limpiar filtros
            if (e.key === 'Escape') {
                clearFilters();
            }
        });

        // Auto-actualización de estadísticas cada 30 segundos
        setInterval(updateStats, 30000);
    }

    // Exportar funciones públicas
    return {
        init,
        toggleRow,
        viewCuadro,
        reviewComparative,
        viewApproved,
        viewHistory,
        goToPage,
        applyFilters,
        clearFilters,
        exportData
    };
})();

// Estilos CSS para las notificaciones (agregar al documento)
const notificationStyles = `
<style>
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: auto;
    color: #666;
    padding: 0 0 0 10px;
}

.notification-close:hover {
    color: #333;
}

.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification-success i:first-child {
    color: var(--success-color);
}

.notification-error {
    border-left: 4px solid var(--accent-color);
}

.notification-error i:first-child {
    color: var(--accent-color);
}

.notification-warning {
    border-left: 4px solid var(--warning-color);
}

.notification-warning i:first-child {
    color: var(--warning-color);
}

.notification-info {
    border-left: 4px solid var(--info-color);
}

.notification-info i:first-child {
    color: var(--info-color);
}
</style>
`;

// Agregar estilos al documento cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'notification-styles';
        styleElement.innerHTML = notificationStyles;
        document.head.appendChild(styleElement.firstElementChild);
    }
});