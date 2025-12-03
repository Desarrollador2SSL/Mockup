// ================================
// Cliente - Modificaciones JavaScript
// ================================

// Current form step
let currentStep = 1;
const totalSteps = 4;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeModificationModule();
    setupEventListeners();
    loadFilters();
});

// Initialize module
function initializeModificationModule() {
    // Check which page we're on
    const path = window.location.pathname;
    
    if (path.includes('cliente_nueva_modificacion')) {
        initializeNewModificationForm();
    } else if (path.includes('cliente_detalle_modificacion')) {
        loadModificationDetails();
    } else if (path.includes('cliente_listado_modificaciones')) {
        loadModificationsList();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter changes
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', applyFilters);
    }
    
    const filterType = document.getElementById('filterType');
    if (filterType) {
        filterType.addEventListener('change', applyFilters);
    }
    
    // File upload
    const fileInput = document.getElementById('attachments');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Form submission
    const modificationForm = document.getElementById('modificationForm');
    if (modificationForm) {
        modificationForm.addEventListener('submit', handleFormSubmit);
    }
}

// ================================
// LISTADO FUNCTIONS
// ================================

// Load modifications list
function loadModificationsList() {
    // This would normally fetch from server
    console.log('Loading modifications list...');
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter) {
        const filterSelect = document.getElementById('filterStatus');
        if (filterSelect) {
            filterSelect.value = filter;
            applyFilters();
        }
    }
}

// Apply filters
function applyFilters() {
    const status = document.getElementById('filterStatus').value;
    const type = document.getElementById('filterType').value;
    const search = document.querySelector('.filter-input').value;
    
    console.log('Applying filters:', { status, type, search });
    
    // Here you would filter the table rows
    // For now, just log the action
    showNotification('Filtros aplicados', 'success');
}

// Load filters from localStorage
function loadFilters() {
    const savedFilters = localStorage.getItem('modificationFilters');
    if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        if (document.getElementById('filterStatus')) {
            document.getElementById('filterStatus').value = filters.status || '';
        }
        if (document.getElementById('filterType')) {
            document.getElementById('filterType').value = filters.type || '';
        }
    }
}

// Save filters to localStorage
function saveFilters() {
    const filters = {
        status: document.getElementById('filterStatus')?.value || '',
        type: document.getElementById('filterType')?.value || ''
    };
    localStorage.setItem('modificationFilters', JSON.stringify(filters));
}

// View modification details
function viewModification(modId) {
    window.location.href = `cliente_detalle_modificacion.html?id=${modId}`;
}

// Edit modification
function editModification(modId) {
    if (confirm('¿Desea editar esta modificación?')) {
        window.location.href = `cliente_nueva_modificacion.html?edit=${modId}`;
    }
}

// Download modification
function downloadModification(modId) {
    console.log('Downloading modification:', modId);
    showNotification('Descargando documento...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Documento descargado exitosamente', 'success');
    }, 1500);
}

// ================================
// DETALLE FUNCTIONS
// ================================

// Load modification details
function loadModificationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const modId = urlParams.get('id');
    
    if (modId) {
        console.log('Loading details for:', modId);
        // Here you would fetch the modification details from server
    }
}

// Print modification
function printModification() {
    window.print();
}

// View document
function viewDocument(docId) {
    console.log('Viewing document:', docId);
    showNotification('Abriendo documento...', 'info');
}

// Download document
function downloadDocument(docId) {
    console.log('Downloading document:', docId);
    showNotification('Descargando archivo...', 'info');
}

// ================================
// NUEVA MODIFICACIÓN FUNCTIONS
// ================================

// Initialize new modification form
function initializeNewModificationForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        loadModificationForEdit(editId);
    }
    
    updateFormSteps();
}

// Load modification for editing
function loadModificationForEdit(modId) {
    console.log('Loading modification for edit:', modId);
    // Here you would load the modification data
}

// Next step in form
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`section${currentStep}`).classList.add('hidden');
            document.getElementById(`step${currentStep}`).classList.remove('active');
            
            currentStep++;
            
            document.getElementById(`section${currentStep}`).classList.remove('hidden');
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            updateFormSteps();
        }
    }
}

// Previous step in form
function previousStep() {
    if (currentStep > 1) {
        document.getElementById(`section${currentStep}`).classList.add('hidden');
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        currentStep--;
        
        document.getElementById(`section${currentStep}`).classList.remove('hidden');
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        updateFormSteps();
    }
}

