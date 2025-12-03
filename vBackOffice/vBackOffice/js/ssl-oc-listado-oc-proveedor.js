/**
 * ssl_listado_oc_proveedor.js
 * Funcionalidad específica para el listado de Órdenes de Compra a Proveedores
 */

const OCProveedor = (function() {
    'use strict';

    // Private variables
    let currentOC = null;
    let filters = {
        nroOC: '',
        proveedor: '',
        cliente: '',
        estado: '',
        fechaDesde: '',
        fechaHasta: ''
    };

    // Initialize the module
    function init() {
        setupEventListeners();
        setDefaultDates();
        loadOCData();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }

    // Set default dates for filters
    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const fechaHasta = document.getElementById('filter-fecha-hasta');
        if (fechaHasta) {
            fechaHasta.value = today;
        }
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const fechaDesde = document.getElementById('filter-fecha-desde');
        if (fechaDesde) {
            fechaDesde.value = oneMonthAgo.toISOString().split('T')[0];
        }
    }

    // Load OC data (mock function - replace with API call)
    function loadOCData() {
        console.log('Cargando datos de OC...');
        // Aquí se haría la llamada a la API para cargar los datos
        // Por ahora los datos están en el HTML
    }

    // Filter functions
    function searchOC() {
        // Recopilar valores de filtros
        filters.nroOC = document.getElementById('filter-nro-oc').value;
        filters.proveedor = document.getElementById('filter-proveedor').value;
        filters.cliente = document.getElementById('filter-cliente').value;
        filters.estado = document.getElementById('filter-estado').value;
        filters.fechaDesde = document.getElementById('filter-fecha-desde').value;
        filters.fechaHasta = document.getElementById('filter-fecha-hasta').value;

        console.log('Buscando OC con filtros:', filters);
        
        // Aquí se implementaría la búsqueda real
        // Por ahora solo mostramos un mensaje
        showNotification('Búsqueda realizada', 'info');
    }

    function clearFilters() {
        document.getElementById('filter-nro-oc').value = '';
        document.getElementById('filter-proveedor').value = '';
        document.getElementById('filter-cliente').value = '';
        document.getElementById('filter-estado').value = '';
        
        setDefaultDates();
        
        filters = {
            nroOC: '',
            proveedor: '',
            cliente: '',
            estado: '',
            fechaDesde: '',
            fechaHasta: ''
        };
        
        showNotification('Filtros limpiados', 'info');
    }

    // Modal functions
    function openNewOCModal() {
        document.getElementById('newOCModal').style.display = 'block';
    }

    function closeNewOCModal() {
        document.getElementById('newOCModal').style.display = 'none';
        resetNewOCForm();
    }

    function viewOC(ocNumber) {
        currentOC = ocNumber;
        updateViewOCModal(ocNumber);
        document.getElementById('viewOCModal').style.display = 'block';
    }

    function closeViewOCModal() {
        document.getElementById('viewOCModal').style.display = 'none';
        currentOC = null;
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // New OC form functions
    function handleOrigenChange() {
        const origen = document.getElementById('origen-oc').value;
        const docRef = document.getElementById('doc-referencia');
        const proveedor = document.getElementById('proveedor-oc');
        const fullContent = document.getElementById('full-oc-content');
        
        if (origen) {
            docRef.disabled = false;
            docRef.innerHTML = '<option value="">Seleccione documento</option>';
            
            // Cargar documentos según origen
            if (origen === 'cotizacion-proveedor') {
                docRef.innerHTML += '<option value="COT-PROV-001-2025">COT-PROV-001-2025 - CEMENTOS BIO BIO</option>';
                docRef.innerHTML += '<option value="COT-PROV-002-2025">COT-PROV-002-2025 - MATERIALES DEL SUR</option>';
            } else if (origen === 'cotizacion-ssl') {
                docRef.innerHTML += '<option value="COT-CLI-001-2025">COT-CLI-001-2025 - CONSTRUCTORA ALMAGRO</option>';
                docRef.innerHTML += '<option value="COT-CLI-002-2025">COT-CLI-002-2025 - INMOBILIARIA INGEVEC</option>';
            } else if (origen === 'oc-cliente') {
                docRef.innerHTML += '<option value="OC-CLI-2025-847">OC-CLI-2025-847 - CONSTRUCTORA ALMAGRO</option>';
                docRef.innerHTML += '<option value="OC-CLI-2025-848">OC-CLI-2025-848 - INMOBILIARIA INGEVEC</option>';
            }
            
            fullContent.style.display = 'none';
        } else {
            docRef.disabled = true;
            proveedor.disabled = true;
            fullContent.style.display = 'none';
        }
    }

    function loadDocumentData() {
        const docRef = document.getElementById('doc-referencia').value;
        const fullContent = document.getElementById('full-oc-content');
        const proveedor = document.getElementById('proveedor-oc');
        
        if (docRef) {
            fullContent.style.display = 'block';
            proveedor.disabled = false;
            proveedor.innerHTML = '';
            
            // Cargar proveedor según documento
            if (docRef.includes('CEMENTOS')) {
                proveedor.innerHTML = '<option value="1">CEMENTOS BIO BIO S.A.</option>';
            } else if (docRef.includes('MATERIALES')) {
                proveedor.innerHTML = '<option value="2">MATERIALES DEL SUR S.A.</option>';
            } else {
                proveedor.innerHTML = '<option value="1">CEMENTOS BIO BIO S.A.</option>';
            }
            
            updateReferenceInfo(docRef);
            
            // Scroll suave hacia la información
            setTimeout(() => {
                document.getElementById('full-oc-content').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            fullContent.style.display = 'none';
            proveedor.disabled = true;
        }
    }

    function updateReferenceInfo(docRef) {
        if (docRef.includes('848')) {
            document.getElementById('ref-cliente').textContent = 'INMOBILIARIA INGEVEC';
            document.getElementById('ref-obra').textContent = 'CONDOMINIO VISTA MAR';
            document.getElementById('ref-oc-cliente').textContent = 'OC-CLI-2025-848';
            document.getElementById('ref-monto').textContent = '$3,450,000';
            document.getElementById('lugar-entrega').value = 'Obra CONDOMINIO VISTA MAR - Av. del Mar 567';
        } else {
            document.getElementById('ref-cliente').textContent = 'CONSTRUCTORA ALMAGRO S.A.';
            document.getElementById('ref-obra').textContent = 'EDIFICIO PACIFIC BLUE';
            document.getElementById('ref-oc-cliente').textContent = 'OC-CLI-2025-847';
            document.getElementById('ref-monto').textContent = '$2,850,000';
            document.getElementById('lugar-entrega').value = 'Obra EDIFICIO PACIFIC BLUE - Av. Las Condes 1234';
        }
    }

    function validateQuantity(input, maxQty) {
        const value = parseInt(input.value);
        if (value > maxQty) {
            input.value = maxQty;
            showNotification(`La cantidad no puede ser mayor a ${maxQty} (cantidad en OC Cliente)`, 'warning');
        }
        updateTotals();
    }

    function updateTotals() {
        // Implementar cálculo de totales
        console.log('Actualizando totales...');
        // Aquí se calcularían los totales basados en las cantidades y precios
    }

    function resetNewOCForm() {
        document.getElementById('origen-oc').value = '';
        document.getElementById('doc-referencia').value = '';
        document.getElementById('doc-referencia').disabled = true;
        document.getElementById('proveedor-oc').value = '';
        document.getElementById('proveedor-oc').disabled = true;
        document.getElementById('full-oc-content').style.display = 'none';
    }

    function updateViewOCModal(ocNumber) {
        // Aquí se actualizarían los datos del modal con información de la OC
        const modalTitle = document.querySelector('#viewOCModal .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="fas fa-file-invoice"></i> Orden de Compra ${ocNumber}`;
        }
        // Cargar más datos según el número de OC
    }

    // OC Action functions
    function approveOC(ocNumber) {
        if (confirm(`¿Está seguro de aprobar la OC ${ocNumber}?`)) {
            showNotification(`OC ${ocNumber} aprobada exitosamente`, 'success');
            // Actualizar estado en la tabla
            updateOCStatus(ocNumber, 'aprobada');
        }
    }

    function rejectOC(ocNumber) {
        const reason = prompt(`¿Por qué rechaza la OC ${ocNumber}?`);
        if (reason) {
            showNotification(`OC ${ocNumber} rechazada: ${reason}`, 'error');
            updateOCStatus(ocNumber, 'rechazada');
        }
    }

    function editOC(ocNumber) {
        showNotification(`Editando OC ${ocNumber}`, 'info');
        // Abrir modal de edición con datos precargados
        openNewOCModal();
        // Precargar datos de la OC para edición
    }

    function resendOC(ocNumber) {
        if (confirm(`¿Reenviar OC ${ocNumber} al proveedor?`)) {
            showNotification(`OC ${ocNumber} reenviada exitosamente`, 'success');
            // Registrar reenvío en historial
        }
    }

    function downloadOC(ocNumber) {
        showNotification(`Descargando PDF de OC ${ocNumber}`, 'info');
        // Implementar descarga real del PDF
        // window.open(`/api/oc/${ocNumber}/pdf`, '_blank');
    }

    function printOC(ocNumber) {
        window.print();
    }

    function viewHistory(ocNumber) {
        showNotification(`Cargando historial de OC ${ocNumber}`, 'info');
        // Abrir modal con historial completo
    }

    function createNewVersion(ocNumber) {
        if (confirm(`¿Crear nueva versión de OC ${ocNumber}?`)) {
            openNewOCModal();
            // Precargar datos de la OC rechazada
            showNotification('Nueva versión de OC iniciada', 'info');
        }
    }

    function cancelOC(ocNumber) {
        if (confirm(`¿Está seguro de cancelar la OC ${ocNumber}? Esta acción no se puede deshacer.`)) {
            showNotification(`OC ${ocNumber} cancelada`, 'warning');
            updateOCStatus(ocNumber, 'cancelada');
        }
    }

    function saveDraft() {
        showNotification('Borrador guardado exitosamente', 'success');
        // Guardar datos del formulario en localStorage o API
    }

    function previewOC() {
        showNotification('Generando vista previa de la OC', 'info');
        // Abrir vista previa en nueva ventana o modal
    }

    function generateOC() {
        if (confirm('¿Está seguro de generar esta Orden de Compra?')) {
            showNotification('OC generada exitosamente: OC-PROV-2025-005', 'success');
            closeNewOCModal();
            // Actualizar tabla con nueva OC
            loadOCData();
        }
    }

    // Utility functions
    function updateOCStatus(ocNumber, newStatus) {
        // Actualizar el estado de la OC en la tabla
        console.log(`Actualizando OC ${ocNumber} a estado: ${newStatus}`);
        // Aquí se haría la llamada a la API para actualizar el estado
    }

    function showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        // Estilos según tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = type === 'warning' ? '#333' : 'white';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Public API
    return {
        init: init,
        searchOC: searchOC,
        clearFilters: clearFilters,
        openNewOCModal: openNewOCModal,
        closeNewOCModal: closeNewOCModal,
        viewOC: viewOC,
        closeViewOCModal: closeViewOCModal,
        handleOrigenChange: handleOrigenChange,
        loadDocumentData: loadDocumentData,
        validateQuantity: validateQuantity,
        approveOC: approveOC,
        rejectOC: rejectOC,
        editOC: editOC,
        resendOC: resendOC,
        downloadOC: downloadOC,
        printOC: printOC,
        viewHistory: viewHistory,
        createNewVersion: createNewVersion,
        cancelOC: cancelOC,
        saveDraft: saveDraft,
        previewOC: previewOC,
        generateOC: generateOC
    };
})();

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);