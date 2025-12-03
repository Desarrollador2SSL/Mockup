/**
 * ssl-recepcion-respuesta.js
 * JavaScript específico para la página de Recepción de Respuestas / Cotizaciones
 */

const SSLRecepcionRespuesta = (function() {
    
    // Datos de ejemplo para la tabla
    const cotizacionesData = [
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
            monto: '',
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
            monto: '',
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
    ];

    // Función para inicializar la página
    function init() {
        setDefaultDates();
        renderTable();
        initKeyboardShortcuts();
    }

    // Establecer fechas por defecto
    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fecha-hasta').value = today;
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        document.getElementById('fecha-desde').value = oneMonthAgo.toISOString().split('T')[0];
    }

    // Renderizar la tabla con los datos
    function renderTable() {
        const tbody = document.getElementById('cotizaciones-tbody');
        if (!tbody) return;

        tbody.innerHTML = cotizacionesData.map(cotizacion => {
            const statusClass = `status-${cotizacion.estado}`;
            const statusText = cotizacion.estado.toUpperCase();
            const isPendiente = cotizacion.estado === 'pendiente';
            const isVencida = cotizacion.estado === 'vencida';
            
            // Determinar qué botones mostrar según el estado
            let actionButtons = '';
            if (isPendiente) {
                actionButtons = `
                    <button class="btn btn-info btn-sm" disabled title="Ver Cotización">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" 
                            onclick="event.stopPropagation(); SSLRecepcionRespuesta.sendReminder('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}')"
                            title="Enviar Recordatorio">
                        <i class="fas fa-bell"></i>
                    </button>
                    <button class="btn btn-success btn-sm" disabled title="Aprobar Cotización">
                        <i class="fas fa-check"></i>
                    </button>
                `;
            } else {
                actionButtons = `
                    <button class="btn btn-info btn-sm" 
                            onclick="event.stopPropagation(); SSLRecepcionRespuesta.viewCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}', '${cotizacion.nroCotizacion}')"
                            title="Ver Cotización">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" 
                            onclick="event.stopPropagation(); SSLRecepcionRespuesta.editCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}', '${cotizacion.nroCotizacion}')"
                            title="Editar Cotización">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success btn-sm" 
                            ${isVencida ? 'disabled' : ''}
                            onclick="event.stopPropagation(); SSLRecepcionRespuesta.approveCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}')"
                            title="Aprobar Cotización">
                        <i class="fas fa-check"></i>
                    </button>
                `;
            }

            const rowClickHandler = !isPendiente ? 
                `onclick="SSLRecepcionRespuesta.viewCotizacion('${cotizacion.nroSolicitud}', '${cotizacion.proveedor}', '${cotizacion.nroCotizacion}')"` : '';

            return `
                <tr ${rowClickHandler}>
                    <td><strong>${cotizacion.nroSolicitud}</strong></td>
                    <td class="proveedor-cell">${cotizacion.proveedor}</td>
                    <td>${cotizacion.cliente}</td>
                    <td>${cotizacion.obra}</td>
                    <td>${cotizacion.nroCotizacion || '-'}</td>
                    <td class="fecha-cell">${cotizacion.fechaRecepcion || '-'}</td>
                    <td class="fecha-cell">${cotizacion.fechaVencimiento}</td>
                    <td class="monto-cell">${cotizacion.monto || '-'}</td>
                    <td class="center-text">${cotizacion.items}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Nueva función para nueva cotización
    function nuevaCotizacion() {
        window.location.href = 'ssl_recepcion_respuesta_detalle.html?mode=new';
    }

    // Ver cotización
    function viewCotizacion(nroSolicitud, proveedor, nroCotizacion) {
        window.location.href = `ssl_recepcion_respuesta_detalle.html?mode=view&solicitud=${nroSolicitud}&proveedor=${encodeURIComponent(proveedor)}&cotizacion=${nroCotizacion}`;
    }

    // Editar cotización
    function editCotizacion(nroSolicitud, proveedor, nroCotizacion) {
        window.location.href = `ssl_recepcion_respuesta_detalle.html?mode=edit&solicitud=${nroSolicitud}&proveedor=${encodeURIComponent(proveedor)}&cotizacion=${nroCotizacion}`;
    }

    // Aprobar cotización
    function approveCotizacion(nroSolicitud, proveedor) {
        if (confirm(`¿Está seguro de aprobar la cotización ${nroSolicitud} de ${proveedor}?`)) {
            // Simular aprobación
            showNotification('success', `Cotización ${nroSolicitud} de ${proveedor} aprobada exitosamente.`);
            
            // Actualizar el estado en los datos
            const index = cotizacionesData.findIndex(c => c.nroSolicitud === nroSolicitud);
            if (index !== -1) {
                cotizacionesData[index].estado = 'revisada';
                renderTable();
            }
        }
    }

    // Enviar recordatorio
    function sendReminder(nroSolicitud, proveedor) {
        if (confirm(`¿Enviar recordatorio a ${proveedor} para la solicitud ${nroSolicitud}?`)) {
            showNotification('info', `Recordatorio enviado a ${proveedor} exitosamente.`);
        }
    }

    // Función de búsqueda
    function searchCotizaciones() {
        const filters = {
            nroSolicitud: document.getElementById('nro-solicitud').value,
            proveedor: document.getElementById('proveedor').value,
            cliente: document.getElementById('cliente').value,
            estado: document.getElementById('estado').value,
            fechaDesde: document.getElementById('fecha-desde').value,
            fechaHasta: document.getElementById('fecha-hasta').value
        };
        
        console.log('Búsqueda con filtros:', filters);
        
        // Simular búsqueda agregando clase loading
        const resultsContainer = document.querySelector('.results-container');
        resultsContainer.classList.add('loading');
        
        setTimeout(() => {
            resultsContainer.classList.remove('loading');
            showNotification('success', 'Búsqueda completada. Se encontraron 8 resultados.');
        }, 1000);
    }

    // Limpiar filtros
    function clearFilters() {
        document.getElementById('nro-solicitud').value = '';
        document.getElementById('proveedor').value = '';
        document.getElementById('cliente').value = '';
        document.getElementById('estado').value = '';
        document.getElementById('fecha-desde').value = '';
        document.getElementById('fecha-hasta').value = '';
        setDefaultDates();
        
        showNotification('info', 'Filtros limpiados');
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

    // Atajos de teclado
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+F: Enfocar búsqueda
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('nro-solicitud').focus();
            }
            
            // Ctrl+N: Nueva cotización
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                nuevaCotizacion();
            }
            
            // Escape: Limpiar filtros
            if (e.key === 'Escape') {
                clearFilters();
            }
        });
    }

    // Exportar funciones públicas
    return {
        init,
        nuevaCotizacion,
        viewCotizacion,
        editCotizacion,
        approveCotizacion,
        sendReminder,
        searchCotizaciones,
        clearFilters
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