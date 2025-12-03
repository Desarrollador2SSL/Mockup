/**
 * ssl-oc-cliente.js
 * JavaScript específico para la página de OC Cliente
 */

const SSLOCCliente = (function() {
    
    // Datos de ejemplo para la tabla
    const ocData = [
        {
            id: 1,
            numeroOC: 'OC-2025-0123',
            fecha: '25/05/2025',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'EDIFICIO PACIFIC BLUE',
            cotizacionRef: 'COT-CLI-001-2025',
            monto: 2850000,
            origen: 'api',
            estado: 'pending',
            diferenciaMonto: 0,
            detalles: {
                items: [
                    {
                        codigo: 'SSL-001-2025',
                        descripcion: 'Cemento Portland tipo I - Saco 25kg',
                        cantCotizada: 150,
                        cantOC: 150,
                        precioCotizado: 5500,
                        precioOC: 5500,
                        estado: 'match'
                    },
                    {
                        codigo: 'SSL-002-2025',
                        descripcion: 'Fierro corrugado 12mm x 12m',
                        cantCotizada: 50,
                        cantOC: 45,
                        precioCotizado: 12800,
                        precioOC: 12800,
                        estado: 'warning'
                    },
                    {
                        codigo: 'SSL-003-2025',
                        descripcion: 'Ladrillo princesa 14x19x29cm',
                        cantCotizada: 2000,
                        cantOC: 2000,
                        precioCotizado: 280,
                        precioOC: 280,
                        estado: 'match'
                    }
                ],
                timeline: [
                    { fecha: '25/05/2025 10:30', evento: 'OC recibida vía API', usuario: 'Sistema Automático' },
                    { fecha: '19/05/2025 14:30', evento: 'Cotización enviada al cliente', usuario: 'Juan Pérez (Ejecutivo SSL)' },
                    { fecha: '18/05/2025 16:45', evento: 'Cuadro comparativo aprobado', usuario: 'María González (Supervisor)' },
                    { fecha: '15/05/2025 10:15', evento: 'Solicitud de pedido SOLPED-2025-001 ingresada', usuario: 'Carlos Rodríguez (Cliente)' }
                ],
                documentos: [
                    { nombre: 'OC-2025-0123.pdf', tipo: 'pdf', tamaño: '2.1 MB' },
                    { nombre: 'COT-CLI-001-2025.pdf', tipo: 'pdf', tamaño: '1.8 MB' }
                ]
            }
        },
        {
            id: 2,
            numeroOC: 'OC-2025-0122',
            fecha: '24/05/2025',
            cliente: 'INMOBILIARIA INGEVEC',
            obra: 'CONDOMINIO VISTA MAR',
            cotizacionRef: 'COT-CLI-002-2025',
            monto: 8320000,
            origen: 'email',
            estado: 'approved',
            diferenciaMonto: 0,
            detalles: {
                items: [],
                timeline: [],
                documentos: []
            }
        },
        {
            id: 3,
            numeroOC: 'OC-2025-0121',
            fecha: '23/05/2025',
            cliente: 'CONSTRUCTORA MOLLER Y PÉREZ-COTAPOS',
            obra: 'EDIFICIO CENTRAL PARK',
            cotizacionRef: 'COT-CLI-003-2025',
            monto: 12450000,
            origen: 'physical',
            estado: 'adjustment',
            diferenciaMonto: -5,
            detalles: {
                items: [],
                timeline: [],
                documentos: []
            }
        },
        {
            id: 4,
            numeroOC: 'OC-2025-0120',
            fecha: '22/05/2025',
            cliente: 'CONSTRUCTORA ALMAGRO S.A.',
            obra: 'TORRE ALMAGRO',
            cotizacionRef: 'COT-CLI-004-2025',
            monto: 45780000,
            origen: 'api',
            estado: 'rejected',
            diferenciaMonto: 0,
            detalles: {
                items: [],
                timeline: [],
                documentos: []
            }
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredData = [...ocData];
    let expandedRows = [];

    // Función de inicialización
    function init() {
        renderTable();
        renderPagination();
        initEventListeners();
        updateStats();
    }

    // Renderizar tabla
    function renderTable() {
        const tbody = document.getElementById('oc-tbody');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(oc => {
            const statusBadge = getStatusBadge(oc.estado);
            const originBadge = getOriginBadge(oc.origen);
            const actionButtons = getActionButtons(oc.estado, oc.numeroOC);
            const isExpanded = expandedRows.includes(oc.id);

            html += `
                <tr class="expandable-row ${isExpanded ? 'expanded' : ''}" onclick="SSLOCCliente.toggleOCDetails(${oc.id})">
                    <td><i class="fas fa-chevron-right expand-icon"></i></td>
                    <td><strong>${oc.numeroOC}</strong></td>
                    <td>${oc.fecha}</td>
                    <td>
                        <strong>${oc.cliente}</strong><br>
                        <small>${oc.obra}</small>
                    </td>
                    <td>${oc.cotizacionRef}</td>
                    <td class="amount-info">
                        $${formatNumber(oc.monto)}
                        ${oc.diferenciaMonto ? `<span class="amount-diff">(${oc.diferenciaMonto}% vs cotización)</span>` : ''}
                    </td>
                    <td>
                        <span class="origin-badge">
                            ${originBadge.icon} ${originBadge.text}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge ${statusBadge.class}">${statusBadge.text}</span>
                    </td>
                    <td onclick="event.stopPropagation()">
                        <div class="action-buttons">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
                <tr class="details-row" id="details-${oc.id}" style="display: ${isExpanded ? 'table-row' : 'none'};">
                    <td colspan="9">
                        <div class="details-content">
                            ${renderDetailsContent(oc)}
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

        // Reactivar los listeners de los tabs
        initTabListeners();
    }

    // Renderizar contenido de detalles
    function renderDetailsContent(oc) {
        return `
            <div class="tabs-container">
                <div class="tabs-nav">
                    <button class="tab-button active" data-tab="comparison-${oc.id}">
                        <i class="fas fa-balance-scale"></i> Comparación
                    </button>
                    <button class="tab-button" data-tab="timeline-${oc.id}">
                        <i class="fas fa-history"></i> Trazabilidad
                    </button>
                    <button class="tab-button" data-tab="documents-${oc.id}">
                        <i class="fas fa-file-alt"></i> Documentos
                    </button>
                </div>
                
                <!-- Tab Comparación -->
                <div class="tab-content active" id="comparison-${oc.id}">
                    ${renderComparison(oc)}
                </div>
                
                <!-- Tab Trazabilidad -->
                <div class="tab-content" id="timeline-${oc.id}">
                    ${renderTimeline(oc)}
                </div>
                
                <!-- Tab Documentos -->
                <div class="tab-content" id="documents-${oc.id}">
                    ${renderDocuments(oc)}
                </div>
            </div>
        `;
    }

    // Renderizar comparación
    function renderComparison(oc) {
        let html = '<h4>Comparación OC vs Cotización Original</h4>';
        
        if (oc.detalles.items && oc.detalles.items.length > 0) {
            html += `
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Cant. Cotizada</th>
                            <th>Cant. OC</th>
                            <th>Precio Unit. Cotizado</th>
                            <th>Precio Unit. OC</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            oc.detalles.items.forEach(item => {
                const statusIcon = getComparisonStatusIcon(item.estado);
                html += `
                    <tr>
                        <td>${item.codigo}</td>
                        <td>${item.descripcion}</td>
                        <td>${item.cantCotizada}</td>
                        <td class="${item.estado}">${item.cantOC}</td>
                        <td>$${formatNumber(item.precioCotizado)}</td>
                        <td class="${item.estado}">$${formatNumber(item.precioOC)}</td>
                        <td>${statusIcon}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-success" onclick="SSLOCCliente.approveOC('${oc.numeroOC}')">
                        <i class="fas fa-check"></i> Aprobar OC
                    </button>
                    <button class="btn btn-warning" onclick="SSLOCCliente.requestAdjustment('${oc.numeroOC}')">
                        <i class="fas fa-edit"></i> Solicitar Ajuste
                    </button>
                    <button class="btn btn-danger" onclick="SSLOCCliente.rejectOC('${oc.numeroOC}')">
                        <i class="fas fa-times"></i> Rechazar OC
                    </button>
                </div>
            `;
        } else {
            html += '<p>No hay información de comparación disponible para esta OC.</p>';
        }
        
        return html;
    }

    // Renderizar timeline
    function renderTimeline(oc) {
        let html = '<h4>Historial de Trazabilidad</h4>';
        
        if (oc.detalles.timeline && oc.detalles.timeline.length > 0) {
            html += '<div class="timeline">';
            
            oc.detalles.timeline.forEach(event => {
                html += `
                    <div class="timeline-item">
                        <div class="timeline-date">${event.fecha}</div>
                        <div class="timeline-content">${event.evento}</div>
                        <div class="timeline-user">${event.usuario}</div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<p>No hay eventos de trazabilidad registrados para esta OC.</p>';
        }
        
        return html;
    }

    // Renderizar documentos
    function renderDocuments(oc) {
        let html = '<h4>Documentos Asociados</h4>';
        
        if (oc.detalles.documentos && oc.detalles.documentos.length > 0) {
            html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">';
            
            oc.detalles.documentos.forEach(doc => {
                const iconClass = doc.tipo === 'pdf' ? 'fa-file-pdf' : 'fa-file-alt';
                const iconColor = doc.tipo === 'pdf' ? '#dc3545' : '#007bff';
                
                html += `
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center;">
                        <i class="fas ${iconClass}" style="font-size: 2rem; color: ${iconColor}; margin-bottom: 10px;"></i>
                        <div>${doc.nombre}</div>
                        <small>${doc.tamaño}</small>
                        <div style="margin-top: 10px;">
                            <button class="btn btn-primary btn-sm" onclick="SSLOCCliente.downloadDocument('${doc.nombre}')">
                                <i class="fas fa-download"></i> Descargar
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<p>No hay documentos asociados a esta OC.</p>';
        }
        
        return html;
    }

    // Toggle detalles OC
    function toggleOCDetails(ocId) {
        const detailsRow = document.getElementById(`details-${ocId}`);
        const expandableRow = detailsRow.previousElementSibling;
        
        if (!detailsRow) return;

        const isVisible = detailsRow.style.display === 'table-row';
        
        // Cerrar todas las otras filas
        document.querySelectorAll('.details-row').forEach(row => {
            row.style.display = 'none';
            row.previousElementSibling.classList.remove('expanded');
        });
        
        if (!isVisible) {
            detailsRow.style.display = 'table-row';
            expandableRow.classList.add('expanded');
            
            // Actualizar lista de filas expandidas
            if (!expandedRows.includes(ocId)) {
                expandedRows.push(ocId);
            }
        } else {
            expandedRows = expandedRows.filter(id => id !== ocId);
        }
    }

    // Obtener badge de estado
    function getStatusBadge(estado) {
        const badges = {
            pending: { class: 'status-pending', text: 'PENDIENTE' },
            approved: { class: 'status-approved', text: 'APROBADA' },
            rejected: { class: 'status-rejected', text: 'RECHAZADA' },
            adjustment: { class: 'status-adjustment', text: 'EN AJUSTE' }
        };
        return badges[estado] || { class: '', text: '' };
    }

    // Obtener badge de origen
    function getOriginBadge(origen) {
        const badges = {
            api: { icon: '<i class="fas fa-plug"></i>', text: 'API' },
            email: { icon: '<i class="fas fa-envelope"></i>', text: 'Email' },
            physical: { icon: '<i class="fas fa-file-alt"></i>', text: 'Física' }
        };
        return badges[origen] || { icon: '', text: '' };
    }

    // Obtener botones de acción
    function getActionButtons(estado, numeroOC) {
        let html = `
            <button class="btn btn-info btn-sm" title="Ver detalle" onclick="SSLOCCliente.viewDetails('${numeroOC}')">
                <i class="fas fa-eye"></i>
            </button>
        `;
        
        if (estado === 'pending') {
            html += `
                <button class="btn btn-primary btn-sm" title="Comparar" onclick="SSLOCCliente.compareOC('${numeroOC}')">
                    <i class="fas fa-balance-scale"></i>
                </button>
            `;
        } else if (estado === 'approved') {
            html += `
                <button class="btn btn-success btn-sm" title="Generar OC Proveedor" onclick="SSLOCCliente.generateSupplierOC('${numeroOC}')">
                    <i class="fas fa-arrow-right"></i>
                </button>
            `;
        } else if (estado === 'adjustment') {
            html += `
                <button class="btn btn-warning btn-sm" title="Ver ajustes" onclick="SSLOCCliente.viewAdjustments('${numeroOC}')">
                    <i class="fas fa-edit"></i>
                </button>
            `;
        } else if (estado === 'rejected') {
            html += `
                <button class="btn btn-danger btn-sm" title="Ver motivo rechazo" onclick="SSLOCCliente.viewRejectionReason('${numeroOC}')">
                    <i class="fas fa-exclamation-circle"></i>
                </button>
            `;
        }
        
        html += `
            <button class="btn btn-outline btn-sm" title="Historial" onclick="SSLOCCliente.viewHistory('${numeroOC}')">
                <i class="fas fa-history"></i>
            </button>
        `;
        
        return html;
    }

    // Obtener icono de estado de comparación
    function getComparisonStatusIcon(estado) {
        const icons = {
            match: '<i class="fas fa-check-circle" style="color: green;"></i> OK',
            warning: '<i class="fas fa-exclamation-triangle" style="color: orange;"></i> Cantidad diferente',
            mismatch: '<i class="fas fa-times-circle" style="color: red;"></i> No coincide'
        };
        return icons[estado] || '';
    }

    // Actualizar estadísticas
    function updateStats() {
        const stats = {
            total: filteredData.length,
            pending: filteredData.filter(oc => oc.estado === 'pending').length,
            approved: filteredData.filter(oc => oc.estado === 'approved').length,
            totalAmount: filteredData.reduce((sum, oc) => sum + oc.monto, 0)
        };

        // Actualizar números en las tarjetas
        const cards = document.querySelectorAll('.stat-number');
        if (cards.length >= 4) {
            cards[0].textContent = stats.total;
            cards[1].textContent = stats.pending;
            cards[2].textContent = stats.approved;
            cards[3].textContent = `$${(stats.totalAmount / 1000000).toFixed(1)}M`;
        }
    }

    // Aplicar filtros
    function applyFilters() {
        const cliente = document.getElementById('filter-cliente').value;
        const estado = document.getElementById('filter-estado').value;
        const origen = document.getElementById('filter-origen').value;
        const fechaDesde = document.getElementById('filter-fecha-desde').value;
        const fechaHasta = document.getElementById('filter-fecha-hasta').value;

        filteredData = ocData.filter(oc => {
            let match = true;

            if (cliente && !oc.cliente.includes(cliente)) match = false;
            if (estado && oc.estado !== estado) match = false;
            if (origen && oc.origen !== origen) match = false;
            // Aquí irían los filtros de fecha si fuera necesario

            return match;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
        updateStats();

        showNotification('success', `Se encontraron ${filteredData.length} resultados`);
    }

    // Limpiar filtros
    function clearFilters() {
        document.getElementById('filter-cliente').value = '';
        document.getElementById('filter-estado').value = '';
        document.getElementById('filter-origen').value = '';
        document.getElementById('filter-fecha-desde').value = '';
        document.getElementById('filter-fecha-hasta').value = '';

        filteredData = [...ocData];
        currentPage = 1;
        renderTable();
        renderPagination();
        updateStats();
        
        showNotification('info', 'Filtros limpiados');
    }

    // Modal functions
    function openNewOCModal() {
        const modal = document.getElementById('newOCModal');
        modal.classList.add('active');
        
        // Set today's date as default
        document.getElementById('ocDate').value = new Date().toISOString().split('T')[0];
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Hide quotation details
        document.getElementById('quotationDetails').style.display = 'none';
    }

    // Cargar proyectos del cliente
    function loadClientProjects() {
        const clientSelect = document.getElementById('client');
        const projectSelect = document.getElementById('project');
        const quotationSelect = document.getElementById('quotation');
        
        if (clientSelect.value) {
            // Enable project select
            projectSelect.disabled = false;
            projectSelect.innerHTML = '<option value="">Seleccione proyecto</option>';
            
            // Simulate loading projects
            if (clientSelect.value === '1') {
                projectSelect.innerHTML += '<option value="1">EDIFICIO PACIFIC BLUE</option>';
                projectSelect.innerHTML += '<option value="2">TORRE ALMAGRO</option>';
            } else if (clientSelect.value === '2') {
                projectSelect.innerHTML += '<option value="3">CONDOMINIO VISTA MAR</option>';
            } else {
                projectSelect.innerHTML += '<option value="4">EDIFICIO CENTRAL PARK</option>';
            }
            
            // Enable quotation select
            quotationSelect.disabled = false;
            quotationSelect.innerHTML = '<option value="">Seleccione cotización</option>';
            quotationSelect.innerHTML += '<option value="COT-CLI-001-2025">COT-CLI-001-2025 - $2,850,000</option>';
            quotationSelect.innerHTML += '<option value="COT-CLI-002-2025">COT-CLI-002-2025 - $8,320,000</option>';
        }
    }

    // Cargar detalles de cotización
    function loadQuotationDetails() {
        const quotationSelect = document.getElementById('quotation');
        const detailsDiv = document.getElementById('quotationDetails');
        
        if (quotationSelect.value) {
            detailsDiv.style.display = 'block';
            
            // Simulate loading quotation details
            if (quotationSelect.value === 'COT-CLI-001-2025') {
                document.getElementById('quotedAmount').textContent = '$2,850,000';
                document.getElementById('quotedDate').textContent = '19/05/2025';
                document.getElementById('quotedValidity').textContent = '30/05/2025';
            } else {
                document.getElementById('quotedAmount').textContent = '$8,320,000';
                document.getElementById('quotedDate').textContent = '18/05/2025';
                document.getElementById('quotedValidity').textContent = '28/05/2025';
            }
        } else {
            detailsDiv.style.display = 'none';
        }
    }

    // Funciones de acciones
    function viewDetails(numeroOC) {
        showNotification('info', `Viendo detalles de ${numeroOC}`);
    }

    function compareOC(numeroOC) {
        showNotification('info', `Comparando ${numeroOC} con cotización original`);
    }

    function generateSupplierOC(numeroOC) {
        if (confirm(`¿Generar OC de proveedor para ${numeroOC}?`)) {
            showNotification('success', `OC de proveedor generada para ${numeroOC}`);
        }
    }

    function viewAdjustments(numeroOC) {
        showNotification('info', `Viendo ajustes solicitados para ${numeroOC}`);
    }

    function viewRejectionReason(numeroOC) {
        showNotification('warning', `Motivo de rechazo: Diferencias significativas en cantidades`);
    }

    function viewHistory(numeroOC) {
        showNotification('info', `Mostrando historial completo de ${numeroOC}`);
    }

    function approveOC(numeroOC) {
        if (confirm(`¿Aprobar ${numeroOC}?`)) {
            showNotification('success', `${numeroOC} aprobada exitosamente`);
            // Actualizar estado en los datos
            const oc = ocData.find(o => o.numeroOC === numeroOC);
            if (oc) {
                oc.estado = 'approved';
                renderTable();
                updateStats();
            }
        }
    }

    function requestAdjustment(numeroOC) {
        const reason = prompt(`Ingrese el motivo del ajuste para ${numeroOC}:`);
        if (reason) {
            showNotification('warning', `Ajuste solicitado para ${numeroOC}`);
        }
    }

    function rejectOC(numeroOC) {
        const reason = prompt(`Ingrese el motivo del rechazo para ${numeroOC}:`);
        if (reason) {
            showNotification('error', `${numeroOC} rechazada`);
            // Actualizar estado en los datos
            const oc = ocData.find(o => o.numeroOC === numeroOC);
            if (oc) {
                oc.estado = 'rejected';
                renderTable();
                updateStats();
            }
        }
    }

    function downloadDocument(docName) {
        showNotification('info', `Descargando ${docName}...`);
    }

    // Renderizar paginación
    function renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Botón anterior
        html += `<button class="pagination-btn" onclick="SSLOCCliente.goToPage(${currentPage - 1})" 
                        ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>`;

        // Páginas
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                            onclick="SSLOCCliente.goToPage(${i})">${i}</button>`;
        }

        if (totalPages > 5) {
            html += '<span>...</span>';
            html += `<button class="pagination-btn" onclick="SSLOCCliente.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Botón siguiente
        html += `<button class="pagination-btn" onclick="SSLOCCliente.goToPage(${currentPage + 1})" 
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

    // Formatear número
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Inicializar event listeners
    function initEventListeners() {
        // Form submission
        const form = document.getElementById('newOCForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('success', 'OC guardada exitosamente');
                closeModal('newOCModal');
            });
        }

        // Close modal on outside click
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+N: Nueva OC
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                openNewOCModal();
            }
            
            // Escape: Cerrar modal o limpiar filtros
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    modal.classList.remove('active');
                } else {
                    clearFilters();
                }
            }
        });
    }

    // Inicializar listeners de tabs
    function initTabListeners() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const tabId = this.getAttribute('data-tab');
                const tabsContainer = this.closest('.tabs-container');
                
                // Remove active class from all buttons and content in this container
                tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const tabContent = tabsContainer.querySelector(`#${tabId}`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // Exportar funciones públicas
    return {
        init,
        toggleOCDetails,
        openNewOCModal,
        closeModal,
        loadClientProjects,
        loadQuotationDetails,
        applyFilters,
        clearFilters,
        goToPage,
        viewDetails,
        compareOC,
        generateSupplierOC,
        viewAdjustments,
        viewRejectionReason,
        viewHistory,
        approveOC,
        requestAdjustment,
        rejectOC,
        downloadDocument
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

.action-buttons {
    display: flex;
    gap: 8px;
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