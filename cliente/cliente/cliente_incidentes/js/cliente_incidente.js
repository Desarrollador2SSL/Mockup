// =============================================
// JavaScript para Gestión de Incidentes - SSL v4.0
// =============================================

// Variables globales
let currentStep = 1;
const totalSteps = 4;
let uploadedFiles = [];
let incidentData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadIncidentData();
});

// Initialize page based on current page
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'cliente_listado_incidentes.html') {
        initializeListPage();
    } else if (currentPage === 'cliente_detalle_incidente.html') {
        initializeDetailPage();
    } else if (currentPage === 'cliente_nuevo_incidente.html') {
        initializeNewIncidentPage();
    }
}

// Initialize list page
function initializeListPage() {
    loadIncidentsList();
    setupFilters();
}

// Initialize detail page
function initializeDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const incidentId = urlParams.get('id');
    if (incidentId) {
        loadIncidentDetails(incidentId);
    }
}

// Initialize new incident page
function initializeNewIncidentPage() {
    setupFormValidation();
    setupFileUpload();
    updateStepIndicator();
    initializeProgressBar();
}

// Initialize progress bar
function initializeProgressBar() {
    const stepsIndicator = document.querySelector('.steps-indicator');
    if (stepsIndicator && !stepsIndicator.querySelector('.progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        stepsIndicator.appendChild(progressBar);
    }
}

// Setup event listeners
function setupEventListeners() {
    // File upload drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
    }

    // File input change
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Form submission
    const newIncidentForm = document.getElementById('newIncidentForm');
    if (newIncidentForm) {
        newIncidentForm.addEventListener('submit', handleFormSubmit);
    }
}

// Toggle filters visibility
function toggleFilters() {
    const filtersContent = document.getElementById('filtersContent');
    const filterToggleIcon = document.getElementById('filterToggleIcon');
    
    if (filtersContent.style.display === 'none') {
        filtersContent.style.display = 'block';
        filterToggleIcon.className = 'fas fa-chevron-up';
    } else {
        filtersContent.style.display = 'none';
        filterToggleIcon.className = 'fas fa-chevron-down';
    }
}

// Clear all filters
function clearFilters() {
    const inputs = document.querySelectorAll('.filters-content input, .filters-content select');
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'date') {
            input.value = '';
        } else if (input.type === 'select-one') {
            input.selectedIndex = 0;
        }
    });
}

// Apply filters
function applyFilters() {
    // Collect filter values
    const filters = {
        incidentNumber: document.querySelector('input[placeholder*="INC"]')?.value,
        lpeNumber: document.querySelector('input[placeholder*="LPE"]')?.value,
        ocNumber: document.querySelector('input[placeholder*="OC"]')?.value,
        status: document.querySelector('select[name="status"]')?.value,
        type: document.querySelector('select[name="type"]')?.value,
        obra: document.querySelector('select[name="obra"]')?.value,
        dateFrom: document.querySelector('input[type="date"]:first-of-type')?.value,
        dateTo: document.querySelector('input[type="date"]:last-of-type')?.value
    };

    // Apply filters (in real app, this would filter the table or make an API call)
    console.log('Applying filters:', filters);
    
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showNotification('Filtros aplicados correctamente', 'success');
    }, 500);
}

// View incident details
function viewIncident(incidentId) {
    window.location.href = `cliente_detalle_incidente.html?id=${incidentId}`;
}

// Edit incident
function editIncident(incidentId) {
    console.log('Editing incident:', incidentId);
    showNotification('Función de edición disponible próximamente', 'info');
}

// Export to Excel
function exportToExcel() {
    showNotification('Exportando a Excel...', 'info');
    // Simulate export
    setTimeout(() => {
        showNotification('Archivo Excel descargado correctamente', 'success');
    }, 1500);
}

// Print table
function printTable() {
    window.print();
}

// Load incidents list
function loadIncidentsList() {
    // In a real app, this would fetch data from an API
    console.log('Loading incidents list...');
}

// Load incident details
function loadIncidentDetails(incidentId) {
    // In a real app, this would fetch data from an API
    console.log('Loading incident details for:', incidentId);
}

