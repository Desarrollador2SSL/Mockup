// ================================
// Cliente - Modificaciones JavaScript
// ===============================

// Global variables
let modifications = [];
let currentModification = null;
let filters = {
    status: '',
    type: '',
    search: ''
};
let selectedOC = null;
let selectedModificationType = null;
let currentStep = 1;
let uploadedFiles = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Detect which page we're on and initialize accordingly
    const currentPage = detectCurrentPage();
    
    if (currentPage === 'list') {
        initializeModifications();
        initializeListPage();
    } else if (currentPage === 'detail') {
        initializeModifications();
        initializeDetailPage();
    } else if (currentPage === 'new') {
        initializeNewModificationPage();
    }
});

// Detect current page
function detectCurrentPage() {
    // Check for unique elements on each page
    if (document.getElementById('searchModifications')) {
        return 'list';
    } else if (document.querySelector('.modification-title')) {
        return 'detail';
    } else if (document.querySelector('.steps-container')) {
        return 'new';
    }
    return 'unknown';
}

// =============================================
// LISTADO DE MODIFICACIONES
// =============================================

// Initialize list page
function initializeListPage() {
    loadModifications();
    setupFilters();
    setupSearch();
    updateStats();
}

// Load modifications data
function loadModifications() {
    // Simulate loading data from server
    modifications = [
        {
            id: 'MOD-2025-0045',
            ocNumber: 'OC-2025-0234',
            type: 'quantity',
            project: 'Torre Pacífico',
            date: '27/08/2025',
            status: 'pending',
            impact: -25000,
            requestedBy: 'Juan Pérez',
            urgent: false
        },
        {
            id: 'MOD-2025-0044',
            ocNumber: 'OC-2025-0230',
            type: 'date',
            project: 'Mall Plaza Norte',
            date: '26/08/2025',
            status: 'review',
            impact: 0,
            requestedBy: 'María González',
            urgent: false
        },
        {
            id: 'MOD-2025-0043',
            ocNumber: 'OC-2025-0228',
            type: 'mixed',
            project: 'Hospital Regional',
            date: '25/08/2025',
            status: 'review',
            impact: -45000,
            requestedBy: 'Carlos Ruiz',
            urgent: true
        },
        {
            id: 'MOD-2025-0042',
            ocNumber: 'OC-2025-0225',
            type: 'quantity',
            project: 'Edificio Corporativo',
            date: '23/08/2025',
            status: 'approved',
            impact: -18500,
            requestedBy: 'Ana Martínez',
            urgent: false
        },
        {
            id: 'MOD-2025-0041',
            ocNumber: 'OC-2025-0220',
            type: 'date',
            project: 'Centro Comercial Sur',
            date: '22/08/2025',
            status: 'approved',
            impact: 0,
            requestedBy: 'Pedro Sánchez',
            urgent: false
        },
        {
            id: 'MOD-2025-0040',
            ocNumber: 'OC-2025-0218',
            type: 'quantity',
            project: 'Puente Metropolitano',
            date: '20/08/2025',
            status: 'rejected',
            impact: -67000,
            requestedBy: 'Luis García',
            urgent: false
        }
    ];
    
    displayModifications(modifications);
}

// Setup filters
function setupFilters() {
    const statusFilter = document.getElementById('filterStatus');
    const typeFilter = document.getElementById('filterType');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filters.status = this.value;
            applyFilters();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filters.type = this.value;
            applyFilters();
        });
    }
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchModifications');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filters.search = this.value.toLowerCase();
            applyFilters();
        });
    }
}

