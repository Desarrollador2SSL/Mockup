/**
 * ssl-detalle-solicitud-cotizacion.js
 * Funcionalidad específica para la página de detalle de solicitud de cotización
 */

// Namespace para evitar colisiones globales
window.QuotationManager = {
    // Estado de la aplicación
    state: {
        selectedProviders: new Set(),
        providerProducts: new Map(),
        productProviders: new Map(),
        uploadedFiles: []
    },

    // Inicialización
    init: function() {
        this.setupEventListeners();
        this.updateGlobalTotals();
        this.updateProviderSummaryTable();
        this.expandFirstProduct();
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Checkboxes de proveedores
        document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const productNumber = e.target.getAttribute('data-product');
                this.updateProviderCount(productNumber);
            });
        });

        // Drag and drop para archivos
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }

        // Prevenir comportamiento por defecto de drag and drop en toda la página
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    },

    // Toggle expansión de productos
    toggleProduct: function(productId) {
        const content = document.getElementById(productId);
        const chevron = document.getElementById(productId + '-chevron');
        
        if (content && chevron) {
            content.classList.toggle('expanded');
            chevron.classList.toggle('rotated');
        }
    },

    // Expandir primer producto por defecto
    expandFirstProduct: function() {
        const firstChevron = document.getElementById('product-1-chevron');
        if (firstChevron) {
            firstChevron.classList.add('rotated');
        }
    },

    // Actualizar contador de proveedores por producto
    updateProviderCount: function(productNumber) {
        const checkboxes = document.querySelectorAll(`input[data-product="${productNumber}"]:checked`);
        const counter = document.getElementById(`selected-${productNumber}`);
        
        if (counter) {
            counter.textContent = checkboxes.length;
        }
        
        // Actualizar clase visual de las tarjetas
        document.querySelectorAll(`input[data-product="${productNumber}"]`).forEach(checkbox => {
            const card = checkbox.closest('.provider-card');
            if (card) {
                if (checkbox.checked) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            }
        });
        
        this.updateGlobalTotals();
        this.updateProviderSummaryTable();
    },

    // Actualizar totales globales
    updateGlobalTotals: function() {
        const allCheckboxes = document.querySelectorAll('.provider-checkbox:checked');
        const totalProviders = new Set();
        
        allCheckboxes.forEach(checkbox => {
            const card = checkbox.closest('.provider-card');
            if (card) {
                const providerName = card.querySelector('h5')?.textContent;
                if (providerName) {
                    totalProviders.add(providerName);
                }
            }
        });
        
        const providersCount = document.getElementById('providers-count');
        const quotesCount = document.getElementById('quotes-count');
        const sendCount = document.getElementById('send-count');
        
        if (providersCount) providersCount.textContent = totalProviders.size;
        if (quotesCount) quotesCount.textContent = allCheckboxes.length;
        if (sendCount) sendCount.textContent = allCheckboxes.length;
    },

    // Actualizar tabla resumen por proveedor
    updateProviderSummaryTable: function() {
        const table = document.getElementById('provider-summary-table');
        if (!table) return;
        
        const providerMap = new Map();
        
        // Recopilar información de proveedores seleccionados
        document.querySelectorAll('.provider-checkbox:checked').forEach(checkbox => {
            const card = checkbox.closest('.provider-card');
            const productCard = checkbox.closest('.product-card');
            
            if (card && productCard) {
                const providerName = card.querySelector('h5')?.textContent || 'Proveedor';
                const productName = productCard.querySelector('h3')?.textContent || 'Producto';
                const email = card.querySelector('.text-xs')?.textContent || '';
                
                if (!providerMap.has(providerName)) {
                    providerMap.set(providerName, {
                        name: providerName,
                        email: email,
                        products: []
                    });
                }
                providerMap.get(providerName).products.push(productName);
            }
        });
        
        // Generar filas de la tabla
        let tableHTML = '';
        providerMap.forEach(provider => {
            const productBadges = provider.products.map(product => {
                const colors = ['blue', 'green', 'yellow', 'purple', 'pink'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 mr-1 mb-1">${product}</span>`;
            }).join('');
            
            tableHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-building text-blue-600"></i>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${provider.name}</div>
                                <div class="text-sm text-gray-500">${provider.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex flex-wrap">
                            ${productBadges}
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <i class="fas fa-envelope text-blue-500 mr-2"></i>
                            <span class="text-sm text-gray-900">Email + Portal</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="status-badge status-warning">Listo para Enviar</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="text-blue-600 hover:text-blue-900 mr-3 text-sm" onclick="QuotationManager.viewProviderDetail('${provider.name}')">Ver Detalle</button>
                        <button class="text-red-600 hover:text-red-900 text-sm" onclick="QuotationManager.excludeProvider('${provider.name}')">Excluir</button>
                    </td>
                </tr>
            `;
        });
        
        table.innerHTML = tableHTML || '<tr><td colspan="5" class="text-center py-8 text-gray-500">No hay proveedores seleccionados</td></tr>';
    },

    // Aplicar configuración global
    applyGlobalSettings: function() {
        const responseTime = document.getElementById('global-response-time')?.value;
        const validity = document.getElementById('global-validity')?.value;
        const delivery = document.getElementById('global-delivery')?.value;
        
        // Aplicar a todos los productos
        document.querySelectorAll('.product-card select').forEach(select => {
            const label = select.previousElementSibling;
            if (label && label.textContent) {
                if (label.textContent.includes('Plazo de Respuesta') && responseTime) {
                    select.value = responseTime;
                }
                if (label.textContent.includes('Validez') && validity) {
                    select.value = validity;
                }
                if (label.textContent.includes('Entrega') && delivery) {
                    select.value = delivery;
                }
            }
        });
        
        this.showNotification('Configuración aplicada a todos los productos', 'success');
    },

    // Seleccionar todos los proveedores
    selectAllProviders: function() {
        const allCheckboxes = document.querySelectorAll('.provider-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
            const card = checkbox.closest('.provider-card');
            if (card) {
                card.classList.add('selected');
            }
        });
        
        // Actualizar contadores
        for (let i = 1; i <= 4; i++) {
            this.updateProviderCount(i);
        }
        
        this.showNotification('Todos los proveedores han sido seleccionados', 'success');
    },

    // Deseleccionar todos los proveedores
    clearAllProviders: function() {
        const allCheckboxes = document.querySelectorAll('.provider-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            const card = checkbox.closest('.provider-card');
            if (card) {
                card.classList.remove('selected');
            }
        });
        
        // Actualizar contadores
        for (let i = 1; i <= 4; i++) {
            this.updateProviderCount(i);
        }
        
        this.showNotification('Todos los proveedores han sido deseleccionados', 'info');
    },

    // Excluir proveedor específico
    excludeProvider: function(providerName) {
        const checkboxes = document.querySelectorAll('.provider-checkbox');
        checkboxes.forEach(checkbox => {
            const card = checkbox.closest('.provider-card');
            if (card) {
                const name = card.querySelector('h5')?.textContent;
                if (name === providerName) {
                    checkbox.checked = false;
                    card.classList.remove('selected');
                }
            }
        });
        
        // Actualizar contadores
        for (let i = 1; i <= 4; i++) {
            this.updateProviderCount(i);
        }
        
        this.showNotification(`Proveedor ${providerName} excluido de todas las cotizaciones`, 'warning');
    },

    // Ver detalle del proveedor
    viewProviderDetail: function(providerName) {
        this.showNotification(`Mostrando detalle de ${providerName}...`, 'info');
        // Aquí se implementaría la lógica para mostrar el detalle
    },

    // Manejo de archivos
    selectFiles: function() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    },

    handleFileSelect: function(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    },

    handleDragOver: function(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    },

    handleDragLeave: function(event) {
        event.currentTarget.classList.remove('dragover');
    },

    handleDrop: function(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
    },

    processFiles: function(files) {
        const container = document.getElementById('uploaded-files');
        if (!container) return;
        
        files.forEach(file => {
            // Validar tamaño del archivo (10MB máximo)
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification(`El archivo ${file.name} excede el tamaño máximo de 10MB`, 'error');
                return;
            }
            
            // Crear elemento de archivo
            const fileElement = this.createFileElement(file);
            container.appendChild(fileElement);
            
            // Agregar al estado
            this.state.uploadedFiles.push(file);
        });
        
        if (files.length > 0) {
            this.showNotification(`${files.length} archivo(s) agregado(s)`, 'success');
        }
    },

    createFileElement: function(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        
        const getFileIcon = (fileName) => {
            const ext = fileName.split('.').pop().toLowerCase();
            if (['pdf'].includes(ext)) return { icon: 'fa-file-pdf', color: 'red' };
            if (['doc', 'docx'].includes(ext)) return { icon: 'fa-file-word', color: 'blue' };
            if (['xls', 'xlsx'].includes(ext)) return { icon: 'fa-file-excel', color: 'green' };
            if (['jpg', 'jpeg', 'png'].includes(ext)) return { icon: 'fa-file-image', color: 'blue' };
            return { icon: 'fa-file', color: 'gray' };
        };
        
        const fileIcon = getFileIcon(file.name);
        const fileSize = (file.size / 1024 / 1024).toFixed(1);
        
        div.innerHTML = `
            <div class="flex items-center">
                <div class="file-icon ${fileIcon.color}">
                    <i class="fas ${fileIcon.icon}"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">${file.name}</p>
                    <p class="text-xs text-gray-500">${fileSize} MB - Subido ahora</p>
                </div>
            </div>
            <button class="text-red-600 hover:text-red-800 p-2" onclick="QuotationManager.removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return div;
    },

    removeFile: function(button) {
        const fileElement = button.closest('.file-item');
        if (fileElement) {
            fileElement.remove();
            this.showNotification('Archivo eliminado', 'info');
        }
    },

    // Acciones principales
    saveDraft: function() {
        // Simular guardado
        this.showNotification('Borrador guardado correctamente', 'success');
        
        // Aquí se implementaría la lógica real de guardado
        const draftData = {
            providers: Array.from(document.querySelectorAll('.provider-checkbox:checked')).map(cb => ({
                product: cb.dataset.product,
                provider: cb.dataset.provider
            })),
            globalSettings: {
                responseTime: document.getElementById('global-response-time')?.value,
                validity: document.getElementById('global-validity')?.value,
                delivery: document.getElementById('global-delivery')?.value
            },
            files: this.state.uploadedFiles.map(f => f.name)
        };
        
        console.log('Draft data:', draftData);
        localStorage.setItem('quotation-draft', JSON.stringify(draftData));
    },

    previewQuotations: function() {
        const selectedCount = document.querySelectorAll('.provider-checkbox:checked').length;
        if (selectedCount === 0) {
            this.showNotification('Debe seleccionar al menos un proveedor', 'error');
            return;
        }
        
        this.showNotification('Generando vista previa de solicitudes...', 'info');
        
        // Aquí se abriría un modal o nueva ventana con la vista previa
        setTimeout(() => {
            console.log('Vista previa generada');
        }, 1000);
    },

    sendQuotations: function() {
        const confirmCheckbox = document.getElementById('confirm-data');
        if (!confirmCheckbox?.checked) {
            this.showNotification('Debe confirmar que la información es correcta antes de enviar', 'error');
            return;
        }
        
        const selectedProviders = document.querySelectorAll('.provider-checkbox:checked');
        if (selectedProviders.length === 0) {
            this.showNotification('Debe seleccionar al menos un proveedor', 'error');
            return;
        }
        
        this.showNotification('Enviando solicitudes de cotización...', 'info');
        
        // Simular envío
        setTimeout(() => {
            this.showNotification(`${selectedProviders.length} solicitudes enviadas exitosamente`, 'success');
            
            // Cambiar estado visual
            document.querySelectorAll('.status-badge.status-warning').forEach(badge => {
                badge.className = 'status-badge status-success';
                badge.innerHTML = '<i class="fas fa-check mr-1"></i>Enviado';
            });
        }, 2000);
    },

    // Sistema de notificaciones
    showNotification: function(message, type = 'info') {
        const colors = {
            success: 'success',
            error: 'error',
            info: 'info',
            warning: 'warning'
        };
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        const notification = document.createElement('div');
        notification.className = `notification ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icons[type]} mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        
        const container = document.getElementById('notification-container') || document.body;
        container.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ocultar notificación
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    QuotationManager.init();
});