// Change incident status
function changeStatus(newStatus) {
    const confirmMsg = `¿Está seguro de cambiar el estado a "${newStatus}"?`;
    if (confirm(confirmMsg)) {
        showNotification(`Estado cambiado a ${newStatus}`, 'success');
        // Update UI
        updateStatusBadge(newStatus);
    }
}

// Open close modal
function openCloseModal() {
    document.getElementById('closeModal').style.display = 'block';
}

// Open cancel modal
function openCancelModal() {
    document.getElementById('cancelModal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Confirm close incident
function confirmClose() {
    const resolution = document.querySelector('#closeModal textarea:first-of-type').value;
    const actions = document.querySelector('#closeModal textarea:last-of-type').value;
    
    if (!resolution || !actions) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    // Process close
    showNotification('Incidente cerrado exitosamente', 'success');
    closeModal('closeModal');
    
    // Update status in UI
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Confirm cancel incident
function confirmCancel() {
    const reason = document.querySelector('#cancelModal select').value;
    const justification = document.querySelector('#cancelModal textarea').value;
    
    if (!reason || !justification) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    // Process cancellation
    showNotification('Incidente cancelado exitosamente', 'success');
    closeModal('cancelModal');
    
    // Update status in UI
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Add evidence
function addEvidence() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*,.pdf,.doc,.docx';
    
    input.onchange = function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            showNotification(`${files.length} archivo(s) agregado(s)`, 'success');
            // Update attachments list
            updateAttachmentsList(files);
        }
    };
    
    input.click();
}

// View attachment
function viewAttachment(filename) {
    console.log('Viewing attachment:', filename);
    showNotification('Abriendo archivo...', 'info');
}

// Download attachment
function downloadAttachment(filename) {
    console.log('Downloading attachment:', filename);
    showNotification('Descargando archivo...', 'info');
}

// Add comment
function addComment() {
    const comment = prompt('Ingrese su comentario:');
    if (comment) {
        showNotification('Comentario agregado exitosamente', 'success');
        // Add comment to timeline
        addCommentToTimeline(comment);
    }
}

// Print incident
function printIncident() {
    window.print();
}

// =============================================
// New Incident Form Functions
// =============================================

// Form navigation
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            
            // Show next step
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            // Update navigation buttons
            updateNavigationButtons();
            updateStepIndicator();
            
            // Update summary if last step
            if (currentStep === totalSteps) {
                updateSummary();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        // Update navigation buttons
        updateNavigationButtons();
        updateStepIndicator();
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // Next and Submit buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Update step indicator
function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        // Remove all classes first
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            // Previous steps are completed
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            // Current step is active
            step.classList.add('active');
        }
        // Future steps remain in default state
    });
    
    // Update the progress line
    updateProgressLine();
}

// Update progress line between steps
function updateProgressLine() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        // Calculate the progress percentage
        // Step 1: 0%, Step 2: 33.33%, Step 3: 66.66%, Step 4: 100%
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        
        // For the connecting line between 4 steps, we need to account for the space
        // The line doesn't go all the way to the edges, it connects the centers
        // So we use a factor to adjust the width
        const adjustedWidth = progressPercentage * 0.85; // Adjust for padding and circle widths
        
        // Apply the width
        progressBar.style.width = `${adjustedWidth}%`;
    }
}

// Validate current step
function validateCurrentStep() {
    let isValid = true;
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
    }
    
    return isValid;
}

// Search LPE
function searchLPE() {
    document.getElementById('searchLPEModal').style.display = 'block';
}

// Select LPE from search
function selectLPE(lpeNumber) {
    document.getElementById('lpeNumber').value = lpeNumber;
    document.getElementById('lpeInfo').style.display = 'block';
    closeModal('searchLPEModal');
    
    // Simulate loading LPE info
    loadLPEInfo(lpeNumber);
}

// Load LPE information
function loadLPEInfo(lpeNumber) {
    // Simulate API call
    const lpeData = {
        'LPE-2025-0234': {
            oc: 'OC-2025-0089',
            obra: 'Torre Pacífico',
            proveedor: 'Aceros del Pacífico S.A.',
            fecha: '28/11/2024'
        },
        'LPE-2025-0232': {
            oc: 'OC-2025-0087',
            obra: 'Edificio Central',
            proveedor: 'Construcciones S.A.',
            fecha: '27/11/2024'
        }
    };
    
    if (lpeData[lpeNumber]) {
        document.getElementById('ocNumber').textContent = lpeData[lpeNumber].oc;
        document.getElementById('obraName').textContent = lpeData[lpeNumber].obra;
        document.getElementById('proveedorName').textContent = lpeData[lpeNumber].proveedor;
        document.getElementById('fechaEntrega').textContent = lpeData[lpeNumber].fecha;
    }
}