// Apply filters
function applyFilters() {
    let filtered = modifications;
    
    // Filter by status
    if (filters.status) {
        filtered = filtered.filter(mod => mod.status === filters.status);
    }
    
    // Filter by type
    if (filters.type) {
        if (filters.type === 'cantidad') {
            filtered = filtered.filter(mod => mod.type === 'quantity');
        } else if (filters.type === 'fecha') {
            filtered = filtered.filter(mod => mod.type === 'date');
        } else if (filters.type === 'mixto') {
            filtered = filtered.filter(mod => mod.type === 'mixed');
        }
    }
    
    // Filter by search
    if (filters.search) {
        filtered = filtered.filter(mod => 
            mod.id.toLowerCase().includes(filters.search) ||
            mod.ocNumber.toLowerCase().includes(filters.search) ||
            mod.project.toLowerCase().includes(filters.search) ||
            mod.requestedBy.toLowerCase().includes(filters.search)
        );
    }
    
    displayModifications(filtered);
}

// Display modifications in table
function displayModifications(mods) {
    const tbody = document.getElementById('modificationsTableBody');
    if (!tbody) return;
    
    if (mods.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No se encontraron modificaciones con los filtros aplicados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = mods.map(mod => `
        <tr>
            <td class="modification-number">
                <span class="mod-badge">${mod.id}</span>
                ${mod.urgent ? '<span class="urgent-badge">Urgente</span>' : ''}
            </td>
            <td class="oc-reference">
                <a href="../cliente_orden_compra/cliente_detalle_orden_compra.html?oc=${mod.ocNumber}" class="link-primary">
                    ${mod.ocNumber}
                </a>
            </td>
            <td>
                ${getTypeBadge(mod.type)}
            </td>
            <td>${mod.project}</td>
            <td>${mod.date}</td>
            <td>
                ${getStatusBadge(mod.status)}
            </td>
            <td class="impact ${mod.impact < 0 ? 'negative' : mod.impact > 0 ? 'positive' : 'neutral'}">
                ${getImpactDisplay(mod.impact)}
            </td>
            <td>${mod.requestedBy}</td>
            <td>
                <div class="action-buttons">
                    ${getActionButtons(mod)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Get type badge HTML
function getTypeBadge(type) {
    const types = {
        'quantity': '<i class="fas fa-minus-circle"></i> Reducción cantidad',
        'date': '<i class="fas fa-calendar-alt"></i> Cambio fecha',
        'mixed': '<i class="fas fa-exchange-alt"></i> Mixto'
    };
    
    const classes = {
        'quantity': 'type-quantity',
        'date': 'type-date',
        'mixed': 'type-mixed'
    };
    
    return `<span class="type-badge ${classes[type]}">${types[type]}</span>`;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statuses = {
        'pending': '<i class="fas fa-clock"></i> Pendiente',
        'review': '<i class="fas fa-search"></i> En Revisión',
        'approved': '<i class="fas fa-check-circle"></i> Aprobado',
        'rejected': '<i class="fas fa-times-circle"></i> Rechazado'
    };
    
    const classes = {
        'pending': 'status-pending',
        'review': 'status-review',
        'approved': 'status-approved',
        'rejected': 'status-rejected'
    };
    
    return `<span class="status-badge ${classes[status]}">${statuses[status]}</span>`;
}

// Get impact display
function getImpactDisplay(impact) {
    if (impact === 0) {
        return '<i class="fas fa-minus"></i> Sin impacto';
    } else if (impact < 0) {
        return `<i class="fas fa-arrow-down"></i> ${formatCurrency(impact)}`;
    } else {
        return `<i class="fas fa-arrow-up"></i> +${formatCurrency(impact)}`;
    }
}

// Get action buttons based on status
function getActionButtons(mod) {
    let buttons = `
        <button class="btn-icon" onclick="verModificacion('${mod.id}')" title="Ver detalle">
            <i class="fas fa-eye"></i>
        </button>
    `;
    
    if (mod.status === 'pending') {
        buttons += `
            <button class="btn-icon" onclick="editarModificacion('${mod.id}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" onclick="enviarRevision('${mod.id}')" title="Enviar a revisión">
                <i class="fas fa-paper-plane"></i>
            </button>
        `;
    } else if (mod.status === 'review') {
        buttons += `
            <button class="btn-icon" onclick="verProgreso('${mod.id}')" title="Ver progreso">
                <i class="fas fa-tasks"></i>
            </button>
            <button class="btn-icon" onclick="abrirChat('${mod.id}')" title="Chat">
                <i class="fas fa-comments"></i>
            </button>
        `;
    } else if (mod.status === 'approved') {
        buttons += `
            <button class="btn-icon" onclick="descargarDocumento('${mod.id}')" title="Descargar documento">
                <i class="fas fa-download"></i>
            </button>
            <button class="btn-icon" onclick="verImpacto('${mod.id}')" title="Ver impacto">
                <i class="fas fa-chart-pie"></i>
            </button>
        `;
    } else if (mod.status === 'rejected') {
        buttons += `
            <button class="btn-icon" onclick="verRazonRechazo('${mod.id}')" title="Ver razón de rechazo">
                <i class="fas fa-info-circle"></i>
            </button>
            <button class="btn-icon" onclick="reenviarsolicitud('${mod.id}')" title="Reenviar solicitud">
                <i class="fas fa-redo"></i>
            </button>
        `;
    }
    
    return buttons;
}

// Update statistics
function updateStats() {
    const pending = modifications.filter(m => m.status === 'pending').length;
    const review = modifications.filter(m => m.status === 'review').length;
    const approved = modifications.filter(m => m.status === 'approved').length;
    
    const totalImpact = modifications
        .filter(m => m.status === 'approved')
        .reduce((sum, m) => sum + m.impact, 0);
    
    // Update UI (if elements exist)
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 4) {
        statsElements[0].textContent = pending;
        statsElements[1].textContent = review;
        statsElements[2].textContent = approved;
        statsElements[3].textContent = formatCurrency(Math.abs(totalImpact));
    }
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.abs(value));
}

// List page actions
function nuevaModificacion() {
    window.location.href = 'cliente_nueva_modificacion.html';
}

function verModificacion(id) {
    window.location.href = `cliente_detalle_modificacion.html?id=${id}`;
}

function editarModificacion(id) {
    window.location.href = `cliente_detalle_modificacion.html?id=${id}&mode=edit`;
}

function enviarRevision(id) {
    if (confirm('¿Está seguro que desea enviar esta modificación a revisión?')) {
        // Update status
        const mod = modifications.find(m => m.id === id);
        if (mod) {
            mod.status = 'review';
            displayModifications(modifications);
            updateStats();
            showNotification('Modificación enviada a revisión exitosamente', 'success');
        }
    }
}

function verProgreso(id) {
    alert(`Viendo progreso de la modificación ${id}`);
}

function abrirChat(id) {
    window.location.href = `../cliente_mensajeria/cliente_detalle_mensajeria.html?type=modificacion&numero=${id}`;
}

function descargarDocumento(id) {
    showNotification(`Descargando documento de modificación ${id}`, 'info');
    // In production, this would download the PDF
}

function verImpacto(id) {
    alert(`Mostrando análisis de impacto para ${id}`);
}

function verRazonRechazo(id) {
    alert(`Razón de rechazo: Los cambios solicitados afectan entregas ya programadas con el proveedor.`);
}

function reenviarsolicitud(id) {
    if (confirm('¿Desea reenviar esta solicitud con ajustes?')) {
        window.location.href = `cliente_detalle_modificacion.html?id=${id}&mode=edit&retry=true`;
    }
}

function exportarModificaciones() {
    showNotification('Exportando modificaciones a Excel...', 'info');
    // In production, this would generate and download an Excel file
}

// =============================================
// DETALLE DE MODIFICACIÓN
// =============================================

// Initialize detail page
function initializeDetailPage() {
    loadModificationDetail();
    setupDetailEvents();
    initializeTimeline();
}

// Load modification detail
function loadModificationDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const modId = urlParams.get('id') || 'MOD-2025-0045';
    const mode = urlParams.get('mode');
    
    // Load modification data
    currentModification = {
        id: modId,
        ocNumber: 'OC-2025-0234',
        type: 'quantity',
        project: 'Torre Pacífico',
        status: 'pending',
        requestedBy: 'Juan Pérez',
        date: '27/08/2025',
        reason: 'Ajuste del proyecto debido a cambios en el diseño arquitectónico que requieren menor cantidad de material del especificado originalmente.',
        originalValue: 450000,
        reduction: 25000,
        newValue: 425000,
        items: [
            { code: 'FE-500', description: 'Fierro Corrugado 1/2"', originalQty: 500, newQty: 450, unit: 'ton', impact: -15000 },
            { code: 'FE-380', description: 'Fierro Corrugado 3/8"', originalQty: 300, newQty: 270, unit: 'ton', impact: -10000 }
        ]
    };
    
    // Enable edit mode if specified
    if (mode === 'edit') {
        enableEditMode();
    }
}

// Setup detail events
function setupDetailEvents() {
    // Quantity inputs
    const quantityInputs = document.querySelectorAll('.input-small');
    quantityInputs.forEach(input => {
        input.addEventListener('change', recalculateImpact);
    });
    
    // Comment input
    const newComment = document.getElementById('newComment');
    if (newComment) {
        newComment.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                agregarComentario();
            }
        });
    }
}

// Initialize timeline
function initializeTimeline() {
    // Animate timeline items on load
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Enable edit mode
function enableEditMode() {
    const inputs = document.querySelectorAll('.input-small');
    inputs.forEach(input => {
        input.disabled = false;
        input.style.background = '#fff';
    });
    
    showNotification('Modo de edición activado', 'info');
}

// Recalculate impact
function recalculateImpact() {
    let totalImpact = 0;
    const rows = document.querySelectorAll('.items-table tbody tr');
    
    rows.forEach(row => {
        const originalQty = parseInt(row.cells[2].textContent);
        const newQtyInput = row.querySelector('.input-small');
        if (newQtyInput) {
            const newQty = parseInt(newQtyInput.value);
            const difference = newQty - originalQty;
            const unitPrice = 300; // Simulated price per ton
            const impact = difference * unitPrice;
            
            row.cells[4].textContent = `${difference} ton`;
            row.cells[4].className = difference < 0 ? 'text-center negative' : 'text-center';
            
            row.cells[5].textContent = formatCurrency(impact);
            row.cells[5].className = impact < 0 ? 'negative' : '';
            
            totalImpact += impact;
        }
    });
    
    // Update total
    const totalCell = document.querySelector('.total-row td:last-child');
    if (totalCell) {
        totalCell.innerHTML = `<strong>${formatCurrency(totalImpact)}</strong>`;
        totalCell.className = totalImpact < 0 ? 'negative' : '';
    }
}

// Detail page actions
function enviarAprobacion() {
    document.getElementById('confirmModal').style.display = 'flex';
}

function cancelarModificacion() {
    if (confirm('¿Está seguro que desea cancelar esta modificación? Esta acción no se puede deshacer.')) {
        showNotification('Modificación cancelada', 'warning');
        setTimeout(() => {
            window.location.href = 'cliente_listado_modificaciones.html';
        }, 1500);
    }
}

function agregarItem() {
    alert('Función para agregar nuevo ítem a modificar');
}

function editarItem(id) {
    alert(`Editando ítem ${id}`);
}

function eliminarItem(id) {
    if (confirm('¿Está seguro que desea eliminar este ítem de la modificación?')) {
        showNotification('Ítem eliminado', 'warning');
    }
}

function adjuntarDocumento() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showNotification(`Archivo "${file.name}" adjuntado exitosamente`, 'success');
        }
    };
    input.click();
}

function verDocumento(id) {
    alert(`Abriendo documento ${id}`);
}

function agregarComentario() {
    const textarea = document.getElementById('newComment');
    if (!textarea || !textarea.value.trim()) return;
    
    const comment = textarea.value.trim();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    
    // Add comment to list
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
        const newCommentHtml = `
            <div class="comment-item" style="animation: slideIn 0.3s ease;">
                <div class="comment-header">
                    <span class="comment-author">Usted</span>
                    <span class="comment-date">${dateStr}</span>
                </div>
                <div class="comment-text">${comment}</div>
            </div>
        `;
        commentsList.insertAdjacentHTML('afterbegin', newCommentHtml);
    }
    
    // Clear textarea
    textarea.value = '';
    showNotification('Comentario agregado', 'success');
}

// Modal functions
function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function confirmarEnvio() {
    closeModal();
    showNotification('Modificación enviada a revisión exitosamente', 'success');
    
    // Update UI to reflect new status
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = 'status-badge status-review';
        statusBadge.innerHTML = '<i class="fas fa-search"></i> En Revisión';
    }
    
    // Disable edit buttons
    const editButtons = document.querySelectorAll('.btn-secondary, .btn-primary');
    editButtons.forEach(btn => {
        if (btn.textContent.includes('Editar') || btn.textContent.includes('Enviar')) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
    
    // Update timeline
    updateTimelineStatus('review');
}

// Update timeline status
function updateTimelineStatus(newStatus) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (newStatus === 'review') {
        timelineItems[1].classList.remove('active');
        timelineItems[1].classList.add('completed');
        timelineItems[2].classList.add('active');
        
        const content = timelineItems[1].querySelector('.timeline-content');
        if (content) {
            content.innerHTML = `
                <div class="timeline-title">Enviado a Revisión</div>
                <div class="timeline-date">${new Date().toLocaleString('es-CL')}</div>
                <div class="timeline-user">Por: ${currentModification.requestedBy}</div>
            `;
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15ooksaround-text-full-data: 15px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'times-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Add CSS animations
if (!document.getElementById('modificacionAnimations')) {
    const style = document.createElement('style');
    style.id = 'modificacionAnimations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .timeline-item {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// NUEVA MODIFICACIÓN - Step Functions
// =============================================

// Initialize new modification page
function initializeNewModificationPage() {
    // Set initial step
    currentStep = 1;
    
    // Initialize step 1
    setupStep1();
    
    // Check for saved draft
    checkForDraft();
    
    // Initialize drag and drop for file upload
    initializeDragAndDrop();
}

// Setup Step 1
function setupStep1() {
    // Enable OC selection
    const ocCards = document.querySelectorAll('.oc-card');
    ocCards.forEach(card => {
        card.addEventListener('click', function() {
            // Only process if not already handling the click
            if (!this.classList.contains('selected')) {
                selectOC(this.querySelector('.oc-number').textContent, this);
            }
        });
    });
}

// Initialize drag and drop
function initializeDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    if (!uploadArea) return;
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload({ target: { files } });
        }
    });
}

// Check for saved draft
function checkForDraft() {
    const draft = localStorage.getItem('modificationDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            const savedDate = new Date(draftData.savedAt);
            const now = new Date();
            const hoursDiff = (now - savedDate) / (1000 * 60 * 60);
            
            // Only show draft if less than 24 hours old
            if (hoursDiff < 24) {
                if (confirm(`Hay un borrador guardado de hace ${Math.round(hoursDiff)} horas. ¿Desea recuperarlo?`)) {
                    loadDraft(draftData);
                } else {
                    localStorage.removeItem('modificationDraft');
                }
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// Load draft
function loadDraft(draftData) {
    // Load OC selection
    if (draftData.ocNumber) {
        const ocCard = Array.from(document.querySelectorAll('.oc-card')).find(
            card => card.querySelector('.oc-number').textContent === draftData.ocNumber
        );
        if (ocCard) {
            selectOC(draftData.ocNumber, ocCard);
        }
    }
    
    // Load modification type and reason if on appropriate step
    if (draftData.modificationType || draftData.reason) {
        goToStep(2);
        
        if (draftData.modificationType) {
            const typeOption = Array.from(document.querySelectorAll('.type-option')).find(
                option => option.onclick.toString().includes(draftData.modificationType)
            );
            if (typeOption) {
                selectModificationType(draftData.modificationType, typeOption);
            }
        }
        
        if (draftData.reason) {
            const reasonField = document.getElementById('modificationReason');
            if (reasonField) {
                reasonField.value = draftData.reason;
                validateStep2();
            }
        }
    }
    
    showNotification('Borrador recuperado exitosamente', 'success');
}

// Select OC
function selectOC(ocNumber, element) {
    // Remove previous selection
    document.querySelectorAll('.oc-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    element.classList.add('selected');
    
    // Store selected OC
    selectedOC = ocNumber;
    
    // Enable continue button
    document.getElementById('btnStep1').disabled = false;
    
    // Show notification
    showNotification(`OC ${ocNumber} seleccionada`, 'info');
}

// Filter OCs
function filterOCs() {
    const searchTerm = document.getElementById('searchOC').value.toLowerCase();
    const ocCards = document.querySelectorAll('.oc-card');
    
    ocCards.forEach(card => {
        const textContent = card.textContent.toLowerCase();
        if (textContent.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Select Modification Type
function selectModificationType(type, element) {
    // Remove previous selection
    document.querySelectorAll('.type-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection
    element.classList.add('selected');
    
    // Store selected type
    selectedModificationType = type;
    
    // Validate step 2
    validateStep2();
}

// Validate Step 2
function validateStep2() {
    const reason = document.getElementById('modificationReason');
    const btnStep2 = document.getElementById('btnStep2');
    
    if (!reason || !btnStep2) {
        console.error('Step 2 elements not found');
        return;
    }
    
    const isValid = selectedModificationType && reason.value.trim().length >= 50;
    btnStep2.disabled = !isValid;
    
    // Update character counter if needed
    const charCount = reason.value.trim().length;
    const helpText = reason.parentElement.querySelector('.field-help');
    if (helpText) {
        helpText.textContent = `${charCount}/50 caracteres mínimos. ${charCount >= 50 ? '✓' : 'Sea específico en su justificación.'}`;
        helpText.style.color = charCount >= 50 ? 'var(--mod-approved)' : '#94a3b8';
    }
}

// Go to Step
function goToStep(stepNumber) {
    // Validate current step before moving
    if (!validateCurrentStep()) {
        showNotification('Por favor complete todos los campos requeridos', 'warning');
        return;
    }
    
    // Update step indicators
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        const content = document.getElementById(`stepContent${i}`);
        
        if (!step || !content) {
            console.error(`Step ${i} elements not found`);
            continue;
        }
        
        if (i < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (i === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
        
        content.classList.toggle('active', i === stepNumber);
    }
    
    currentStep = stepNumber;
    
    // Execute step-specific logic
    try {
        switch(stepNumber) {
            case 1:
                setupStep1();
                break;
            case 2:
                setupStep2();
                break;
            case 3:
                setupStep3();
                break;
            case 4:
                setupStep4();
                break;
        }
    } catch (error) {
        console.error(`Error setting up step ${stepNumber}:`, error);
        showNotification('Error al cargar el paso. Por favor, intente nuevamente.', 'error');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return selectedOC !== null;
        case 2:
            const reason = document.getElementById('modificationReason');
            return selectedModificationType !== null && reason && reason.value.trim().length >= 50;
        case 3:
            // Check if at least one item is selected
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            return checkboxes.length > 0;
        case 4:
            return true; // No validation needed for review step
        default:
            return true;
    }
}

// Setup Step 2
function setupStep2() {
    // Update selected OC summary
    const summaryElement = document.getElementById('selectedOCNumber');
    if (summaryElement && selectedOC) {
        summaryElement.textContent = selectedOC;
    }
    
    // Clear any previous selections
    document.querySelectorAll('.type-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset modification type
    selectedModificationType = null;
    
    // Setup modification reason validation
    const reasonTextarea = document.getElementById('modificationReason');
    if (reasonTextarea) {
        reasonTextarea.addEventListener('input', validateStep2);
    }
}

// Setup Step 3
function setupStep3() {
    // Show appropriate modification sections based on type
    const quantitySection = document.getElementById('quantitySection');
    const dateSection = document.getElementById('dateSection');
    
    if (!quantitySection || !dateSection) {
        console.error('Modification sections not found');
        return;
    }
    
    if (selectedModificationType === 'quantity') {
        quantitySection.style.display = 'block';
        dateSection.style.display = 'none';
    } else if (selectedModificationType === 'date') {
        quantitySection.style.display = 'none';
        dateSection.style.display = 'block';
    } else if (selectedModificationType === 'mixed') {
        quantitySection.style.display = 'block';
        dateSection.style.display = 'block';
    } else {
        // Default to quantity if no type selected (shouldn't happen)
        quantitySection.style.display = 'block';
        dateSection.style.display = 'none';
    }
    
    // Initialize quantity inputs
    const quantityInputs = document.querySelectorAll('#itemsTableBody input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            const row = this.closest('tr');
            const originalQty = parseFloat(row.cells[3].textContent) || 0;
            const unitPrice = parseFloat(row.cells[6].textContent.replace(/[^0-9.-]/g, '')) || 0;
            updateItemDifference(this, originalQty, unitPrice);
        });
    });
}

// Update Item Difference
function updateItemDifference(input, originalQty, unitPrice) {
    const row = input.closest('tr');
    const newQty = parseFloat(input.value) || 0;
    const difference = newQty - originalQty;
    const impact = difference * unitPrice;
    
    // Update difference cell
    const diffCell = row.querySelector('.difference');
    diffCell.textContent = `${difference} ton`;
    diffCell.className = difference < 0 ? 'text-center difference negative' : 'text-center difference';
    
    // Update impact cell
    const impactCell = row.querySelector('.impact');
    impactCell.textContent = formatCurrency(impact);
    impactCell.className = impact < 0 ? 'text-right impact negative' : 'text-right impact';
    
    // Calculate total impact
    calculateTotalImpact();
}

// Calculate Total Impact
function calculateTotalImpact() {
    let totalImpact = 0;
    const rows = document.querySelectorAll('#itemsTableBody tr');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const impactCell = row.querySelector('.impact');
            const impactText = impactCell.textContent.replace(/[$,]/g, '');
            totalImpact += parseFloat(impactText) || 0;
        }
    });
    
    // Update total
    const totalElement = document.getElementById('totalImpact');
    if (totalElement) {
        totalElement.innerHTML = `<strong>${formatCurrency(totalImpact)}</strong>`;
        totalElement.className = totalImpact < 0 ? 'text-right negative' : 'text-right';
    }
}

// Setup Step 4
function setupStep4() {
    // Update review summary with safe checks
    const reviewOC = document.getElementById('reviewOC');
    if (reviewOC) {
        reviewOC.textContent = selectedOC || 'OC-2025-0234';
    }
    
    const typeText = {
        'quantity': 'Reducción de Cantidad',
        'date': 'Cambio de Fecha',
        'mixed': 'Modificación Mixta'
    };
    
    const reviewType = document.getElementById('reviewType');
    if (reviewType) {
        reviewType.textContent = typeText[selectedModificationType] || 'Reducción de Cantidad';
    }
    
    // Update other review fields
    const reviewProject = document.getElementById('reviewProject');
    if (reviewProject) {
        reviewProject.textContent = 'Torre Pacífico';
    }
    
    const reviewSupplier = document.getElementById('reviewSupplier');
    if (reviewSupplier) {
        reviewSupplier.textContent = 'ACEROS DEL PACÍFICO S.A.';
    }
    
    const reviewImpact = document.getElementById('reviewImpact');
    const totalImpact = document.getElementById('totalImpact');
    if (reviewImpact) {
        reviewImpact.textContent = totalImpact?.textContent || '-$25,000';
    }
    
    const reviewRequestedBy = document.getElementById('reviewRequestedBy');
    if (reviewRequestedBy) {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        reviewRequestedBy.textContent = userData.name || 'Juan Pérez';
    }
    
    // Update reason
    const reason = document.getElementById('modificationReason');
    const reviewReason = document.getElementById('reviewReason');
    if (reason && reviewReason) {
        reviewReason.textContent = reason.value;
    }
    
    // Update changes summary
    const reviewChanges = document.getElementById('reviewChanges');
    if (reviewChanges) {
        const changes = collectChanges();
        reviewChanges.innerHTML = `<ul>${changes.map(c => `<li>${c}</li>`).join('')}</ul>`;
    }
    
    // Update documents count
    const reviewDocuments = document.getElementById('reviewDocuments');
    if (reviewDocuments) {
        reviewDocuments.innerHTML = `
            <span class="document-count">${uploadedFiles.length} documento(s) adjunto(s)</span>
        `;
    }
    
    // Setup terms checkbox
    const acceptTerms = document.getElementById('acceptTerms');
    if (acceptTerms) {
        acceptTerms.addEventListener('change', validateStep4);
    }
}

// Collect changes for review
function collectChanges() {
    const changes = [];
    
    if (selectedModificationType === 'quantity' || selectedModificationType === 'mixed') {
        const rows = document.querySelectorAll('#itemsTableBody tr');
        rows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const code = row.cells[1].textContent;
                const originalQty = row.cells[3].textContent;
                const newQtyInput = row.querySelector('input[type="number"]');
                if (newQtyInput) {
                    const newQty = newQtyInput.value;
                    const diff = parseFloat(newQty) - parseFloat(originalQty);
                    if (diff !== 0) {
                        changes.push(`${code}: ${originalQty} → ${newQty} ton (${diff > 0 ? '+' : ''}${diff} ton)`);
                    }
                }
            }
        });
    }
    
    if (selectedModificationType === 'date' || selectedModificationType === 'mixed') {
        const deliveries = document.querySelectorAll('#dateSection tbody tr');
        deliveries.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const delivery = row.cells[1].textContent;
                const originalDate = row.cells[2].textContent;
                const newDateInput = row.querySelector('input[type="date"]');
                if (newDateInput && newDateInput.value) {
                    const newDate = new Date(newDateInput.value).toLocaleDateString('es-CL');
                    if (originalDate !== newDate) {
                        changes.push(`${delivery}: ${originalDate} → ${newDate}`);
                    }
                }
            }
        });
    }
    
    return changes.length > 0 ? changes : ['No se han especificado cambios'];
}

// Validate Step 4
function validateStep4() {
    const acceptTerms = document.getElementById('acceptTerms');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (acceptTerms && btnSubmit) {
        btnSubmit.disabled = !acceptTerms.checked;
    }
}

// Handle File Upload
function handleFileUpload(event) {
    const files = event.target.files;
    
    Array.from(files).forEach(file => {
        // Validate file
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`El archivo ${file.name} excede el límite de 10MB`, 'error');
            return;
        }
        
        // Add to uploaded files
        uploadedFiles.push(file);
        
        // Display file
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        if (uploadedFilesDiv) {
            const fileElement = document.createElement('div');
            fileElement.className = 'uploaded-file-item';
            fileElement.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button onclick="removeFile('${file.name}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            uploadedFilesDiv.appendChild(fileElement);
        }
    });
    
    showNotification(`${files.length} archivo(s) agregado(s)`, 'success');
}

// Remove File
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    // Update UI
    const fileElements = document.querySelectorAll('.uploaded-file-item');
    fileElements.forEach(element => {
        if (element.textContent.includes(fileName)) {
            element.remove();
        }
    });
}

// Save Draft
function saveDraft() {
    const draft = {
        ocNumber: selectedOC,
        modificationType: selectedModificationType,
        reason: document.getElementById('modificationReason')?.value,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('modificationDraft', JSON.stringify(draft));
    showNotification('Borrador guardado exitosamente', 'success');
}

// Submit Modification
function submitModification() {
    // Show loading state
    const btnSubmit = document.getElementById('btnSubmit');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnSubmit.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate new modification number
        const newModNumber = `MOD-2025-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
        document.getElementById('newModNumber').textContent = newModNumber;
        
        // Show success modal
        document.getElementById('successModal').style.display = 'flex';
        
        // Clear draft
        localStorage.removeItem('modificationDraft');
        
        // Reset button
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
    }, 2000);
}