// Update form steps UI
function updateFormSteps() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    // Show/hide next/submit buttons
    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        
        // Update summary
        updateSummary();
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            // Validate OC selection
            const selectedOC = document.querySelector('input[name="selectedOC"]:checked');
            if (!selectedOC) {
                showNotification('Por favor seleccione una Orden de Compra', 'error');
                return false;
            }
            break;
            
        case 2:
            // Validate modification type
            const modType = document.querySelector('input[name="modificationType"]:checked');
            if (!modType) {
                showNotification('Por favor seleccione el tipo de modificación', 'error');
                return false;
            }
            
            const reason = document.getElementById('modificationReason').value;
            if (!reason.trim()) {
                showNotification('Por favor ingrese el motivo de la modificación', 'error');
                return false;
            }
            break;
            
        case 3:
            // Validate items selection
            const selectedItems = document.querySelectorAll('input[name="itemSelect"]:checked');
            if (selectedItems.length === 0) {
                showNotification('Por favor seleccione al menos un ítem para modificar', 'error');
                return false;
            }
            break;
    }
    
    return true;
}

// Select OC
function selectOC(ocNumber) {
    const radio = document.querySelector(`input[value="${ocNumber}"]`);
    if (radio) {
        radio.checked = true;
    }
}

// Toggle all items
function toggleAllItems() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('input[name="itemSelect"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Handle file selection
function handleFileSelect(e) {
    const files = e.target.files;
    const fileList = document.getElementById('fileList');
    
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name} (${fileSize} MB)</span>
            <button type="button" class="btn-icon" onclick="removeFile(${i})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    }
}

// Remove file from list
function removeFile(index) {
    // This would need more complex handling to actually remove the file
    console.log('Removing file at index:', index);
    showNotification('Archivo eliminado', 'info');
}

// Update summary
function updateSummary() {
    // Get selected values
    const selectedOC = document.querySelector('input[name="selectedOC"]:checked');
    const modType = document.querySelector('input[name="modificationType"]:checked');
    const selectedItems = document.querySelectorAll('input[name="itemSelect"]:checked');
    
    // Update summary display
    if (selectedOC) {
        document.getElementById('summaryOC').textContent = selectedOC.value;
    }
    
    if (modType) {
        let typeText = '';
        switch(modType.value) {
            case 'cantidad':
                typeText = 'Reducción de Cantidades';
                break;
            case 'fecha':
                typeText = 'Modificación de Fechas';
                break;
            case 'ambos':
                typeText = 'Cantidad y Fecha';
                break;
        }
        document.getElementById('summaryType').textContent = typeText;
    }
    
    document.getElementById('summaryItems').textContent = `${selectedItems.length} ítem(s)`;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return false;
    }
    
    // Show confirmation dialog
    if (confirm('¿Está seguro de enviar esta solicitud de modificación?')) {
        // Collect form data
        const formData = {
            oc: document.querySelector('input[name="selectedOC"]:checked')?.value,
            type: document.querySelector('input[name="modificationType"]:checked')?.value,
            reason: document.getElementById('modificationReason')?.value,
            items: Array.from(document.querySelectorAll('input[name="itemSelect"]:checked')).map(cb => cb.value),
            timestamp: new Date().toISOString()
        };
        
        console.log('Submitting modification:', formData);
        
        // Show loading
        showNotification('Enviando solicitud...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Solicitud de modificación enviada exitosamente', 'success');
            
            // Generate modification number
            const modNumber = generateModificationNumber();
            
            // Redirect to detail page
            setTimeout(() => {
                window.location.href = `cliente_detalle_modificacion.html?id=${modNumber}`;
            }, 1500);
        }, 2000);
    }
}

// Generate modification number
function generateModificationNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `MOD-${year}-${random}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconForType(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get icon for notification type
function getIconForType(type) {
    switch(type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'times-circle';
        case 'warning':
            return 'exclamation-triangle';
        default:
            return 'info-circle';
    }
}

// Add notification styles if not present
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: -400px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: right 0.3s ease;
            z-index: 10000;
            max-width: 350px;
        }
        
        .notification.show {
            right: 20px;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-success i {
            color: #4CAF50;
        }
        
        .notification-error {
            border-left: 4px solid #f44336;
        }
        
        .notification-error i {
            color: #f44336;
        }
        
        .notification-warning {
            border-left: 4px solid #ff9800;
        }
        
        .notification-warning i {
            color: #ff9800;
        }
        
        .notification-info {
            border-left: 4px solid #2196F3;
        }
        
        .notification-info i {
            color: #2196F3;
        }
        
        @media (max-width: 768px) {
            .notification {
                right: -100%;
                left: auto;
                max-width: calc(100% - 40px);
            }
            
            .notification.show {
                right: auto;
                left: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}