// Update incident fields based on type
function updateIncidentFields() {
    const incidentType = document.getElementById('incidentType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    // Clear existing dynamic fields
    dynamicFields.innerHTML = '';
    
    // Add fields based on incident type
    switch(incidentType) {
        case 'cantidad':
            dynamicFields.innerHTML = `
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Cantidad Esperada <span class="required">*</span></label>
                        <input type="number" class="form-control" placeholder="Cantidad según OC" required>
                    </div>
                    <div class="form-group col-md-6">
                        <label>Cantidad Recibida <span class="required">*</span></label>
                        <input type="number" class="form-control" placeholder="Cantidad real recibida" required>
                    </div>
                </div>
            `;
            break;
        case 'danado':
            dynamicFields.innerHTML = `
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Tipo de Daño <span class="required">*</span></label>
                        <select class="form-control" required>
                            <option value="">Seleccione...</option>
                            <option value="oxidacion">Oxidación</option>
                            <option value="rotura">Rotura</option>
                            <option value="deformacion">Deformación</option>
                            <option value="humedad">Daño por humedad</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <label>% Aproximado de Material Afectado</label>
                        <input type="number" class="form-control" min="0" max="100" placeholder="Porcentaje">
                    </div>
                </div>
            `;
            break;
        case 'incorrecto':
            dynamicFields.innerHTML = `
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Material Solicitado <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Descripción del material en OC" required>
                    </div>
                    <div class="form-group col-md-6">
                        <label>Material Recibido <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Descripción del material recibido" required>
                    </div>
                </div>
            `;
            break;
    }
}

// Add material to list
function addMaterial() {
    const materialsList = document.getElementById('materialsList');
    const newMaterial = document.createElement('div');
    newMaterial.className = 'material-item';
    newMaterial.innerHTML = `
        <input type="text" class="form-control" placeholder="Descripción del material">
        <input type="number" class="form-control" placeholder="Cantidad">
        <select class="form-control">
            <option>Unidad</option>
            <option>Kg</option>
            <option>Ton</option>
            <option>m²</option>
            <option>m³</option>
        </select>
        <button type="button" class="btn btn-danger" onclick="removeMaterial(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    materialsList.appendChild(newMaterial);
}

// Remove material from list
function removeMaterial(button) {
    button.parentElement.remove();
}

// File upload handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    for (let file of files) {
        if (validateFile(file)) {
            uploadedFiles.push(file);
            displayUploadedFile(file);
        }
    }
    updateFileCount();
}

function validateFile(file) {
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
        showNotification(`El archivo ${file.name} excede el tamaño máximo de 25MB`, 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showNotification(`El tipo de archivo ${file.name} no está permitido`, 'error');
        return false;
    }
    
    return true;
}

function displayUploadedFile(file) {
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    const fileItem = document.createElement('div');
    fileItem.className = 'attachment-item';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <i class="${fileIcon} file-icon"></i>
        <div class="attachment-info">
            <div class="attachment-name">${file.name}</div>
            <div class="attachment-meta">${fileSize}</div>
        </div>
        <button class="btn-icon" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    uploadedFilesDiv.appendChild(fileItem);
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.startsWith('video/')) return 'fas fa-video video';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf pdf';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFileDisplay();
    updateFileCount();
}

function updateFileDisplay() {
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    uploadedFilesDiv.innerHTML = '';
    uploadedFiles.forEach(file => displayUploadedFile(file));
}

function updateFileCount() {
    const count = uploadedFiles.length;
    const summaryFiles = document.getElementById('summaryFiles');
    if (summaryFiles) {
        summaryFiles.textContent = count > 0 ? `${count} archivo(s)` : 'Sin archivos';
    }
}

// Update summary before submission
function updateSummary() {
    // Collect all form data
    document.getElementById('summaryLPE').textContent = document.getElementById('lpeNumber').value || '-';
    
    const incidentType = document.getElementById('incidentType');
    document.getElementById('summaryType').textContent = 
        incidentType.options[incidentType.selectedIndex].text || '-';
    
    const priority = document.getElementById('priority');
    document.getElementById('summaryPriority').textContent = 
        priority.options[priority.selectedIndex].text || '-';
    
    document.getElementById('summaryReporter').textContent = 
        document.getElementById('reportedBy').value || '-';
    
    document.getElementById('summaryDescription').textContent = 
        document.getElementById('description').value || '-';
    
    document.getElementById('summaryFiles').textContent = 
        uploadedFiles.length > 0 ? `${uploadedFiles.length} archivo(s)` : 'Sin archivos';
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showNotification('Incidente reportado exitosamente. N° INC-2025-0153', 'success');
        
        // Redirect to incidents list
        setTimeout(() => {
            window.location.href = 'cliente_listado_incidentes.html';
        }, 2000);
    }, 1500);
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('newIncidentForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        });
    }
}

// Setup file upload
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });
    }
}

// Setup filters
function setupFilters() {
    // Add event listeners to filter inputs for real-time filtering
    const filterInputs = document.querySelectorAll('.filters-content input, .filters-content select');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Auto-apply filters on change (optional)
            // applyFilters();
        });
    });
}

// Load incident data (for editing or viewing)
function loadIncidentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const incidentId = urlParams.get('id');
    
    if (incidentId) {
        // Simulate loading incident data
        console.log('Loading incident:', incidentId);
    }
}

// Update status badge
function updateStatusBadge(status) {
    const statusBadges = document.querySelectorAll('.badge');
    statusBadges.forEach(badge => {
        if (badge.textContent.toLowerCase().includes('pendiente') || 
            badge.textContent.toLowerCase().includes('revisión') ||
            badge.textContent.toLowerCase().includes('cerrado')) {
            badge.className = `badge badge-${status}`;
            badge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    });
}

// Update attachments list
function updateAttachmentsList(files) {
    const attachmentsList = document.querySelector('.attachments-list');
    if (attachmentsList) {
        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'attachment-item';
            
            const fileIcon = getFileIcon(file.type);
            const fileSize = formatFileSize(file.size);
            const date = new Date().toLocaleDateString('es-CL');
            
            fileItem.innerHTML = `
                <i class="${fileIcon} file-icon"></i>
                <div class="attachment-info">
                    <div class="attachment-name">${file.name}</div>
                    <div class="attachment-meta">${fileSize} - ${date}</div>
                </div>
                <button class="btn-icon" onclick="viewAttachment('${file.name}')">
                    <i class="fas fa-eye"></i>
                </button>
            `;
            
            attachmentsList.appendChild(fileItem);
        }
    }
}

// Add comment to timeline
function addCommentToTimeline(comment) {
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const userName = document.getElementById('userName').textContent;
        const date = new Date().toLocaleString('es-CL');
        
        commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <i class="fas fa-user-circle"></i>
                    <strong>${userName}</strong>
                    <span class="comment-role">Cliente</span>
                </div>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-body">
                <p>${comment}</p>
            </div>
        `;
        
        commentsSection.appendChild(commentItem);
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
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not exist
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.innerHTML = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-warning { border-left: 4px solid #f59e0b; }
            .notification-info { border-left: 4px solid #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Show loading state
function showLoading() {
    // Create loading overlay
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Procesando...</p>
        </div>
    `;
    
    // Add styles if not exist
    if (!document.getElementById('loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-styles';
        styles.innerHTML = `
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .loading-spinner {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
            }
            .loading-spinner i {
                font-size: 2rem;
                color: var(--secondary-color);
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(loading);
}

// Hide loading state
function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// Add input error styles
const errorStyles = document.createElement('style');
errorStyles.innerHTML = `
    .form-control.error {
        border-color: var(--danger-color);
        background-color: #fee2e2;
    }
    .form-control.error:focus {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .drag-over {
        background-color: rgba(102, 126, 234, 0.1) !important;
        border-color: var(--secondary-color) !important;
    }
`;
document.head.appendChild(errorStyles);